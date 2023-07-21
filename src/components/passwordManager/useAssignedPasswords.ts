import { useEffect, useState } from "react";
import { LocalTab } from "./PasswordForm";
import apiClient from "../../apiClient";
import { notify } from "../../utils";
import { IAssignedPassword } from "../../globals/interfaces";

export default function useAssignedPasswords (localActiveTab: LocalTab, passwordGuid: string | undefined) {
    const [assignedPasswords, setAssignedPasswords] = useState<Array<IAssignedPassword>>([]);
    const [queryComplete, setQueryComplete] = useState(false);
    
    useEffect(() => {
        const getAssigned = async () => {
            if (localActiveTab === 'ASSIGN' && !queryComplete && passwordGuid) {
                try {
                    const res = await apiClient.get(`/password/assigned/${passwordGuid}`);
                    setAssignedPasswords(res.data);
                    setQueryComplete(true);
                } catch (err) {
                    notify(JSON.stringify(err), 'error');
                }
            }
        }
        getAssigned();
    }, [passwordGuid, localActiveTab]);

    useEffect(() => {
        setQueryComplete(false);
    }, [passwordGuid]);

    return {
        assignedPasswords
    }
}