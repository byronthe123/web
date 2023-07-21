import * as yup from 'yup';

const baseSchema = yup.object().shape({
    s_special_handling_code: yup.string().length(3, 'Must be 3 characters').required('Required field'),
    s_modified_by: yup.string().email().required(),
    t_modified: yup.date().required()
});

export const createSchema = baseSchema.shape({
    s_created_by: yup.string().email().required(),
    t_created: yup.date().required()
});

export const updateSchema = baseSchema.shape({
    id: yup.number().required()
});
