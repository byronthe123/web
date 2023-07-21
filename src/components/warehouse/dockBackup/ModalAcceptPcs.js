import React, {Fragment} from 'react';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-tippy/dist/tippy.css'
import {Tooltip} from 'react-tippy';

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

const ModalAcceptPcs = ({
    open, 
    handleModal,
    selectedCompany,
    updateExportAcceptancePcs,
    exportAcceptancePcs,
    setExportAcceptancePcs
}) => {

    return (
        <Fragment>
            <Modal isOpen={open} toggle={() => handleModal(!open)} className='mx-auto'>
                <div className="modal-content px-0" style={{width: '900px', marginLeft: '-200px'}}>
                    {
                        selectedCompany &&
                        <div className="modal-body mx-auto">
                            <div className='text-center'>
                                <h1>Accept Export Pieces for {selectedCompany.s_mawb}</h1>
                            </div>
                            <div>
                                <Row>
                                    <Col lg={4}>
                                        <h4>Found Pcs: {selectedCompany.export_pcs}</h4>
                                    </Col>
                                    <Col lg={4}>
                                        <h4 style={{float: 'left'}}>Enter Pcs: </h4>
                                        <input type='number' value={exportAcceptancePcs} onChange={(e) => setExportAcceptancePcs(e.target.value)} style={{float: 'right', width: '50px'}} />
                                    </Col>
                                    <Col lg={4}>
                                        <Button onClick={() => updateExportAcceptancePcs()}>Submit</Button>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    }
                </div>
            </Modal>
        </Fragment>
    );
}

export default ModalAcceptPcs;