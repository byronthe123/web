import { useMemo } from "react";
import { IEmployee, IMap } from "../../globals/interfaces";

export default function useEmployeesMap (employees: Array<IEmployee>) {
    const employeesMap: IMap<boolean> = useMemo(() => {
        const map: IMap<boolean> = {};
        for (let i = 0; i < employees.length; i++) {
            map[employees[i].s_email] = true;
        }
        return map;
    }, [employees]);

    return employeesMap;
}