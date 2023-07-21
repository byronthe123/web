import { useEffect } from "react";
import { PushStep, QueueState } from "../../../globals/interfaces";

export default function useBalanceCheck (
    stepId: string,
    balanceDue: number,
    s_type: QueueState
) {
    return stepId !== '1' && balanceDue > 0 && s_type !== 'TRANSFER-IMPORT';
}