import * as yup from 'yup';

const dataSchema = yup.object().shape({
    id: yup.number().required(),
    s_status: yup.string().required(),
    d_switch: yup.date().required(),
    f_import_isc_cost: yup.number().required(),
    f_import_isc_cost_previous: yup.number().required(),
    f_import_per_kg: yup.number().required(),
    f_import_per_kg_previous: yup.number().required(),
    f_import_min_charge: yup.number().required(),
    f_import_min_charge_previous: yup.number().required(),
    s_firms_code: yup.string().required(),
    s_import_distribution_email: yup.string().notRequired(),
    i_import_sla_cao_breakdown_min: yup.number().notRequired(),
    i_import_sla_pax_breakdown_min: yup.number().notRequired(),
    i_export_sla_cao_cut_off_min: yup.number().notRequired(),
    i_export_sla_pax_cut_off_min: yup.number().notRequired(),
    i_export_sla_cao_uws_min: yup.number().notRequired(),
    i_export_pax_uws_min: yup.number().notRequired(),
    i_add_first_free_day: yup.number().required(),
    i_add_second_free_day: yup.number().required()
});

export default dataSchema;