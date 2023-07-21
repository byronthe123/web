import { useEffect, useState } from "react";
import { IAssignedPassword, IUser } from "../../globals/interfaces";
import _ from "lodash";

export interface IUserAssignedPassword extends IUser {
    assignedPassword: boolean;
}

export type UserAssignedMap = Record<string, boolean>;

export default function useUserAssignedPasswords (assignedPasswords: Array<IAssignedPassword>, users: Array<IUser>) {

    const [userAssignedMap, setUserAssignedMap] = useState<UserAssignedMap>({}); 
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const map: UserAssignedMap = {};
        for (const { email } of assignedPasswords) {
            map[email] = true;
        }

        const selectedIds: Set<string> = new Set();
        for (const user of users) {
            if (map[user.s_email]) {
                selectedIds.add(String(user.id));
            }
        }

        setSelectedIds(selectedIds);
    }, [assignedPasswords, users]);

    const handleSelectUser = (user: IUser) => {
        const { s_email, id } = user;
        const useId = String(id);
        setUserAssignedMap(prev => {
            const copy = _.cloneDeep(prev);
            if (selectedIds.has(useId)) {
                copy[s_email] = false;
            } else {
                copy[s_email] = true;
            }
            return copy;
        });
        setSelectedIds(prev => {
            const copy = _.cloneDeep(prev);
            if (copy.has(useId)) {
                copy.delete(useId);
            } else {
                copy.add(useId);
            }
            return copy;
        });
    }

    return {
        userAssignedMap,
        selectedIds,
        handleSelectUser
    }
}