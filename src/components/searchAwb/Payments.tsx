import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col, Input } from 'reactstrap';
import ReactTable from '../custom/ReactTable';
import { IFHL, IUser, IFFM, IPayment } from '../../globals/interfaces';
import _ from 'lodash';
import dayjs from 'dayjs';
import useStorage from '../counter/import/useStorage';
import { formatCost, checkPayment } from '../../utils';
import useStorageDays from '../counter/import/useStorageDays';

interface IUsePayment extends IPayment {
    i_pieces: number,
    f_weight: number
}

interface IPaymentObj {
    [level: string]: {
        i_pieces: number,
        f_weight: number
    }
}

interface Props {
    payments: Array<IPayment>;
    fhls: Array<IFHL>;
    ffms: Array<IFFM>;
    minCharges: {
        f_import_min_charge: number; 
        f_import_per_kg: number;
    };
    totalWgt: number;
    s_mawb: string;
    user: IUser;
}

export default function Payments ({ 
    payments, 
    fhls, 
    ffms,
    minCharges, 
    totalWgt, 
    s_mawb,
    user
}: Props ) {

    console.log(minCharges);

    const [selectedMap, setSelectedMap] = useState<{[key: number]: any}>({});
    const [usePayments, setUsePayments] = useState<Array<IUsePayment>>([]);
    const [key, setKey] = useState(0);

    useEffect(() => {
        const copy = _.cloneDeep(payments);
        const map: IPaymentObj = {
            master: {
                i_pieces: 0,
                f_weight: 0
            }
        }

        for (let i = 0; i < fhls.length; i++) {
            const { i_pieces, f_weight, s_hawb } = fhls[i];
            if (!s_hawb || s_hawb.length === 0) {
                map.master.i_pieces += i_pieces;
                map.master.f_weight += f_weight;
            } else if (!map[s_hawb]) {
                map[s_hawb] = {
                    i_pieces,
                    f_weight
                }
            } else {
                map[s_hawb].i_pieces += i_pieces;
                map[s_hawb].f_weight += f_weight;
            }
        }

        for (let i = 0; i < copy.length; i++) {
            const { s_hawb } = copy[i];
            if (s_hawb && s_hawb.length > 0) {
                // @ts-ignore
                copy[i].i_pieces = _.get(map, `[${s_hawb}].i_pieces`, 0);

                // @ts-ignore
                copy[i].f_weight = _.get(map, `[${s_hawb}].f_weight`, 0);
            } else {
                copy[i].i_pieces = map.master.i_pieces;
                copy[i].f_weight = map.master.f_weight;
            }
        }

        setUsePayments(copy);
    }, [payments, fhls]);

    const handleCheckPayment = (payment: IPayment): void => {
        const copy = _.cloneDeep(selectedMap);
        if (copy[payment.i_id] === undefined) {
            copy[payment.i_id] = payment;
        } else {
            delete copy[payment.i_id];
        }
        setSelectedMap(copy);
        setKey(key + 1);
    }

    // const checkSelected = (i_id: number): boolean => selectedMap[i_id] !== undefined;
    const checkSelected = (i_id: number): boolean => {
        return selectedMap[i_id] !== undefined;
    };

    const totalSelected = useMemo(() => {
        let total = 0;
        for (let key in selectedMap) {
            total += selectedMap[key].f_amount;
        }
        return total;
    }, [selectedMap]);

    const totalPayments = useMemo(() => {
        return payments.reduce((total, current) => total += checkPayment(current.s_payment_method) ? Math.max(0, current.f_amount) : 0, 0);
    }, [payments]);

    const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [weight, setWeight] = useState(0);

    useEffect(() => {
        setWeight(totalWgt);
    }, [totalWgt]);

    const { lastArrivalDate, setLastArrivalDate, storageDays } = useStorageDays(
        // @ts-ignore
        ffms, ffms.length === 0, s_mawb, '', user.s_unit, true, currentDate 
    );

    if (!dayjs(lastArrivalDate).isValid()) {
        setLastArrivalDate(dayjs().format('YYYY-MM-DD'));
    }

    const { dailyStorage, totalStorage } = useStorage(weight, storageDays, minCharges.f_import_per_kg, minCharges.f_import_min_charge);

    return (
        <Row>
            <Col md={12} className={'mb-2'}>
                <h6 className={'font-weight-bold'}>Total Payments for this Waybill {formatCost(totalPayments)}</h6>
                <h6>
                    Pickup Date: <Input type='date' value={currentDate} onChange={(e: any) => setCurrentDate(e.target.value)} style={{ display: 'inline', width: '150px' }} className={'mr-2'} /> 
                    Pickup Weight: <Input type='number' value={weight} onChange={(e: any) => setWeight(e.target.value)} style={{ display: 'inline', width: '70px' }} /> 
                </h6>
                {
                    ffms.length < 1 && 
                    <h6>
                        <span className={'text-danger bg-warning'}>
                        FFMS not found. Arrival date defaulted to today.
                        </span>
                    </h6>
                }
                <h6>
                    Last arrival date: {dayjs(lastArrivalDate).format('MM/DD/YYYY')} .If you pickup the cargo on {dayjs(currentDate).format('MM/DD/YYYY')} that's {storageDays} day{storageDays > 1 && 's'} storage at {formatCost(dailyStorage)} per day which is a total of {formatCost(totalStorage)}
                </h6>
                <h6 className={'mt-2'}>Total Selected: {formatCost(totalSelected)}</h6>
            </Col>
            <Col md={12}>
                {/* @ts-ignore */}
                <ReactTable 
                    data={usePayments}
                    mapping={[
                        {
                            name: 'Selected',
                            value: 'far fa-check-circle',
                            icon: true,
                            showCondition: (payment: IPayment) => checkSelected(payment.i_id)
                        },
                        {
                            name: 'HAWB',
                            value: 's_hawb'
                        },
                        {
                            name: 'Created',
                            value: 't_created',
                            datetime: true
                        },
                        {
                            name: 'Status',
                            value: 's_status',
                            customWidth: 90
                        },
                        {
                            name: 'By',
                            value: 's_created_by',
                            email: true
                        },
                        {
                            name: 'Method',
                            value: 's_payment_method'
                        },
                        {
                            name: 'Type',
                            value: 's_payment_type',
                            customWidth: 100
                        },
                        {
                            name: 'Customer',
                            value: 's_notification_email'
                        },
                        {
                            name: 'Processed',
                            value: 'b_processed',
                            boolean: true,
                            customWidth: 75
                        },
                        {
                            name: 'Amount',
                            value: 'f_amount',
                            money: true,
                            customWidth: 170
                        }
                    ]}
                    enableClick={true}
                    handleClick={(payment: IPayment) => handleCheckPayment(payment)}
                    key={key}
                    numRows={10}
                />
            </Col>
        </Row>
    );
}