import React, { useMemo } from 'react';
import { useImportContext } from './context';
import { Row, Col, Table, Button } from 'reactstrap';
import { formatCost } from '../../../utils';
import classnames from 'classnames';
import moment from 'moment';
import PaymentReceipt from './PaymentReceipt';
import { renderToString } from 'react-dom/server';
import { IMap } from '../../../globals/interfaces';

const useEnableVoidIsc = (s_mawb: string, s_unit: string) => {
    const enable = useMemo(() => {
        const voidAirlines: IMap<boolean> = {
            '373': true,
            '279': true,
            '173': true
        };
        return s_unit === 'CBOS1' && voidAirlines[s_mawb.substring(0, 3)];
    }, [s_mawb, s_unit]);

    return enable;
}

export default function Charges () {

    const { paymentsCharges, storage, global, module, additionalData } = useImportContext();
    const { isc, hmCharge, totalPaid, credits, balanceDue, otherCharges, voidIsc, setVoidIsc, comat, generalOrder  } = paymentsCharges;
    const { 
        dailyStorage, 
        totalStorage, 
        storageDays, 
        storageStartDate,                 
        altStorage, 
        altStorageAmount 
    } = storage;
    const { user } = global;
    const { selectedAwb, values } = module;
    const enableVoidIsc = useEnableVoidIsc(selectedAwb.s_mawb, user.s_unit);
    const storageDescription = storageDays > 0 ? 
        ` Start Date: ${moment(storageStartDate).format('MM/DD/YYYY')}. 
        ${storageDays} days at ${formatCost(dailyStorage)} per day.` :
        '';
    const totalCharges = isc + totalStorage + otherCharges.amount;
    const { payments, stationInfo } = additionalData;

    const generatePaymentReceipt = () => {
        const sheet = renderToString(
            <PaymentReceipt 
                selectedAwb={selectedAwb}
                s_hawb={values.s_hawb}
                user={user}
                isc={isc}
                totalStorage={totalStorage}
                storageDescription={storageDescription}
                totalCharges={totalCharges}
                credits={credits}
                totalPaid={totalPaid}
                balanceDue={balanceDue}
                payments={payments}
                stationInfo={stationInfo}
                hmCharge={hmCharge}
            />
        );
        
        const myWindow = window.open("", "MsgWindow", "width=1920,height=1080");
        //@ts-ignore
        myWindow.document.body.innerHTML = null;
        //@ts-ignore
        myWindow.document.write(sheet);
    }

    return (
        <Row className={'mt-3'}>
            <Col md={12}>
                <h4 className={'float-left'}>Summary</h4>
                <i 
                    className={'fad fa-print float-right mt-1 hover-pointer'} 
                    style={{ fontSize: '20px' }} 
                    onClick={() => generatePaymentReceipt()}
                />
                <Table striped style={{ fontSize: '16px' }}>
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td className={'float-left'}>
                                ISC
                                {
                                    enableVoidIsc && 
                                        <Button 
                                            onClick={() => setVoidIsc(!voidIsc)}
                                            className={'ml-2'}
                                        >
                                            {voidIsc ? 'Add' : 'Void'} ISC
                                        </Button>
                                }
                            </td>
                            <td className={'float-right'}>
                                {formatCost(isc)}
                            </td>
                        </tr>
                        <tr>
                            <td className={'float-left'}>
                                Storage:
                                {
                                    !altStorage &&
                                    <span>
                                        {storageDescription}
                                    </span>
                                }
                            </td>
                            <td className={'float-right'}>
                                {formatCost(totalStorage)}
                            </td>
                        </tr>
                        <tr>
                            <td className={'float-left'} style={{ width: '80%' }}>
                                Other:
                                {
                                    <span>{otherCharges.description}</span>
                                }
                            </td>
                            <td className={'float-right'}>
                                {formatCost(otherCharges.amount)}
                            </td>
                        </tr>
                        <tr>
                            <td className={'float-left'}>Total Charges</td>
                            <td className={'float-right'}>
                                {formatCost(totalCharges)}
                            </td>
                        </tr>
                        <tr>
                            <td className={'float-left'}>Total Credits</td>
                            <td className={'float-right'}>
                                ({formatCost(credits)})
                            </td>
                        </tr>
                        <tr>
                            <td className={'float-left'}>Total Paid</td>
                            <td className={'float-right'}>
                                ({formatCost(totalPaid)})
                            </td>
                        </tr>
                        <tr>
                            <td className={'float-left'}>
                                Payment Due 
                                {comat && ' (Comat)'}
                                {generalOrder && ' (General Order)'}
                            </td>
                            <td className={classnames(
                                'float-right', 
                                balanceDue > 0 ? 'text-danger bg-warning' : 'text-success'
                            )}>
                                {formatCost(balanceDue)}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
}
