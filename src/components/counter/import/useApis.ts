import React from 'react';
import { useImportContext } from "./context";
import useLoading from "../../../customHooks/useLoading";
import moment from 'moment';
import { IFile, IMap } from '../../../globals/interfaces';
import { api, notify } from "../../../utils";
import { markByHouse, markPaymentsByMaster } from "./localUtils";
import _ from 'lodash';
import useBrowser from "../../../customHooks/useBrowser";
import { renderToString } from "react-dom/server";
import RejectionNotice from "./RejectionNotice";
import getRejectionNotice from './getRejectionNotice';

export default function useApis () {

    const { global, module, additionalData, paymentsCharges, piecesWeight, storage, fileProps,  } = useImportContext();
    const { user } = global;
    const {                 
        refresh,
        setRefresh,
        manualMode,
        selectedAwb,
        values
    } = module;

    const { payments, setPayments, locations, stationInfo } = additionalData;
    const { otherCharges, totalCharges, totalPaid, balanceDue, credits, voidIsc, isc } = paymentsCharges;
    const { pieces, autoPieces, weight, autoWeight } = piecesWeight;
    const { lastArrivalDate, totalStorage, autoTotalStorage } = storage;
    const { files, resetFiles } = fileProps;
    const { setLoading } = useLoading();
    const browser = useBrowser();

    const resolvePaidTypes = (type: string) => {
        if (type === 'ONLINE') {
            const onlinePaymentMethods = ['CARGOSPRINT_CREDIT', 'CREDIT_CARD', 'ECHECK'];
            const total = payments.reduce((total, current) => {
                return total += onlinePaymentMethods.includes(current.s_payment_method) ? current.f_amount : 0;
            }, 0);
            return total;
        } else {
            const total = payments.reduce((total, current) => {
                return total += current.s_payment_type === type ? current.f_amount : 0;
            }, 0);
            return total;
        }   
    }

    const resolveOverrideNotes = () => {
        let notes = '';
        payments.map(payment => payment.s_payment_type === 'OVERRIDE' ? notes += `${payment.s_notes}.` : null);
        return notes;
    }

    // Final Submit:
    const createImportItem = async(reject: boolean, push: (id: string) => void) => {
        console.log(files);
        let endpoint = '';

        const { s_email } = user && user;
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');

        interface IData {
            importData: IMap<any>;
            queueData: IMap<any>;
            processedPayments: Array<number>;
            processedCsIds: Array<string>;
            files: Array<IFile>;
        }

        const data: IData = {
            importData: {},
            queueData: {},
            processedPayments: [],
            processedCsIds: [],
            files: []
        };
    
        const importData = values;

        const queueData = {
            id: selectedAwb.id,
            t_counter_start: values.t_counter_start_time || now,
            t_counter_end: now,
            s_counter_ownership_agent: s_email,
            s_transaction_id: selectedAwb.s_transaction_id,
            s_modified_by: s_email,
            t_modified: now,
            s_mawb_id: selectedAwb.s_mawb_id,
            s_status: 'REJECTED',
            b_counter_reject: true,
            s_counter_reject_agent: s_email,
            t_counter_reject_time: now,
            s_counter_reject_reason: values.s_counter_reject_reason,

        }

        // New:
        importData.i_pieces = pieces;
        importData.i_pieces_auto = autoPieces;
        importData.f_weight = weight;
        importData.f_weight_auto = autoWeight;
        importData.d_last_arrival_date = lastArrivalDate;
        importData.d_last_arrival_date_auto = lastArrivalDate;
        importData.f_charge_isc = isc;
        importData.f_charge_isc_auto = isc;
        importData.f_charge_storage = totalStorage;
        importData.f_charge_storage_auto = autoTotalStorage;

        importData.s_unit = selectedAwb.s_unit;
        importData.s_awb_type = selectedAwb.s_type;
        importData.s_mawb = selectedAwb.s_mawb;
        importData.s_transaction_id = selectedAwb.s_transaction_id;
        importData.f_charge_others = otherCharges.amount;
        importData.f_charges_total = totalCharges;
        importData.f_paid_online = resolvePaidTypes('ONLINE');
        importData.f_paid_online_auto = resolvePaidTypes('ONLINE'); // ! Confirm
        importData.f_paid_check = resolvePaidTypes('CHECK');
        importData.f_paid_cash = resolvePaidTypes('CASH');
        importData.f_paid_total = totalPaid;
        importData.b_cargo_located = locations.length > 0;
        importData.f_balance_total = balanceDue;
        importData.f_balance_offset = credits;
        importData.s_balance_approval_notes = resolveOverrideNotes(); 
        importData.s_driver_company = selectedAwb.s_trucking_company;
        importData.t_kiosk_submittedtime = selectedAwb.t_kiosk_submitted;
        importData.s_counter_assigned_agent = selectedAwb.s_counter_ownership_agent;
        importData.t_counter_assigned_start = selectedAwb.t_counter_ownership;
        importData.s_counter_by = s_email;
        importData.t_counter_endtime = now;
        importData.t_created = now;
        importData.s_created_by = s_email;
        importData.t_modified = now;
        importData.s_modified_by = s_email;
        importData.b_user_modified_auto = manualMode || voidIsc;
        importData.s_mawb_id = selectedAwb.s_mawb_id;
        importData.s_browser = browser;

        if (!moment(importData.t_counter_start_time).isValid()) {
            importData.t_counter_start_time = selectedAwb.t_kiosk_submitted;
        }

        if (reject) {
            importData.s_status = 'REJECTED';
            importData.b_counter_reject = true;
            importData.s_counter_reject_agent = s_email;
            importData.t_counter_reject_time = now;
            importData.s_driver_name = selectedAwb.s_trucking_driver;

            //Queue: 
            queueData.s_status = 'REJECTED';
            queueData.b_counter_reject = true;
            queueData.s_counter_reject_agent = s_email;
            queueData.t_counter_reject_time = now;
            queueData.s_counter_reject_reason = values.s_counter_reject_reason;

            // endpoint:
            endpoint = 'rejectImportItem';
        } else {
            importData.s_status = 'PROCESSED';
            importData.b_counter_reject = false;

            //Queue: 
            queueData.s_status = 'PROCESSED';
            queueData.b_counter_reject = false;

            data.files = files;

            // Endpoint
            endpoint = 'createImportItemNew';
        }

        // Update Processed Payments:
        const processedPayments = new Set<number>();
        const processedCsIds = new Set<string>();
        for (let i = 0; i < payments.length; i++) {
            if (payments[i].selected === true) {
                if (!processedPayments.has(payments[i].i_id)) {
                    processedPayments.add(payments[i].i_id);
                }
                if (!processedCsIds.has(payments[i].s_cs_id)) {
                    processedCsIds.add(payments[i].s_cs_id);
                }
            }
        }

        data.importData = importData;
        data.queueData = queueData;
        data.processedPayments = Array.from(processedPayments);
        data.processedCsIds = Array.from(processedCsIds);

        // data.importData.t_driver_id_expiration = '2021-10-20';
        // const validSchmea = await importItemSchema.validate(data);
        // if (!validSchmea) {
        //     console.log(validSchmea);
        //     return;
        // }

        setLoading(true);
        const res = await api('post', endpoint, { data });
        setLoading(false);

        if (res.status === 200) {
            notify('Complete');
            if (!res.data.csUpdated && !reject) {
                alert('Please update CargoSprint Payment records manually.');
            }

            if (reject) {
                const rejectionNotice = getRejectionNotice(
                    selectedAwb,
                    user,
                    importData,
                    stationInfo
                );
                const myWindow = window.open('', 'MsgWindow', 'width=1920,height=1080');
                // @ts-ignore
                myWindow.document.body.innerHTML = null;
                // @ts-ignore
                myWindow.document.write(rejectionNotice);
            };

            push('1');
            setRefresh(!refresh);
        }
    };

    const searchMissingPayment = async (processByHouse: boolean) => {

        setLoading(true);

        const existingCsIds: IMap<boolean> = {};

        payments.map(payment => payment.s_cs_id && (existingCsIds[payment.s_cs_id] = true));

        const data = {
            s_mawb: selectedAwb.s_mawb,
            existingCsIds,
            s_email: user.s_email
        }

        const res = await api('post', 'searchMissingPayment', { data });
        setLoading(false);

        if (res.status === 200) {
            const diff = res.data.length - payments.length;

            if (processByHouse) {
                setPayments(markByHouse(_.get(values, 's_hawb', '').toUpperCase(), res.data));
            } else {
                setPayments(markPaymentsByMaster(res.data));
            }
    
            notify(`${diff} additional payments found.`, diff > 0 ? 'success' : 'warn');    
        }

    }

    return {
        createImportItem,
        searchMissingPayment
    }
}