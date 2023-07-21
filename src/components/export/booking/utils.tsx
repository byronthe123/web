import * as yup from 'yup';
import { validateAwb } from '../../../utils';

const baseBookingMawbSchema = yup.object().shape({
    s_mawb: yup.string().required().test('Validate AWB', 'AWB Must be valid', (value: string) => validateAwb(value)),
    s_origin: yup.string().required('Required').length(3, 'Must be 3 characters'),
    s_destination: yup.string().required('Required').length(3, 'Must be 3 characters'),
    s_nature_of_goods: yup.string().required('Required'),
    i_pieces: yup.number().required('Required').typeError('Number required'),
    f_weight: yup.number().required('Required').typeError('Number required'),
    f_volume: yup.number().required('Required').typeError('Number required'),
    s_shc: yup.string().notRequired().nullable(),
    s_carrier_agent: yup.string().notRequired().nullable(),
    s_carrier_iata: yup.string().notRequired().nullable(),
    s_carrier_account: yup.string().notRequired().nullable(),
    s_modified_by: yup.string().email().required(),
    t_modified: yup.date().required(),
});

export const createBookingMawbSchema = baseBookingMawbSchema.shape({
    s_created_by: yup.string().email().required(),
    t_created: yup.date().required()
});

export const updateBookingMawbSchema = baseBookingMawbSchema.shape({
    id: yup.number().required()
});


const baseBookingMawbPieceSchema = yup.object().shape({
    s_pieces_guid: yup.string().required(),
    i_pieces: yup.number('Numbers only').required('Required').typeError('Number required'),
    f_width: yup.number('Numbers only').required('Required').typeError('Number required'),
    f_length: yup.number('Numbers only').required('Required').typeError('Number required'),
    f_height: yup.number('Numbers only').required('Required').typeError('Number required'),
    f_weight: yup.number('Numbers only').required('Required').typeError('Number required'),
    f_chargable_weight: yup.number().notRequired().nullable(),
    s_shc: yup.string().notRequired().nullable(),
    i_booking_mawb_id: yup.number().required(),
    s_piece_remark: yup.string().notRequired().nullable(),
    s_created_by: yup.string().email().required(),
    t_created: yup.date().required(),
    s_modified_by: yup.string().email().required(),
    t_modified: yup.date().required(),
    s_status: yup.string().required()
});

export const createBookingMawbPieceSchema = baseBookingMawbPieceSchema.shape({
    s_created_by: yup.string().email().required(),
    t_created: yup.date().required()
});

export const updateBookingMawbPieceSchema = baseBookingMawbPieceSchema.shape({
    id: yup.number().required()
});

const bookingBaseSchema = yup.object().shape({
    i_flight_id: yup.number().required(),
    s_mawb: yup.string().required().test('Validate AWB', 'AWB Must be valid', (value: string) => validateAwb(value)),
    i_pieces: yup.number().required('Required').typeError('Number required'),
    f_weight: yup.number().required('Required').typeError('Number required'),
    f_cw: yup.number().notRequired().nullable(),
    f_volume: yup.number().notRequired().nullable(),
    s_shc: yup.string().notRequired().nullable(),
    s_modified_by: yup.string().email().required(),
    t_modified: yup.date().required(),
    s_status: yup.string().required(),
    s_remarks: yup.string().notRequired().nullable()
});

export const createBookingSchema = bookingBaseSchema.shape({
    s_created_by: yup.string().email().required(),
    t_created: yup.date().required(),
});

export const updateBookingSchema = bookingBaseSchema.shape({
    id: yup.number().required()
});