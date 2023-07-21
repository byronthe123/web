import React, { useState, useEffect, Fragment } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

import {
    Button,
    Modal,
    Label,
    Input, 
    FormGroup,
    Row, 
    Col
  } from "reactstrap";

const ModalReportBug = ({
    open, 
    handleModal,
    reportBug,
    history,
    submittingBug,
    setCustomWikiTitle
}) => {

    const bugTypes = ['REGULAR', 'PAYMENT'];
    const [selectedBugType, setSelectedBugType] = useState(bugTypes[0]);
    const [description, setDescription] = useState('');
    const [mawb, setMawb] = useState('');
    const [rRecord, setRrecord] = useState('');

    useEffect(() => {
        setDescription('');
    }, [open, selectedBugType]);

    const handleReportBug = () => {
        const data = {
            selectedBugType,
            description,
            mawb,
            rRecord
        }
        reportBug(data);
    }


    return (
        <Fragment>
            <Modal isOpen={open} toggle={() => handleModal()}>
            <div className="modal-content mx-auto" style={{width: '600px'}}>
                <div className="modal-header pb-3">
                    <h4 className="modal-title text-center" id="exampleModalLabel">
                        EOS Web Bug Reporting
                    </h4>
                    <i className={'fal fa-question text-right'} style={{ fontSize: '24px' }} onClick={() => setCustomWikiTitle('LADYBUG')} data-tip={'Wiki'} />
                </div>
                <div className="modal-body mx-auto pt-3 ">
                    {
                        submittingBug ? 
                            <PulseLoader 
                                size={50}
                                loading={true}
                                color={"#51C878"}
                            /> : 
                            <>
                                <Row className='d-flex justify-content-center'>
                                    <FormGroup>
                                        <h4>Reporting bug for Page: <span style={{ fontWeight: 'bold' }}>{ history && history.location.pathname }</span></h4>
                                    </FormGroup>
                                </Row>
                                <Row className='d-flex justify-content-center'>
                                    <Col md={12} className={'text-center'}>
                                        <FormGroup>
                                            <Label>Select Issue Type:</Label>
                                            <Input type='select' value={selectedBugType} onChange={(e) => setSelectedBugType(e.target.value)} style={{ width: '150px' }} className={'mx-auto'}>
                                                {
                                                    bugTypes.map((t, i) => (
                                                        <option key={i} value={t}>{t}</option>
                                                    ))
                                                }
                                            </Input>
                                        </FormGroup>
                                        {
                                            selectedBugType === 'REGULAR' ?
                                                <FormGroup>
                                                    <Label>Please describe the issue you are having</Label>
                                                    <Input 
                                                        type='textarea' 
                                                        value={description} 
                                                        onChange={(e) => setDescription(e.target.value)} 
                                                        style={{width: '400px', height: '200px'}}
                                                    />
                                                </FormGroup> :
                                                <>
                                                    <FormGroup className={'mb-3'}>
                                                        <Label>MAWB/HAWB Number</Label>
                                                        <Input type='text' value={mawb} onChange={(e) => setMawb(e.target.value)} />
                                                    </FormGroup>
                                                    <FormGroup className={'mb-3'}>
                                                        <Label>CargoSprint R-record</Label>
                                                        <Input type='text' value={rRecord} onChange={(e) => setRrecord(e.target.value)} />
                                                        <Label className={'mt-1'}>Research R-record number on CargoSprint Admin Portal. You may type more then one.</Label>
                                                    </FormGroup>
                                                    <FormGroup className={'mb-3'}>
                                                        <Label>Additional Details</Label>
                                                        <Input type='textarea' value={description} onChange={(e) => setDescription(e.target.value)} />
                                                        <Label className={'mt-1'}>This will automatically trigger an email to CargoSprint tech support.</Label>
                                                    </FormGroup>
                                                </>
                                        }
                                    </Col>
                                </Row>
                            </>
                    }
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => handleModal()}>Close</button>
                    {
                        !submittingBug && 
                            <button className="btn btn-primary ml-2 py-0" style={{height: '42px'}} type="button" disabled={description.length < 1} onClick={() => handleReportBug()}>Submit</button>
                    }
                </div>
            </div>
            </Modal>
        </Fragment>
    );
}

export default ModalReportBug;

