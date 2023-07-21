import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { api } from '../../../utils';
import _ from 'lodash';

export default function useAwbs (
    s_counter_ownership_agent: string,
    s_unit: string,
    s_type: string,
    refresh: boolean
) {

    const [awbs, setAwbs] = useState<Array<any>>([]);
    const [awbsLoading, setAwbsLoading] = useState<boolean>(true);
    const history = useHistory();

    useEffect(() => {
        const awbsQuery = async() => {
            const res = await api('post', 'agentAwbs', {
                s_counter_ownership_agent,
                s_unit,
                s_type
            });

            const { data } = res;

            if (
                (_.get(history, 'location.search.length', 0) > 0) && 
                data.length > 0
            ) {
                const s_mawb = history.location.search.split('=')[1];
                const index = data.findIndex((a: any) => a.s_mawb === s_mawb);
                data.unshift(data.splice(index, 1)[0]);
            }

            console.log(data);
   
            setAwbs(data);
            setAwbsLoading(false);
        };

        if (s_counter_ownership_agent && s_unit && s_type) {
            awbsQuery();
        }
    }, [s_counter_ownership_agent, s_unit, s_type, refresh]);

    return {
        awbsLoading, 
        awbs
    };
}
