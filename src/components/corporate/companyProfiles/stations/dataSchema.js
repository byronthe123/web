import * as yup from 'yup';

const dataSchema = yup.object().shape({
    s_unit: yup.string().required(),
    s_address: yup.string().required(),
    s_phone: yup.string().required(),
    s_firms_code: yup.string().required(),
    s_weekday_hours: yup.string().required(),
    s_weekend_hours: yup.string().required(),
    s_airport: yup.string().required(),
    s_airport_code: yup.string().notRequired(),
    f_import_isc_cost: yup.number().required(),
    f_import_per_kg: yup.number().required(),
    f_import_min_charge: yup.number().required(),
    i_add_first_free_day: yup.number().required(),
    i_add_second_free_day: yup.number().required(),
    s_map_link: yup.string().notRequired().nullable()
});

export default dataSchema;