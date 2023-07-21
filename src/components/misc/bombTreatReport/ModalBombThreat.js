import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Label, FormGroup, Input } from 'reactstrap';
import { Formik, Field } from 'formik';
import moment from 'moment';
import FormikCheckBox from '../../custom/FormikCheckbox';
import { mapping, callerVoiceOptions1, callerVoiceOptions2, backgroundSounds, threatLanguage } from './bombThreatOptions';
import CreateBombReport from './CreateBombReport';
import { renderToString } from 'react-dom/server';
import { asyncHandler } from '../../../utils';
import Axios from 'axios';
import usersMapping from '../../managers/manageTraining/usersMapping';

export default function ModalBombThreat ({
    modal,
    setModal,
    user,
    baseApiUrl,
    headerAuthCode,
    createSuccessNotification
}) {

    const toggle = () => setModal(!modal);
    const [initialValues, setInitialValues] = useState({});

    
    const nameFormatter = (string) => {
        const array = string.split(' ');
        let final = '';
        for (let i = 0; i < array.length; i++) {
            let current;
    
            if (i === 0) {
                current = `${array[i][0].toLowerCase()}${array[i].substring(1)}`;
            } else {
                current = `${array[i][0].toUpperCase()}${array[i].substring(1)}`;
            }
    
            final += current;
    
        }
        return final;
    }

    useEffect(() => {
        const resolveInitialValues = (mapping) => {
            const values = {};
            for (let i = 0; i < mapping.length; i++) {
                values[mapping[i]] = '';
            }
            values.date = moment().local().format('MM/DD/YYYY HH:mm:ss');
            values.createdBy = user.s_email;
            
            return values;
        }


        const addValues = [...callerVoiceOptions1, ...callerVoiceOptions2, ...backgroundSounds];

        for (let i = 0; i < addValues.length; i++) {
            mapping.push(nameFormatter(addValues[i]));
        }

        setInitialValues(resolveInitialValues(mapping));
    }, [modal]);

    const generateReport = (values) => {
        const report = renderToString(
            <CreateBombReport 
                values={values}
            />
        );
        return report;
    }

    const printReport = (values) => {
        const report = generateReport(values);
        const printWindow = window.open("", "MsgWindow", "width=1920, height=1080");
        printWindow.document.write(report);
        setModal(false);
    }

    const emailReport = asyncHandler(async(values) => {
        const report = generateReport(values);
        await Axios.post(`${baseApiUrl}/emailBombReport`, {
            data: {
                s_email: user.s_email,
                bodyHtml: report,
                subject: `Bomb Report ${moment().local().format('YYYY-MM-DD')}`
            }   
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        createSuccessNotification('You will receive an email.');
        setModal(false);
    }); 

    return (
        <Modal isOpen={modal} toggle={toggle} style={{ width: '1000px', maxWidth: '100%' }} data-testid={'modal-bomb-threat'}>
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
            >
                {({ values, setFieldValue }) => (
                    <>
                        <ModalHeader>Bomb Threat Procedure Form</ModalHeader>
                        <ModalBody>
                            <p>Most bomb threats are received by phone. Bomb threats are serious until proven otherwise. Act quickly but remain calm and obtain information with the checklist on the reverse of this card.</p>
                            <p className={'font-weight-bold'}>If a bomb threat is received by phone:</p>
                            <ol>
                                <li>Remain calm. Keep the caller on the line for as long as possible. DO NOT HANG UP, even if the caller does. </li>
                                <li>Listen carefully. Be polite and show interest. </li>
                                <li>Try to keep the caller talking to learn more information. </li>
                                <li>If possible, write a note to a colleague to call the authorities or, as soon as the caller hangs up, immediately notify them yourself. </li>
                                <li>If your phone has a display, copy the number and/or letters on the window display. </li>
                                <li>Complete the Bomb Threat Checklist (reverse side) immediately. Write down as much detail as you can remember. Try to get exact words. </li>
                                <li>Immediately upon termination of the call, do not hang up, but from a different phone, contact FPS immediately with information and await instructions. </li>
                            </ol>
                            <p className={'font-weight-bold'}>If a bomb threat is received by handwritten note:</p>
                            <ol>
                                <li>Call <Field name={'callNum1'} type={'text'} /></li>
                                <li>Handle node as minimally as possible</li>
                            </ol>
                            <p className={'font-weight-bold'}>If a bomb threat is received by email:</p>
                            <ol>
                                <li>Call <Field name={'callNum2'} type={'text'} /></li>
                                <li>Do not delete the message</li>
                            </ol>
                            <Row>
                                <Col md={6}>
                                    <p className={'font-weight-bold'}>Signs of a suspicious package</p>
                                    <ol>
                                        <li>No return addresses</li>
                                        <li>Excessive Postage</li>
                                        <li>Stains</li>
                                        <li>Strange Odor</li>
                                        <li>Poorly Handwritten</li>
                                        <li>Misspelled Words</li>
                                        <li>Incorrect Titles</li>
                                        <li>Foreign Postage</li>
                                        <li>Restrictive Notes</li>
                                        <li>Unexpected Delivery</li>
                                    </ol>
                                </Col>
                                <Col md={6}>
                                    <p className={'font-weight-bold'}>Do Not:</p>
                                    <ol>
                                        <li>Use two-way radios or cellular phone; radio signals have the potential to detonate a bomb. </li>
                                        <li>Evacuate the building until police arrive and evaluate the threat. </li>
                                        <li>Activate the fire alarm. </li>
                                        <li>Touch or move a suspicious package. Strange sounds </li>
                                    </ol>
                                </Col>
                            </Row>

                            <h1>
                                Bomb Threat Checklist <span style={{ fontSize: '12.8px' }}>(Date: {values.dateTime})</span>
                            </h1>
                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Time Caller Hung Up</Label>
                                        <Field name={'hungUpTime'} type={'datetime-local'} className={'form-control'} />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Phone Number where call received</Label>
                                        <Field name={'callReceivedNum'} type={'text'} className={'form-control'} />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <h4>Ask Caller</h4>
                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Where is the bomb located?</Label>
                                        <Field name={'bombLocation'} type={'text'} className={'form-control'} />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>When will it go off?</Label>
                                        <Field name={'bombDetonationdDate'} type={'datetime-local'} className={'form-control'} />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>What does it look like?</Label>
                                        <Field name={'bombDescription'} type={'text'} className={'form-control'} />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>What kind of bomb is it?</Label>
                                        <Field name={'bombType'} type={'text'} className={'form-control'} />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>What will make it explode?</Label>
                                        <Field name={'bombDetonationCause'} type={'text'} className={'form-control'} />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label className={'d-block'}>Did you place the bomb?</Label>
                                        {
                                            ['YES', 'NO'].map((value, i) => (
                                                <Button 
                                                    onClick={() => setFieldValue('placedBomb', value === 'YES')}
                                                    active={value === 'YES' ? values.placedBomb : values.placedBomb === false}
                                                    key={i}
                                                >
                                                    {value}
                                                </Button>
                                            ))
                                        }
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Why did you place the bomb?</Label>
                                        <Field name={'whyPlacedBomb'} type={'textarea'} className={'form-control'} />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>What is your name?</Label>
                                        <Field name={'perpName'} type={'text'} className={'form-control'} />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Exact Words of Threat</Label>
                                        <Field name={'threat'} type={'textarea'} className={'form-control'} />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row className={'mx-2'}>
                                <Col md={8}>
                                    <p className={'font-weight-bold'}>Caller's Voice</p>
                                    <Row>
                                        <Col md={6}>
                                            {
                                                callerVoiceOptions1.map((option, i) => (
                                                    <FormikCheckBox 
                                                        name={nameFormatter(option)}
                                                        checked={values[nameFormatter(option)]}
                                                        label={option}
                                                        onClick={() => setFieldValue(values[nameFormatter(option)], !values[nameFormatter(option)])}
                                                        key={i}
                                                    />
                                                ))
                                            }
                                        </Col>
                                        <Col md={6}>
                                            {
                                                callerVoiceOptions2.map((option, i) => (
                                                    <FormikCheckBox 
                                                        name={nameFormatter(option)}
                                                        checked={values[nameFormatter(option)]}
                                                        label={option}
                                                        onClick={() => setFieldValue(values[nameFormatter(option)], !values[nameFormatter(option)])}
                                                        key={i}
                                                    />
                                                ))
                                            }
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={4}>
                                    <p className={'font-weight-bold'}>Background Sounds</p>
                                    {
                                        backgroundSounds.map((option, i) => (
                                            <FormikCheckBox 
                                                name={nameFormatter(option)}
                                                checked={values[nameFormatter(option)]}
                                                label={option}
                                                onClick={() => setFieldValue(values[nameFormatter(option)], !values[nameFormatter(option)])}
                                                key={i}
                                            />
                                        ))
                                    }
                                </Col>
                            </Row>

                            <Row className={'mx-2'}>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Threat Language</Label>
                                        {
                                            threatLanguage.map((option, i) => (
                                                <FormikCheckBox 
                                                    name={nameFormatter(option)}
                                                    checked={values[nameFormatter(option)]}
                                                    label={option}
                                                    onClick={() => setFieldValue(values[nameFormatter(option)], !values[nameFormatter(option)])}
                                                    key={i}
                                                />
                                            ))
                                        }
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Other Information</Label>
                                        <Field name={'other'} type={'textarea'} className={'form-control'} />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12}>
                                    <h4>Information about Caller</h4>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Where is the caller located?</Label>
                                        <Field name={'callerLocation'} type={'text'} className={'form-control'} />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Estimated Age</Label>
                                        <Field name={'callerAge'} type={'number'} className={'form-control'} />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Is the voice familiar?</Label>
                                        <Field name={'voice'} type={'text'} className={'form-control'} />
                                    </FormGroup>
                                </Col>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Other Points?</Label>
                                        <Field name={'otherAboutCaller'} type={'textarea'} className={'form-control'} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={() => printReport(values)}>Print</Button>
                            <Button color="secondary" onClick={() => emailReport(values)}>Email</Button>
                            <Button color="warning" onClick={toggle}>Close</Button>
                        </ModalFooter>
                    </>
                )}
            </Formik>
        </Modal>
    );
}