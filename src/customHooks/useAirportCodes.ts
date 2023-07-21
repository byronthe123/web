import { useEffect, useState } from "react";
import { IAirport } from "../globals/interfaces";
import { api } from "../utils";

export default function useAirportCodes(allData?: boolean) {

    const [airportCodes, setAirportCodes] = useState<Array<IAirport>>([]);

    useEffect(() => {
        const getData = async () => {
            const endpoint = allData ? '/airport' : '/airport/codes';
            const res = await api('get', endpoint);
            setAirportCodes(res.data);
        }
        getData();
    }, []);

    return {
        airportCodes
    }
}