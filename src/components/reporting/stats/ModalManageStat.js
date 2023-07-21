import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';
import { Formik, Field } from 'formik';
import formMapping from './formMapping';
import moment from 'moment';
import * as yup from 'yup';
import _ from 'lodash';
import { renderToString } from 'react-dom/server';

import ImportExportForm from './ImportExportForm';
import RampForm from './RampForm';
import MiscForm from './MiscForm';
import ActionIcon from '../../custom/ActionIcon';
import StatsPrint from './StatsPrint';
import { print } from '../../../utils';

export default function ModalManageStat ({
    user,
    modal,
    setModal,
    selectedType,
    viewOnly,
    selectedStat,
    airlines,
    airlineOptions,
    handleSelectAirline,
    selectedAirline,
    createValidateStat,
    enterInLbs,
    setEnterInLbs,
    isManager,
    checkDuplicateStat,
    duplicateWarning,
    deleteStat
}) {

    const toggle = () => setModal(!modal);
    const [initialValues, setInitialValues] = useState({});
    const [uldsArray, setUldsArray] = useState([]);

    const resolveInitialValues = (mapping) => {
        const values = {};
        for (let i = 0; i < mapping.length; i++) {
            const { key, defaultValue } = mapping[i];
            if (viewOnly) {
                // if (key !== 's_notes') {
                //     values[key] = selectedStat[key];
                // }
                values[key] = selectedStat[key];
                if (key === 'd_flight') {
                    values[key] = moment.utc(selectedStat[key]).format('YYYY-MM-DD');
                }
            } else {
                if (defaultValue !== undefined) {
                    values[key] = defaultValue;
                } else {
                    values[key] = '';
                }
            }
        }
        values.s_type = selectedType;
        return values;
    }

    useEffect(() => {
        const values = resolveInitialValues(formMapping);
        
        const { s_airline_code } = values;
        const airline = airlines.find(a => a && a.AirlineDatum && a.AirlineDatum.s_airline_code === s_airline_code) || '';

        if (viewOnly) {
            if (airline) {
                handleSelectAirline({
                    value: airline.AirlineDatum.s_airline_code,
                    label: `${airline.AirlineDatum.s_airline_name} (${airline.AirlineDatum.s_airline_code})`,
                    logo: airline.AirlineDatum.s_logo
                });
            }
        } else {
            handleSelectAirline({
                value: '',
                label: '',
                logo: null
            });
        }

        setInitialValues(values);
        setEnterInLbs(false);
    }, [modal]);

    const [validAirline, setValidAirline] = useState(false);

    useEffect(() => {
        console.log(selectedAirline);
        if (selectedAirline && selectedAirline.value && selectedAirline.value.length > 0) {
            setValidAirline(true);
        } else {
            setValidAirline(false);
        }
    }, [selectedAirline]);

    const resolveBg = (selectedType) => {
        if (selectedType === 'IMPORT') {
            return '#61B996';
        } else if (selectedType === 'EXPORT') {
            return '#6BB4DD';
        } else {
            return 'grey';
        }
    }

    const printStat = (values) => {
        print(<StatsPrint stat={values} uldsArray={uldsArray} userEmail={user.s_email} />);
    }

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} size={'lg'} style={{ maxWidth: '1400px' }}>
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    // validate={values => {
                    //     const errors = {};
                    //     let required;
                    //     if (selectedType === 'IMPORT' || selectedType === 'EXPORT') {
                    //         required = ['s_flight_number', 'd_flight'];
                    //     } else if (selectedType === 'RAMP' ) {
                    //         required = ['s_flight_number', 'd_flight', 's_aircraft_type'];
                    //     } else {
                    //         required = ['d_flight'];
                    //     }

                    //     for (let key in values) {
                    //         if (required.includes(key) && values[key].length === 0) {
                    //             errors[key] = `${key} is invalid: ${values[key]}`;
                    //         }
                    //     }

                    //     return errors;
                    // }}
                    validationSchema={
                        yup.object().shape({
                            s_flight_number: yup.string().test('s_flight_number requirement', 'Flight number required', value => {
                                if (['IMPORT', 'EXPORT', 'RAMP'].includes(selectedType)) {
                                    return _.get(value, 'length', 0) > 0;
                                } else {
                                    return true;
                                }
                            }),
                            s_aircraft_type: yup.string().test('s_aircraft_type requirement', 'Aircraft type required', value => {
                                if (['RAMP'].includes(selectedType)) {
                                    return _.get(value, 'length', 0) > 0;
                                } else {
                                    return true;
                                }
                            }),
                            s_misc_type: yup.string().test('s_misc_type requirement', 'Misc type required', value => {
                                if (selectedType === 'MISC') {
                                    return _.get(value, 'length', 0) > 0;
                                } else {
                                    return true;
                                }
                            }),
                            d_flight: yup.date().required('Must be a valid date'),
                            i_awb: yup.number().integer('Must be a whole number').notRequired().nullable().min(0),
                            i_pieces: yup.number().integer('Must be a whole number').notRequired().nullable().min(0),
                            i_awb_dg: yup.number().integer('Must be a whole number').notRequired().nullable().min(0),
                            i_awb_prepare: yup.number().integer('Must be a whole number').notRequired().nullable().min(0),
                            i_ld3: yup.number().integer('Must be a whole number').notRequired().nullable().min(0),
                            i_ld3_bup: yup.number().integer('Must be a whole number').notRequired().nullable().min(0),
                            i_ld7: yup.number().integer('Must be a whole number').notRequired().nullable().min(0),
                            i_ld7_bup: yup.number().integer('Must be a whole number').notRequired().nullable().min(0),
                        })
                    }
                >
                    {({ values, setFieldValue, isValid, handleChange, errors }) => (
                        <>
                            <ModalHeader className='py-3' style={{ width: '100%' }}>
                                <div className='float-left'>
                                    <span>
                                        { viewOnly ? 'View' : 'Add'} <span style={{ backgroundColor: resolveBg(selectedType), color: 'white' }}>{ selectedType }</span> Stats
                                    </span>
                                    <span>
                                        {
                                            selectedAirline && 
                                            <img src={selectedAirline.logo} style={{ height: '50px', width: 'auto' }} />
                                        }
                                    </span>
                                </div>
                                {
                                    isManager && 
                                    <div className='float-right'>
                                        <Button color='warning'>Manager Access</Button>
                                    </div>
                                }
                            </ModalHeader>
                            <ModalBody className='py-3'>
                                <fieldset disabled={viewOnly && !isManager}>
                                {
                                    selectedType === 'IMPORT' || selectedType === 'EXPORT' ?
                                        <ImportExportForm 
                                            user={user}
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            airlineOptions={airlineOptions}
                                            handleSelectAirline={handleSelectAirline}
                                            selectedAirline={selectedAirline}
                                            handleChange={handleChange}
                                            selectedType={selectedType}
                                            enterInLbs={enterInLbs}
                                            setEnterInLbs={setEnterInLbs}
                                            selectedStat={selectedStat}
                                            viewOnly={viewOnly}
                                            checkDuplicateStat={checkDuplicateStat}
                                            duplicateWarning={duplicateWarning}
                                            errors={errors}
                                            setUldsArray={setUldsArray}
                                        /> 
                                        :  selectedType === 'RAMP' ? 
                                        <RampForm 
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            airlineOptions={airlineOptions}
                                            handleSelectAirline={handleSelectAirline}
                                            selectedAirline={selectedAirline}
                                            selectedStat={selectedStat}
                                            viewOnly={viewOnly}
                                            checkDuplicateStat={checkDuplicateStat}
                                            duplicateWarning={duplicateWarning}
                                            errors={errors}
                                        /> : 
                                        <MiscForm 
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            airlineOptions={airlineOptions}
                                            handleSelectAirline={handleSelectAirline}
                                            selectedAirline={selectedAirline}
                                            selectedStat={selectedStat}
                                            viewOnly={viewOnly}
                                            errors={errors}
                                        />
                                }
                                </fieldset>
                            </ModalBody>
                            <ModalFooter className='py-3'>
                                {
                                    !viewOnly && 
                                    <Button disabled={(!isValid || !validAirline)} onClick={() => createValidateStat(values, false)}>Submit</Button>
                                }
                                {
                                    viewOnly && isManager && 
                                    <>
                                        <Button onClick={() => createValidateStat(values, true)}>Validate</Button>
                                        <Button onClick={() => deleteStat(selectedStat.s_guid)} color={'danger'}>Delete</Button>
                                    </>
                                }
                                <Button onClick={toggle} color={'info'}>Exit</Button>
                            </ModalFooter>
                        </>
                    )}
                </Formik>
            </Modal>
        </div>
    );
}