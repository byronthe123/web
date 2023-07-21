import * as yup from 'yup';

import { validateSchema } from '../../../../utils';

const createFsnLocationSchema = yup.object().shape({
    s_code: yup.string().required(),
    i_airline_mapping_detail_id: yup.string().required(),
    s_status: yup.string().required().notOneOf(['TERMINATED', 'INACTIVE']),
    s_created_by: yup.string().email().required(),
    t_created: yup.date().required(),
    s_modified_by: yup.string().email().required(),
    t_modified: yup.date().required()
});

const updateFsnLocationSchema = yup.object().shape({
    id: yup.number().required(),
    s_code: yup.string().required(),
    i_airline_mapping_detail_id: yup.string().required(),
    s_status: yup.string().required().notOneOf(['TERMINATED', 'INACTIVE']),
    s_modified_by: yup.string().email().required(),
    t_modified: yup.date().required()
});

export const validateData = async (update: boolean, data: any) => {
    const useSchema = update ? updateFsnLocationSchema : createFsnLocationSchema;
    return await validateSchema(useSchema, data);
}