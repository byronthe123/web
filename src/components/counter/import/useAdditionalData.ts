import { useState, useEffect } from 'react';
import { api } from '../../../utils';
import { markPaymentsByMaster, markLocationsByMaster, markByHouse } from './localUtils';
import useLoading from '../../../customHooks/useLoading';
import { FFM, FHL, FWB, Payment, IscData, FSN, Location } from './interfaces';
import _ from 'lodash';
import { IPayment, ICorpStation, IRack } from '../../../globals/interfaces';
import { defaultContext } from './defaultValues';

export default function useAdditionalData (
    s_mawb: string, 
    s_unit: string, 
    manualMode: boolean, 
    s_hawb: string,
    s_type: string
) {
    // could this be changed to an object with each state
    // as a prop and use useReducer?

    const { setLoading } = useLoading();
    const [payments, setPayments] = useState<Array<IPayment>>([]);
    const [ffms, setFfms] = useState<Array<FFM>>([]);
    const [fhls, setFhls] = useState<Array<FHL>>([]);
    const [fwbs, setFwbs] = useState<Array<FWB>>([]);
    const [locations, setLocations] = useState<Array<Location>>([]);
    const [iscData, setIscData] = useState<IscData>({});
    const [clearanceData, setClearanceData] = useState<Array<FSN>>([]);
    const [stationInfo, setStationInfo] = useState<ICorpStation>(defaultContext.additionalData.stationInfo);

    useEffect(() => {
        const additionalImportDataQuery = async() => {
            setLoading(true);
            const data = {
                s_mawb,
                s_airline_prefix: s_mawb.substr(0, 3),
                s_unit,
                s_type
            }
    
            const res = await api('post', 'additionalImportData', { data });
            setLoading(false);

            if (res.status === 200) {
                const {
                    paymentsInfo,
                    ffmInfo,
                    fhlInfo,
                    fwbData,
                    locationInfo,
                    iscData,
                    clearanceData,
                    stationInfo
                } = res.data;
            
                for (let i = 0; i < ffmInfo.length; i++) {
                    ffmInfo[i].selected = true;
                }

                // Update payments to change messages to EOS
                for (let i = 0; i < paymentsInfo.length; i++) {
                    const { s_created_by = '' } = paymentsInfo[i];
                    if (s_created_by.toUpperCase() === 'MESSAGES@CHOICE.AERO') {
                        paymentsInfo[i].s_created_by = 'EOS';
                    }
                }
                
                // Locations
                // TRANSFER-IMPORT locations = destination !== s_unit
                // Normal IMPORT locations = destination === s_unit ONLY
                const filteredLocations = [];
                for (let i = 0; i < locationInfo.length; i++) {
                    const location = locationInfo[i];
                    if (s_type === 'TRANSFER-IMPORT' && location.s_destination !== s_unit.substring(1, 4)) {
                        filteredLocations.push(location);
                    } else if (s_type === 'IMPORT' && location.s_destination === s_unit.substring(1, 4)) {
                        filteredLocations.push(location);
                    }
                }

                // Select payments/locations by master initially:
                setLocations(markLocationsByMaster(filteredLocations));

                setPayments(markPaymentsByMaster(paymentsInfo));
                setFfms(ffmInfo);
                setFhls(fhlInfo);
                setFwbs(fwbData);
                setIscData(iscData);
                setClearanceData(clearanceData);
                setStationInfo(stationInfo);
            }
        };
        if (s_mawb && s_unit) {
            additionalImportDataQuery();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [s_mawb, s_unit]);

    useEffect(() => {
        if (!manualMode) {
            setPayments(markPaymentsByMaster(payments));
            setLocations(markLocationsByMaster(locations));
        } else if (s_hawb) {
            // Payments
            const useHawb = s_hawb.toUpperCase();
            setPayments(markByHouse(useHawb, payments))

            // Locations
            setLocations(markByHouse(useHawb, locations));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [manualMode, s_hawb]);

    const handleSelectFfm = (ffm: FFM) => {
        const copy = _.cloneDeep(ffms);
        const updatedIndex = copy.findIndex(f => f.id === ffm.id);

        const newStatus = !copy[updatedIndex].selected;

        if (newStatus === false) {
            const selectedCount = copy.reduce((total, current) => {
                return total += current.selected ? 1 : 0;
            }, 0);

            // don't unselect if there is only 1 selected ffm left
            if (selectedCount === 1) {
                return;
            } else {
                copy[updatedIndex].selected = newStatus;
            }
        } else {
            copy[updatedIndex].selected = newStatus;
        }

        setFfms(copy);
    };

    return {
        payments,
        setPayments,
        locations,
        ffms,
        fhls,
        fwbs,
        iscData,
        clearanceData,
        handleSelectFfm,
        stationInfo
    }

}