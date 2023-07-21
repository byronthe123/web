import React, { Component, Fragment, useState, useEffect, useRef  } from 'react';
import { withRouter, useHistory} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import { Formik, Field } from 'formik';
import { Form, FormGroup, Button, Label, Row, Col, Input, Table, Card, CardBody, CardTitle, CardText } from 'reactstrap';

import AppLayout from '../../components/AppLayout';

const SafetyIncidentReporting = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, eightyWindow, width, createSuccessNotification
}) => {

    const history = useHistory();

    useEffect(() => {
        if (!user.b_internal) {
            history.push('/EOS/Portal/Profile');
        }
    }, []);

    const [unit, setUnit] = useState('');

    useEffect(() => {
        user && user.s_unit && setUnit(user.s_unit);
    }, [user.s_unit]);

    const submitReport = (values, resetForm) => {

        const data = values;

        data.s_station = unit;

        axios.post(`${baseApiUrl}/saveNewSmsReport`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            createSuccessNotification('Report Created');
            resetForm();
        }).catch(error => {
            console.log(error);
        });

    }

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: 'white', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                <div className="card-body mb-5 px-5 py-3">
                    <h1>Safety Incident Reporting</h1>
                    <Formik
                        initialValues={{
                            s_created_by: 'ANONYMOUS',
                            t_created: moment().local().format('YYYY-MM-DDTHH:mm'), 
                            s_incident_location: '',
                            t_incident: moment().local().format('YYYY-MM-DDTHH:mm'),
                            s_initial_summary: ''
                        }}
                        validate={values => {
                            const errors = {};
                            const exclude = [];
                            for (let key in values) {
                                if (exclude.indexOf(key) === -1 && values[key].length === 0) {
                                    errors[key] = `${key} is invalid`;
                                }
                            }
                            console.log(errors);
                            return errors;
                        }}>
                        {({ isSubmitting, isValid, errors, values, resetForm, setFieldValue }) => (
                            <Form>
                                {
                                    console.log(values)
                                }
                                <FormGroup className='mb-0'>
                                    <div className='row'>
                                        <div className='col-12' style={{fontSize: '18px'}}>
                                            <table style={{borderSpacing: '15px', borderCollapse: 'separate', width: '75%'}}>
                                                <tbody>
                                                    <tr>
                                                        <td>Report As:</td>
                                                        <td>
                                                            <Field component='select' name='s_created_by' className='form-control'>
                                                                <option value={'ANONYMOUS'}>Anonymous</option>
                                                                <option value={user && user.displayName}>{user && user.displayName}</option>
                                                            </Field>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Choice Station</td>
                                                        <td><p className='form-control'>{unit}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Incident Location</td>
                                                        <td>
                                                            <Field component='textarea' className='form-control' name={"s_incident_location"} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Incident Summary</td>
                                                        <td>
                                                            <Field component='textarea' className='form-control' name={"s_initial_summary"} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Incident Date / Time</td>
                                                        <td>
                                                        <Field 
                                                            type='datetime-local' 
                                                            name={"t_incident"}
                                                            className='form-control'
                                                        />
                                                        </td>
                                                    </tr>
                                                </tbody> 
                                            </table>
                                            <Button disabled={!isValid} onClick={() => submitReport(values, resetForm)}>Submit Report</Button>
                                        </div>
                                    </div>
                                </FormGroup>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

        </AppLayout>
    );
}

export default withRouter(SafetyIncidentReporting);