import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
const guid1 = uuidv4();
const guid2 = uuidv4();

export const tutorialData = {
    "companiesList":[
        {
            "id":33333,
            "t_created": now,
            "s_created_by":"test@choice.aero",
            "t_modified":now,
            "s_modified_by":"test@choice.aero",
            "s_unit":"TEST",
            "s_transaction_id":guid1,
            "s_type":"IMPORT",
            "s_priority":"NORMAL",
            "s_state":"IMPORT",
            "s_status":"WAITING",
            "s_mawb":"00012345678",
            "s_mawb_id":uuidv4(),
            "s_airline":"AMERICAN",
            "s_airline_code":"001",
            "s_trucking_company":"TEST IMPORT",
            "s_trucking_driver":"JOHN SMITH",
            "s_trucking_cell":1123334444,
            "b_trucking_sms":false,
            "s_trucking_email":null,
            "s_trucking_language":"ENGLISH",
            "t_kiosk_start":now,
            "t_kiosk_submitted":now,
            "s_counter_ownership_agent":null,
            "t_counter_ownership":null,
            "t_counter_start":null,
            "t_counter_end":null,
            "s_abandoned_agent":null,
            "t_abandoned":null,
            "s_restored_agent":null,
            "t_restored":null,
            "s_restored_reason":null,
            "s_notes":null,
            "b_counter_reject":null,
            "s_counter_reject_agent":null,
            "t_counter_reject_time":null,
            "s_counter_reject_reason":null,
            "b_isc_paid":false,
            "s_hawb":null,
            "s_driver_photo_link":null,
            "exportCount":0,
            "importCount":1
        },
        {
            "id":33334,
            "t_created": now,
            "s_created_by":"test@choice.aero",
            "t_modified":now,
            "s_modified_by":"test@choice.aero",
            "s_unit":"TEST",
            "s_transaction_id":guid2,
            "s_type":"EXPORT",
            "s_priority":"NORMAL",
            "s_state":"EXPORT",
            "s_status":"WAITING",
            "s_mawb":"00098745632",
            "s_mawb_id":uuidv4(),
            "s_airline":"AMERICAN",
            "s_airline_code":"001",
            "s_trucking_company":"TEST EXPORT",
            "s_trucking_driver":"SMITH JOHN",
            "s_trucking_cell":1123334444,
            "b_trucking_sms":false,
            "s_trucking_email":null,
            "s_trucking_language":"ENGLISH",
            "t_kiosk_start":now,
            "t_kiosk_submitted":now,
            "s_counter_ownership_agent":null,
            "t_counter_ownership":null,
            "t_counter_start":null,
            "t_counter_end":null,
            "s_abandoned_agent":null,
            "t_abandoned":null,
            "s_restored_agent":null,
            "t_restored":null,
            "s_restored_reason":null,
            "s_notes":null,
            "b_counter_reject":null,
            "s_counter_reject_agent":null,
            "t_counter_reject_time":null,
            "s_counter_reject_reason":null,
            "b_isc_paid":false,
            "s_hawb":null,
            "s_driver_photo_link":null,
            "exportCount":0,
            "importCount":1
        }
    ],
    "items":[
        {
            "id":33333,
            "t_created": now,
            "s_created_by":"test@choice.aero",
            "t_modified":now,
            "s_modified_by":"test@choice.aero",
            "s_unit":"TEST",
            "s_transaction_id":guid1,
            "s_type":"IMPORT",
            "s_priority":"NORMAL",
            "s_state":"IMPORT",
            "s_status":"WAITING",
            "s_mawb":"00012345678",
            "s_mawb_id":uuidv4(),
            "s_airline":"AMERICAN",
            "s_airline_code":"001",
            "s_trucking_company":"TEST IMPORT",
            "s_trucking_driver":"JOHN SMITH",
            "s_trucking_cell":1123334444,
            "b_trucking_sms":false,
            "s_trucking_email":null,
            "s_trucking_language":"ENGLISH",
            "t_kiosk_start":now,
            "t_kiosk_submitted":now,
            "s_counter_ownership_agent":null,
            "t_counter_ownership":null,
            "t_counter_start":null,
            "t_counter_end":null,
            "s_abandoned_agent":null,
            "t_abandoned":null,
            "s_restored_agent":null,
            "t_restored":null,
            "s_restored_reason":null,
            "s_notes":null,
            "b_counter_reject":null,
            "s_counter_reject_agent":null,
            "t_counter_reject_time":null,
            "s_counter_reject_reason":null,
            "b_isc_paid":false,
            "s_hawb":null,
            "s_driver_photo_link":null,
            "exportCount":0,
            "importCount":1
        },
        {
            "id":33334,
            "t_created": now,
            "s_created_by":"test@choice.aero",
            "t_modified":now,
            "s_modified_by":"test@choice.aero",
            "s_unit":"TEST",
            "s_transaction_id":guid2,
            "s_type":"EXPORT",
            "s_priority":"NORMAL",
            "s_state":"EXPORT",
            "s_status":"WAITING",
            "s_mawb":"00098745632",
            "s_mawb_id":uuidv4(),
            "s_airline":"AMERICAN",
            "s_airline_code":"001",
            "s_trucking_company":"TEST EXPORT",
            "s_trucking_driver":"SMITH JOHN",
            "s_trucking_cell":1123334444,
            "b_trucking_sms":false,
            "s_trucking_email":null,
            "s_trucking_language":"ENGLISH",
            "t_kiosk_start":now,
            "t_kiosk_submitted":now,
            "s_counter_ownership_agent":null,
            "t_counter_ownership":null,
            "t_counter_start":null,
            "t_counter_end":null,
            "s_abandoned_agent":null,
            "t_abandoned":null,
            "s_restored_agent":null,
            "t_restored":null,
            "s_restored_reason":null,
            "s_notes":null,
            "b_counter_reject":null,
            "s_counter_reject_agent":null,
            "t_counter_reject_time":null,
            "s_counter_reject_reason":null,
            "b_isc_paid":false,
            "s_hawb":null,
            "s_driver_photo_link":null,
            "exportCount":0,
            "importCount":1
        }
    ]
}