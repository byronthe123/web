import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Row, Col } from 'reactstrap';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { formatCost, api } from '../../../utils';
import { markPaymentsByMaster, markByHouse } from './localUtils';
import { FFM, ISelectedAwb } from './interfaces';
import { ICharge, IMap, IPayment } from '../../../globals/interfaces';
import useLoading from '../../../customHooks/useLoading';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    addCharge: boolean;
    selectedAwb: ISelectedAwb;
    balanceDue: number;
    importValues: IMap<any>;
    email: string;
    setPayments: (state: Array<IPayment>) => void;
    ffm: FFM;
    processByHouse: boolean;
    charges: Array<ICharge>;
}

export default function ModalAddPaymentCharge ({
    modal,
    setModal,
    addCharge,
    selectedAwb,
    balanceDue,
    importValues,
    email,
    setPayments,
    ffm,
    processByHouse,
    charges
}: Props) {

    const printoutCharge = charges.filter(charge => charge.s_name === 'PRINT OUT');
    const { setLoading } = useLoading();
    const acceptPaymentTypes = ['CASH', 'CHECK'];
    const [f_amount, set_f_amount] = useState(0);
    const [s_payment_type, set_s_payment_type] = useState('');
    const [s_notes, set_s_notes] = useState('');
    const [s_payment_reference, set_s_payment_reference] = useState('');
    const [chargeAmount, setChargeAmount] = useState('');
    const [selectedCharge, setSelectedCharge] = useState<ICharge>();
    const useCounterFee = charges.find(c => c.s_name === 'COUNTER FEE')?.f_multiplier || 20;

    const reset = useCallback(() => {
        setChargeAmount('');
        set_f_amount(0);
        set_s_notes('');
        set_s_payment_reference('');
    }, []);

    useEffect(() => {
        reset();
    }, [modal, reset]);

    const addPaymentOrCharge = async() => {
        setLoading(true);

        let endpoint;

        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');

        const payments: IMap<any> = {};

        console.log(s_payment_type);
        const amendPaymentReference = (s_payment_reference && s_payment_reference.length > 0) ?
            `-${s_payment_reference}` : '';

        payments.s_payment_type = s_payment_type;
        payments.s_awb = selectedAwb.s_mawb;
        payments.s_hawb = processByHouse ? importValues.s_hawb : null;
        payments.f_amount = addCharge ? Math.abs(f_amount) * -1 : f_amount;
        payments.s_name = selectedAwb.s_trucking_driver;
        payments.t_created_date = now;
        payments.s_unit = selectedAwb.s_unit;
        payments.s_created_by = email;
        payments.t_created = now;
        payments.s_modified_by = email;
        payments.t_modified = now;
        payments.s_notes = s_notes;
        payments.s_origin = ffm.s_origin;
        payments.s_destination = ffm.s_destination;
        payments.s_cs_id = `EOS${amendPaymentReference}`;

        // PRINT OUT Charge is routed to /addPayment
        const addPayment = !addCharge || s_payment_type === 'PRINT OUT';

        if (addPayment) {
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
            s_type: s_payment_type,
            f_amount: f_amount,
            t_created: now,
            s_created_by: email,
            t_modified: now,
            s_modified_by: email,
            s_hawb: importValues.s_hawb,
            d_payment_date: now,
            s_mawb_id: selectedAwb.s_mawb_id,
            s_guid: uuidv4(),
            s_status: 'PROCESSED',
            s_notes: s_notes          
        };

        const other = {
            counterFee: useCounterFee * -1,
        }

        const data: IMap<any> = {
            payments,
            other
        }

        if (addPayment) {
            data.counter = counter;
        }

        const res = await api('post', endpoint, { data });
        setLoading(false);

        if (processByHouse) {
            setPayments(markByHouse(importValues.s_hawb, res.data));
        } else {
            setPayments(markPaymentsByMaster(res.data));
        }

        setModal(false);
    };

    useEffect(() => {
        const useAmount = parseFloat(chargeAmount.toString()) > 0 ? parseFloat(chargeAmount.toString()) : 0;

        if (addCharge) {
            const charge = charges.find(t => t.s_name === s_payment_type);
            if (charge) {
                setSelectedCharge(charge);
                const total = useAmount * charge.f_multiplier;
                set_f_amount(total);
            }
        } else if (useAmount > 0) {
            set_f_amount(useAmount + useCounterFee);
        }
    }, [addCharge, chargeAmount, charges, s_payment_type]);

    useEffect(() => {
        if (s_payment_reference.length > 5) {
            set_s_payment_reference(s_payment_reference.substring(0, 5));
        }
    }, [s_payment_reference]);

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader>{ addCharge ? 'PRINTOUT PAYMENT' : 'ACCEPT PAYMENT' } </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label>Type</Label>
                    <select value={s_payment_type} className={'form-control'} onChange={(e: any) => set_s_payment_type(e.target.value)}>
                        <option></option>
                        {
                            addCharge ? 
                                printoutCharge.sort((a, b) => a.s_name.localeCompare(b.s_name)).map((type, i) => type.s_name !== 'STORAGE' &&
                                    <option key={i} value={type.s_name}>
                                        {type.s_name}
                                    </option>
                                ) :
                                acceptPaymentTypes.map((t, i) =>
                                    <option key={i} value={t}>{t}</option>
                                ) 
                                
                        }
                    </select>
                </FormGroup>
                {
                    !addCharge && s_payment_type === 'CHECK' && 
                    <FormGroup>
                        <Label>Check Number (5 characters max)</Label>
                        <Input value={s_payment_reference} type={'text'} onChange={(e: any) => set_s_payment_reference(e.target.value)} />
                    </FormGroup>
                }
                {
                    addCharge ?
                        <FormGroup>
                            <Row>
                                <Col md={4}>
                                    <Label>Count</Label>
                                    <Input type={'number'} value={chargeAmount} onChange={(e: any) => setChargeAmount(e.target.value)} />
                                </Col>
                                <Col md={4}>
                                    <Label>UOM</Label>
                                    <Input disabled value={(selectedCharge && selectedCharge.s_uom) || ''} />
                                </Col>
                                <Col md={4}>
                                    <Label>Total</Label>
                                    <Input disabled value={f_amount} />
                                </Col>
                            </Row>
                        </FormGroup> :
                        <>
                            <FormGroup>
                                <Label>Payment Due</Label>
                                <Input value={formatCost(balanceDue)} disabled />
                            </FormGroup>
                            <FormGroup>
                                <Label>Amount Customer is Paying</Label>
                                <Input type={'number'} value={chargeAmount} onChange={(e: any) => setChargeAmount(e.target.value)} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Counter Fee</Label>
                                <Input disabled value={formatCost(useCounterFee)} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Amount Due to Collect from Customer:</Label>
                                <Input value={formatCost(Number(chargeAmount) + useCounterFee)} disabled />
                            </FormGroup>
                        </>
                }
                {
                    (s_payment_type === 'PRINT OUT' && f_amount > 0) &&
                    <Label>Please make sure you collect {formatCost(f_amount)} from the customer.</Label>
                }
                <FormGroup>
                    <Label>Notes</Label>
                    <Input value={s_notes} type={'textarea'} onChange={(e: any) => set_s_notes(e.target.value)} />
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button 
                    color="primary" 
                    onClick={() => addPaymentOrCharge()}
                    disabled={!chargeAmount || Number(chargeAmount) < 1}
                >
                    Submit
                </Button>
                <Button color="secondary" onClick={() => toggle()}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}
