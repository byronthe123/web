import React, {Fragment} from 'react';
import {Row, Col, Button, Table, Card, CardBody, FormGroup, Form, Label, Input} from 'reactstrap';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";

import FlightDetailContainer from './FlightDetailContainer';

import CustomFormInput from '../../custom/CustomFormInput';
import CustomSwitch from '../../custom/CustomSwitch';

const ImportExportStatsPage = ({
    handleInput,
    handleSwitchNil,
    handleSwitchCancelled,
    s_airline_code,
    s_flight_number,
    d_flight,
    i_awb,
    i_pieces,
    i_awb_dg,
    i_awb_prepare,
    i_ld3,
    i_ld3_bup,
    i_ld7,
    i_ld7_bup,
    f_total_kg,
    f_tsa_kg,
    f_bup_kg,
    f_loose_kg,
    f_mail_kg,
    f_flight_kg,
    f_transfer_kg,
    f_awb_transfer,
    f_courier_kg,
    b_nil,
    b_cancelled,
    s_notes,
    enableSubmitStat,
    resolveAmountValues,
    createStatRecord,
    stats,
    filteredStats,
    displayFilteredStats,
    airlineLogo,
    selectedStatId,
    selectStatId,
    selectedStat,
    filterAirlineCode,
    filterFlightNum,
    filterAirlineDate,
    filterValidated,
    handleSwitchFilterValidated,
    displayLogo,
    handleFilterInput,
    halfWindow,
    eightyWindow,
    width,
    page,
    enterWeightLbs,
    handleSwitchWeightType,
    handleCreateStatRecord,
    resolveWeightKgs
}) => {

    const resolveInvalid = (value) => {
        if (value < 0) {
            return '2px solid red';
        }
        return '';
    }

    return (
        <div>
            <Row>
                <Col md='12' lg='12'>
                    <Row>
                        <Col md='4' lg='4'>
                            <h4>Tonnage Report</h4>
                        </Col>
                        <Col md='4' lg='4'>
                            {
                                displayFilteredStats && displayLogo() &&
                                <img src={airlineLogo} style={{height: '50px', width: 'auto'}} />
                            }
                        </Col>
                    </Row>
                    <Row className='pb-2'>
                        <Col md={eightyWindow() ? 6 : 2}>
                            <Card style={{borderRadius: '0.75rem', height: '100%'}}>
                                <CardBody className='custom-card py-auto'>
                                    <h4 className='pb-1'>Enter Flight ID</h4>
                                    <Form>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup className='custom-form-group'>
                                                    <Label className='custom-label'>Airline Code</Label>
                                                    <Input type='text' id={'s_airline_code'} value={s_airline_code} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6} className='pl-0'>
                                                <FormGroup className='custom-form-group'>
                                                    <Label className='custom-label'>Flight Number</Label>
                                                    <Input type='text' id={'s_flight_number'} value={s_flight_number} onChange={(e) => handleInput(e)} style={{border: 'none'}} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <FormGroup className='custom-form-group'>
                                            <Label className='custom-label'>Flight Date</Label>
                                            <Input type='date' id={'d_flight'} value={d_flight} onChange={(e) => handleInput(e)} style={{border: 'none'}} />
                                        </FormGroup>
                                        <Row>
                                            <Col md={6}>
                                                <CustomSwitch label={'NIL'} value={b_nil} handleSwitch={handleSwitchNil} />
                                            </Col>
                                            <Col md={6}>
                                                <CustomSwitch label={'Cancelled'} value={b_cancelled} handleSwitch={handleSwitchCancelled} />
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col md={eightyWindow() ? 6 : 4}>
                            <Card className='mb-2' style={{borderRadius: '0.75rem', height: '100%'}}>
                                <CardBody className='custom-card py-auto'>
                                    <h4 className='pb-1'>Enter Flight Data</h4>
                                    <Form>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup className='custom-form-group'>
                                                    <Label className='custom-label'>AWB</Label>
                                                    <Input type='text' id={'i_awb'} value={i_awb} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup className='custom-form-group'>
                                                    <Label className='custom-label'>LD3</Label>
                                                    <Input type='text' id={'i_ld3'} value={i_ld3} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup className='custom-form-group'>
                                                    <Label className='custom-label'>LD3 BUP</Label>
                                                    <Input type='text' id={'i_ld3_bup'} value={i_ld3_bup} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup className='custom-form-group'>
                                                    <Label className='custom-label'>Pieces</Label>
                                                    <Input type='text' id={'i_pieces'} value={i_pieces} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup className='custom-form-group'>
                                                    <Label className='custom-label'>LD7</Label>
                                                    <Input type='text' id={'i_ld7'} value={i_ld7} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup className='custom-form-group'>
                                                    <Label className='custom-label'>LD7 BUP</Label>
                                                    <Input type='text' id={'i_ld7_bup'} value={i_ld7_bup} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}>
                                                <FormGroup className='custom-form-group'>
                                                    <Label className='custom-label'>DG AWB Count</Label>
                                                    <Input type='text' id={'i_awb_dg'} value={i_awb_dg} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                                </FormGroup>
                                            </Col>
                                            {
                                                page === 'export' &&
                                                <Fragment>
                                                    <Col md={4}>
                                                        <FormGroup className='custom-form-group'>
                                                            <Label className='custom-label'>AWB Prepare</Label>
                                                            <Input type='text' id={'i_awb_prepare'} value={i_awb_prepare} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup className='custom-form-group'>
                                                            <Label className='custom-label'>TSA Weight KG</Label>
                                                            <Input type='text' id={'f_tsa_kg'} value={f_tsa_kg} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                                        </FormGroup>
                                                    </Col>
                                                </Fragment>
                                            }
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col md={eightyWindow() ? 12 : 6} className={`${eightyWindow() && 'mt-2'}`}>
                            <Card className='mb-2' style={{borderRadius: '0.75rem', height: '100%'}}>
                                <CardBody className='custom-card py-4'>
                                    <h4 className='pb-1'>Enter Flight Weight in <span className='px-1'><Switch checked={enterWeightLbs} onClick={handleSwitchWeightType} /></span> {enterWeightLbs ? 'Pounds' : 'Kilos'} </h4>
                                    <Row>
                                        <Col md={8}>
                                            <Row>
                                                <Col md={12}>
                                                    <Form>
                                                        <FormGroup className='custom-form-group mb-0'>
                                                            <Label className='custom-label'>Cargo Total Weight</Label>                                                            
                                                            <Row>
                                                                <Col md={6}>
                                                                    <Input type='text' id={'f_total_kg'} value={f_total_kg} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                                                </Col>
                                                                {
                                                                    enterWeightLbs && 
                                                                    <Col md={6}>
                                                                        <Label className='custom-label'>(KG: {resolveWeightKgs(f_total_kg)})</Label>
                                                                    </Col>
                                                                }
                                                            </Row>
                                                        </FormGroup>
                                                    </Form>
                                                </Col>
                                            </Row>
                                            <Row className='mx-auto'>
                                                <Col md={6} className='pl-0'>
                                                    <Col md={12} style={{backgroundColor: '#b1f0ad'}}>
                                                        <Row>
                                                            <Col md={12}>
                                                                <Row>
                                                                    <Col md={12} className='text-center'>
                                                                        <h4 className='pt-1 pb-0 mb-0'>
                                                                            <i className="fas fa-minus"></i>
                                                                        </h4>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={12}>
                                                                        <FormGroup className='custom-form-group mb-0' style={{backgroundColor: 'white'}}>
                                                                            <Label className='custom-label'>Cargo BUP Weight</Label>
                                                                            <Row>
                                                                                <Col md={6}>
                                                                                    <Input type='text' id={'f_bup_kg'} value={f_bup_kg} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                                                                </Col>
                                                                                {
                                                                                    enterWeightLbs && 
                                                                                    <Col md={6}>
                                                                                        <Label className='custom-label'>(KG: {resolveWeightKgs(f_bup_kg)})</Label>
                                                                                    </Col>
                                                                                }
                                                                            </Row>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={12} className='text-center'>
                                                                        <h4 className='mb-0 pt-1 pb-0'>
                                                                            <i className="fas fa-equals"></i>
                                                                        </h4>
                                                                    </Col> 
                                                                </Row>
                                                                <Row>
                                                                    <Col md={12}>
                                                                        <FormGroup className='custom-form-group' style={{backgroundColor: '#b1f0ad', fontWeight: 'bold'}}>
                                                                            <Label className='custom-label'>Cargo Loose Weight</Label>
                                                                            <Row>
                                                                                <Col md={6}>
                                                                                    <Label className='custom-label'>{f_loose_kg}</Label>
                                                                                </Col>
                                                                                {
                                                                                    enterWeightLbs && 
                                                                                    <Col md={6}>
                                                                                        <Label className='custom-label'>(KG: {resolveWeightKgs(f_loose_kg)})</Label>
                                                                                    </Col>
                                                                                }
                                                                            </Row>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Col>
                                                <Col md={6} className='pr-0'>
                                                    <Col md={12} style={{backgroundColor: '#7ccb78'}}>
                                                        <Row>
                                                            <Col md={12}>
                                                                <Row>
                                                                    <Col md={12} className='text-center'>
                                                                        <h4 className='pt-1 pb-0 mb-0'>
                                                                            <i className="fas fa-plus"></i>
                                                                        </h4>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={12}>
                                                                        <FormGroup className='custom-form-group mb-0' style={{backgroundColor: 'white'}}>
                                                                            <Label className='custom-label'>Mail Weight</Label>                                                                            
                                                                            <Row>
                                                                                <Col md={6}>
                                                                                    <Input type='text' id={'f_mail_kg'} value={f_mail_kg} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                                                                </Col>
                                                                                {
                                                                                    enterWeightLbs && 
                                                                                    <Col md={6}>
                                                                                        <Label className='custom-label'>(KG: {resolveWeightKgs(f_mail_kg)})</Label>
                                                                                    </Col>
                                                                                }
                                                                            </Row>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={12} className='text-center'>
                                                                        <h4 className='mb-0 pt-1 pb-0'>
                                                                            <i className="fas fa-equals"></i>
                                                                        </h4>                                                                    
                                                                    </Col> 
                                                                </Row>
                                                                <Row>
                                                                    <Col md={12}>
                                                                        <FormGroup className='custom-form-group' style={{backgroundColor: '#7ccb78', fontWeight: 'bold'}}>
                                                                            <Label className='custom-label text-white'>Total Flight Weight</Label>
                                                                            <Row style={{fontWeight: 'bold'}}>
                                                                                <Col md={6}>
                                                                                    <Label className='custom-label text-white'>{f_flight_kg}</Label>
                                                                                </Col>
                                                                                {
                                                                                    enterWeightLbs && 
                                                                                    <Col md={6}>
                                                                                        <Label className='custom-label text-white'>(KG: {resolveWeightKgs(f_flight_kg)})</Label>
                                                                                    </Col>
                                                                                }
                                                                            </Row>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col md={4}>
                                            {
                                                page === 'import' && 
                                                <Fragment>
                                                    <Row>
                                                        <Col md={12}>
                                                            <FormGroup className='custom-form-group'>
                                                                <Label className='custom-label'>Transfer AWB Weight</Label>                                                            
                                                                <Row>
                                                                    <Col md={6}>
                                                                        <Input type='text' id={'f_awb_transfer'} value={f_awb_transfer} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                                                    </Col>
                                                                    {
                                                                        enterWeightLbs && 
                                                                        <Col md={6}>
                                                                            <Label className='custom-label'>(KG: {resolveWeightKgs(f_awb_transfer)})</Label>
                                                                        </Col>
                                                                    }
                                                                </Row>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md={12}>
                                                            <FormGroup className='custom-form-group'>
                                                                <Label className='custom-label'>Transfer Weight</Label>                                                                
                                                                <Row>
                                                                    <Col md={6}>
                                                                        <Input type='text' id={'f_transfer_kg'} value={f_transfer_kg} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                                                    </Col>
                                                                    {
                                                                        enterWeightLbs && 
                                                                        <Col md={6}>
                                                                            <Label className='custom-label'>(KG: {resolveWeightKgs(f_transfer_kg)})</Label>
                                                                        </Col>
                                                                    }
                                                                </Row>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Fragment>
                                            }
                                            <Row>
                                                <Col md={12}>
                                                    <FormGroup className='custom-form-group'>
                                                        <Label className='custom-label'>Courier Weight</Label>                                                        
                                                        <Row>
                                                            <Col md={6}>
                                                                <Input type='text' id={'f_courier_kg'} value={f_courier_kg} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                                            </Col>
                                                            {
                                                                enterWeightLbs && 
                                                                <Col md={6}>
                                                                    <Label className='custom-label'>(KG: {resolveWeightKgs(f_courier_kg)})</Label>
                                                                </Col>
                                                            }
                                                        </Row>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <Card className='mb-2' style={{borderRadius: '0.75rem'}}>
                                <CardBody className='custom-card py-4'>
                                    <Row>
                                        <Col md={11} className='mb-0'>
                                            <FormGroup className='custom-form-group'>
                                                <Label className='custom-label'>Notes</Label>
                                                <Input type='textarea' id={'s_notes'} value={s_notes} onChange={(e) => handleInput(e)}  style={{border: 'none'}} />
                                            </FormGroup>
                                        </Col>
                                        <Col md={1} className='my-auto'>
                                            <Button disabled={!enableSubmitStat()} onClick={() => handleCreateStatRecord('importExport')} >Submit</Button>
                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <FlightDetailContainer 
                stats={stats}
                filteredStats={filteredStats}
                displayFilteredStats={displayFilteredStats}
                handleInput={handleInput}
                selectedStatId={selectedStatId}
                selectStatId={selectStatId}
                selectedStat={selectedStat}
                filterAirlineCode={filterAirlineCode}
                filterFlightNum={filterFlightNum}
                filterAirlineDate={filterAirlineDate}
                filterValidated={filterValidated}
                handleSwitchFilterValidated={handleSwitchFilterValidated}
                handleFilterInput={handleFilterInput}
                type={'importExport'}
                halfWindow={halfWindow}
                eightyWindow={eightyWindow}
                width={width}
            />
        </div>
    );
}

export default ImportExportStatsPage;