import React, {Fragment} from 'react';

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
    Col,
    Table
  } from "reactstrap";
import moment from 'moment';

const ModalAssign = ({
    open, 
    handleModal,
    selectedAwbs,
    setModalReportDamageOpen,
    deliverDock
}) => {

    return (
        <Fragment>
            <Modal isOpen={open} toggle={() => handleModal(!open)} className='mx-auto'>
                <div className="modal-content px-5" style={{width: '900px', marginLeft: '-200px'}}>
                    <div className="modal-body mx-auto">
                        <div className='text-center'>
                            {
                                selectedAwbs && selectedAwbs.length > 0 && 
                                <h1>Locations for {selectedAwbs[0].s_mawb}{selectedAwbs[0].s_hawb !== null && `/${selectedAwbs[0].s_hawb}`}</h1>
                            }
                        </div>
                        <div>
                            <Row>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Location</th>
                                            <th>Pieces</th>
                                            <th>Status</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            selectedAwbs.map((a, i) => 
                                                <tr key={i}>
                                                    <td style={{verticalAlign: 'middle'}}>{a.s_location}</td>
                                                    <td style={{verticalAlign: 'middle'}}>{a.i_pieces}</td>
                                                    <td style={{verticalAlign: 'middle'}}>{a.rack_status}</td>
                                                    <td>
                                                        <Button color='primary' onClick={() => deliverDock(a.rack_id)}>Deliver</Button>
                                                    </td>
                                                    <td>
                                                        <Button color='warning'>Discrepancy</Button>
                                                    </td>
                                                    <td>
                                                        <Button color='danger' onClick={() => setModalReportDamageOpen(true)}>Damage</Button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </Row>
                        </div>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
}

export default ModalAssign;