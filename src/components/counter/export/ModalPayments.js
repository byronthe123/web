import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label } from 'reactstrap';
import { formatCost } from '../../../utils';


export default ({
    modal,
    setModal,
    addCharge,
    selectedAwb,
    payments,
    paymentDue,
    addPaymentOrCharge
}) => {

    const toggle = () => setModal(!modal);

    const charges = [
        {
            name: 'AWB PREPARE FEE',
            amount: -25
        },
        {
            name: 'TEST PAYMENT TYPE',
            amount: -50
        }
    ];

    const acceptPaymentTypes = ['CASH', 'CHECK'];
    const [s_payment_type, set_s_payment_type] = useState(acceptPaymentTypes[0]);
    const [s_payment_reference, set_s_payment_reference] = useState('');

    const [chargeAmount, setChargeAmount] = useState(0);
    const [s_notes, set_s_notes] = useState('');

    useEffect(() => {
        if (addCharge) {
            set_s_payment_type(charges[0].name);
            setChargeAmount(charges[0].amount);
        } else {
            set_s_payment_type(acceptPaymentTypes[0]);
            setChargeAmount(0);
        }
        set_s_notes('');
    }, [modal]);

    useEffect(() => {
        if (addCharge) {
            console.log(s_payment_type);
            const selected = charges.find(c => c.name === s_payment_type);
            console.log(selected);
            selected && setChargeAmount(selected.amount);
        }
    }, [addCharge, s_payment_type]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader>Add {addCharge ? 'Charge' : 'Payment'} {s_payment_type} {chargeAmount}</ModalHeader>
            <ModalBody>
                {
                    addCharge ? 
                    <>
                        <FormGroup>
                            <Input type={'select'} onChange={(e) => set_s_payment_type(e.target.value)}>
                                {
                                    charges.map((c, i) => (
                                        <option value={c.name} key={i}>{c.name}: {formatCost(Math.abs(c.amount))}</option>
                                    ))
                                }
                            </Input>                      
                        </FormGroup>
                        <FormGroup>
                            <Label>Notes</Label>
                            <Input type={'textarea'} value={s_notes} onChange={(e) => set_s_notes(e.target.value)} />
                        </FormGroup>  
                    </> :
                    <>
                        <FormGroup>
                            <Input type={'select'} value={s_payment_type} onChange={(e) => set_s_payment_type(e.target.value)}>
                                {
                                    acceptPaymentTypes.map((t, i) =>
                                        <option key={i} value={t}>{t}</option>
                                    ) 
                                }
                            </Input>
                        </FormGroup>
                        {
                            s_payment_type === 'CHECK' && 
                            <FormGroup>
                                <Label>Check Number</Label>
                                <Input value={s_payment_reference} type={'text'} onChange={(e) => set_s_payment_reference(e.target.value)} />
                            </FormGroup>
                        }
                        <FormGroup>
                            <Label>Payment Due</Label>
                            <Input value={paymentDue} disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label>Amount Customer is Paying</Label>
                            <Input type={'number'} value={chargeAmount} onChange={(e) => setChargeAmount(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Counter Fee</Label>
                            <Input disabled value={'$20.00'} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Amount Due to Collect from Customer:</Label>
                            <Input value={formatCost(Number(chargeAmount) + 20)} disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label>Notes</Label>
                            <Input type={'textarea'} value={s_notes} onChange={(e) => set_s_notes(e.target.value)} />
                        </FormGroup>
                    </>
                }
            </ModalBody>
            <ModalFooter>
                <Button 
                    color="primary" 
                    onClick={() => addPaymentOrCharge(
                        addCharge ? chargeAmount : (parseFloat(chargeAmount) + 20), 
                        s_notes, 
                        s_payment_type, 
                        s_payment_reference
                    )}>
                        Submit
                </Button>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}