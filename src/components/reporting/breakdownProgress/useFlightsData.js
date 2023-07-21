import { useEffect, useState } from "react";
import moment from 'moment';
import { api } from "../../../utils";
import useLoading from "../../../customHooks/useLoading";

const getUldsArray = (map) => {
    const array = [];
    for (let key in map) {
        map[key].s_uld = key;

        const { awbs } = map[key];
        const awbsArray = [];
        for (let key in awbs) {
            awbs[key].s_mawb = key;
            awbsArray.push(awbs[key]);
        }

        map[key].awbs = awbsArray;

        array.push(map[key]);
    }
    return array;
}

export default function useFlightsData (d_arrival_date, s_unit) {
    const { setLoading } = useLoading();
    const [flightData, setFlightData] = useState([]);
    const [flights, setFlights] = useState([]);
    const [completePercent, setCompletePercent] = useState(0);
    const [locatedPercent, setLocatedPercent] = useState(0);
    const [uldsData, setUldsData] = useState([]);

    useEffect(() => {
        const selectbreakdownProgressFlights = async() => {
            setLoading(true);
            const s_pou = s_unit.substr(1, 3);
            const res = await api('post', 'selectBreakdownProgressFlights', { d_arrival_date, s_pou });
            setLoading(false);
            if (res.status === 200) {
                const { map, data, uldsData } = res.data;
                console.log(res.data);
                const flights = [];
                let numComplete = 0, totalRackPieces = 0, totalActualPieces = 0;
                for (let key in map) {
                    const flight = map[key];
                    const { ulds } = flight;
                    flight.s_flight_id = key.split('/')[0];
                    flight.ulds = getUldsArray(ulds);
                    flights.push(flight);

                    // if (flight.progress >= 1) {
                    //     numComplete++;
                    // }
                    numComplete += flight.progress;
                    totalRackPieces += flight.rackPieces;
                    totalActualPieces += flight.i_actual_piece_count;
                }

                flights.sort((a, b) => a.progress - b.progress);
                setFlightData(data);
                setFlights(flights);
                setCompletePercent(numComplete / flights.length);
                setLocatedPercent(totalRackPieces / totalActualPieces);
                setUldsData(uldsData);
            }
        }
        if (moment(d_arrival_date).isValid() && s_unit) {
            selectbreakdownProgressFlights();
        }
    }, [d_arrival_date, s_unit]);

    return {
        flights,
        completePercent,
        locatedPercent,
        uldsData
    };
}