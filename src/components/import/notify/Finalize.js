import React, { useEffect, useMemo } from 'react';
import { Row, Col, Button, ButtonGroup, Card, CardBody, Input, Table, Label, FormGroup } from 'reactstrap';
import { WithWizard } from 'react-albus';
import FileBase64 from 'react-file-base64';
import _ from 'lodash';
import { formatMawb } from '../../../utils';

export default ({
    s_unit,
    selectedAwb,
    selectedCompany,
    ccEmails,
    addCcEmail,
    setAddCcEmail,
    handleAddCcEmail,
    setCcEmails,
    removeCcEmail,
    emailData,
    selectedCompanyEmails,
    phoneData,
    validateEmail,
    emailPreview,
    setModalSendEmailOpen,
    manual_s_airline_code,
    manual_s_flight_id,
    manual_s_mawb,
    setModalCallPhoneOpen,
    files,
    getFiles,
    removeFile,
    fileInputKey,
    enableCustomFields,
    setEnableCustomFields,
    chfUldAmount,
    setChfUldAmount,
    chfUldFactor,
    setChfUldFactor,
    chfLoose,
    setChfLoose,
    chfLooseFactor,
    setChfLooseFactor,
    addCharge,
    setAddCharge,
    futureNotification,
    setFutureNotification,
    chfLooseKg,
    setChfLooseKg,
    skylineEmail,
    setSkylineEmail,
    partNumber,
    setPartNumber,
    blacklist,
    handleSearchAwb,
    composeEmail
}) => {

    useEffect(() => {
        setCcEmails([]);
        setFutureNotification(false);
        setChfUldAmount(0);

        const t8Airline = _.get(selectedAwb, 's_airline_code', '') === 'T8';
        if (s_unit === 'CEWR1' && t8Airline) {
            setEnableCustomFields(true);
            setChfLoose(true);
            setChfLooseFactor(0.07);
        } else {
            setEnableCustomFields(false);
            setChfLoose(false);
            setChfLooseFactor(0.18);
        }
    }, []);

    const enableSendEmail = selectedCompanyEmails && selectedCompanyEmails.length > 0;
    const blacklisted = blacklist[(addCcEmail || '').toUpperCase()];

    const useAwb = selectedAwb && selectedAwb.s_mawb;

    const handleComposeSkylineEmail = () => {
        composeEmail(!skylineEmail);
        setSkylineEmail(prev => !prev);
    }

    return (
        <Row>
            <Col md={4}>
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody className='custom-card-transparent'>
                                <h2>Finalize AWB <span className='hyperlink' onClick={() => handleSearchAwb(null, useAwb)}>{formatMawb(useAwb)}</span></h2>
                                <Table>
                                    <thead></thead>
                                    <tbody>
                                        <tr>
                                            <th>Flight</th>
                                            <td>{selectedAwb && selectedAwb.s_flight_id}</td>
                                        </tr>
                                        <tr>
                                            <th>Profile Selected</th>
                                            <td>{selectedCompany && selectedCompany.s_name}</td>
                                        </tr>
                                        <tr>
                                            <th>Part Number</th>
                                            <td>
                                                <Input type={'text'} value={partNumber} onChange={(e) => setPartNumber(e.target.value)} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className='mt-3'> 
                    <Col md={12}>
                        <Card>
                            <CardBody className='custom-card-transparent'>
                                <div className='px-2'>
                                    <Row>
                                        <h4>Emails:</h4>
                                        <Table striped>
                                            <thead></thead>
                                            <tbody>
                                                {
                                                    selectedCompanyEmails && selectedCompanyEmails.map((e, i) => 
                                                        <tr key={i}>
                                                            <td>{e}</td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </Table>
                                    </Row>
                                    <Row>
                                        <h4>
                                            Carbon Copy Emails: 
                                            {blacklisted !== undefined && <span className={'ml-2 text-danger bg-warning'}>Blacklisted: {blacklisted}</span>}
                                        </h4>
                                        <Table striped>
                                            <thead></thead>
                                            <tbody>
                                                {
                                                    ccEmails && ccEmails.map((e, i) =>
                                                        <tr key={i}>
                                                            <td>{e}</td>
                                                            <td>
                                                                <i 
                                                                    className={'fas fa-trash text-red'} 
                                                                    onClick={() => removeCcEmail(e)} 
                                                                />
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </Table>
                                    </Row>
                                    <Row>
                                        <Input type='email' value={addCcEmail} onChange={(e) => setAddCcEmail(e.target.value)} style={{display: 'inline', width: '400px'}} />
                                        <Button className='ml-2' style={{display: 'inline'}} disabled={!validateEmail(addCcEmail) || blacklisted !== undefined} onClick={() => handleAddCcEmail()}>Add</Button>
                                    </Row>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className='mt-3'> 
                    <Col md={12}>
                        <Card>
                            <CardBody className='custom-card-transparent'>
                                <div className='px-2'>
                                    <Row>
                                        <h4>Attachments:</h4>
                                    </Row>
                                    <Row>
                                        <FileBase64
                                            multiple={true}
                                            onDone={getFiles} 
                                            key={fileInputKey}
                                        />
                                    </Row>
                                    <Row className='mt-2'>
                                    {
                                        files.map((f, i) =>
                                            <Col md={12} key={i} className='px-0'>
                                                <p className='mb-0'>{i+1}. {f.name} <i className='fa fa-trash' onClick={() => removeFile(f.name)}></i></p>
                                            </Col>
                                        )
                                    }
                                    </Row>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col md={12} className='text-center'>
                        <Card>
                            <CardBody className='custom-card-transparent'>
                                <WithWizard
                                    render={({ push }) => (
                                        <Row>
                                            {
                                                ['SJFK1', 'CJFK2'].includes(s_unit) && 
                                                    <Col md={12} className={'mx-auto mb-2'}>
                                                        <button
                                                            className={`btn ${skylineEmail ? 'btn-success' : 'btn-grey' }`}
                                                            onClick={() => handleComposeSkylineEmail()}
                                                        >
                                                            Skyline Email
                                                        </button>
                                                    </Col>
                                            }
                                            <Col md={12}>
                                                <Button onClick={() => setModalCallPhoneOpen(true)} className='mr-2'>
                                                    Call Phone
                                                    <i className='fas fa-phone ml-2' />
                                                </Button>
                                                <Button disabled={!enableSendEmail} onClick={() => setModalSendEmailOpen(true)} className='mr-2'>
                                                    Send Email
                                                    <i className='fas fa-envelope ml-2' />
                                                </Button>
                                                <Button onClick={() => push('2')}>
                                                    Start Over
                                                    <i className='fas fa-redo-alt ml-2' />
                                                </Button>
                                            </Col>
                                        </Row>
                                    )}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col md={12} className='text-center'>
                        <Card>
                            <CardBody className='custom-card-transparent'>
                                <Row className='text-left'>
                                    <Col md={12} className='ml-3'>
                                        <Input 
                                            type='checkbox' 
                                            checked={enableCustomFields}
                                            onClick={() => setEnableCustomFields(!enableCustomFields)} 
                                        />
                                        <Label className='mt-1'>Manual Fields</Label>
                                    </Col>
                                    {
                                        enableCustomFields && 
                                        <Col md={12} className='ml-3'>
                                            <FormGroup>
                                                <Label className='d-inline mr-2'>CHF ULD Amount</Label>
                                                <Input type='number' value={chfUldAmount} onChange={(e) => setChfUldAmount(e.target.value)} className='d-inline' style={{ width: '150px' }} disabled={s_unit.includes('BOS')} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label className='d-inline mr-2'>CHF ULD Charge</Label>
                                                <Input type='number'  value={chfUldFactor} onChange={(e) => setChfUldFactor(e.target.value)} className='d-inline' style={{ width: '150px' }} />
                                            </FormGroup>
                                            <FormGroup className='ml-4'>
                                                <Input type='checkbox' checked={chfLoose} onClick={() => setChfLoose(!chfLoose)} />
                                                <Label className='mt-1'>CHF Loose</Label>
                                            </FormGroup>
                                            {
                                                chfLoose && 
                                                <>
                                                    <FormGroup>
                                                        <Label className='d-inline mr-2'>CHF Loose KG</Label>
                                                        <Input type='number' value={chfLooseKg} onChange={(e) => setChfLooseKg(e.target.value)} className='d-inline' style={{ width: '150px' }} />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label className='d-inline mr-2'>CHF Loose Charge</Label>
                                                        <Input type='number' value={chfLooseFactor} onChange={(e) => setChfLooseFactor(e.target.value)} className='d-inline' style={{ width: '150px' }} />
                                                    </FormGroup>
                                                </>
                                            }
                                            <FormGroup className='ml-4'>
                                                <Input type='checkbox' checked={futureNotification} onClick={() => setFutureNotification(!futureNotification)} />
                                                <Label className='mt-1'>Future Notification</Label>
                                            </FormGroup>
                                            <FormGroup className='ml-4'>
                                                <Input type='checkbox' checked={addCharge} onClick={() => setAddCharge(prev => !prev)} />
                                                <Label className='mt-1'>Add Charge</Label>
                                            </FormGroup>
                                        </Col>
                                    }
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col md={8}>
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody className='custom-card-transparent py-0'>
                                <div dangerouslySetInnerHTML={{__html: emailPreview}}></div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}