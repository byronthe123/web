import React, { useState, useEffect, useRef } from 'react';
import { Formik, Field } from 'formik';
import { Row, Col, Button, FormGroup } from 'reactstrap';
import ReactTable from '../../custom/ReactTable';
import readingSignMapping from './readingSignMapping';
import ModalCreateUpdate from './ModalCreateUpdate';
import Axios from 'axios';
import { addLocalValue, api, asyncHandler, deleteLocalValue, updateLocalValue } from '../../../utils';
import moment from 'moment';
import readingSignsTableMapping from './readingSignsTableMapping';
import Tour from 'reactour';

export default ({
    baseApiUrl,
    headerAuthCode,
    user,
    readingSigns,
    setReadingSigns,
    createSuccessNotification
}) => {

    const [createNew, setCreateNew] = useState(false);
    const [initialValues, setInitialValues] = useState({});
    const [selectedRecord, setSelectedRecord] = useState({});
    const [units, setUnits] = useState([]);
    const editorRef = useRef();

    const resolveInitialValues = (createNew, record={}) => {
        const values = {};
        for (let i = 0; i < readingSignMapping.length; i++) {
            if (createNew) {
                values[readingSignMapping[i]] = '';
            } else {
                if (readingSignMapping[i] === 'dueDate') {
                    values[readingSignMapping[i]] = moment.utc(record[readingSignMapping[i]]).format('YYYY-MM-DD');
                } else {
                    values[readingSignMapping[i]] = record[readingSignMapping[i]];
                }
            }
        }
        return values;
    }

    const resolveUnits = (record) => {
        const map = {};
        const { authorizedUnits } = user;

        const selectedUnits = {};

        if (record.units) {
            record.units.map(u => selectedUnits[u] = true);
        }

        for (let i = 0; i < authorizedUnits.length; i++) {
            map[authorizedUnits[i]] = selectedUnits[authorizedUnits[i]] !== undefined ?  true: false
        }   

        return map;
    }

    const [modal, setModal] = useState(false);
    const [formikKey, setFormikKey] = useState(0);

    const handleCreateUpdateRecord = (createNew, record={}) => {
        setCreateNew(createNew);
        setSelectedRecord(record);
        setInitialValues(resolveInitialValues(createNew, record));
        setUnits(resolveUnits(createNew ? {} : record));
        setModal(true);
        setFormikKey(formikKey + 1);
    }

    const createUpdateRecord = asyncHandler(async(values) => {
        const endpoint = createNew ? 'createReadingSign' : 'updateReadingSign';
        let method;

        const data = values;
        data.content = editorRef.current.editor.getContents();
        data.units = [];
        data.modifiedBy = user.s_email;

        Object.keys(units).map(key => units[key] === true && data.units.push(key));

        if (createNew) {
            data.createdBy = user.s_email;
            method = 'post';
        } else {
            data._id = selectedRecord._id;
            method = 'put';
        }

        const res = await Axios({
            method,
            url: `${baseApiUrl}/${endpoint}`,
            data: {
                data
            },
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        if (createNew) {
            addLocalValue(readingSigns, setReadingSigns, res.data);
        } else {
            updateLocalValue(readingSigns, setReadingSigns, selectedRecord._id, res.data, '_id');
        }

        createSuccessNotification('Success');
        setModal(false);

    });

    const deleteReadingSign = asyncHandler(async() => {
        await api('delete', `deleteReadingSign/${selectedRecord._id}`);
        deleteLocalValue(readingSigns, setReadingSigns, selectedRecord._id, '_id');
        setModal(false);
        createSuccessNotification('Record Deleted');
    });

    // Tour

    const [runTutorial, setRunTutorial] = useState(false);
    const [tutorialStep, setTutorialStep] = useState(0);
    const [tutorialKey, setTutorialKey] = useState(0);

    const handleTutorial = () => {
        if (!runTutorial) {
            setTutorialStep(0);
            setTutorialKey(tutorialKey+1);
        }
    }

    useEffect(() => {
        if (tutorialKey > 0) {
            setRunTutorial(true);
        }
    }, [tutorialKey]);

    // Tour
    const steps = [
        {
            selector: '.tutorial-intro-create',
            content: 'In this tutorial we will show you how to create a new Read and Sign Record.',
        },
        {
            selector: '.step-1-create',
            content: '1. Click the Create New button.',
        },
        {
            selector: '.step-2-create',
            content: '2. Enter in the title.'
        }, 
        {
            selector: '.step-3-create',
            content: `3. Select the date by which user's must acknowledge the Read and Sign.`
        },
        {
            selector: '.step-4-create',
            content: '4. Select all the units where this Read and Sign will be used.'
        },
        {
            selector: '.step-5-create',
            content: '5. Use the formatting tool to create and style the Read and Sign.'
        },
        {
            selector: '.step-6-create',
            content: '6. Click Submit.'
        }
    ];

    useEffect(() => {
        if (tutorialStep === 1 && modal) {
            setTimeout(() => {
                setTutorialStep(2);
            }, 1000);
        }
    }, [tutorialStep, modal]);

    return (
        <Row>
            <Tour 
                steps={steps}
                isOpen={runTutorial}
                onRequestClose={() => setRunTutorial(false)}
                goToStep={tutorialStep}
                startAt={0}
                nextStep={() => setTutorialStep(tutorialStep + 1)}
                disableFocusLock={true}
            />
            <Col md={12} className={'text-center'}>
                <div className={'mx-auto tutorial-intro-create'}></div>
            </Col>
            <Col md={12}>
                <Button 
                    onClick={() => handleCreateUpdateRecord(true)}
                    className={'mb-2 step-1-create'}
                >
                    Create New
                </Button>
                <ReactTable 
                    data={readingSigns}
                    mapping={readingSignsTableMapping}
                    enableClick={true}
                    handleClick={(item) => handleCreateUpdateRecord(false, item)}
                    numRows={10}
                />
                <Formik 
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validateOnMount={true}
                    validate={values => {
                        const errors = {};
                        const checkFields = ['title', 'dueDate'];
                        for (let i = 0; i < checkFields.length; i++) {
                            if (values[checkFields[i]] === null || values[checkFields[i]].length === 0) {
                                errors[checkFields[i]] = 'Invalid value';
                            }
                        }
                        return errors;
                    }}
                    key={formikKey}
                >
                    {({ values, setFieldValue, isValid }) => (
                        <ModalCreateUpdate 
                            modal={modal}
                            setModal={setModal}
                            createNew={createNew}
                            values={values}
                            setFieldValue={setFieldValue}
                            units={units}
                            editorRef={editorRef}
                            isValid={isValid}
                            createUpdateRecord={createUpdateRecord}
                            deleteReadingSign={deleteReadingSign}
                        />
                    )}
                </Formik>
            </Col>
            <button 
                onClick={() => handleTutorial()} 
                className={'btn btn-purple mt-2'}
            >
                Tutorial
            </button>
        </Row>
    );
}