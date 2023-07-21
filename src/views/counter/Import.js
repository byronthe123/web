import React, { useState, useEffect  } from 'react';
import {withRouter, useHistory} from 'react-router-dom';
import { ImportProvider, useImportContext } from '../../components/counter/import/context/index';
import moment from 'moment';
import { Button, Row, Col  } from "reactstrap";
import { Formik } from 'formik';
import { Wizard, Steps, Step } from 'react-albus';
import TopNavigation from '../../components/wizard-hooks/TopNavigation';

import AppLayout from '../../components/AppLayout';
import mapping from '../../components/counter/import/mapping';
import PaymentAndLocation from '../../components/counter/import/PaymentAndLocation';
import IdentificationAndDocuments from '../../components/counter/import/IdentificationAndDocuments';
import CheckClearance from '../../components/counter/import/CheckClearance';
import ModalReject from '../../components/counter/import/ModalReject'; 
import useApis from '../../components/counter/import/useApis';

const ImportMain = () => {

    const history = useHistory();
    const { global, module, additionalData, paymentsCharges, storage } = useImportContext();
    const { storageStartDate } = storage;
    const {                 
        awbsLoading,
        awbs,
        setManualMode,
        selectedAwb,
        setSelectedAwb,
        values, 
        setFieldValue, 
        resetForm,
        topNavClick,
        setRefresh
    } = module;

    const { ffms, clearanceData } = additionalData;
    const { createImportItem, searchMissingPayment } = useApis();

    useEffect(() => {
        if(!awbsLoading) {
            if (awbs.length < 1) {
                history.push('/EOS/Operations/Counter/Queue');
            } else {
                setSelectedAwb(awbs[0]);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [awbsLoading, awbs, history]);

    useEffect(() => {
        if (ffms.length === 0) {
            setManualMode(true);
        } else {
            setManualMode(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ffms]);

    useEffect(() => {
        const identificationFields = ['s_driver_name', 's_driver_id_type', 't_driver_id_expiration', 's_driver_id_number', 'b_driver_id_match_photo'];
        const identificationObj = {};
        for (let i = 0; i < identificationFields.length; i++) {
            const current = identificationFields[i];
            identificationObj[current] = values[current];
        }

        resetForm();

        for (let key in identificationObj) {
            setFieldValue(key, identificationObj[key]);
        }

        if (selectedAwb && selectedAwb.s_mawb) {
            setFieldValue('t_counter_start_time', moment().local().format('MM/DD/YYYY HH:mm:ss'));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAwb]);

    // Modal Reject
    const [modalReject, setModalReject] = useState(false);

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3' data-testid={'view-import'}>
                        <Col md='12' lg='12'>
                            
                            <Wizard render={({ step, steps, next, push, previous }) => (
                                <>
                                    <Row>
                                        <Col md={12}>
                                            <h1 className='float-left' data-test="main-title" onClick={() => setRefresh(prev => !prev)}>
                                                Import
                                            </h1>
                                        </Col>
                                    </Row>
                                    <div className="wizard wizard-default mt-1">
                                        <TopNavigation
                                            className="justify-content-center mb-4"
                                            disableNav={false}
                                            topNavClick={topNavClick}
                                        />
                                        <Steps>
                                            <Step id={'1'} name={'Check for Payment & Location'}>
                                                <PaymentAndLocation 
                                                    searchMissingPayment={searchMissingPayment}
                                                />
                                            </Step>
                                            <Step id={'2'} name={'Check Identification and Documents'}>
                                                <IdentificationAndDocuments 
                                                    step={step}
                                                    previous={previous}
                                                />
                                            </Step>
                                            <Step id={'3'} name={'Check Clearance'}>
                                                <CheckClearance 
                                                    selectedAwb={selectedAwb}
                                                    values={values}
                                                    createImportItem={createImportItem}
                                                    step={step}
                                                    push={push}
                                                    awbs={awbs}
                                                    clearanceData={clearanceData}
                                                    paymentsCharges={paymentsCharges}
                                                />
                                            </Step>
                                        </Steps>
                                    </div>

                                    <ModalReject 
                                        modal={modalReject}
                                        setModal={setModalReject}
                                        createImportItem={createImportItem}
                                        push={push}
                                        values={values}
                                    />

                                </>
                            )}>

                            </Wizard>

                        </Col>
                    </Row>
                </div>
            </div>

        </AppLayout>
    );
}

const Import = () => {

    const [initialValues, setInitialValues] = useState({});

    const isNumber = (key) => key[0] === 'f' || key[0] === 'i';

    useEffect(() => {
        const resolveInitialValues = (mapping) => {
            const values = {};
            for (let i = 0; i < mapping.length; i++) {
                const key = mapping[i];
                if (isNumber(key)) {
                    values[key] = 0;
                } else {
                    values[key] = '';
                }
            }
            return values;
        }
        const values = resolveInitialValues(mapping);
        setInitialValues(values);
    }, []);

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
        >
            {({ values, setFieldValue, resetForm }) => (
                <ImportProvider 
                    values={values}
                    setFieldValue={setFieldValue}
                    resetForm={resetForm}
                >
                    <ImportMain />
                </ImportProvider>

            )}
        </Formik>
    );
}

export default withRouter(Import);