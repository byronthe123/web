import * as yup from 'yup';
import { IMap } from '../../../globals/interfaces';
import { validateSchema } from '../../../utils';

export const validateSplitLocation = async (data: IMap<any>) => {
    const dataSchema = yup.object().shape({
        i_remaining_pieces: yup.number().required().min(1),
        i_delivered_pieces: yup.number().required().min(2),
        s_modified_by: yup.string().required(),
        t_modified: yup.date().required(),
        s_mawb: yup.string().required(),
        id: yup.number().required(),
        s_delivered_transaction_id: yup.string().required()
    });

    let validData = false;

    try {
        await dataSchema.validate(data);
        validData = true;
    } catch (err) {
        alert(err);
    }

    return validData;
};

export const validateDeliverRackPieces = async (data: IMap<any>) => {
    const dataSchema = yup.object().shape({
        id: yup.number().required(),
        s_modified_by: yup.string().required(),
        t_modified: yup.date().required(),
        s_platform: yup.string().required(),
        s_status: yup.string().required(),
        t_delivered: yup.date().required(),
        s_delivered_by: yup.string().required(),
        b_delivered: yup.boolean().required(),
        s_delivered_agent: yup.string().required(),
        s_delivered_transaction_id: yup.string().notRequired().nullable().when('b_delivered', { is: true, then: yup.string().required() }),
    });

    let validData = false;

    try {
        await dataSchema.validate(data);
        validData = true;
    } catch (err) {
        alert(err);
    }

    return validData;
};

export const validateRejectDockAwb = async (data: IMap<any>) => {
    const dataSchema = yup.object().shape({
        s_transaction_id: yup.string().required(),
        s_mawb_id: yup
            .string()
            .notRequired()
            .when('rejectType', { is: 'AWB', then: yup.string().required() }),
        s_modified_by: yup.string().required(),
        t_modified: yup.date().required(),
        s_status: yup.string().required(),
        s_dock_reject_reason: yup.string().required(),
        s_unit: yup.string().required(),
        rejectType: yup
            .string()
            .required()
            .test('rejectType', 'Must be AWB or COMPANY', (value: string) =>
                ['AWB', 'COMPANY'].includes(value)
            ),
    });

    return await validateSchema(dataSchema, data);
};

export const validateFinishDocking = async (data: IMap<any>) => {
    const dataSchema = yup.object().shape({
        file: yup.object().shape({
            type: yup.string().required(),
            base64: yup.string().required(),
        }),
        s_transaction_id: yup.string().required(),
        s_modified_by: yup.string().required(),
        t_modified: yup.string().required(),
        s_unit: yup.string().required(),
        s_dock_door_guid: yup.string().required(),
        awbs: yup
            .array()
            .required()
            .of(
                yup.object().shape({
                    s_mawb_id: yup.string().required(),
                    s_type: yup.string().required(),
                    i_pcs_delivered: yup.number().required(),
                })
            ),
    });

    console.log(data);

    return await validateSchema(dataSchema, data);
};
