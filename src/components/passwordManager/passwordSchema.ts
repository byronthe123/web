import * as yup from 'yup';

export const createPasswordSchema = yup.object().shape({
    userId: yup.string().required(),
    name: yup.string().required(),
    username: yup.string().notRequired().nullable(),
    password: yup.string().required(),
    link: yup.string().url().notRequired().nullable(),
    notes: yup.string().notRequired().nullable(),
    created: yup.date().required(),
    createdBy: yup.string().required(),
    modified: yup.date().required(),
    modifiedBy: yup.string().required(),
});

export const updatePasswordSchema = createPasswordSchema.shape({
    id: yup.number().required()
});
