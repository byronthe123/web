import React from 'react';

import {
    Button,
    Modal,
    FormGroup,
    Input,
    Row,
    Form
} from "reactstrap";
import { IULD } from '../../../../globals/interfaces';

interface Props {
    open: boolean; 
    handleModal: (state: boolean) => void;
    s_pou: string;
    s_flight_id: string;
    d_arrival_date: string;
    selectedFlight: IULD | undefined;
    s_uld: string;
    set_s_uld: (state: string) => void;
    s_notes: string;
    set_s_notes: (state: string) => void;
    submitUld: () => Promise<void>;
}

export default function ModalNotListed ({
    open, 
    handleModal,
    s_pou,
    s_flight_id,
    d_arrival_date,
    selectedFlight,
    s_uld,
    set_s_uld,
    s_notes,
    set_s_notes,
    submitUld
}: Props) {
    return (
        <Modal isOpen={open} toggle={() => handleModal(!open)}>
            <div className="modal-content" style={{width: '600px'}}>
                <div className="modal-body mx-auto">
                    <div className='text-center'>
                        <h1>Create Not Listed ULD</h1>
                    </div>
                    <div>
                        <Row>
                            <h4 className='pr-3'>Flight Selected: {s_flight_id}</h4>
                        </Row>
                        <Row className='pt-3'>
                            <Form style={{width: '500px'}}>
                                <FormGroup>
                                    <h4>ULD</h4>
                                    <Input type="text" value={s_uld} onChange={(e: any) => set_s_uld(e.target.value)} />
                                </FormGroup>
                                <FormGroup>
                                    <h4>Arrival Date</h4>
                                    <Input type="text" value={d_arrival_date} />
                                </FormGroup>
                                <FormGroup>
                                    <h4>Origin</h4>
                                    <Input type="text" value={selectedFlight ? selectedFlight.s_pol : ''} />
                                </FormGroup>
                                <FormGroup>
                                    <h4>Destination</h4>
                                    <Input type="text" value={s_pou} />
                                </FormGroup>
                                <FormGroup>
                                    <h4>Port of Loading</h4>
                                    <Input type="text" value={selectedFlight ? selectedFlight.s_pol : ''} />
                                </FormGroup>
                                <FormGroup>
                                    <h4>Port of Unloading</h4>
                                    <Input type="text" value={s_pou} />
                                </FormGroup>
                                <FormGroup>
                                    <h4>Notes</h4>
                                    <Input type="textarea" value={s_notes} onChange={(e: any) => set_s_notes(e.target.value)} />
                                </FormGroup>
                                <FormGroup>
                                    <Button 
                                        disabled={selectedFlight === null || s_uld.length < 3} 
                                        onClick={() => submitUld()} 
                                        color='primary'
                                    >
                                        Submit
                                    </Button>
                                </FormGroup>
                            </Form>
                        </Row>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
