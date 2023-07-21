import React, {Fragment} from 'react';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

import Timeline from './Timeline';
import { formatMawb } from '../../../utils';

export default ({
    open, 
    handleModal,
    awb,
    awbsArray,
    graphApiToken,
    switchAwb,
    selectedDriverPhoto,
    handleSelectAwb,
    handleSearchAwb
}) => {

    console.log(awb);

    return (
        <Fragment>
            <Modal isOpen={open} toggle={(e) => handleModal(!open)}>
                <div className="modal-content" style={{width: '1200px', height: '900px', position: 'absolute', right: '-70%'}}>
                    <div className="modal-body px-5">
                        <div>
                            {
                                awb && 
                                <>
                                    <Row>
                                        <Col md={4} style={{ zIndex: '99 !important' }}>
                                            <Row>
                                                <Col md={12}>
                                                    <h2 style={{fontWeight: 'bold', color:'white', backgroundColor: `${awb && awb.s_type === 'IMPORT' ? '#61b996' : '#6bb4dd'}`}}>
                                                        {awb.s_type} /
                                                        <span className='hyperlink ml-1' onClick={() => handleSearchAwb(null, awb.s_mawb)}>{formatMawb(awb.s_mawb)}</span> /
                                                        {awb.s_status} /
                                                        {awb.ic_total_engagement_time} minutes                                 
                                                    </h2>
                                                </Col>
                                            </Row>
                                            {
                                                (awb.s_driver_photo_link || selectedDriverPhoto) && 
                                                    <Row>
                                                        <Col md={12} className={'text-left'}>
                                                            <img style={{width: '475px', height: 'auto'}} src={awb.s_driver_photo_link || selectedDriverPhoto} />
                                                        </Col>
                                                    </Row>
                                            }
                                            <Row className={'mt-2'}>
                                                <Col md={12}>
                                                    <Table striped style={{fontWeight: 'bold'}}>
                                                        <thead></thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>Driver:</td>
                                                                <td>{awb.s_trucking_driver}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Company:</td>
                                                                <td>{awb.s_trucking_company}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>SMS:</td>
                                                                <td>{awb.b_sms ? 'YES' : 'NO'} {awb.s_trucking_cell}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Email:</td>
                                                                <td>{awb.s_trucking_email}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Language:</td>
                                                                <td>{awb.s_trucking_language}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Dock Door:</td>
                                                                <td>{awb.s_dock_door}</td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={12}>
                                                    <h4>Other AWBs by this Transaction:</h4>
                                                    <Row>
                                                        {
                                                            awbsArray && awbsArray.map((a, i) => a.s_mawb !== awb.s_mawb && 
                                                                <Button onClick={() => switchAwb(a)} className={'mt-1'}>{a.s_mawb}</Button>
                                                            )
                                                        }
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className='mt-2'>
                                                <Col md={12}>
                                                    <h4>Customer Survey Feedback</h4>
                                                    <h6>{awb.s_feedback}</h6>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col md={8}>
                                            <Timeline 
                                                awb={awb}
                                                graphApiToken={graphApiToken}
                                            />
                                        </Col>  
                                    </Row>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
}
