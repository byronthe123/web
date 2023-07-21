import { useMemo } from "react";
import { IActiverUsers, IActiveUser } from "../../../globals/interfaces";
import { ProcessingAgentsMap } from "./interfaces";

export default function useSortedActiveUsers (
    activeUsers: IActiverUsers, 
    processingAgentsMap: ProcessingAgentsMap,
    s_unit: string
) {
    const sortedActiveUsers: Array<IActiveUser> = useMemo(() => {
        let users = Object.keys(activeUsers).map(key => activeUsers[key]);
        const filtered = users.filter(u => u.s_unit === s_unit);
        
        // filtered.push({
        //     displayName: 'test',
        //     s_email: 'test',
        //     s_unit: 'CJFK2',
        //     path: '/EOS/Operations/Counter/Queue',
        //     online: true,
        //     status: 'Active'
        // }, {
        //     displayName: 'busy',
        //     s_email: 'busy',
        //     s_unit: 'CJFK2',
        //     path: '/EOS/Operations/Managers/Import',
        //     online: true,
        //     status: 'Active'
        // }, {
        //     displayName: 'active',
        //     s_email: 'active',
        //     s_unit: 'CJFK2',
        //     path: '/EOS/Operations/Counter/Queue',
        //     online: true,
        //     status: 'Active'
        // });

        let 
            freeUsers: Array<IActiveUser> = [], 
            busyUsers: Array<IActiveUser> = [], 
            inactiveUsers: Array<IActiveUser> = [];

        freeUsers = filtered.filter((user: IActiveUser) => user.online && user.path.includes('/EOS/Operations/Counter/') && !processingAgentsMap[user.s_email]);
        busyUsers = filtered.filter((user: IActiveUser) => user.online && (!user.path.includes('/EOS/Operations/Counter/') || processingAgentsMap[user.s_email]));
        inactiveUsers = filtered.filter((user: IActiveUser) => !user.online);
        
        return [...freeUsers, ...busyUsers, ...inactiveUsers];
    }, [activeUsers, processingAgentsMap, s_unit]);

    return {
        sortedActiveUsers
    };
}