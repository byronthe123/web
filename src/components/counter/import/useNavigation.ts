import { useCallback } from "react";
import moment from 'moment';
import { IStep } from '../../../globals/interfaces';

export default function useNavigation (
    locatedPieces: number,
    pieces: any,
    weight: any,
    lastArrivalDate: string,
    selectedAwbType: string,
    balanceDue: number,
    validIdentification: boolean,
    validFiles: boolean,
    overrideLocateAllByHouse: boolean,
    hold: boolean
) {

    const enableNavigation = useCallback((stepId: string) => {
        if (stepId === '1') {
            return true;
        } else if (stepId === '2') {    
            const validLocated = overrideLocateAllByHouse ? true : (locatedPieces >= pieces);
            const validPcsWeightFlightDate = 
                Number(pieces) > 0 && 
                Number(weight) > 0 && 
                moment(lastArrivalDate).isValid();

            if (selectedAwbType === 'TRANSFER-IMPORT') {
                return validPcsWeightFlightDate && validLocated && !hold;
            } else if (validPcsWeightFlightDate && (balanceDue <= 0) && validLocated && !hold) {
                return true;
            }
        } else if (stepId === '3') {
            console.log(validIdentification, validFiles);
            return (validIdentification && validFiles);
        }
    }, [
        locatedPieces,
        pieces,
        weight,
        lastArrivalDate,
        selectedAwbType,
        balanceDue,
        validIdentification,
        validFiles,
        overrideLocateAllByHouse,
        hold
    ]);

    const topNavClick = (stepItem: IStep, push: (stepId: string) => void) => {
        const stepId = stepItem.id;
        if (enableNavigation(stepId)) {
            push(stepId);
        }
    };

    return topNavClick;
}