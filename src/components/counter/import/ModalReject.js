import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';
import { Field } from 'formik';

const rejectOptions = [
    '',
    'WAITING ON CLEARANCE',
    'TRUCK TRANSFER',
    'DELIVERED/DUPLICATE',
    'WRONG PREFIX',
    'FREIGHT NOT READY',
    'FREIGHT NOT ARRIVED',
    'DOCUMENTS INCOMPLETE',
    'MISSING PAYMENT',
    'DRIVER LEFT',
    'WRONG TYPE',
    'CARGO LATE BY BOOKING'
];

export default ({
    values,
    modal,
    setModal,
    createImportItem,
    push
}) => {

    const toggle = () => setModal(!modal);

    const handleReject = (push) => {
        createImportItem(true, push);
        setModal(false);
    }

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader>Reject</ModalHeader>
                <ModalBody>
                    <Label>Enter Reject Reason</Label>
                    <Field name={'s_counter_reject_reason'} component={'select'} className={'form-control'}>
                    {
                        rejectOptions.sort((a, b) => a.localeCompare(b)).map((o, i) => (
                            <option value={o} key={i}>{o}</option>
                        ))
                    }
                    </Field>
                </ModalBody>
                <ModalFooter>
                    <Button 
                        color="danger" 
                        onClick={() => handleReject(push)}
                        disabled={!values.s_counter_reject_reason || values.s_counter_reject_reason.length === 0}
                    >
                        Reject
                    </Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}