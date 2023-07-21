import * as yup from 'yup';
import { validateAwb } from '../../../utils';

const otherSchema = yup.object().shape({
    username: yup.string().required('Required'),
    fwb: yup.object().notRequired(),
    fhl: yup.object().notRequired()
});

const baseSchema = yup.object().shape({
    s_awb: yup.string().required('Required').test('Validate AWB', 'AWB is invalid', (value: string) => validateAwb(value)),
    s_hawb: yup.string().notRequired().nullable(),
    f_amount: yup.number().min(0.01, 'Minimum 0.01').required('Required').typeError('Must be a number'),
    s_payment_type: yup.string().required('Required'),
    s_payment_method: yup.string().required('Required'),
    b_override_approved: yup.boolean().nullable().when('s_payment_method', {
        is: 'OVERRIDE',
        then: yup.boolean().required('Required')
    }),
    s_notes: yup.string().notRequired().nullable().when('s_payment_method', {
        is: 'OVERRIDE',
        then: yup.string().required('Required')
    }).when('s_payment_type', {
        is: 'STORAGE',
        then: yup.string().required('Required')
    }),
    s_status: yup.string().required('Required'),
    s_unit: yup.string().required('Required'),
    s_created_by: yup.string().email().required('Required'),
    t_created: yup.date().required('Required'),
    t_created_date: yup.date().required('Required'),
    s_modified_by: yup.string().email().required('Required'),
    t_modified: yup.date().required('Required'),
    other: otherSchema,
    counterMoney: yup.object().when('s_payment_method', {
        is: 'PAYMENT',
        then: yup.object().shape({
            s_mawb: yup.string().required('Required'),
            s_hawb: yup.string().notRequired(),
            s_unit: yup.string().required('Required'),
            s_type: yup.string().required('Required'),
            s_payment_reference: yup.string().notRequired().nullable().when('s_type', {
                is: 'CHECK',
                then: yup.string().required('Required')
            }),
            f_amount: yup.number().required('Required'),
            b_received: yup.boolean().required('Required'),
            s_status: yup.string().required('Required'),
            s_created_by: yup.string().email().required('Required'),
            t_created: yup.date().required('Required'),
            s_modified_by: yup.string().email().required('Required'),
            t_modified: yup.date().required('Required'),
            d_payment_date: yup.date().required()
        }),
        otherwise: yup.object().notRequired().nullable()
    }),
    counterFee: yup.object().when('s_payment_method', {
        is: 'PAYMENT',
        then: yup.object().shape({
            f_amount: yup.number().required(),
            s_payment_method: yup.string().required(),
            s_payment_type: yup.string().required()
        }),
        otherwise: yup.object().notRequired().nullable()
    })
});

export const createSchema = baseSchema.shape({
    s_created_by: yup.string().email().required('Required'),
    t_created: yup.date().required('Required'),
});

export const updateSchema = baseSchema.shape({
    i_id: yup.number().required('Required')
});

export const deletePaymentSchema = yup.object().shape({
    i_id: yup.number().required(),
    s_awb: yup.string().notRequired().nullable(),
    s_hawb: yup.string().notRequired().nullable(),
    f_amount: yup.number().required(),
    s_payment_type: yup.string().notRequired().nullable(),
    s_payment_method: yup.string().required(),
    s_notes: yup.string().notRequired().nullable(),
    s_modified_by: yup.string().required(),
    t_modified : yup.date().required(),
    s_unit: yup.string().required(),
    other: otherSchema,
});