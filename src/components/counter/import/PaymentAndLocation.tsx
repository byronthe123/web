import React, { useState, useMemo, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Card, CardBody, Button, Input } from 'reactstrap';
import classnames from 'classnames';
import _ from 'lodash';

import { useImportContext } from './context/index';
import SelectAwbSlideShow from './SelectAwbSlideShow';
import ReactTable from '../../custom/ReactTable';
import tableMapping from './tableMappings';
import Charges from './Charges';
import FfmFwbFhl from './FfmFwbFhl';
import Locations from './Locations';
import ModalAddPaymentCharge from './ModalAddPaymentCharge';
import ModalCreateAwb from './ModalCreateAwb';
import ModalHouse from './ModalHouse';

interface CustomInputProps {
    type: string, 
    value: any, 
    setValue: (value: any) => void,
    testid: string
}

const CustomInput = ({type, value, setValue, testid}: CustomInputProps) => {

    const invalidValue = useMemo(
        () => type === 'number' ? 
            (!value || value <= 0) : 
            (!value || !moment(value).isValid()),
        [type, value]
    );

    return (
        <Input 
            type={type}
            value={value}
            onChange={(e: any) => setValue(e.target.value)} 
            className={classnames(
                'form-control d-inline mr-2', 
                {'bg-warning' : invalidValue }
            )} 
            data-testid={testid}
        />
    );
}

interface Props {
    searchMissingPayment: (processByHouse: boolean) => Promise<void>
}

export default function PaymentAndLocation ({searchMissingPayment}: Props) {

    const { global, module, additionalData, piecesWeight, storage, paymentsCharges } = useImportContext();
    const { user } = global;
    const { 
        refresh, 
        setRefresh,
        awbs, 
        values, 
        setFieldValue, 
        selectedAwb, 
        setSelectedAwb, 
        manualMode, 
        setManualMode 
    } = module;
    const { locations, payments, setPayments, locatedPieces, ffms, fwbs, fhls, handleSelectFfm, hold }  = additionalData;

    const { 
        pieces, 
        setPieces, 
        weight, 
        setWeight, 
        allMasterPiecesLocated, 
        overrideLocateAllByHouse, 
        setOverrideLocateAllByHouse 
    } = piecesWeight;
    const { lastArrivalDate, setLastArrivalDate } = storage;
    const { balanceDue, charges } = paymentsCharges;

    // Modal Create AWB
    const [modalCreateAwb, setModalCreateAwb] = useState(false);

    // Modal Select House
    const [processByHouse, setProcessByHouse] = useState(false);
    const [modalHouse, setModalHouse] = useState(false);

    // ModalPaymentsCharges
    const [modalPayments, setModalPayments] = useState(false);
    const [addCharge, setAddCharge] = useState(false);

    const handleAddPaymentCharge = (addCharge: boolean) => {
        setAddCharge(addCharge);
        setModalPayments(true);
    }
    
    const handleProcessByHouse = () => {
        if (!processByHouse) {
            setProcessByHouse(true);
            setManualMode(true);
            setModalHouse(true);
        } else {
            setProcessByHouse(false);
            setManualMode(false);
            setFieldValue('s_hawb', null);
        }
    }

    useEffect(() => {
        if (!manualMode) {
            setProcessByHouse(false);
        }
    }, [manualMode]);

    return (
        <Row id={'navTabs'}> 
            <Col>
                <Card>
                    <CardBody>
                        <Row>
                            <Col md={3}>
                                <h4 className={'mt-2'} data-testid={'awb-detail'}>AWB Detail ({awbs.length})</h4>
                            </Col>
                            <Col md={6}>
                                <SelectAwbSlideShow 
                                    items={awbs}
                                    handleSelectAwb={setSelectedAwb}
                                    inline={false}
                                />
                            </Col>
                            <Col md={3} className={'text-right'}>
                                <Button onClick={() => setModalCreateAwb(true)}>Create AWB</Button>
                            </Col>
                        </Row>
                        <Row className={'mt-2'}>
                            <Col md={4} className={'mt-2'}>
                                <h6 className={'d-inline mr-2'}>Pieces:</h6>
                                {
                                    manualMode ?
                                        <CustomInput 
                                            type={'number'} 
                                            value={pieces}
                                            setValue={setPieces}
                                            testid={'in-pieces'}
                                        /> :
                                        <h6 className={'d-inline'}>{pieces}</h6>
                                }
                            </Col>
                            <Col md={4} className={'mt-2'}>
                                <h6 className={'d-inline mr-2'}>Weight:</h6>
                                {
                                    manualMode ?
                                        <CustomInput 
                                            type={'number'} 
                                            value={weight}
                                            setValue={setWeight}
                                            testid={''}
                                        /> :
                                        <h6 className={'d-inline'}>{weight}</h6>
                                }
                            </Col>
                            <Col md={4} className={'mt-2'}>
                                <h6 className={'d-inline mr-2'}>Flight Date:</h6>
                                {
                                    manualMode ?
                                        <CustomInput 
                                            type={'date'} 
                                            value={lastArrivalDate}
                                            setValue={setLastArrivalDate}
                                            testid={''}
                                        /> :
                                        <h6 className={'d-inline'}>{lastArrivalDate}</h6>
                                }
                            </Col>
                        </Row>
                        <Row className={'mt-3'}>
                            <Col md={12} className={'mb-1'}>
                                {
                                    selectedAwb.s_type === 'IMPORT' &&
                                        <h4 className={'float-left'}>Subtotals</h4>
                                }
                                <div className={'float-right'}>
                                    <Button active={manualMode} color={manualMode ? 'secondary' : 'light'} onClick={() => setManualMode(!manualMode)} className={'mr-2'}>Manual</Button>                                                         
                                    <Button active={processByHouse} color={'info'} onClick={() => handleProcessByHouse()} className={'mr-2'}>
                                        Process by HAWB {processByHouse && `: ${values.s_hawb}`}
                                    </Button>   
                                    {
                                        selectedAwb.s_type === 'IMPORT' &&
                                            <>
                                                <Button color={'primary'} onClick={() => handleAddPaymentCharge(false)}>Accept Payment</Button>
                                                <Button onClick={() => handleAddPaymentCharge(true)} color={'warning'} className={'ml-2'}>Printout Payment</Button>
                                            </>
                                    }                                                      
                                </div>
                            </Col>
                            <Col md={12}>
                            {
                                selectedAwb.s_type === 'IMPORT' ? 
                                    <ReactTable 
                                        data={payments.filter(p => p.selected)}
                                        mapping={tableMapping.payments}
                                        locked={true}
                                        numRows={5}
                                        index={true}
                                    /> :
                                    <Locations 
                                        user={user}
                                        locations={locations}
                                        locatedPieces={locatedPieces}
                                        pieces={Number(pieces)}
                                        allMasterPiecesLocated={allMasterPiecesLocated}
                                        overrideLocateAllByHouse={overrideLocateAllByHouse}
                                        setOverrideLocateAllByHouse={setOverrideLocateAllByHouse}
                                        processByHouse={processByHouse}
                                        hold={hold}
                                    />
                            }
                            </Col>
                        </Row>
                        {/* Charges Summary */}
                        {
                            selectedAwb.s_type === 'IMPORT' && 
                            <Charges />
                        }
                    </CardBody>
                </Card>
            </Col>
            <Col>
               <FfmFwbFhl 
                    ffms={ffms}
                    handleSelectFfm={handleSelectFfm}
                    fwbs={fwbs}
                    fhls={fhls}
                    s_hawb={values.s_hawb}
               />
                {
                    selectedAwb.s_type === 'IMPORT' && 
                    <Locations 
                        user={user}
                        locations={locations}
                        locatedPieces={locatedPieces}
                        pieces={Number(pieces)}
                        allMasterPiecesLocated={allMasterPiecesLocated}
                        overrideLocateAllByHouse={overrideLocateAllByHouse}
                        setOverrideLocateAllByHouse={setOverrideLocateAllByHouse}
                        processByHouse={processByHouse}
                        hold={hold}
                    />
                }
            </Col>

                        
            <ModalCreateAwb 
                modal={modalCreateAwb}
                setModal={setModalCreateAwb}
                selectedAwb={selectedAwb}
                user={user}
                refresh={() => setRefresh(!refresh)}
            />

            <ModalAddPaymentCharge 
                modal={modalPayments}
                setModal={setModalPayments}
                addCharge={addCharge}
                selectedAwb={selectedAwb}
                balanceDue={balanceDue}
                importValues={values}
                email={_.get(user, 's_email', '')}
                setPayments={setPayments}  
                // @ts-ignore
                ffm={_.get(ffms, '[0]', {})}   
                processByHouse={processByHouse} 
                charges={charges}
            />

            <ModalHouse 
                modal={modalHouse}
                setModal={setModalHouse}
                values={values}
                setFieldValue={setFieldValue}
                fhls={fhls}
            />

        </Row>
    );
}