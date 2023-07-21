import * as yup from 'yup';

export const baseSchema = yup.object().shape({
    version: yup.string().required(),
    date: yup.date().required(),
    type: yup.string().required(),
    title: yup.string().required(),
    detail: yup.string().notRequired().nullable(),
    url: yup.string().notRequired().nullable(),
    created: yup.date().required(),
    createdBy: yup.string().required(),
});

export const updateSchema = baseSchema.shape({
    id: yup.number().required()
});