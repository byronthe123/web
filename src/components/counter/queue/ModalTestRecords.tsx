import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';

interface Props {
    modal: boolean;
    setModal: (modal: boolean) => void;
    generateTestRecords: (
        num: number, 
        s_state: string, 
        s_mawb: string
    ) => Promise<void>
}

export default function ModalTestRecords ({
    modal,
    setModal,
    generateTestRecords
}: Props) {

    const toggle = () => setModal(!modal);

    const states = ['IMPORT', 'EXPORT', 'MIXED'];
    const [s_state, set_s_state] = useState(states[0]);
    const [num, setNum] = useState(1);
    const [s_mawb, set_s_mawb] = useState('');

    useEffect(() => {
        set_s_state(states[0]);
        setNum(1);
        set_s_mawb('');
    }, [modal]);

    const enableSubmit = () => {
        return (s_state && s_state.length > 0) && num > 0;
    }

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader>Create Test Records</ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label className={'mr-2'}>State</Label>
                    {
                        states.map((s, i) => (
                            <Button 
                                key={i} 
                                className={'mr-1'}
                                active={s === s_state}
                                onClick={() => set_s_state(s)}
                            >
                                {s}
                            </Button>
                        ))
                    }
                </FormGroup>
                <FormGroup>
                    <Label>Number</Label>
                    <Input type={'number'} min={1} value={num} onChange={(e: any) => setNum(e.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Label>MAWB (Optional)</Label>
                    <Input type={'text'} value={s_mawb} onChange={(e: any) => set_s_mawb(e.target.value)} />
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button 
                    color="primary" 
                    onClick={() => generateTestRecords(num, s_state, s_mawb)}
                    disabled={!enableSubmit()}
                >
                    Submit
                </Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}