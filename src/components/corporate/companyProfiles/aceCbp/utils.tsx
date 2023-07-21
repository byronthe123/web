import * as yup from 'yup';

export const createSchema = yup.object().shape({
    s_code: yup.string().required(),
    b_customs_hold: yup.boolean().nullable().notRequired(),
    b_general_order: yup.boolean().nullable().notRequired(),
    b_usda_hold: yup.boolean().nullable().notRequired(),
    b_hold: yup.boolean().nullable().notRequired(),
    s_description: yup.string().required(),
    s_reason: yup.string().required(),
    s_created_by: yup.string().email().required(),
    t_created: yup.date().required(),
    s_modified_by: yup.string().email().required(),
    t_modified: yup.date().required()
});

export const updateSchema = createSchema.shape({
    id: yup.number().required()
});

export const validateCreateCbpAceCode = async (data: any) => {


}