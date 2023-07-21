import { useEffect, useState } from "react";
import { api } from "../../../utils";

export default function useNotificationData (selectedAwb) {
    const [notificationData, setNotificationData] = useState(null);
    const [totalPieces, setTotalPieces] = useState('');
    const [totalWeight, setTotalWeight] = useState('');
    const [flightPieces, setFlightPieces] = useState('');
    const [flightWeight, setFlightWeight] = useState('');
    const [flightRackPcs, setFlightRackPcs] = useState('');
    const [fwbDataConsigneeAddressName, setFwbDataConsigneeAddressName] = useState(null);

    useEffect(() => {
        const getNotificationData = async () => {
            const { s_mawb = '', s_flight_id = '' } = selectedAwb;
            console.log(selectedAwb);
            const response = await api('post', 'additionalNotificationData', { s_mawb, s_flight_id });

            if (response.status === 200) {
                const { data } = response;
                const { fwbData = [], flightPieces } = data;
                setNotificationData(data);
                setFwbDataConsigneeAddressName(fwbData.length > 0 ? fwbData[0].s_consignee_name1 : null);
                
                setTotalPieces(selectedAwb.i_pieces_total);
                setTotalWeight(selectedAwb.f_weight);
                setFlightPieces(selectedAwb.i_actual_piece_count);
                setFlightWeight(selectedAwb.f_weight);
                setFlightRackPcs(flightPieces);
            }
        }

        if (selectedAwb) {
            getNotificationData();
        }
    }, [selectedAwb]);

    return {
        notificationData,
        totalPieces,
        totalWeight,
        flightPieces,
        flightWeight,
        flightRackPcs,
        fwbDataConsigneeAddressName
    }

}