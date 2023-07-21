import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import useSWR from 'swr';

import { IMap } from "../../../globals/interfaces";
import { ICompany, ProcessingAgentsMap, IQueueStats } from "./interfaces";
import { defaultCompany, defaultInitialValues } from "./defaults";
import { unhandledApi } from "../../../utils";
import apiClient from "../../../apiClient";

const fetcher = async (endpoint: string) => {
    try {
        const { statusText, data } = await apiClient.get(endpoint);
        if (statusText === 'OK') {
            return data;
        }
        return null;
    } catch (err) {
        throw err;
    }
}

export default function useQueueData (
    s_email: string,
    s_unit: string
) {

    const { data: queueData } = useSWR(
        s_unit ? `/queue/${s_unit}` : null,
        fetcher,
        {
            refreshInterval: 10000
        }
    );

    const { data: stats } = useSWR<IQueueStats>(
        (s_unit && s_email) ? `/queueStats?s_unit=${s_unit}&s_email=${s_email}` : null,
        fetcher,
        {
            refreshInterval: 60000,
            fallbackData: {
                minWaitingTime: 0,
                aveWaitingTime: 0,
                maxWaitingTime: 0,
                transactionsProcessed: 0,
                unitMinProcessingTime: 0, 
                unitAveProcessingTime: 0, 
                unitMaxProcessingTime: 0, 
                unitAwbsProcessed: 0,
                userMinProcessingTime: 0, 
                userAveProcessingTime: 0, 
                userMaxProcessingTime: 0, 
                userAwbsProcessed: 0,
            }
        }
    );
    
    const [companiesList, setCompaniesList] = useState<Array<ICompany>>([]);
    const [firstWaitingId, setFirstWaitingId] = useState(0);
    const [processingAgentsMap, setProcessingAgentsMap] = useState<ProcessingAgentsMap>({});
    const [accessToken, setAccessToken] = useState('');
    const [myAssignmentCompany, setMyAssignmentCompany] = useState<ICompany>(defaultCompany);

    const setQueueData = (data: { 
        companiesList: Array<ICompany>, 
        firstWaitingId: number,
        processingAgentsMap: IMap<boolean>
        accessToken: string
    }) => {
        const { companiesList, accessToken, firstWaitingId, processingAgentsMap } = data;
        companiesList.sort((a, b) => +moment(a.t_kiosk_submitted) - +moment(b.t_kiosk_submitted));
        setCompaniesList(companiesList);
        setFirstWaitingId(firstWaitingId);
        setProcessingAgentsMap(processingAgentsMap);
        setAccessToken(accessToken);

        let foundMyCompany = false;
        // Find the agent's company:
        for (let i = 0; i < companiesList.length; i++) {
            const { s_counter_ownership_agent, s_status } = companiesList[i];
            if (
                s_counter_ownership_agent === s_email.toUpperCase() && 
                s_status === 'DOCUMENTING'
            ) {
                setMyAssignmentCompany(companiesList[i]);
                foundMyCompany = true;
            }
        }

        if (!foundMyCompany) {
            setMyAssignmentCompany(defaultCompany);
        }    
    };

    useEffect(() => {
        if (queueData && queueData.companiesList) {
            setQueueData(queueData);
        }
    }, [queueData]);


    const [initialValues, setInitialValues] = useState(defaultInitialValues);

    const initializeValues = () => {
        setInitialValues(defaultInitialValues);
    }
    
    return {
        companiesList,
        firstWaitingId,
        processingAgentsMap,
        accessToken,
        myAssignmentCompany,
        initialValues,
        stats,
        setQueueData,
        initializeValues
    }
}