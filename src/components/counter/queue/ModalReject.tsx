import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, FormGroup } from 'reactstrap';
import Select from 'react-select';
import _ from 'lodash';
import { ISelectOption } from '../../../globals/interfaces';

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

rejectOptions.sort((a, b) => a.localeCompare(b));
const rejectSelectOptions: Array<ISelectOption> = [];
rejectOptions.map(option => rejectSelectOptions.push({ 
    label: option,
    value: option 
}));

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    rejectReason: ISelectOption;
    setRejectReason: (option: ISelectOption) => void;
    s_notes: string;
    set_s_notes: (s_notes: string) => void;
    reject: () => Promise<void>
}

export default function ModalReject ({
    modal,
    setModal,
    rejectReason,
    setRejectReason,
    s_notes,
    set_s_notes,
    reject
}: Props) {

    const toggle = () => setModal(!modal);

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader>Reject</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>Select Reject Reason:</Label>
                        <Select 
                            value={rejectReason}
                            options={rejectSelectOptions}
                            onChange={(selectedOption: ISelectOption) => setRejectReason(selectedOption)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Notes:</Label>
                        <Input type={'textarea'} value={s_notes} onChange={(e: any) => set_s_notes(e.target.value)} />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button 
                        color="danger" 
                        onClick={() => reject()}
                        disabled={String(rejectReason.value).length === 0}
                    >
                        Reject
                    </Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}