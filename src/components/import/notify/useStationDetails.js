import _ from 'lodash';
import { useState, useEffect } from 'react';
import { api } from '../../../utils';


export default function useStationDetails (
    s_unit, 
    selectedFlight
) {

    const [unitInfo, setUnitInfo] = useState({});
    const [airlineDetails, setAirlineDetails] = useState({});
    const [s_import_distribution_email, set_s_import_distribution_email] = useState('');
    const [iscData, setIscData] = useState({});

    useEffect(() => {
        const resolveIscStorageFooters = async () => {
            const data = {
                s_unit,
                s_airline_prefix: selectedFlight.uniqueFlightAwbs[0].s_mawb.substr(0, 3)
            }

            const response = await api('post', 'resolveIscStorageFooters', { data });

            if (response.status === 200) {
                const { unitInfo, airlineDetails, iscData } = response.data;
                const { s_import_distribution_email } = airlineDetails;
                console.log(response.data);
                console.log(s_import_distribution_email);

                setUnitInfo(unitInfo);
                setAirlineDetails(airlineDetails);
                set_s_import_distribution_email(s_import_distribution_email);
                setIscData(iscData);
            }
        }

        if (s_unit && _.get(selectedFlight, 'uniqueFlightAwbs', []).length > 0) {
            resolveIscStorageFooters();
        }
    }, [s_unit, selectedFlight]);

    return {
        unitInfo,
        airlineDetails,
        s_import_distribution_email,
        iscData
    }
}