import { useMemo } from 'react';
import { Location } from "./interfaces";

const holds = ['b_customs_hold', 'b_usda_hold', 'b_hold'];

export default function useHold (locations: Array<Location>) {
    const hold: boolean = useMemo(() => {
        for (let i = 0; i < locations.length; i++) {
            const currentLocation = locations[i];
            if (currentLocation.selected) {
                for (let j = 0; j < holds.length; j++) {
                    const currentHold = holds[j];
                    if (currentLocation[currentHold]) {
                        return true;
                    }
                }
            }

        }
        return false;
    }, [locations]);

    return {
        hold
    };
}