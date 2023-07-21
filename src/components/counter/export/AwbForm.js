import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, FormGroup, Label, Button, ButtonGroup } from 'reactstrap';
import { Field } from 'formik';
import PulseLoader from 'react-spinners/PulseLoader';
import moment from 'moment';
import classnames from 'classnames';

import FormikSwitch from '../../custom/FormikSwitch';
import ConfirmField from './ConfirmField';
import SelectAirport from '../../custom/SelectAirport';
import styled from 'styled-components';
import ModalConfirmBooking from './ModalConfirmBooking';
import SpecialHandlingCodes from '../../custom/SpecialHandlingCodes';

export default function AwbForm({
    selectedAwb,
    recognizingFile,
    formFields,
    setFormFields,
    values,
    setFieldValue,
    checkIdentification,
    selectedFile,
    fileType,
    setModal,
    checkAwbData,
    addToFiles,
    airportCodes,
    airportCodesMap,
    setBookingConfirmed,
    shcs,
    shcsDgMap
}) {

    const [modalConfirmBooking, setModalConfirmBooking] = useState(false);
    const handleSave = () => {
        addToFiles(selectedFile);
        setModal(false);
    };

    const [selectedShcs, setSelectedShcs] = useState([]);

    useEffect(() => {
        let b_dg = false;
        const length = Math.min(5, selectedShcs.length);
        for (let i = 0; i < length; i++) {
            setFieldValue(`s_shc${i + 1}`, selectedShcs[i].value);
            if (shcsDgMap[selectedShcs[i].value]) {
                b_dg = true;
            }
        }
        setFieldValue('b_dg', b_dg);
    }, [selectedShcs, shcsDgMap]);

    useEffect(() => {
        if (values.t_depart_date) {
            const date = values.t_depart_date;
            const validDate =
                moment(date).isValid() &&
                moment(moment(date).format('MM/DD/YYYY')).isSameOrAfter(
                    moment().local().subtract(1, 'week').format('MM/DD/YYYY')
                ) &&
                moment(moment(date).format('MM/DD/YYYY')).isBefore(
                    moment().local().add(1, 'month').format('MM/DD/YYYY')
                );

            if (!validDate) {
                alert('Invalid Flight Date.');
                setFieldValue('t_depart_date', '');
            }
        }
    }, [values.t_depart_date]);

    return (
        <Row>
            {recognizingFile ? (
                <Col md={12} className={'text-center'}>
                    <PulseLoader size={100} color={'#51C878'} loading={true} />
                </Col>
            ) : (
                <Col md={12}>
                    <Row className={'text-left mt-3'}>
                        <Col md={6} className={'text-center mt-2'}>
                            <img
                                src={`${
                                    selectedFile.base64 ||
                                    'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms='
                                }`}
                                style={{ maxWidth: '400px', height: 'auto' }}
                            />
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label className={'d-block font-weight-bold'}>
                                    AWB: must be {selectedAwb.s_mawb}
                                </Label>
                                <Field
                                    name={'s_mawb'}
                                    type={'text'}
                                    className={classnames('d-inline', {
                                        'bg-warning':
                                            !values.s_mawb ||
                                            values.s_mawb !==
                                                selectedAwb.s_mawb,
                                    })}
                                    style={{ width: '350px' }}
                                    autoComplete={'off'}
                                />
                                <ConfirmField
                                    formFields={formFields}
                                    setFormFields={setFormFields}
                                    name={'s_mawb'}
                                />
                            </FormGroup>
                            <FormGroup>
                                <SelectAirportContainer>
                                    <CustomLabel>Origin:</CustomLabel>
                                    <SelectAirport
                                        airports={airportCodes}
                                        airportCodesMap={airportCodesMap}
                                        code={values.s_origin}
                                        setCode={(value) =>
                                            setFieldValue('s_origin', value)
                                        }
                                    />
                                </SelectAirportContainer>
                                <ConfirmField
                                    formFields={formFields}
                                    setFormFields={setFormFields}
                                    name={'s_origin'}
                                />
                            </FormGroup>
                            <FormGroup>
                                <SelectAirportContainer>
                                    <CustomLabel>POU:</CustomLabel>
                                    <SelectAirport
                                        airports={airportCodes}
                                        airportCodesMap={airportCodesMap}
                                        code={values.s_port_of_unlading}
                                        setCode={(value) =>
                                            setFieldValue(
                                                's_port_of_unlading',
                                                value
                                            )
                                        }
                                    />
                                </SelectAirportContainer>
                            </FormGroup>
                            <FormGroup>
                                <SelectAirportContainer>
                                    <CustomLabel>Destination</CustomLabel>
                                    <SelectAirport
                                        airports={airportCodes}
                                        airportCodesMap={airportCodesMap}
                                        code={values.s_destination}
                                        setCode={(value) =>
                                            setFieldValue(
                                                's_destination',
                                                value
                                            )
                                        }
                                    />
                                </SelectAirportContainer>
                                <ConfirmField
                                    formFields={formFields}
                                    setFormFields={setFormFields}
                                    name={'s_destination'}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className={'d-block'}>Pieces:</Label>
                                <Field
                                    name={'i_pieces'}
                                    type={'number'}
                                    className={'form-control d-inline'}
                                    style={{ width: '350px' }}
                                />
                                <ConfirmField
                                    formFields={formFields}
                                    setFormFields={setFormFields}
                                    name={'i_pieces'}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className={'d-block'}>Weight:</Label>
                                <Field
                                    name={'i_weight'}
                                    type={'number'}
                                    className={'form-control d-inline'}
                                    style={{ width: '350px' }}
                                />
                                <ConfirmField
                                    formFields={formFields}
                                    setFormFields={setFormFields}
                                    name={'f_weight'}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className={'d-block'}>Commodity:</Label>
                                <Field
                                    name={'s_commodity'}
                                    type={'text'}
                                    className={'form-control d-inline'}
                                    style={{ width: '350px' }}
                                />
                                <ConfirmField
                                    formFields={formFields}
                                    setFormFields={setFormFields}
                                    name={'s_commodity'}
                                />
                            </FormGroup>
                            <Button 
                                onClick={() => setModalConfirmBooking(true)}
                                className={'mb-2'}
                            >
                                Confirm Booking
                            </Button>
                            <div className={'custom-disabled'}>
                                <FormGroup>
                                    <Label className={'d-block'}>
                                        Flight Number:
                                    </Label>
                                    <Field
                                        name={'s_flight_number'}
                                        type={'text'}
                                        className={'form-control d-inline'}
                                        style={{ width: '350px' }}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label className={'d-block'}>
                                        Flight Date:
                                    </Label>
                                    <Field
                                        name={'t_depart_date'}
                                        type={'date'}
                                        min={moment().format('YYYY-MM-DD')}
                                        className={classnames(
                                            'form-control d-inline',
                                            {
                                                'bg-warning':
                                                    !values.t_depart_date ||
                                                    values.t_depart_date.length < 1,
                                            }
                                        )}
                                        style={{ width: '350px' }}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label className={'d-block'}>
                                        Aircraft Type:
                                    </Label>
                                    <ButtonGroup>
                                        {['CAO', 'PAX'].map((type, i) => (
                                            <button
                                                onClick={() =>
                                                    setFieldValue(
                                                        's_transport_type',
                                                        type
                                                    )
                                                }
                                                active={
                                                    values.s_transport_type === type
                                                }
                                                className={classnames(
                                                    'btn',
                                                    values.s_transport_type === type
                                                        ? 'btn-success'
                                                        : 'btn-outline-dark'
                                                )}
                                                key={i}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </ButtonGroup>
                                </FormGroup>
                            </div>

                            <Row>
                                <Col md={12}>
                                    <Label className={'d-block'}>
                                        Special Handling Code:
                                    </Label>
                                    <SpecialHandlingCodes 
                                        shcs={shcs}
                                        selectedShcs={selectedShcs}
                                        setSelectedShcs={setSelectedShcs}
                                    />
                                </Col>
                            </Row>

                            <Row className={'mt-4'} style={{ width: '150px' }}>
                                <Col md={12}>
                                    <FormikSwitch
                                        label={'DG'}
                                        name={'b_dg'}
                                        values={values}
                                        setFieldValue={() => {}}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col md={12} className={'text-center mt-2'}>
                            <Button
                                disabled={!checkAwbData()}
                                onClick={() => handleSave()}
                            >
                                Save
                            </Button>
                        </Col>
                    </Row>
                </Col>
            )}
            <ModalConfirmBooking 
                modal={modalConfirmBooking}
                setModal={setModalConfirmBooking}
                selectedAwb={selectedAwb}
                values={values}
                setFieldValue={setFieldValue}
                setBookingConfirmed={setBookingConfirmed}
            />
        </Row>
    );
}

export const SelectAirportContainer = styled.div`
    display: flex;
    align-items: baseline;
`;

const CustomLabel = styled(Label)`
    width: 70px;
`;