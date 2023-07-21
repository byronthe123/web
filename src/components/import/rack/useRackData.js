import { useState, useEffect } from 'react';

import { api, formatMawb, notify } from "../../../utils";
import useLoading from '../../../customHooks/useLoading';
import { useAppContext } from '../../../context';
import { socket } from '../../../context/socket';

export default function useRackData (s_unit) {
    const { setLoading } = useLoading();
    const [schema, setSchema] = useState({});
    const [specialLocations, setSpecialLocations] = useState({});
    const [rackItems, setRackItems] = useState([]);
    const [locationsMap, setLocationsMap] = useState({});
    const [queryIndex, setQueryIndex] = useState(0);

    const resolveLocationsMap = (schema, locations) => {
        const map = {};

        for (let tower in schema) {
            const levels = schema[tower];
            for (let level in levels) {
                const locations = levels[level];
                for (let location in locations) {
                    const completeLocation = `${tower}${level}${location}`;
                    const { allowDuplicates } = locations[location];
                    map[completeLocation] = {
                        allowDuplicates,
                        numLocated: 0
                    }
                }
            }
        }

        for (let i = 0; i < locations.length; i++) {
            const { s_location, s_status } = locations[i];
            if (s_status === 'LOCATED' && map[s_location]) {
                map[s_location].numLocated++;
            }
        }

        return map;
    }

    useEffect(() => {
        const incrementQueryIndex = (data) => {
            const { s_mawb, s_unit: updatedUnit } = data;
            if (updatedUnit === s_unit) {
                setQueryIndex(prev => prev + 1);
                notify(`${formatMawb(s_mawb)} updated`);    
            }
        };
        socket.on('updateRackData', incrementQueryIndex);
        
        return () => {
            socket.off('updateRackData', incrementQueryIndex);
        }
    }, [s_unit])

    useEffect(() => {
        const selectRackItems = async() => {
            setLoading(true);
            const response = await api('get', `selectRackItemsAndSchema/${s_unit}`);
            setLoading(false);

            if (response.status === 200) {
                const { rackItems, schema, specialLocations } = response.data;
                setRackItems(rackItems);
                setSchema(schema);
                setSpecialLocations(specialLocations);
                setLocationsMap(resolveLocationsMap(schema, rackItems));
            } else {
                setRackItems([]);
                setSchema({});
                setSpecialLocations({});
                setLocationsMap({});
            }
        };
        if (s_unit) {
            selectRackItems();
        }
    }, [s_unit, queryIndex]);

    return {
        rackItems,
        setRackItems,
        schema,
        specialLocations,
        locationsMap
    }
}
