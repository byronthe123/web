import * as yup from 'yup';

const base = yup.object().shape({
    code: yup.string().required(),
    icao: yup.string().required(),
    name: yup.string().required(),
    countryCode: yup.string().notRequired().nullable(),
    country: yup.string().notRequired().nullable(),
    cityCode: yup.string().notRequired().nullable(),
    city: yup.string().notRequired().nullable(),
    modifiedBy: yup.string().email().required(),
    modifiedAt: yup.date().required()
});

export const createSchema = base.shape({
    createdBy: yup.string().email().required(),
    createdAt: yup.date().required()
});

export const updateSchema = base.shape({
    id: yup.number().required()
});