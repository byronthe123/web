import * as yup from 'yup';

const base = yup.object().shape({
    i_corp_station_id: yup.number().typeError('Unit is required').required('Required'),
    s_name: yup.string().required('Required'),
    f_multiplier: yup.number().typeError('Must be a number').required('Required'),
    s_uom: yup.string().required('Required').typeError('Required'),
    s_modified_by: yup.string().email().required(),
    t_modified: yup.date().required()
});

export const createSchema = base.shape({
    s_created_by: yup.string().email().required(),
    t_created: yup.date().required()
});

export const updateSchema = base.shape({
    id: yup.number().required()
});