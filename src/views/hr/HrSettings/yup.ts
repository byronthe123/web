import * as yup from 'yup';

export const createHrFileSchema = yup.object().shape({
    name: yup.string().required(),
    expires: yup.boolean().required(),
    expirationReminder: yup.number().when('expires', {
        is: true,
        then: yup.number().required()
    }),
    category: yup.string().required(),
    createdBy: yup.string().required(),
    created: yup.date().required(),
});

export const updateHrFileSchema = yup.object().shape({
    id: yup.number().required(),
    modifiedBy: yup.string().required(),
    modified: yup.date().required(),
});