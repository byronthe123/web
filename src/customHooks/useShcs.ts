import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import { ISpecialHandlingCode } from "../globals/interfaces";
import { api } from "../utils";

export default function useShcs () {
    const [shcs, setShcs] = useState<Array<ISpecialHandlingCode>>([]);

    useEffect(() => {
        const selectSpecialHandlingCodes = async () => {
            const { data } = await apiClient.get('specialHandlingCodes');
            setShcs(data);
        }
        selectSpecialHandlingCodes();
    }, []);

    return {
        shcs
    }
}