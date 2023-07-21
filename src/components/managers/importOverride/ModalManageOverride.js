import React, { useMemo } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input } from 'reactstrap';
import BackButton from '../../custom/BackButton';

export default function ModalManageOverride ({
    modal,
    setModal,
    user,
    selectedItem,
    deleteOverrideCharge,
    unprocessPayment,
    s_payment_method,
    approvers,
    approveOverride,
    overrideAmount, 
    setOverrideAmount
}) {

    const toggle = () => setModal(!modal);
    const enableApproveOverride = useMemo(() => {
        if (s_payment_method === 'OVERRIDE') {
            for (let key in approvers) {
                if (approvers[key].email.toLowerCase() === user.s_email.toLowerCase()) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }, [s_payment_method, approvers]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader>
                <div className={'d-flex'}>
                    <BackButton onClick={toggle} />
                    <h4 className={'mt-2 pl-2'}>{selectedItem.s_awb} - {selectedItem.s_payment_method} Details</h4>
                </div>
            </ModalHeader>
            <ModalBody>
                <Label>Notes</Label>
                <Input type='textarea' disabled value={selectedItem.s_notes} />
                <Label className={'mt-3'}>Amount</Label>
                <Input type='number' value={overrideAmount} onChange={(e) => setOverrideAmount(e.target.value)} />
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={() => deleteOverrideCharge()}>Delete</Button>
                <Button color="warning" onClick={() => unprocessPayment()}>Unprocess</Button>
                {
                    enableApproveOverride && 
                        <Button 
                            color={'primary'}
                            onClick={() => approveOverride()}
                        >
                            Approve
                        </Button>
                }
            </ModalFooter>
        </Modal>
    );
}