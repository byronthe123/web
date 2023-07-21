import React, { useState, useEffect } from 'react';
import { Field } from 'formik';
import { Table, Row, Col, Button, ButtonGroup } from 'reactstrap';
import FormikSwitch from '../../custom/FormikSwitch';
import { asyncHandler, formatCost } from '../../../utils';
import Axios from 'axios';
import tableMapping from '../import/tableMappings';
import ReactTable from '../../custom/ReactTable';
import ModalPayments from './ModalPayments';
import classnames from 'classnames';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { SelectAirportContainer } from './AwbForm';
import SelectAirport from '../../custom/SelectAirport';

const ConfirmButton = ({
    value,
    setValue,
    label,
    disabled
}) => {
    return (
        <Row>
            <Col md={12} className={"text-center"}>
                <Button 
                    disabled={disabled} 
                    onClick={() => setValue(!value)} 
                    className={'mx-auto text-center'}
                    color={disabled ? 'warning' : 'primary'}
                >
                    {label} 
                    {
                        value && <i className={'fal fa-check ml-2'}/>
                    }
                </Button>
            </Col>
        </Row>
    );
}


const screenTypesMap = {
    'unscreendIac': true,
    'iacTenderCcsf': true,
    'iacAlsoCcsf': true
}

export default function ConfirmAndProcess ({
    values, 
    setFieldValue,
    foundIac,
    foundCcsf,
    createExportItem,
    push,
    selectedAwb,
    baseApiUrl,
    headerAuthCode,
    user,
    screeningType,
    shipperType,
    airportCodes,
    airportCodesMap
}) {

    const [confirmAwbDetails, setConfirmAwbDetails] = useState(false);
    const [confirmTsa, setConfirmTsa] = useState(false);
    const [confirmId, setConfirmId] = useState(false);
    const [enableProcess, setEnableProcess] = useState(false);

    useEffect(() => {
        if (confirmAwbDetails && confirmTsa && confirmId) {
            setEnableProcess(true);
        } else {
            setEnableProcess(false);
        }
    }, [confirmAwbDetails, confirmTsa, confirmId]);

    const disableTsa = 
        screenTypesMap[screeningType] &&
        values.s_transport_type === 'PAX' && shipperType === 'UNKNOWN SHIPPER ONLY';

    useEffect(() => {
        if (disableTsa) {
            setConfirmTsa(false);
        }
    }, [disableTsa]);

    const [payments, setPayments] = useState([]);
    const [addCharge, setAddCharge] = useState(false);
    const [modalPayments, setModalPayments] = useState(false);
    const [paymentDue, setPaymentDue] = useState(0);
    const [charges, setCharges] = useState(0);
    const [credits, setCredits] = useState(0);
    const [paid, setPaid] = useState(0);

    const resolvePayments = (payments) => {
        let charges = 0;
        let credits = 0;
        let paid = 0;

        for (let i = 0; i < payments.length; i++) {
            if (payments[i].s_payment_method === 'OVERRIDE') {
                credits += payments[i].f_amount;
            } else if (payments[i].s_payment_method === 'CHARGE') {
                charges += payments[i].f_amount;
            } else {
                paid += payments[i].f_amount;
            }
        }

        setCharges(charges);
        setCredits(credits);
        setPaid(paid);
        setPaymentDue(charges - (credits + paid));
    }

    useEffect(() => {
        const selectCargoSprintPayments = asyncHandler(async() => {
            const res = await Axios.post(`${baseApiUrl}/selectCargoSprintPayments`, {
                s_awb: selectedAwb.s_mawb
            }, {
                headers: {
                    Authorization: `Bearer ${headerAuthCode}`
                }
            });
            setPayments(res.data);
            resolvePayments(res.data);
        });
        selectCargoSprintPayments();
    }, [selectedAwb]);

    const handleAddPaymentCharge = (addCharge) => {
        setAddCharge(addCharge);
        setModalPayments(true);
    }

    const addPaymentOrCharge = asyncHandler(async(f_amount, s_notes, s_payment_type, s_payment_reference) => {

        let endpoint;

        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        const email = user.s_email;

        const payments = {};

        payments.s_payment_type = s_payment_type;
        payments.s_awb = selectedAwb.s_mawb;
        payments.s_hawb = null;
        payments.f_amount = addCharge ? Math.abs(f_amount) * -1 : f_amount;
        payments.s_name = selectedAwb.s_trucking_driver;
        payments.t_created_date = now;
        payments.s_unit = selectedAwb.s_unit;
        payments.s_created_by = email;
        payments.t_created = now;
        payments.s_notes = s_notes;
        payments.s_origin = values.s_origin;
        payments.s_destination = values.s_destination;

        if (!addCharge) {
            payments.s_payment_method = 'PAYMENT'; //updated
            endpoint = 'addPayment';
        } else {
            payments.s_payment_method = 'CHARGE'; //updated
            endpoint = 'addCharge';
        }

        const counter = {
            s_unit: selectedAwb.s_unit,
            s_mawb: selectedAwb.s_mawb,
            s_airline: selectedAwb.s_airline,
            s_payment_reference: s_payment_reference,
            s_type: payments.s_payment_type,
            f_amount: f_amount,
            t_created: now,
            s_created_by: email,
            t_modified: now,
            s_modified_by: email,
            s_hawb: null,
            d_payment_date: now,
            s_mawb_id: selectedAwb.s_mawb_id,
            s_guid: uuidv4(),
            s_status: 'PROCESSED',
            s_notes: s_notes          
        };

        const data = {
            payments
        }

        if (!addCharge) {
            data.counter = counter;
        }

        const res = await axios.post(`${baseApiUrl}/${endpoint}`, {
            data
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        setPayments(res.data, true);
        setModalPayments(false);
    });


    return (
        <>
            <Row>
                <Col md={4}>
                    <ConfirmButton 
                        value={confirmAwbDetails}
                        setValue={setConfirmAwbDetails}
                        label={'AWB Details'}
                    />
                    <Table>
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td>AWB</td>
                                <td>
                                    <Field 
                                        name={'s_mawb'}
                                        type={'text'}
                                        className={'form-control'}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Origin</td>
                                <td>
                                    <SelectAirportContainer>
                                        <SelectAirport
                                            airports={airportCodes}
                                            airportCodesMap={airportCodesMap}
                                            // setCode={(value) =>
                                            //     setFieldValue(
                                            //         's_origin',
                                            //         value
                                            //     )
                                            // }
                                            code={values.s_origin}
                                        />
                                    </SelectAirportContainer>
                                </td>
                            </tr>
                            <tr>
                                <td>POU</td>
                                <td>
                                    <SelectAirportContainer>
                                        <SelectAirport
                                            airports={airportCodes}
                                            airportCodesMap={airportCodesMap}
                                            // setCode={(value) =>
                                            //     setFieldValue(
                                            //         's_port_of_unlading',
                                            //         value
                                            //     )
                                            // }
                                            code={values.s_port_of_unlading}
                                        />
                                    </SelectAirportContainer>
                                </td>
                            </tr>
                            <tr>
                                <td>Destination</td>
                                <td>
                                    <SelectAirportContainer>
                                        <SelectAirport
                                            airports={airportCodes}
                                            airportCodesMap={airportCodesMap}
                                            // setCode={(value) =>
                                            //     setFieldValue(
                                            //         's_destination',
                                            //         value
                                            //     )
                                            // }
                                            code={values.s_destination}
                                        />
                                    </SelectAirportContainer>
                                </td>
                            </tr>
                            <tr>
                                <td>Pieces</td>
                                <td>
                                    <Field 
                                        name={'i_pieces'}
                                        type={'number'}
                                        className={'form-control'}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Weight</td>
                                <td>
                                    <Field 
                                        name={'i_weight'}
                                        type={'number'}
                                        className={'form-control'}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Commodity</td>
                                <td>
                                    <Field 
                                        name={'s_commodity'}
                                        type={'text'}
                                        className={'form-control'}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Flight</td>
                                <td>
                                    <Field 
                                        name={'s_flight_number'}
                                        type={'text'}
                                        className={'form-control'}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Flight date</td>
                                <td>
                                    <Field 
                                        name={'t_depart_date'}
                                        type={'date'}
                                        className={'form-control'}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Aircraft Type</td>
                                <td>
                                    <ButtonGroup>
                                    {
                                        ['CAO', 'PAX'].map((type, i) => (
                                            <Button 
                                                onClick={() => setFieldValue('s_transport_type', type)}
                                                active={values.s_transport_type === type}
                                            >
                                                {type}
                                            </Button>
                                        ))
                                    }
                                    </ButtonGroup>
                                </td>
                            </tr>
                            <tr>
                                <td>Special Handling Codes</td>
                                <td>
                                    <input disabled type="text" value={values.s_shc1} onChange={(e) => setFieldValue('s_shc1', e.target.value)} className="form-control mr-2" style={{maxWidth: '57px', float: 'left'}} maxlength="3" />
                                    <input disabled type="text" value={values.s_shc2} onChange={(e) => setFieldValue('s_shc2', e.target.value)} className="form-control mr-2" style={{maxWidth: '57px', float: 'left'}} maxlength="3" />
                                    <input disabled type="text" value={values.s_shc3} onChange={(e) => setFieldValue('s_shc3', e.target.value)} className="form-control mr-2" style={{maxWidth: '57px', float: 'left'}} maxlength="3" />
                                    <input disabled type="text" value={values.s_shc4} onChange={(e) => setFieldValue('s_shc4', e.target.value)} className="form-control mr-2" style={{maxWidth: '57px', float: 'left'}} maxlength="3" />
                                    <input disabled type="text" value={values.s_shc5} onChange={(e) => setFieldValue('s_shc5', e.target.value)} className="form-control mr-2" style={{maxWidth: '57px', float: 'left'}} maxlength="3" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <div style={{ width: '200px'}}>
                                        <FormikSwitch 
                                            label={'DG'}
                                            name={'b_dg'}
                                            values={values}
                                            setFieldValue={() => {}}
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col md={4}>
                    <ConfirmButton 
                        value={confirmTsa}
                        setValue={setConfirmTsa}
                        label={'TSA Checked'}
                        disabled={disableTsa}
                    />
                    <Table>
                        <thead></thead>
                        <tbody>
                            {
                                screeningType === 'unscreendOthers' &&
                                <tr>
                                    <td>Non IAC</td>
                                    <td>{values.s_non_iac}</td>
                                </tr>
                            }
                            {
                                foundIac && foundIac.approval_number &&
                                <>
                                    <tr>
                                        <td>IAC Number</td>
                                        <td>
                                            <Field 
                                                name={'s_iac'}
                                                type={'text'}
                                                className={'form-control'}
                                                disabled
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Indirect Carrier Name</td>
                                        <td>
                                            {foundIac.indirect_carrier_name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Address</td>
                                        <td>
                                            {`${foundIac.city}, ${foundIac.state}, ${foundIac.postal_code}`}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>IACSSP_08_001</td>
                                        <td>
                                            {foundIac.IACSSP_08_001}
                                        </td>
                                    </tr>
                                </>
                            }
                            {
                                foundCcsf && foundCcsf.approval_number &&
                                <>
                                    <tr>
                                        <td>CCSF Number</td>
                                        <td>
                                            <Field 
                                                name={'s_ccsf'}
                                                type={'text'}
                                                className={'form-control'}
                                                disabled
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Certified Cargo Screening Facility</td>
                                        <td>
                                            {foundCcsf.certified_cargo_screening_facility_name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Address</td>
                                        <td>
                                            {`${foundCcsf.city}, ${foundCcsf.state}`}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Expiration Date</td>
                                        <td>
                                            {foundCcsf.ccsf_expiration_date}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>IAC Number</td>
                                        <td>
                                            {foundCcsf.iac_number}
                                        </td>
                                    </tr>
                                </>
                            }
                            {
                                values.b_interline_transfer && 
                                <tr>
                                    <td>Interline Transfer</td>
                                    <td>{values.s_interline_transfer}</td>
                                </tr>
                            }
                            <tr className={classnames({'bg-warning': disableTsa})}>
                                <td>Shipper Type</td>
                                <td>{shipperType}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Row>
                        <Col md={12}>
                            <h4 className={'float-left'}>Payments</h4>
                            <div className={'float-right'}>
                                <Button className={'mr-1'} onClick={() => handleAddPaymentCharge(false)}>Accept Payment</Button>
                                <Button color={'danger'} onClick={() => handleAddPaymentCharge(true)}>Add Charge</Button>
                            </div>
                        </Col>
                    </Row>
                    <ReactTable 
                        data={payments}
                        mapping={tableMapping.payments}
                        numRows={5}
                    />
                    <Table striped>
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td className={'float-left'}>Total Charges</td>
                                <td className={'float-right'}>{formatCost(charges)}</td>
                            </tr>
                            <tr>
                                <td className={'float-left'}>Total Credits</td>
                                <td className={'float-right'}>{formatCost(credits)}</td>
                            </tr>
                            <tr>
                                <td className={'float-left'}>Total Paid</td>
                                <td className={'float-right'}>{formatCost(paid)}</td>
                            </tr>
                            <tr>
                                <td className={'float-left'}>Payment Due</td>
                                <td className={classnames('float-right', `${paymentDue < 1 ? 'text-success': 'text-danger'}`)}>{formatCost(paymentDue)}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col md={4}>
                    <ConfirmButton 
                        value={confirmId}
                        setValue={setConfirmId}
                        label={'ID Confirmed'}
                    />
                    <Table>
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td>Company</td>
                                <td>
                                    <Field 
                                        name={'s_company'}
                                        type={'text'}
                                        className={'form-control'}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Name</td>
                                <td>
                                    <Field 
                                        name={'s_company_driver_name'}
                                        type={'text'}
                                        className={'form-control'}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>ID Type 1</td>
                                <td>
                                    <Field 
                                        name={'s_company_driver_id_type_1'}
                                        type={'text'}
                                        className={'form-control'}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>ID Number 1</td>
                                <td>
                                    <Field 
                                        name={'s_company_driver_id_num_1'}
                                        type={'text'}
                                        className={'form-control'}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>ID Expiration 1</td>
                                <td>
                                    <Field 
                                        name={'d_company_driver_id_expiration_1'}
                                        type={'date'}
                                        className={'form-control'}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <div style={{ width: '270px'}}>
                                        <FormikSwitch 
                                            label={'Photo match 1'}
                                            name={'b_company_driver_photo_match_1'}
                                            values={values}
                                            setFieldValue={setFieldValue}
                                        />
                                    </div>
                                </td>
                            </tr>
                            {/* ID Type 2 */}
                            <tr>
                                <td>ID Type 2</td>
                                <td>
                                    <Field 
                                        name={'s_company_driver_id_type_2'}
                                        type={'text'}
                                        className={'form-control'}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>ID Number 2</td>
                                <td>
                                    <Field 
                                        name={'s_company_driver_id_num_2'}
                                        type={'text'}
                                        className={'form-control'}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>ID Expiration 2</td>
                                <td>
                                    <Field 
                                        name={'d_company_driver_id_expiration_2'}
                                        type={'date'}
                                        className={'form-control'}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <div style={{ width: '270px'}}>
                                        <FormikSwitch 
                                            label={'Photo match 2'}
                                            name={'b_company_driver_photo_match_2'}
                                            values={values}
                                            setFieldValue={setFieldValue}
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col md={12} className={'text-right'}>
                    <Button className={'d-inline'} disabled={!enableProcess} onClick={() => createExportItem(false, push)}>Process to Warehouse</Button>
                </Col>
            </Row>
            <ModalPayments 
                modal={modalPayments}
                setModal={setModalPayments}
                addCharge={addCharge}
                selectedAwb={selectedAwb}
                payments={payments}
                addPaymentOrCharge={addPaymentOrCharge}
            />
        </>
    );
}