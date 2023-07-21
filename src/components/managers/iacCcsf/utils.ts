import * as yup from 'yup';

export const baseIacSchema = yup.object().shape({
    approval_number: yup.string().required(),
    indirect_carrier_name: yup.string().notRequired().nullable(),
    IACSSP_08_001: yup.string().required(),
    city: yup.string().notRequired().nullable(),
    state: yup.string().notRequired().nullable(),
    postal_code: yup.string().notRequired().nullable(),
    expiration_date: yup.date().required(),
    s_modified_by: yup.string().email().required(),
    t_modified: yup.date().required()
});

export const createIacSchema = baseIacSchema.shape({
    s_created_by: yup.string().email().required(),
    t_created: yup.date().required()
});

export const updateIacSchema = baseIacSchema.shape({
    id: yup.number().required()
});

export const baseCcsfSchema = yup.object().shape({
    approval_number: yup.string().required(),
    certified_cargo_screening_facility_name: yup.string().notRequired().nullable(),
    street_address: yup.string().notRequired().nullable(),
    city: yup.string().notRequired().nullable(),
    state: yup.string().notRequired().nullable(),
    ccsf_expiration_date: yup.date().required(),
    iac_number: yup.string().required(),
    s_modified_by: yup.string().email().required(),
    t_modified: yup.date().required()
});

export const createCcsfSchema = baseCcsfSchema.shape({
    s_created_by: yup.string().email().required(),
    t_created: yup.date().required()
});

export const updateCcsfSchema = baseCcsfSchema.shape({
    id: yup.number().required()
});
