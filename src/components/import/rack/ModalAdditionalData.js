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

const ModalAdditionalData = ({
    open, 
    handleModal,
    rackItem
}) => {

    const formatBoolean = (condition) => condition ? 'YES' : 'NO';

    return (
        <Fragment>
            <Modal isOpen={open} toggle={() => handleModal(!open)} className='mx-auto'>
                <div className="modal-content px-5" style={{width: '1200px', marginLeft: '-300px'}}>
                    {
                        rackItem && rackItem.id && 
                        <div className="modal-body mx-auto">
                            <div className='text-center'>
                                <h1>Additional Data for {rackItem.s_mawb} {rackItem.s_hawb !== null && rackItem.s_hawb.length > 0 && `/ ${rackItem.s_hawb}`}</h1>
                            </div>
                            <div>
                                <Row style={{fontSize: '18px'}}>
                                    <Table striped>
                                        <thead>

                                        </thead>
                                        <tbody>

                                            <tr>
                                                <th>Flight:</th>
                                                <th>Arrival:</th>
                                                <th>Spec. Hand. Code:</th>
                                                <th>ULD:</th>
                                                <th>Platform:</th>
                                            </tr>
                                            <tr>
                                                <td>{rackItem.s_flight_id}</td>
                                                <td>{moment.utc(rackItem.d_flight).format('MM/DD/YYYY')}</td>
                                                <td>{rackItem.s_special_hanlding_code}</td>
                                                <td>{rackItem.s_flight_uld}</td>
                                                <td>{rackItem.s_platform }</td>
                                            </tr>

                                            <tr>
                                                <th>Hold:</th>
                                                <th>HAWB Breakdown:</th>
                                                <th>USDA Hold:</th>
                                                <th>Customs Hold:</th>
                                                <th>Comat:</th>
                                            </tr>
                                            <tr>
                                            {
                                                ['b_hold', 'b_usda_hold', 's_flight_uld', 'b_customs_hold', 'b_comat'].map((item, i) => (
                                                    <td key={i}>{formatBoolean(rackItem[item])}</td>
                                                ))
                                            }
                                            </tr>
                                            <tr>
                                                <th>General Order</th>
                                                <th colSpan={4}>Notes</th>
                                            </tr>
                                            <tr>
                                                <td>{formatBoolean(rackItem.b_general_order)}</td>
                                                <td colSpan={4}>
                                                    {
                                                        rackItem.s_notes && rackItem.s_notes.split('.').map((n, i) =>
                                                            <p key={i}>{n}</p>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Created:</th>
                                                <th>Created by:</th>
                                                <th>Modified:</th>
                                                <th>Modified by:</th>
                                                <th></th>
                                            </tr>
                                            <tr>
                                                <td>{moment.utc(rackItem.t_created).format('MM/DD/YYYY HH:mm:ss')}</td>
                                                <td>{rackItem.s_created_by}</td>
                                                <td>{moment.utc(rackItem.t_modified).format('MM/DD/YYYY HH:mm:ss')}</td>
                                                <td>{rackItem.s_modified_by}</td>
                                                <th></th>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Row>
                            </div>
                        </div>
                    }
                </div>
            </Modal>
        </Fragment>
    );
}

export default ModalAdditionalData;