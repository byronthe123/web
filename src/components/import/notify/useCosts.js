import { useState, useEffect } from 'react';

export default function useCosts (airlineDetails, unitInfo) {
    const [storageKg, setStorageKg] = useState('');
    const [storageMinCost, setStorageMinCost] = useState('');
    const [firmsCode, setFirmsCode] = useState('');
    const [iscCost, setIscCost] = useState('');

    useEffect(() => {
        const _storageKg = 
            airlineDetails && airlineDetails.f_import_per_kg ? 
                airlineDetails.f_import_per_kg : 
                unitInfo && unitInfo.f_import_per_kg;

        const _storageMinCost = 
            airlineDetails && airlineDetails.f_import_min_charge ? 
                airlineDetails.f_import_min_charge : 
                unitInfo && unitInfo.f_import_min_charge;

        const _firmsCode = 
            airlineDetails && airlineDetails.s_firms_code ? 
                airlineDetails.s_firms_code : 
                unitInfo.s_firms_code;

        const _iscCost = 
            airlineDetails && airlineDetails.f_import_isc_cost ? 
                airlineDetails.f_import_isc_cost :
                unitInfo.f_import_isc_cost;

        setStorageKg(_storageKg);
        setStorageMinCost(_storageMinCost);
        setFirmsCode(_firmsCode);
        setIscCost(_iscCost);
    }, [airlineDetails, unitInfo]);

    return {
        storageKg,
        storageMinCost,
        firmsCode,
        iscCost
    }
}