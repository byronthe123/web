import { useEffect, useState } from "react";
import { IPayment } from "../../../globals/interfaces";
import { Payment } from "./interfaces";

export default function useAltStorage (
    payments: Array<IPayment>
) {
    const [altStorage, setAltStorage] = useState(false);
    const [altStorageAmount, setAltStorageAmount] = useState(0);

    useEffect(() => {
        let override = false;
        for (let i = 0; i < payments.length; i++) {
            const current = payments[i];
            if ((current.selected && current.selected === true) && current.s_payment_type === 'STORAGE' && current.s_payment_method === 'CHARGE') {
                override = true;
                setAltStorageAmount(Math.abs(current.f_amount));
                break;
            }
        }
        setAltStorage(override);
    }, [payments]);

    return {
        altStorage,
        altStorageAmount
    }
}