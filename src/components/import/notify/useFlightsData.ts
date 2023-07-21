import _ from 'lodash';
import { useMemo } from 'react';
import { IMap } from "../../../globals/interfaces";
import { formatPercent } from '../../../utils';
import { INotifyFFM, INotifyFlight, IFlightArrayItem } from './interfaces';

// uniqueFlightAwbs is basically another map
// based on awbs. run both logic blocks at once?

export default function useFlightsData (ffmData: Array<INotifyFFM>) {
    const flightsMap: IMap<INotifyFlight> = useMemo(() => {
        const ffmDataCopy = _.cloneDeep(ffmData);
        const map: IMap<Array<INotifyFFM>> = {};

        for (let i = 0; i < ffmDataCopy.length; i++) {
            const { s_flight_id } = ffmDataCopy[i];
            if (map[s_flight_id] === undefined) {
                map[s_flight_id] = [];
            }
            map[s_flight_id].push(ffmDataCopy[i]);
        }

        const _finalMap: IMap<INotifyFlight> = {};

        for (let s_flight_id in map) {
            const awbs = map[s_flight_id];

            // create a new map for each set of awbs in a flight id
            const uniqueAwbsMap: IMap<INotifyFFM> = {};
            for (let awb in awbs) {
                const current = awbs[awb];
                if (uniqueAwbsMap[current.s_mawb] === undefined) {
                    uniqueAwbsMap[current.s_mawb] = current;
                } else {
                    uniqueAwbsMap[current.s_mawb].f_weight += current.f_weight;
                    uniqueAwbsMap[current.s_mawb].i_actual_piece_count += current.i_actual_piece_count;
                }
            } 

            // use the map to create a unique array which is added to _finalMap:
            // get the notifiedSum: 
            const uniqueFlightAwbs = [];
            let notifiedSum = 0;
            for (let key in uniqueAwbsMap) {
                const current = uniqueAwbsMap[key];
                uniqueFlightAwbs.push(current);
                if (current.notification_id) {
                    notifiedSum++;
                }
            }

            _finalMap[s_flight_id] = {
                uniqueFlightAwbs,
                notifiedSum
            }
        }

        return _finalMap;
    }, [ffmData]);

    const flightsArray: Array<IFlightArrayItem> = useMemo(() => {
        const array = [];
        for (let s_flight_id in flightsMap) {
            const { uniqueFlightAwbs, notifiedSum } = flightsMap[s_flight_id];
            let s_flight_number = '', s_logo = '';
            if (uniqueFlightAwbs.length > 0) {
                const { s_flight_number: number, s_logo: logo } = uniqueFlightAwbs[0];
                s_flight_number = number;
                s_logo = logo;
            }
            array.push({
                s_flight_number,
                s_logo,
                uniqueFlightAwbs, 
                notifiedSum,
                notifiedPercent: formatPercent(notifiedSum / uniqueFlightAwbs.length, true)
            });
        }
        array.sort((a, b) => parseFloat(a.notifiedPercent) - parseFloat(b.notifiedPercent));
        return array;
    }, [flightsMap]);

    return {
        flightsMap,
        flightsArray
    }
}