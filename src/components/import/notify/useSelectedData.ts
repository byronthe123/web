import { useState, useMemo } from 'react';
import _ from 'lodash';
import { IFlightArrayItem } from './interfaces';
import { defaultFlightArrayItem } from './defaults';

export default function useSelectedData () {
    const [selectedFlight, setSelectedFlight] = useState<IFlightArrayItem>(defaultFlightArrayItem);

    // This array is used to calc. storage by being passed into the useStorage hook:
    const filteredFlights = useMemo(() => {
        const { uniqueFlightAwbs } = selectedFlight;
        if (uniqueFlightAwbs && uniqueFlightAwbs.length > 0) {
            const copy = _.cloneDeep(uniqueFlightAwbs[0]); 
            copy.selected = true;
            return [copy];
        }
        return [];
    }, [selectedFlight]);

    return {
        selectedFlight, 
        setSelectedFlight,
        filteredFlights
    }
}