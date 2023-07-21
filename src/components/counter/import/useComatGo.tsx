import { useState, useEffect } from "react";
import { Location } from "./interfaces";

export default function useComatGo (locations: Array<Location>) {
    const [comat, setComat] = useState(false);
    const [generalOrder, setGeneralOrder] = useState(false);

    useEffect(() => {
        // All selected locations must have b_comat true for true
        const selectedLocations = locations.filter(l => l.selected);

        if (selectedLocations.length > 0) {
            let numComat = 0, numGeneralOrder = 0;
        
            for (let i = 0; i < selectedLocations.length; i++) {
                numComat += selectedLocations[i].b_comat ? 1 : 0;
                numGeneralOrder += selectedLocations[i].b_general_order ? 1 : 0;
            }
    
            setComat(numComat === selectedLocations.length);
            setGeneralOrder(numGeneralOrder === selectedLocations.length);
        } else {
            setComat(false);
            setGeneralOrder(false);
        }

    }, [locations]);

    return {
        comat,
        generalOrder
    };
}