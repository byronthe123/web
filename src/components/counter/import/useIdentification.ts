import { useEffect, useMemo } from 'react';
import _ from 'lodash';
import { IMap } from '../../../globals/interfaces';
import { File } from './interfaces';

const identificationFields = ['s_driver_name', 's_driver_id_type', 't_driver_id_expiration', 's_driver_id_number', 'b_driver_id_match_photo'];

export default function useIdentification (
    s_transaction_id: string, 
    s_trucking_driver: string,
    values: IMap<any>,
    setFieldValue: (fieldName: string, value: any) => void,
    formFields: IMap<any>,
    modelId: string,
    refresh: boolean
) {

    useEffect(() => {
        if (s_transaction_id) {
            const storageTranscation = (localStorage.getItem('s_transaction_id') || '').toString();
            if (storageTranscation !== s_transaction_id) {
                localStorage.setItem('s_transaction_id', s_transaction_id);
                removeIdentificationInfo();
                setFieldValue('s_driver_name', s_trucking_driver);
                setFieldValue('b_driver_id_match_photo', false);
            } else {
                for (let i = 0; i < identificationFields.length; i++) {
                    const key = identificationFields[i];
                    if (localStorage.getItem(key)) {
                        const val = (localStorage.getItem(key) || '').toString();
                        if (key === 'b_driver_id_match_photo') {
                            setFieldValue(key, val === 'true' ? true : false);
                        } else {
                            setFieldValue(key, val);
                        }
                    } else {
                        if (key === 's_driver_name') {
                            setFieldValue('s_driver_name', s_trucking_driver);
                        } else if (key === 'b_driver_id_match_photo') {
                            setFieldValue('b_driver_id_match_photo', false);
                        } else {
                            setFieldValue(key, '');
                        }
                    }
                }
            }
        }
    }, [s_transaction_id, s_trucking_driver, refresh]);

    const saveIdentificationInformation = () => {
        for (let i = 0; i < identificationFields.length; i++) {
            const key = identificationFields[i];
            localStorage.setItem(key, values[key]);
        }
    } 

    const clearIdentification = () => {
        identificationFields.map(key => {
            setFieldValue(key, '');
            localStorage.removeItem(key);
        });
    }
    
    const removeIdentificationInfo = (file?: File) => {
        // @ts-ignore
        if (file !== undefined && _.get(file, 's_file_type', '') === 'IDENTIFICATION') {
            clearIdentification();
        }
    };

    const validIdentification = useMemo(() => {
        const checkValues = ['s_driver_name', 's_driver_id_type', 't_driver_id_expiration', 's_driver_id_number', 'b_driver_id_match_photo'];
        for (let i = 0; i < checkValues.length; i++) {
            const key = checkValues[i];
            if (!values[key] || values[key].length < 1) {
                console.log(key, values[key]);
                return false;
            }
        }
        if (modelId.length > 0) {
            for (let key in formFields) {
                if (!formFields[key].confirmed) {
                    console.log(key, formFields[key]);
                    return false;
                }
            }
        }
        return true;
    }, [values, formFields, modelId]);

    return {
        saveIdentificationInformation,
        validIdentification,
        removeIdentificationInfo
    }

}