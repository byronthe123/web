import { useMemo } from 'react';
import { IPayment } from "../../../globals/interfaces";

export default function usePostEntry (payments: Array<IPayment>) {
    const postEntry = useMemo(() => {
        const postEntryPayment = payments.find(p => p.s_payment_type === 'POST ENTRY');
        return postEntryPayment !== undefined;
    }, [payments]);

    return {
        postEntry
    };
}