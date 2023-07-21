import _ from "lodash";
import { useState } from "react";

import { useAppContext } from "../../../context";
import useLoading from "../../../customHooks/useLoading";
import { IFHL, IFWB, IPayment } from "../../../globals/interfaces";
import { api, getDate, validateSchema, notify } from "../../../utils";
import { DeletePayment } from './interfaces';
import { deletePaymentSchema } from './utils';

export default function useData () {

    const { user } = useAppContext();
    const { setLoading } = useLoading();
    const [paymentsData, setPaymentsData] = useState<Array<IPayment>>([]);
    const [fwb, setFwb] = useState<IFWB>();
    const [fhl, setFhl] = useState<IFHL>();
    const [searchComplete, setSearchComplete] = useState(false);

    const searchPayments = async (s_awb: string, s_hawb: string, s_unit: string) => {
        const data = {
            s_awb,
            s_hawb,
            s_unit: s_unit
        };

        const res = await api('get', `/payment?s_awb=${s_awb}&s_hawb=${s_hawb}&s_unit=${s_unit}`, { data });

        if (res.status === 200) {
            const { main = [], fwb = undefined, fhl = undefined } = res.data;
            if (main.length === 0) {
                notify('No records found', 'warn');
            }

            setPaymentsData(main);
            setFwb(fwb);
            setFhl(fhl);
            setSearchComplete(true);
        }
    };

    const createPayment = async (data: any): Promise<boolean> => {
        if (data.s_payment_method === 'CHARGE') {
            data.f_amount *= -1;
        }
        const res = await api('post', '/payment', data);
        if (res.status === 200) {
            setPaymentsData(prev => {
                const copy = _.cloneDeep(prev);
                copy.push(...res.data);
                return copy;
            });
        }
        return res.status === 200;
    }

    const deletePayment: DeletePayment = async (selectedPayment: IPayment) => {
        const { i_id, s_awb, s_hawb, f_amount, s_payment_type, s_payment_method } = selectedPayment;
        const data: any = {
            i_id,
            s_awb,
            s_hawb,
            f_amount,
            s_payment_type,
            s_payment_method,
            s_notes: null,
            s_created_by: user.s_email,
            s_modified_by: user.s_email,
            t_modified: getDate(),
            s_unit: user.s_unit,
            other: {
                username: user.displayName,
                fwb,
                fhl
            }
        }
        const validSchema = await validateSchema(deletePaymentSchema, data);
        if (validSchema) {
            const res = await api('delete', '/payment', data);
            if (res.status === 204) {
                setPaymentsData(prev => {
                    const filtered = prev.filter(payment => payment.i_id !== data.i_id);
                    return filtered;
                });
            }
            return res.status === 204;
        }
        return false;
    }

    const searchMissingPayment = async (s_mawb: string) => {
        setLoading(true);
        const res = await api('get', `/payment/missing?s_mawb=${s_mawb}&s_email=${user.s_email}`);
        setLoading(false);
        if (res.status === 200) {
            if (res.data.length > 0) {
                setPaymentsData(prev => {
                    const combined = [...prev,...res.data];
                    return combined;
                });
            } else {
                notify('No additional payments found', 'warn');
            }
        }
    }

    return {
        paymentsData,
        fwb,
        fhl,
        searchComplete,
        setSearchComplete,
        searchPayments,
        createPayment,
        deletePayment,
        searchMissingPayment
    }

}