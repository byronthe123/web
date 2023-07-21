import { IPayment } from "../../../globals/interfaces";

export type PaymentMethod = 'CHARGE' | 'PAYMENT' | 'OVERRIDE';

export interface Totals {
    paid: number;
    charged: number;
    due: number;
    overrides: number;
    counterFee: number;
}

export type DeletePayment = (selectedPayment: IPayment) => Promise<boolean>;