import React, {Fragment, useState, useEffect} from 'react';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Formik, Field } from 'formik';

import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Input,
    Label,
    Row,
    Form,
    Col
  } from "reactstrap";
import moment from 'moment';
import FileBase64 from 'react-file-base64';

const ModalEditFlights = ({
    open, 
    handleModal,
    user,
    createNew,
    selectedItem,
    tableMapping,
    selectedDays,
    handleDayClick,
    addFlightsSchedule,
    deleteFlightSchedule,
    manager
}) => {

    const [s_flight_id, set_s_flight_id] = useState('');

    useEffect(() => {
        if (selectedItem) {
            set_s_flight_id(`${selectedItem.s_airline_code}${selectedItem.s_flight_number}/${moment(selectedItem.t_fids_location).format('YYYY-MM-DD')}`);
        }
    }, [selectedItem]);

    const statusOptions = [
        'PLANNED',
        'NIL',
        'CANCELLED'
    ];

    const aircraftTypes = [
        'PAX',
        'CAO',
        'TRK'
    ];

    const setInitialValues = {};

    for (let i = 0; i < tableMapping.length; i++) {
        const currentKey = tableMapping[i].value;
        if (createNew) {
            if (currentKey === 's_unit') {
                setInitialValues[currentKey] = user && user.s_unit;
            } else if (currentKey === 's_status') {
                setInitialValues[currentKey] = statusOptions[0];
            } else if (currentKey === 's_flight_type') {
                setInitialValues[currentKey] = 'IMPORT';
            } else if (currentKey === 's_aircraft_type') {
                setInitialValues[currentKey] = aircraftTypes[0];
            } else if (currentKey === 's_origin_airport') {
                setInitialValues[currentKey] = user && user.s_unit && user.s_unit.substr(1, 3);
            } else {
                setInitialValues[currentKey] = '';
            }
        } else {
            let setValue = selectedItem && selectedItem[currentKey] && selectedItem[currentKey];
            const dateTimeKeys = ['t_estimated_departure', 't_actual_departure', 't_estimated_arrival', 't_actual_arrival'];
            if (dateTimeKeys.indexOf(currentKey) !== -1) {
                setValue = selectedItem && selectedItem[currentKey] && moment.utc(selectedItem[currentKey]).format('YYYY-MM-DDTHH:mm');
            }   
            setInitialValues[currentKey] = setValue;
        }
    }

    const enableSubmit = (isValid) => {
        if (createNew) {
            return isValid && selectedDays.length > 0
        }
        return isValid;
    }   

    const validateAirlineCode = (value, setFieldValue) => {
        if (value && value.length > 0 && value[0].match(/[A-z, a-z]/) === null) {
            alert('Invalid entry for Airline Code.');
            setFieldValue('s_airline_code', '');
        } else {
            setFieldValue('s_airline_code', value);
        }
    }

    return (
        <Fragment>
            <Modal isOpen={open} toggle={(e) => handleModal(!open)}>
                <div className="modal-content" style={{width: '1200px', position: 'absolute', right: '-70%'}}>
                    <div className="modal-body mx-auto" style={{width: '1150px'}}>
                        <div className='text-center'>
                            <h1>{createNew ? 'Add Flight' : `Update Flight ${s_flight_id}`}</h1>
                        </div>
                        <div>
                            <Row className='pt-3'>
                                <Col md={12} className='mx-auto'>
                                    <Formik
                                        initialValues={setInitialValues}
                                        validate={(values, setFieldValue) => {
                                            const errors = {};
                                            const exclude = ['id', 's_airline_name', 't_estimated_departure', 't_estimated_arrival', 't_actual_departure', 't_cut_off_time', 't_uws_time', 't_actual_arrival', 't_sla_breakdown', 's_notes'];
                                            for (let key in values) {
                                                if (exclude.indexOf(key) === -1 && values[key].length === 0) {
                                                    errors[key] = `${key} is invalid`;
                                                }
                                            }
                                            if (values.s_flight_type === 'IMPORT') {
                                                setFieldValue('s_origin_airport', 'TEST');
                                                // setFieldValue('s_origin_airport', user && user.s_unit && user.s_unit.substr(1, 3));
                                            } else if (values.s_flight_type === 'EXPORT') {
                                                setFieldValue('s_destination_airport', user && user.s_unit && user.s_unit.substr(1, 3));
                                            }
                                            return errors;
                                        }}
                                        >
                                        {({ isSubmitting, isValid, errors, values, handleChange, setFieldValue }) => (
                                            <Form>
                                                <Row>
                                                <Col md={6}>
                                                    {
                                                        manager && 
                                                        <>
                                                            <Row>
                                                                <Col md={3}>
                                                                    <FormGroup>
                                                                        <Label className='mr-2'>Unit</Label>
                                                                        <p className='form-control'>{values.s_unit}</p>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <FormGroup>
                                                                        <Label className='mr-2'>Flight Type</Label>
                                                                        <Field component="select" name="s_flight_type" className="form-control" onChange={(e) => {
                                                                            handleChange(e);
                                                                            if (e.target.value === 'IMPORT') {
                                                                                setFieldValue('s_origin_airport', user && user.s_unit && user.s_unit.substr(1, 3));
                                                                                setFieldValue('s_destination_airport', '');
                                                                            } else {
                                                                                setFieldValue('s_destination_airport', user && user.s_unit && user.s_unit.substr(1, 3));
                                                                                setFieldValue('s_origin_airport', '');
                                                                            }
                                                                        }}>
                                                                            <option value={'IMPORT'}>IMPORT</option>
                                                                            <option value={'EXPORT'}>EXPORT</option>
                                                                        </Field>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <FormGroup>
                                                                        <Label className='mr-2'>Airline Code</Label>
                                                                        <Field type="text" name={'s_airline_code'} value={values.s_airline_code} onChange={e => validateAirlineCode(e.target.value, setFieldValue)} className="form-control" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={3}>                                             
                                                                    <FormGroup>
                                                                        <Label className='mr-2'>Flight Number</Label>
                                                                        <Field type="text" name="s_flight_number" className="form-control" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={3}>
                                                                    <FormGroup>
                                                                        <Label className='mr-2'>Aircraft</Label>
                                                                        <Field type="text" name="s_aircraft" className="form-control" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <FormGroup>
                                                                        <Label className='mr-2'>Aircraft Type</Label>
                                                                        <Field component="select" name="s_aircraft_type" className="form-control">
                                                                            {
                                                                                aircraftTypes.map((t, i) => 
                                                                                    <option value={t} key={i}>{t}</option>
                                                                                )
                                                                            }
                                                                        </Field>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <FormGroup>
                                                                        <Label className='mr-2'>Origin</Label>
                                                                        <Field type="text" name="s_origin_airport" className="form-control" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <FormGroup>
                                                                        <Label className='mr-2'>Destination</Label>
                                                                        <Field type="text" name="s_destination_airport" className="form-control" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </>
                                                    }
                                                    <FormGroup>
                                                        <Label className='mr-2'>Status</Label>
                                                        <Field component="select" name="s_status" className="form-control">
                                                        {
                                                            statusOptions.map((o, i) =>
                                                                <option key={i} value={o}>{o}</option>
                                                            )
                                                        }
                                                        </Field>
                                                    </FormGroup>
                                                    <FormGroup>
                                                    {
                                                        createNew ? 
                                                        <>
                                                            <Label className='mr-2'>Estimated Departure Time</Label>
                                                            <Field type="time" name="t_estimated_departure_time" className="form-control" />
                                                        </> :
                                                        <>
                                                        {
                                                            manager ? 
                                                                <>
                                                                    <Label className='mr-2'>Estimated Departure</Label>
                                                                    <Field type="datetime-local" name="t_estimated_departure" className="form-control" />
                                                                    <Label className='mr-2'>Actual Departure</Label>
                                                                    <Field type="datetime-local" name="t_actual_departure" className="form-control" />
                                                                </> : 
                                                                <>
                                                                    <Label className='mr-2'>Actual Departure</Label>
                                                                    <Field type="datetime-local" name="t_actual_departure" className="form-control" />
                                                                </>
                                                        }
                                                        </>
                                                    }
                                                    </FormGroup>
                                                    {
                                                        createNew ? 
                                                        <>
                                                            <Label className='mr-2'>Estimated Arrival Time</Label>
                                                            <Field type="time" name="t_estimated_arrival_time" className="form-control" />
                                                        </> :
                                                        <>
                                                            {
                                                                manager ?
                                                                    <>
                                                                        <Label className='mr-2'>Estimated Arrival</Label>
                                                                        <Field type="datetime-local" name="t_estimated_arrival" className="form-control" />
                                                                        <>
                                                                            <Label className='mr-2'>Actual Arrival</Label>
                                                                            <Field type="datetime-local" name="t_actual_arrival" className="form-control" />
                                                                        </>
                                                                    </> :
                                                                    <>
                                                                        <Label className='mr-2'>Actual Arrival</Label>
                                                                        <Field type="datetime-local" name="t_actual_arrival" className="form-control" />
                                                                    </>
                                                            }
                                                        </>
                                                    }
                                                    <FormGroup>
                                                        <Label className='mr-2'>Notes</Label>
                                                        <Field type="text" name="s_notes" className="form-control" />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                {
                                                    !createNew && selectedItem && selectedItem.s_airline_code && selectedItem.s_flight_number &&
                                                        <div dangerouslySetInnerHTML={{ __html: `
                                                            <div class="airportia-widget">
                                                                <iframe scrolling="no" frameborder="0"
                                                                    style="border:0; width: 100%; height: 95%; min-height: 650px; margin:0; padding:0;"
                                                                    src="https://www.airportia.com/widgets/flight/${selectedItem.s_airline_code}${selectedItem.s_flight_number.replace(/\b0+/g, '')}/">
                                                                </iframe>
                                                            </div>
                                                        `
                                                        }}></div>
                                                }
                                                {
                                                    createNew && 
                                                    <div className='text-center mx-auto'>
                                                        <h4>Select Days:</h4>
                                                        <DayPicker
                                                            selectedDays={selectedDays}
                                                            onDayClick={handleDayClick}
                                                        />
                                                    </div>
                                                }
                                                <Row>
                                                    <Col md={12} className='text-center'>
                                                        <Button onClick={() => addFlightsSchedule(values)} disabled={!enableSubmit(isValid)}>
                                                            Submit
                                                        </Button>
                                                        {
                                                            manager && !createNew && 
                                                            <Button className='ml-2' color='danger' onClick={() => deleteFlightSchedule()}>
                                                                Delete
                                                            </Button>
                                                        }
                                                    </Col>
                                                </Row>
                                                </Col>
                                                </Row>
                                            </Form>
                                        )}
                                    </Formik>                            
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
}

export default ModalEditFlights;