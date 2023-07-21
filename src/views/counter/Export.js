import React, { useState, useEffect, useContext, useMemo  } from 'react';
import { AppContext } from '../../context/index';
import {withRouter, useHistory} from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import moment from 'moment';
import { Button, Row, Col  } from "reactstrap";
import { Formik } from 'formik';
import { asyncHandler, api, formatDatetime, formatEmail } from '../../utils';
import { Wizard, Steps, Step } from 'react-albus';
import TopNavigation from '../../components/wizard-hooks/TopNavigation';
import BottomNavigation from '../../components/wizard-hooks/BottomNavigation';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import AppLayout from '../../components/AppLayout';
import { exportTypes } from '../../components/counter/fileTypes';
import mapping from '../../components/counter/export/mapping';
import IdentificationAndDocuments from '../../components/counter/export/IdentificationAndDocuments';
import ModalReject from '../../components/counter/import/ModalReject'; 
import ModalCreateAwb from '../../components/counter/import/ModalCreateAwb'; 
import ConfirmAndProcess from '../../components/counter/export/ConfirmAndProcess';
import CreateAcceptanceSheet from '../../components/counter/export/CreateAcceptanceSheet';
import SelectAwbSlideShow from '../../components/counter/import/SelectAwbSlideShow';
import ModalLoading from '../../components/custom/ModalLoading';
import TsaCheck from '../../components/counter/export/TsaCheck';
import useAirportCodes from '../../customHooks/useAirportCodesMap';
import useAirportCodesMap from '../../customHooks/useAirportCodesMap';
import useShcs from '../../customHooks/useShcs';
import apiClient from '../../apiClient';

const ExportMain = ({
    values, 
    setFieldValue,
    resetForm,
    user, 
    baseApiUrl, 
    headerAuthCode, 
    launchModalChangeLocation, 
    displaySubmenu, 
    handleDisplaySubmenu, 
    eightyWindow, 
    mobile,
    width, 
    createSuccessNotification,
    authButtonMethod,
    isAuthenticated
}) => {

    const { counter, appData } = useContext(AppContext);
    const { shcs } = appData;
    const { counterFiles, addCounterFile, removeCounterFile, clearCounterFiles } = counter;
    const history = useHistory();
    const [myExportAwbs, setMyExportAwbs] = useState([]);
    const [selectedAwb, setSelectedAwb] = useState({});
    const [shipperType, setShipperType] = useState('');
    const [refreshIndex, setRefreshIndex] = useState(0);
    const [alreadyProcessedAwb, setAlreadyProcessedAwb] = useState(false);
    const [processedNotice, setProcessedNotice] = useState('');
    const [airportCodes, setAirportCodes] = useState([]);
    const { airportCodesMap } = useAirportCodesMap(airportCodes);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);

    useEffect(() => {
        const checkProcessedExportAwb = async () => {
            const res = await api('get', `checkProcessedExportAwb/${selectedAwb.s_mawb}`);
            if (res.data && Object.keys(res.data).length > 0) {
                setAlreadyProcessedAwb(true);
                const { s_modified_by, t_modified, s_status } = res.data;
                const notice = `This AWB has already a status of ${s_status} and was last modified by ${formatEmail(s_modified_by)} at  ${formatDatetime(t_modified)}. It cannot be processed.`;
                setProcessedNotice(notice);
                alert(notice);
            } else {
                setAlreadyProcessedAwb(false);
                setProcessedNotice('');
            }
        }
        checkProcessedExportAwb();
    }, [selectedAwb.s_mawb]);
    
    const refresh = () => setRefreshIndex(refreshIndex + 1);
    
    const myAwbsQuery = asyncHandler(async() => {
        resetForm();

        const s_counter_ownership_agent = user.s_email;
        const s_unit = user.s_unit;

        const res = await api('post', 'agentAwbs', {
            s_counter_ownership_agent,
            s_unit,
            s_type: 'EXPORT'
        });

        const myExportAwbs = res.data.filter(d => d.s_type === 'EXPORT' || d.s_type === 'TRANSFER-EXPORT');

        if(myExportAwbs.length < 1) {
            history.push('/EOS/Operations/Counter/Queue');
        } else {

            if (history.location.search && history.location.search.length > 0) {
                const s_mawb = history.location.search.split('=')[1];
                const index = myExportAwbs.findIndex(a => a.s_mawb === s_mawb);
                myExportAwbs.unshift(myExportAwbs.splice(index, 1)[0]);
            }

            setMyExportAwbs(myExportAwbs);
            setSelectedAwb(myExportAwbs[0]);
            setFieldValue('s_company', myExportAwbs[0].s_trucking_company);
        }
    });


    useEffect(() => {
        const airportsQuery = async () => {
            const res = await api('get', '/airport/codes');
            setAirportCodes(res.data);
        }
    
        airportsQuery();
    }, []);

    useEffect(() => {
        if (user.s_unit) {
            myAwbsQuery();
        }
    }, [user.s_unit, refreshIndex]);

    useEffect(() => {
        if (selectedAwb) {
            setFieldValue('t_counter_start_time', moment().local().format('MM/DD/YYYY HH:mm:ss'));
        }
    }, [selectedAwb]);

    const handleSelectAwb = (awb) => {
        setSelectedAwb(awb);
    }

    // Step 2: Check Identification Documents:

    const identificationFields1 = ['s_company_driver_name', 's_company_driver_id_type_1', 's_company_driver_id_num_1', 'd_company_driver_id_expiration_1', 'b_company_driver_photo_match_1'];
    const identificationFields2 = ['s_company_driver_name', 's_company_driver_id_type_2', 's_company_driver_id_num_2', 'd_company_driver_id_expiration_2', 'b_company_driver_photo_match_2'];

    const [fileTypes, setFileTypes] = useState(exportTypes);

    const [files, setFiles] = useState([]);
    const [selectedFileType, setSelectedFileType] = useState();
    const [modelId, setModelId] = useState('');

    useEffect(() => {
        if (selectedAwb.s_transaction_id) {
            const { s_transaction_id } = selectedAwb;
            const storageTranscation = localStorage.getItem('s_transaction_id') && localStorage.getItem('s_transaction_id').toString() || '';
            const idFile = files.find(f => f.fileType === 'IDENTIFICATION1');
            if (storageTranscation !== s_transaction_id || !idFile || idFile === undefined) {
                setFiles([]);
                setFileTypes(null);
                const copy = Object.assign({}, exportTypes);

                for (let key in copy) {
                    copy[key].uploaded = false;
                }
                setFileTypes(copy);
                clearCounterFiles();
                localStorage.setItem('s_transaction_id', s_transaction_id);
                removeIdentificationInfo();
                setFieldValue('s_company_driver_name', selectedAwb.s_trucking_driver);
                setFieldValue('b_company_driver_photo_match_1', false);
                setFieldValue('b_company_driver_photo_match_2', false);
            } else {

                const loopIdentificationFields = (identificationArray) => {
                    for (let i = 0; i < identificationArray.length; i++) {
                        const key = identificationArray[i];
                        if (localStorage.getItem(key)) {
                            if (key === 'b_company_driver_photo_match_1' || key === 'b_company_driver_photo_match_2') {
                                setFieldValue(key, localStorage.getItem(key).toString() === 'true' ? true : false);
                            } else {
                                setFieldValue(key, localStorage.getItem(key).toString());
                            }
                        } else {
                            if (key === 's_company_driver_name') {
                                setFieldValue('s_company_driver_name', selectedAwb.s_trucking_driver);
                            } else if (key === 'b_company_driver_photo_match_1') {
                                setFieldValue('b_company_driver_photo_match_1', false);
                            } else if (key === 'b_company_driver_photo_match_2') {
                                setFieldValue('b_company_driver_photo_match_2', false);
                            } else {
                                setFieldValue(key, '');
                            }
                        }
                    }
                }

                loopIdentificationFields(identificationFields1);
                loopIdentificationFields(identificationFields2);

                if (storageTranscation === s_transaction_id) {
                    if (counterFiles.length > 0) {
                        for (let i = 0; i < counterFiles.length; i++) {
                            const current = counterFiles[i];
                            const exists = files.find(f => f.guid === current.guid);
                            if (!exists) {
                                addToFiles(counterFiles[i]);
                            }
                        }
                    }
                }
            }
        }
    }, [selectedAwb]);

    const saveIdentificationInformation = (useFileType) => {
        // console.log(useFileType);
        const identificationFields = useFileType === 'IDENTIFICATION1' ? identificationFields1 : identificationFields2;
        for (let i = 0; i < identificationFields.length; i++) {
            // console.log(identificationFields[i]);
            const key = identificationFields[i];
            localStorage.setItem(key, values[key]);
        }
    } 
    
    const removeIdentificationInfo = () => {
        identificationFields1.map(key => {
            localStorage.removeItem(key);
            setFieldValue(key, '');
        });
        identificationFields2.map(key => {
            setFieldValue(key, '');
            localStorage.removeItem(key);
        });
    }

    const addToFiles = (file, fileType) => {
        if (file && file.fileType) {
            const copy = _.cloneDeep(files);
            const findExistingIndex = copy.findIndex(existingFile => existingFile.guid === file.guid);
            if (findExistingIndex !== -1) {
                return;
            }
            
            file.guid = uuidv4();
            copy.push(file);
            setFiles(copy);
        
            if (file.fileType === 'IDENTIFICATION1' || file.fileType === 'IDENTIFICATION2') {
                addCounterFile(file);
            }

            if (fileTypes[file.fileType]) {
                fileTypes[file.fileType].uploaded = true;
            }

        } else {
            fileTypes[fileType].uploaded = true;
        }
    }

    const removeFile = (file) => {
        const filtered = files.filter(f => f.guid !== file.guid);
        setFiles(filtered);
        if (file.fileType === 'IDENTIFICATION1' || file.fileType === 'IDENTIFICATION2') {
            removeCounterFile(file);
            removeIdentificationInfo(); // Assumes that ID docs are linked to the ID info.
        }
        fileTypes[file.fileType].uploaded = false;
    }

    const [file, setFile] = useState({});

    const updateFile = (prop, value) => {
        const copy = Object.assign({}, file);
        copy[prop] = value;
        setFile(copy);
    }

    const checkIdentification = (useFileType) => {
        if (useFileType === 'IDENTIFICATION1') {
            const fields = Object.assign([], identificationFields1);
            for (let i = 0; i < fields.length; i++) {
                const key = fields[i];
                if (!values[key] || values[key].length < 1) {
                    // console.log(`${key} = ${values[key]}`);
                    return false;
                }
            }
        } else if (useFileType === 'IDENTIFICATION2') {
            for (let i = 0; i < identificationFields2.length; i++) {
                const key = identificationFields2[i];
                if (!values[key] || values[key].length < 1) {
                    // console.log(`${key} = ${values[key]}`)
                    return false;
                }
            }
        }

        /* 
            This logic can be changed to match the Import confirmFields logic
            which adds the confirmation buttons even if a blank value is returned.
            This logic along with the additional logic in the ConfirmField component
            only shows and checks the confirmField value if a value is returned from the
            formRecognize process.
        */

        if (modelId.length > 0) {
            for (let key in formFields) {
                if (!formFields[key].confirmed) {
                    return false;
                }
            }
        }
        return true;
    }

    // const checkAwbData = () => {
    //     const checkFields = ['s_mawb', 's_origin', 's_destination', 'i_pieces', 'i_weight', 's_commodity', 's_flight_number', 't_depart_date', 's_transport_type'];
    
    //     // Check if s_mawb fields are not equal
    //     if (values.s_mawb !== selectedAwb.s_mawb) {
    //         return false;
    //     }
    
    //     // Check if any of the checkFields are empty, undefined or not confirmed
    //     const isInvalid = checkFields.some((field) => {
    //         const formField = formFields[field];
    //         const isFieldEmpty = !values[field] || values[field].length === 0;
    //         const isFormFieldInvalid = formField && formField.value && !formField.confirmed;
    //         return isFieldEmpty || isFormFieldInvalid;
    //     });
    
    //     if (isInvalid) {
    //         return false;
    //     }
    
    //     // Check if airport codes exist and booking is confirmed
    //     return airportCodesMap[values.s_origin] && airportCodesMap[values.s_port_of_unlading] && airportCodesMap[values.s_destination] && bookingConfirmed;
    // };

    const checkAwbData = () => {
        const checkFields = ['s_mawb', 's_origin', 's_destination', 'i_pieces', 'i_weight', 's_commodity', 't_depart_date', 's_transport_type'];
    
        // Check if s_mawb fields are not equal
        if (values.s_mawb !== selectedAwb.s_mawb) {
            console.log('s_mawb values are not equal');
            return false;
        }
    
        // Check if any of the checkFields are empty, undefined or not confirmed
        const isInvalid = checkFields.some((field) => {
            const formField = formFields[field];
            const isFieldEmpty = !values[field] || values[field].length === 0;
            const isFormFieldInvalid = formField && formField.value && !formField.confirmed;
    
            if (isFieldEmpty) {
                console.log(`Field "${field}" is empty or undefined in 'values'`);
            }
            if (isFormFieldInvalid) {
                console.log(`Field "${field}" in 'formFields' is not confirmed or its value is undefined`);
            }
    
            return isFieldEmpty || isFormFieldInvalid;
        });
    
        if (isInvalid) {
            return false;
        }
    
        if (!(airportCodesMap[values.s_origin] && airportCodesMap[values.s_port_of_unlading] && airportCodesMap[values.s_destination])) {
            console.log('One or more of the airport codes are not in the map');
        }
        
        if (!bookingConfirmed) {
            console.log('Booking is not confirmed');
        }
    
        // Check if airport codes exist and booking is confirmed
        return airportCodesMap[values.s_origin] && airportCodesMap[values.s_port_of_unlading] && airportCodesMap[values.s_destination] && bookingConfirmed;
    };

    const openAcceptanceSheet = (acceptanceSheet) => {
        const myWindow = window.open("", "MsgWindow", "width=1920,height=1080");
        if (myWindow && myWindow.document) {
            myWindow.document.write(acceptanceSheet);
        }
    }

    const [modalLoading, setModalLoading] = useState(false);

    const shcsDgMap = useMemo(() => {
        const map = {};
        for (const shc of shcs) {
            map[shc.s_special_handling_code] = shc.b_dg;
        }
        return map;
    }, [shcs]);
    const getAirline = async (s_airline_code) => {
        const res = await apiClient.get(`/airline/${s_airline_code}`);
        if (res.status === 200) {
            return res.data;
        }
    }

    // Final Submit:
    const createExportItem = asyncHandler(async(reject, push) => {
        alert(selectedAwb.s_airline_code);

        setModalLoading(true);

        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        const email = user.s_email;

        if (!values.t_counter_start_time) {
            values.t_counter_start_time = now;
        }

        const exportData = values;
        const queueData = {
            id: selectedAwb.id,
            t_counter_start: values.t_counter_start_time || now,
            t_counter_end: now,
            s_type: selectedAwb.s_type,
            s_counter_ownership_agent: email,
            s_transaction_id: selectedAwb.s_transaction_id,
            s_modified_by: email,
            t_modified: now
        };

        exportData.s_unit = user.s_unit;
        exportData.s_awb_type = 'EXPORT';
        exportData.s_mawb = selectedAwb.s_mawb;
        exportData.s_priority = 'NORMAL';
        exportData.s_airline = selectedAwb.s_airline;
        exportData.s_airline_code = selectedAwb.s_airline_code;
        exportData.s_language = selectedAwb.s_trucking_language;
        exportData.b_sms_enabled = selectedAwb.b_trucking_sms;
        exportData.s_sms = selectedAwb.s_trucking_cell;

        if (reject) {
            exportData.s_status = 'REJECTED';
            exportData.b_counter_reject = true;
            exportData.s_counter_reject_agent = email;
            exportData.t_counter_reject_time = now;

            // queue data:
            queueData.s_status = 'REJECTED';
            queueData.b_counter_reject = true;
            queueData.s_counter_reject_agent = email;
            queueData.t_counter_reject_time = now;
            queueData.s_counter_reject_reason = values.s_counter_reject_reason;
        } else {
            exportData.s_status = 'DOCUMENTED';
            exportData.b_counter_reject = false;
            exportData.s_counter_reject_agent = null;
            exportData.t_counter_reject_time = null;

            //Queue: 
            queueData.s_status = 'PROCESSED';
            queueData.b_counter_reject = false;
        }

        exportData.s_kiosk_submitted_agent = selectedAwb.s_counter_ownership_agent;
        exportData.t_kiosk_submitteddatetime = selectedAwb.t_kiosk_submitted;
        exportData.s_counter_assigned_agent = selectedAwb.s_counter_ownership_agent;
        exportData.t_counter_assigned_start = selectedAwb.t_counter_ownership;
        exportData.s_counter_by = email;
        exportData.t_counter_endtime = now;
        exportData.t_created = now;
        exportData.s_created_by = email;
        exportData.t_modified = now;
        exportData.s_modified_by = email;
        exportData.s_transaction_id = selectedAwb.s_transaction_id;
        exportData.s_mawb_id = selectedAwb.s_mawb_id;

        const airline = await getAirline(selectedAwb.s_airline_code);

        const acceptanceSheet = renderToString(
            <CreateAcceptanceSheet
                b_dg={values.b_dg}
                b_screened={values.b_screened}
                s_mawb={values.s_mawb}
                i_pieces={values.i_pieces}
                i_weight={values.i_weight}
                s_transport_type={values.s_transport_type}
                s_airline_code={values.s_airline_code}
                s_flight_number={values.s_flight_number}
                s_airline={values.s_airline}
                t_depart_date={values.t_depart_date}
                s_origin={values.s_origin}
                s_destination={values.s_destination}
                s_port_of_unlading={values.s_port_of_unlading}
                s_commodity={values.s_commodity}
                s_iac={values.s_iac}
                s_ccsf={values.s_ccsf}
                s_shc1={values.s_shc1}
                s_shc2={values.s_shc2}
                s_shc3={values.s_shc3}
                s_shc4={values.s_shc4}
                s_shc5={values.s_shc5}
                s_company_driver_name={values.s_company_driver_name}
                s_company={values.s_company}
                s_company_driver_id_type_1={values.s_company_driver_id_type_1}
                s_company_driver_id_num_1={values.s_company_driver_id_num_1}
                d_company_driver_id_expiration_1={values.d_company_driver_id_expiration_1}
                b_company_driver_photo_match_1={values.b_company_driver_photo_match_1}
                s_company_driver_id_type_2={values.s_company_driver_id_type_2}
                s_company_driver_id_num_2={values.s_company_driver_id_num_2}
                d_company_driver_id_expiration_2={values.d_company_driver_id_expiration_2}
                b_company_driver_photo_match_2={values.b_company_driver_photo_match_2}
                s_kiosk_submitted_agent={values.s_kiosk_submitted_agent}
                getProcessAgentName={false}
                user={user}
                t_created={now}
                b_interline_transfer={values.b_interline_transfer}
                s_interline_transfer={values.s_interline_transfer}
                s_logo={airline.s_logo}
                shcs={shcs}
            />
        );

        const data = {
            files,
            exportData,
            queueData
        }

        await api('post', 'createExportItemNew', { data });

        if (!reject) {
            openAcceptanceSheet(acceptanceSheet);
        }

        push('1');
        setModalReject(false);
        myAwbsQuery();
        resetFiles();
        setModalLoading(false);

    });

    const resetFiles = () => {
        const clearedFiles = files.filter(f => f.fileType === 'IDENTIFICATION1' || f.fileType === 'IDENTIFICATION2');
        setFiles(clearedFiles);
        for (let key in fileTypes) {
            if (!['IDENTIFICATION1', 'IDENTIFICATION2'].includes(key)) {
                fileTypes[key].uploaded = false;
            }
        }
    }

    // ModalPaymentsCharges
    const [modalPayments, setModalPayments] = useState(false);
    const [addCharge, setAddCharge] = useState(false);

    const handleAddPaymentCharge = (addCharge) => {
        setAddCharge(addCharge);
        setModalPayments(true);
    }

    // Modal Reject
    const [modalReject, setModalReject] = useState(false);

    // Modal Create AWB
    const [modalCreateAwb, setModalCreateAwb] = useState(false);

    // Recognize Form
    const [formFields, setFormFields] = useState({});
    
    const appendFormFields = (object) => {
        const copy = Object.assign({}, formFields);
        for (let key in object) {
            copy[key] = object[key];
        }
        setFormFields(copy);
    }

    const saveAndRecognizeForm = asyncHandler(async(fileType) => {
        const data = {
            file,
            modelId
        }

        const res = await api('post', 'saveAndRecognizeForm', { data });

        const { fields } = res.data[0];
        const customFields = {};

        if ( (fileType === 'IDENTIFICATION1') ||  (file.fileType === 'IDENTIFICATION1') ) {
            setFieldValue('s_company_driver_id_num_1', fields['idNum'].value);
            if (fields['expirationDate'].value && fields['expirationDate'].value.length > 0 && moment(fields['expirationDate'].value).isValid() && moment(fields['expirationDate'].value).isSameOrAfter(moment().format('MM/DD/YYYY'))) {
                setFieldValue('d_company_driver_id_expiration_1', moment(fields['expirationDate'].value).format('YYYY-MM-DD'));
            } else {
                setFieldValue('d_company_driver_id_expiration_1', null);
                alert('Driver ID Expiration Date is invalid. Please confirm it manually');
            }
            setFieldValue('s_company_driver_name', fields['name'].value);
            
            for (let key in fields) {
                if (key !== 'name') {
                    customFields[`${key}1`] = fields[key];
                    customFields[`${key}1`].confirmed = false;
                } else {
                    customFields[`${key}`] = fields[key];
                    customFields[`${key}`].confirmed = false;
                }
            }

            appendFormFields(customFields);

        } else if ( (fileType === 'IDENTIFICATION2') ||  (file.fileType === 'IDENTIFICATION2') ) {
            setFieldValue('s_company_driver_id_num_2', fields['idNum'].value);
            
            if (moment(fields['expirationDate'].value).isValid() && moment(fields['expirationDate'].value).isSameOrAfter(moment().format('MM/DD/YYYY'))) {
                setFieldValue('d_company_driver_id_expiration_2', moment(fields['expirationDate'].value).format('YYYY-MM-DD'));
            } else {
                setFieldValue('d_company_driver_id_expiration_2', '');
                alert('Driver ID Expiration Date is invalid. Please confirm it manually');
            }

            setFieldValue('s_company_driver_name', fields['name'].value);
            
            for (let key in fields) {
                if (key !== 'name') {
                    customFields[`${key}2`] = fields[key];
                    customFields[`${key}2`].confirmed = false;
                } else {
                    customFields[`${key}`] = fields[key];
                    customFields[`${key}`].confirmed = false;
                }
            }

            appendFormFields(customFields);
        } else if (fileType === 'AWB') {

            const parseAwb = _.get(fields, `['s_mawb'].value`, '').replace(/[-,.()\s]/g, '');
            if (parseAwb !== selectedAwb.s_mawb.replace(/-/g, '')) {
                // alert('AWB number does not match the AWB being processed. Please confirm it manually.');
            } else {
                setFieldValue('s_mawb', parseAwb);
            }

            setFieldValue('s_origin', fields['s_origin'].value);
            setFieldValue('s_destination', fields['s_destination'].value);

            if (fields['i_pieces'] && fields['i_pieces'].value && parseInt(fields['i_pieces'].value) >= 0) {
                setFieldValue('i_pieces', fields['i_pieces'].value);
            } else {
                setFieldValue('i_pieces', '');
            }

            if (fields['i_weight'] && fields['i_weight'].value && parseInt(fields['i_weight'].value) >= 0) {
                setFieldValue('i_weight', fields['i_weight'].value);
            } else {
                setFieldValue('i_weight', '');
            }

            setFieldValue('s_commodity', fields['s_commodity'].value);

            const flightNumber = fields['s_flight_number'] && fields['s_flight_number'].value.split('/')[0];
            setFieldValue('s_flight_number', flightNumber);
            
            if (
                fields['t_departure_date'] && 
                fields['t_departure_date'].value && 
                fields['t_departure_date'].value.length > 0
            ) {
                
                const array = fields['t_departure_date'].value.split('/');
                if (array && array.length === 2) {
                    const date = `${array[1]}/${array[0]}/${moment().format('YYYY')}`;

                    moment(date).isValid() &&
                    moment(moment(date).format('MM/DD/YYYY'))
                        .isSameOrAfter(moment().local().subtract(1, 'week').format('MM/DD/YYYY')) && 
                    moment(moment(date).format('MM/DD/YYYY'))
                        .isBefore(moment().local().add(1, 'month').format('MM/DD/YYYY'))   
    
                    setFieldValue('t_depart_date', moment(date).format('YYYY-MM-DD'));
    
                } else {
                    setFieldValue('t_depart_date', '');
                }

            } else {
                // alert('Please set the flight date manually.');
                setFieldValue('t_depart_date', '');
            }

            // special handling code not found
            setFieldValue('b_dg', false);// dg not found

            for (let key in fields) {
                customFields[key] = fields[key];
                customFields[key].confirmed = false;
            }

            // console.log(customFields);

            appendFormFields(customFields);

        } else {
            for (let key in fields) {
                fields[key].confirmed = false;
            }
            appendFormFields(fields);
        }

    });

    // TSA
    const [foundIac, setFoundIac] = useState(null);
    const [foundCcsf, setFoundCcsf] = useState(null);
    const [screeningType, setScreeningType] = useState(null);
    const [airlines, setAirlines] = useState([]);

    const selectAllAirlines = async () => {
        const res = await api('get', 'selectAllAirlines');
        const airlines = [];
        for (let i = 0; i < res.data.length; i++) {
            airlines.push({
                value: res.data[i].s_airline_name,
                label: res.data[i].s_airline_name
            });
        }
        setAirlines(airlines);
    }

    const enableSavingTsaCheck = () => {

        const checkIacTypes = ['unscreendIac', 'iacTenderCcsf'];
        const { s_non_iac, s_iac, s_ccsf, s_interline_transfer } = values;
        const validShipperType = _.get(shipperType, 'length', 0) > 0;

        if(screeningType === 'unscreendOthers' && _.get(s_non_iac, 'length', 0) > 0) {
            return true;
        } else if(checkIacTypes.indexOf(screeningType) !== -1 && s_iac !== null && foundIac && foundIac !== null && validShipperType) {
            if(foundIac.valid) {
                return true;
            }
        } else if(screeningType === 'iacAlsoCcsf' && s_iac !== null && foundIac && foundIac !== null && s_ccsf !== null && foundCcsf && foundCcsf !== null && validShipperType) {
            if(foundIac.valid && foundCcsf.valid && foundIac.approval_number === foundCcsf.iac_number) {
                return true;
            }
        } else if (screeningType === 'interlineTransfer') {
            return s_interline_transfer && s_interline_transfer.length > 2;
        }

        return false;

    }

    // Wizard Navigation:

    const resolveProceedStepOne = () => {
        const validPhoto = values.b_company_driver_photo_match_1 === true;
        const photoUploaded = fileTypes['IDENTIFICATION1'].uploaded === true;
        
        // console.log(` &&&&&&&&&&&&&&& checkAwbData() = ${checkAwbData()} &&&&&&&&&&&&&&&`);
        // console.log(` &&&&&&&&&&&&&&& validPhotovalidPhoto = ${validPhoto} &&&&&&&&&&&&&&&`);
        // console.log(` &&&&&&&&&&&&&&& checkIdentification('IDENTIFICATION1') = ${checkIdentification('IDENTIFICATION1')} &&&&&&&&&&&&&&&`);

        if ( checkAwbData() && validPhoto && photoUploaded && checkIdentification('IDENTIFICATION1') ) {
            return true;
        } else {
            return false;
        }
    }

    const resolveEnableNext = (stepItem) => {
        const { id } = stepItem;
        if (id === '1') {
            return true;
        } else if (id === '2') {
            return resolveProceedStepOne();
        } else if (id === '3') {
            //console.log(`WORKING 3`);
        }
        return false;
    };

    const topNavClick = (stepItem, push) => {
        if (resolveEnableNext(stepItem)) {
            push(stepItem.id);
        }
    };

    const resolveEnableNextBottomNav = (step) => {
        if (step.id === '1') {
            return resolveProceedStepOne();
        } else if (step.id === '2') {
            return enableSavingTsaCheck();
        }
    }

    const onClickNext = (goToNext, steps, step, push) => {
        step.isDone = true;
        if (steps.length - 1 <= steps.indexOf(step)) {
            return;
        } else if (!resolveEnableNextBottomNav(step)) {
            step.disabled = true;
            return;
        } else {
            step.disabled = false;
            goToNext();
        }
    };
    
    const onClickPrev = (goToPrev, steps, step, push) => {
        if (steps.indexOf(step) <= 0) {
            return;
        }
        goToPrev();
    };

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3 '>
                        <Col md='12' lg='12'>
                            
                            <Wizard render={({ step, steps, next, push }) => (
                                <>
                                    <Row className={`mb-3`}>
                                        <Col md={12}>
                                            <div className='float-left'>
                                                <Row style={{ width: '1000px' }}>
                                                    <Col md={2}>
                                                        <h1 className={'d-inline'}>Export</h1>
                                                    </Col>
                                                    <Col md={5}>
                                                        <SelectAwbSlideShow 
                                                            items={myExportAwbs}
                                                            handleSelectAwb={handleSelectAwb}
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <Button onClick={() => setModalCreateAwb(true)}>Create AWB</Button>
                                                    </Col>
                                                    {
                                                        alreadyProcessedAwb && 
                                                        <div style={{ flex: 1 }}>
                                                            <h6 className={'text-danger'}>{processedNotice}</h6>
                                                        </div>
                                                    }
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>

                                    <div className={`wizard wizard-default ${alreadyProcessedAwb && 'custom-disabled'}`}>
                                        <TopNavigation
                                            className="justify-content-center mb-4"
                                            disableNav={false}
                                            topNavClick={topNavClick}
                                        />
                                        <Steps>
                                            <Step id={'1'} name={'Scan Documents'}>
                                                <IdentificationAndDocuments 
                                                    values={values}
                                                    setFieldValue={setFieldValue}
                                                    counterFiles={counterFiles}
                                                    fileTypes={fileTypes}
                                                    selectedFileType={selectedFileType}
                                                    setSelectedFileType={setSelectedFileType}
                                                    modelId={modelId}
                                                    setModelId={setModelId}
                                                    saveAndRecognizeForm={saveAndRecognizeForm}
                                                    formFields={formFields}
                                                    setFormFields={setFormFields}
                                                    files={files}
                                                    addToFiles={addToFiles}
                                                    file={file}
                                                    setFile={setFile}
                                                    updateFile={updateFile}
                                                    removeFile={removeFile}
                                                    selectedAwb={selectedAwb}
                                                    checkIdentification={checkIdentification}
                                                    checkAwbData={checkAwbData}
                                                    saveIdentificationInformation={saveIdentificationInformation}
                                                    mobile={mobile}
                                                    airportCodes={airportCodes}
                                                    airportCodesMap={airportCodesMap}
                                                    setBookingConfirmed={setBookingConfirmed}
                                                    shcs={shcs}
                                                    shcsDgMap={shcsDgMap}
                                                />
                                            </Step>
                                            <Step id={'2'} name={'TSA Check'}>
                                                <TsaCheck 
                                                    baseApiUrl={baseApiUrl}
                                                    headerAuthCode={headerAuthCode}
                                                    values={values}
                                                    setFieldValue={setFieldValue}
                                                    screeningType={screeningType}
                                                    setScreeningType={setScreeningType}
                                                    foundIac={foundIac}
                                                    setFoundIac={setFoundIac}
                                                    foundCcsf={foundCcsf}
                                                    setFoundCcsf={setFoundCcsf}
                                                    airlines={airlines}
                                                    selectAllAirlines={selectAllAirlines}
                                                    shipperType={shipperType}
                                                    setShipperType={setShipperType}
                                                />
                                            </Step>
                                            <Step id={'3'} name={'Confirm'}>
                                                <ConfirmAndProcess 
                                                    values={values}
                                                    setFieldValue={setFieldValue}
                                                    foundIac={foundIac}
                                                    foundCcsf={foundCcsf}
                                                    createExportItem={createExportItem}
                                                    push={push}
                                                    selectedAwb={selectedAwb}
                                                    baseApiUrl={baseApiUrl}
                                                    headerAuthCode={headerAuthCode}
                                                    user={user}
                                                    screeningType={screeningType}
                                                    shipperType={shipperType}
                                                    airportCodes={airportCodes}
                                                    airportCodesMap={airportCodesMap}
                                                />
                                            </Step>
                                        </Steps>
                                        <BottomNavigation 
                                            onClickNext={onClickNext}
                                            onClickPrev={onClickPrev}
                                            className="justify-content-center front"
                                            prevLabel={'Back'}
                                            nextLabel={'Next'}
                                            resolveEnableNext={resolveEnableNextBottomNav}
                                        />
                                    </div>

                                    <ModalReject 
                                        modal={modalReject}
                                        setModal={setModalReject}
                                        createImportItem={createExportItem}
                                        push={push}
                                        values={values}
                                    />

                                    <ModalCreateAwb 
                                        modal={modalCreateAwb}
                                        setModal={setModalCreateAwb}
                                        selectedAwb={selectedAwb}
                                        user={user}
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        asyncHandler={asyncHandler}
                                        myAwbsQuery={myAwbsQuery}
                                        createSuccessNotification={createSuccessNotification}
                                        refresh={refresh}
                                    />

                                    <ModalLoading
                                        modal={modalLoading}
                                        setModal={setModalLoading}
                                    />

                                </>
                            )}>

                            </Wizard>

                        </Col>
                    </Row>
                </div>
            </div>

        </AppLayout>
    );
}

const Export = ({
    user, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, eightyWindow, width, mobile, createSuccessNotification, authButtonMethod, isAuthenticated, counterFiles, addCounterFile, removeCounterFile, clearCounterFiles
}) => {

    const [initialValues, setInitialValues] = useState({});

    const isNumber = (key) => key[0] === 'f' || key[0] === 'i';
    const isBoolean = (key) => key[0] === 'b';

    const resolveInitialValues = (mapping) => {
        const values = {};
        for (let i = 0; i < mapping.length; i++) {
            const key = mapping[i];
            if (isNumber(key)) {
                values[key] = 0;
            } else if (isBoolean(key)) {
                values[key] = false;
            } else {
                values[key] = '';
            }
        }
        return values;
    }

    useEffect(() => {
        const values = resolveInitialValues(mapping);
        setInitialValues(values);
    }, []);

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
        >
            {({ values, setFieldValue, resetForm }) => (
                <ExportMain 
                    values={values}
                    setFieldValue={setFieldValue}
                    resetForm={resetForm}
                    user={user}
                    baseApiUrl={baseApiUrl}
                    headerAuthCode={headerAuthCode}
                    createSuccessNotification={createSuccessNotification}
                    promptUserLocation={promptUserLocation}
                    selectUserLocation={selectUserLocation}
                    launchModalChangeLocation={launchModalChangeLocation}
                    displaySubmenu={displaySubmenu}
                    handleDisplaySubmenu={handleDisplaySubmenu}
                    eightyWindow={eightyWindow}
                    mobile={mobile}
                    width={width}
                    authButtonMethod={authButtonMethod}
                    isAuthenticated={isAuthenticated}
                />
            )}
        </Formik>
    );
}

export default withRouter(Export);