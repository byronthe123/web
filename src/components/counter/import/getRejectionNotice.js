
// @ts-nocheck
import React from 'react';
import { renderToString } from "react-dom/server";
import RejectionNotice from './RejectionNotice';

export default function getRejectionNotice (
    selectedAwb,
    user,
    importData,
    stationInfo
) {
    const rejectionNotice = renderToString(
        <RejectionNotice 
            selectedAwb={selectedAwb}
            user={user}
            s_driver_company={importData.s_driver_company}
            s_driver_name={importData.s_driver_name}
            t_kiosk_submittedtime={importData.t_kiosk_submittedtime}
            t_counter_start_time={importData.t_counter_start_time}
            s_counter_assigned_agent={importData.s_counter_assigned_agent}
            t_counter_reject_time={importData.t_counter_reject_time}
            s_counter_reject_reason={importData.s_counter_reject_reason}
            f_charge_isc={importData.f_charge_isc}
            f_charge_storage={importData.f_charge_storage}
            f_charge_others={importData.f_charge_others}
            f_charges_total={importData.f_charges_total}
            f_paid_online={importData.f_paid_online}
            f_paid_cash={importData.f_paid_cash}
            f_paid_check={importData.f_paid_check}
            f_paid_total={importData.f_paid_total}
            f_balance_offset={importData.f_balance_offset}
            i_pieces={importData.i_pieces}
            f_weight={importData.f_weight}
            d_last_arrival_date={importData.d_last_arrival_date}
            stationInfo={stationInfo}
        />
    );

    return rejectionNotice;
}