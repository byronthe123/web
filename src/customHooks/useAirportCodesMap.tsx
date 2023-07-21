import { useEffect, useState } from "react";
import { IAirport } from "../globals/interfaces";

export default function useAirportCodesMap (airports: Array<IAirport>) {

    const [airportCodesMap, setMap] = useState<Record<string, string>>({});

    useEffect(() => {
        const map: Record<string, string> = {};
        for (const { code, name } of airports) {
            map[code] = name;
        }
        setMap(map);
    }, [airports]);

    return {
        airportCodesMap
    }
}