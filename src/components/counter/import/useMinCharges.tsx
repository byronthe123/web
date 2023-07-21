import { useState, useEffect } from 'react';
import _ from 'lodash';
import { getNum } from './localUtils';
import moment from 'moment';
import { IscData } from './interfaces';

export default function useMinCharges (
    postEntryFee: boolean, 
    iscData: IscData, 
    voidIsc: boolean, 
    lastArrivalDate: string,
    s_unit: string,
    s_mawb?: string
) {

    const [f_import_per_kg, set_f_import_per_kg] = useState<number>(0);
    const [f_import_min_charge, set_f_import_min_charge] = useState<number>(0);
    const [isc, setIsc] = useState<number>(0);

    useEffect(() => {
        const airlineDataWithDetail = _.get(iscData, 'airlineDataWithDetail', {});
        const corpStationData = _.get(iscData, 'corpStationData', {});
        const _isc = _.get(airlineDataWithDetail, 'AirlineMappingDetail.f_import_isc_cost', null);
        const _previousIsc = _.get(airlineDataWithDetail, 'AirlineMappingDetail.f_import_isc_cost_previous', null);
        const d_switch = _.get(airlineDataWithDetail, 'AirlineMappingDetail.d_switch', null);
        const corpIsc = _.get(corpStationData, 'f_import_isc_cost', 0);

        if (postEntryFee || voidIsc) {
            setIsc(0);
        } else {
            if (moment(lastArrivalDate).isSameOrBefore(moment(d_switch))) {
                setIsc(
                    getNum(_previousIsc || corpIsc)
                );
            } else {
                setIsc(
                    getNum(_isc || corpIsc)
                );
            }
        }

        let useImportPerKg, useImportMinCharge;

        if (moment(lastArrivalDate).isSameOrBefore(moment(d_switch))) {
            useImportPerKg = _.get(airlineDataWithDetail, 'AirlineMappingDetail.f_import_per_kg_previous', null);
            useImportMinCharge = _.get(airlineDataWithDetail, 'AirlineMappingDetail.f_import_min_charge_previous', null)
        } else {
            useImportPerKg = _.get(airlineDataWithDetail, 'AirlineMappingDetail.f_import_per_kg', null);
            useImportMinCharge = _.get(airlineDataWithDetail, 'AirlineMappingDetail.f_import_min_charge', null)
        }

        if (useImportPerKg === null) {
            useImportPerKg = _.get(corpStationData, 'f_import_per_kg', 0);
        }

        if (useImportMinCharge === null) {
            useImportMinCharge = _.get(corpStationData, 'f_import_min_charge', 0)
        }

        set_f_import_per_kg(useImportPerKg);
        set_f_import_min_charge(useImportMinCharge);

    }, [postEntryFee, iscData, voidIsc, lastArrivalDate, s_unit]);

    return {
        f_import_per_kg,
        f_import_min_charge,
        isc
    }
}