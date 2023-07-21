import * as yup from 'yup';

export const validateManualEntryBase = async (data) => {
    const dataSchema = yup.object().shape({
        s_mawb: yup.string().required().length(11),
        i_pieces_total: yup.number().required(),
        s_pieces_type: yup.string().required(),
        f_weight: yup.number().required(),
        s_commodity: yup.string().required(),
        s_special_handling_code: yup.string().required(),
        s_volume: yup.number().required(),
        s_origin: yup.string().required(),
        s_destination: yup.string().required(),
        d_arrival_date: yup.date().required(),
        s_pol: yup.string().required(),
        s_pou: yup.string().required(),
        i_actual_piece_count: yup.number().required(),
        d_storage_first_free: yup.date().required(),
        d_storage_second_free: yup.date().required(),
        d_storage_start: yup.date().required(),
        i_total_consignment_pieces: yup.number().required(),
        i_arrived_date: yup.number().required(),
        i_arrived_week: yup.number().required(),
        i_arrived_year: yup.number().required(),
        i_message_sequence: yup.number().required(),
        b_message_complete: yup.boolean().required(),
        b_has_continuation: yup.boolean().required(),
        i_unique: yup.number().required(),
        s_airline_code: yup.string().required().notRequired(),
        s_arrived_month: yup.string().required(),
        s_arrived_weekday: yup.string().required(),
        s_created_by: yup.string().required(),
        s_flight_id: yup.string().notRequired().nullable(),
        s_flight_number: yup.string().required(),
        s_flight_serial: yup.string().required(),
        s_message_type: yup.string().required(),
        s_modified_by: yup.string().required(),
        s_status: yup.string().required(),
        s_uld: yup.string().required(),
        s_uld_code: yup.string().required(),
        s_uld_number: yup.string().required(),
        s_uld_type: yup.string().required(),
        s_volume_unit: yup.string().required(),
        t_created: yup.date().required(),
        t_modified: yup.date().required()
    });

    let validData = false;

    try {
        await dataSchema.validate(data);
        validData = true;
    } catch (err) {
        alert(err);
    }

    return validData;
};
