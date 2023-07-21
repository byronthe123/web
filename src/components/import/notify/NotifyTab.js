import React, { useState, useEffect, Fragment } from 'react';
import { Row, Col, Button } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

import { defaultFlightArrayItem } from './defaults';
import useFfmData from './useFfmData';
import useNotificationData from './useNotificationData';
import useCompanyContacts from './useCompanyContacts';
import useStationDetails from './useStationDetails';
import useCosts from './useCosts';
import useStorageDays from '../../counter/import/useStorageDays';
import useStorage from '../../counter/import/useStorage';
import useMultipleMode from './useMultipleMode';

import { Card, CardBody } from 'reactstrap';
import { Wizard, Steps, Step } from 'react-albus';

import TopNavigation from '../../wizard-hooks/TopNavigation';
import Flights from './Flights';
import AWBs from './AWBs';
import CompanyProfiles from './CompanyProfiles';
import Finalize from './Finalize';
import handleComposeEmail from './handleComposeEmail';
import ModalSendEmail from './ModalSendEmail';
import ModalCallPhone from './ModalCallPhone';
import ModalProcessedExempt from './ModalProcessedExempt';
import { asyncHandler, api, validateEmail, getNum } from '../../../utils';
import useFlightsData from './useFlightsData';
import useSelectedData from './useSelectedData';
import useMinCharges from '../../counter/import/useMinCharges';

const emailArrayFormatter = (array) => {
    let string = '';
    for (let i = 0; i < array.length; i++) {
        if (array[i] !== null && !['null', 'NULL'].includes(array[i])) {
            string += `${array[i]}; `;
        }
    }
    return string;
};

export default function NotifyTab({
    user,
    baseApiUrl,
    headerAuthCode,
    createSuccessNotification,
    selectedCompany,
    setSelectedCompany,
    companyData,
    setCompanyData,
    emailData,
    setEmailData,
    phoneData,
    setPhoneData,
    blacklist,
    handleSearchAwb,
}) {
    // Set flights, ffmData:
    const [d_arrival_date, set_d_arrival_date] = useState(
        moment().format('YYYY-MM-DD')
    );
    const { ffmData, setFfmData } = useFfmData(
        d_arrival_date,
        user.s_destination,
        user.s_unit
    );
    const { flightsArray } = useFlightsData(ffmData);
    const { selectedFlight, setSelectedFlight, filteredFlights } =
        useSelectedData();

    const {
        autoStorageDays,
        autoLastFreeDay,
        autoGoDate,
        storageStartDate,
        setStorageStartDate,
    } = useStorageDays(filteredFlights, false, '', '', '');
    const [lastFreeDate, setLastFreeDate] = useState('');
    const [goDate, setGoDate] = useState('');

    // selectedAwb, notificationData
    const [selectedAwb, setSelectedAwb] = useState(null);
    const {
        notificationData,
        totalPieces,
        totalWeight,
        flightPieces,
        flightWeight,
        flightRackPcs,
        fwbDataConsigneeAddressName,
    } = useNotificationData(selectedAwb);

    // Other
    const [trackStep, setTrackStep] = useState('1');

    // selectedCompany
    const { selectedCompanyEmails, selectedCompanyPhones } = useCompanyContacts(
        selectedCompany,
        emailData,
        phoneData
    );

    const updateNotified = (s_mawb) => {
        setFfmData((prev) => {
            const copy = _.cloneDeep(prev);
            for (let i = 0; i < copy.length; i++) {
                if (
                    (copy[i].s_mawb && copy[i].s_mawb.replace(/-/g, '')) ===
                    s_mawb.replace(/-/g, '')
                ) {
                    copy[i].notification_id = 1; // placeholder to show notified, not actual notification id
                }
            }
            return copy;
        });
        setSelectedFlight((prev) => {
            const copy = prev;
            const { uniqueFlightAwbs } = copy;
            for (let i = 0; i < uniqueFlightAwbs.length; i++) {
                if (uniqueFlightAwbs[i].s_mawb === s_mawb) {
                    const awbCopy = _.cloneDeep(uniqueFlightAwbs[i]);
                    awbCopy.notification_id = 1;
                    uniqueFlightAwbs[i] = awbCopy;
                }
            }
            return copy;
        });
        setRefresh((prev) => prev + 1);
    };

    // CC Emails

    const [ccEmails, setCcEmails] = useState([]);
    const [addCcEmail, setAddCcEmail] = useState('');

    const handleAddCcEmail = () => {
        const emails = Object.assign([], ccEmails);
        emails.push(addCcEmail.toUpperCase());
        setCcEmails(emails);
        setAddCcEmail('');
    };

    const removeCcEmail = (email) => {
        const filtered = ccEmails.filter((e) => e !== email);
        setCcEmails(filtered);
    };

    const [partNumber, setPartNumber] = useState('');

    const [enableCustomFields, setEnableCustomFields] = useState(false);
    const [chfUldAmount, setChfUldAmount] = useState(0);
    const [chfUldFactor, setChfUldFactor] = useState(225);
    const [chfLoose, setChfLoose] = useState(false);
    const [chfLooseKg, setChfLooseKg] = useState(0);
    const [addCharge, setAddCharge] = useState(true);

    useEffect(() => {
        setLastFreeDate(autoLastFreeDay);
    }, [autoLastFreeDay]);

    useEffect(() => {
        setGoDate(autoGoDate);
    }, [autoGoDate]);

    useEffect(() => {
        setChfLooseKg(totalWeight);
    }, [totalWeight]);

    const [chfLooseFactor, setChfLooseFactor] = useState(0.18);
    const [futureNotification, setFutureNotification] = useState(false);

    //Skyline Email:
    const [skylineEmail, setSkylineEmail] = useState(false);

    //Footers and ISC query:
    const [emailPreview, setEmailPreview] = useState('');
    const [emailBody, setEmailBody] = useState('');

    const { unitInfo, airlineDetails, s_import_distribution_email, iscData } =
        useStationDetails(_.get(user, 's_unit', null), selectedFlight);

    const { firmsCode } = useCosts(
        airlineDetails,
        unitInfo
    );

    const {
        f_import_per_kg: storageKg,
        f_import_min_charge: storageMinCost,
        isc: iscCost
    } = useMinCharges(false, iscData, false, d_arrival_date, user.s_unit);

    const { dailyStorage: autoDailyStorage } = useStorage(
        flightWeight,
        autoStorageDays,
        storageKg,
        storageMinCost
    );

    const {
        multipleMode,
        setMultipleMode,
        selectedMap,
        setSelectedMap,
        manageSelectedMap,
        refresh,
        setRefresh,
    } = useMultipleMode(storageKg, storageMinCost);

    useEffect(() => {
        setRefresh(refresh + 1);
    }, [selectedFlight]);

    const composeEmail = (skylineEmail = false) => {
        let _s_mawb,
            _s_flight_id,
            _flightPieces,
            _flightWeight,
            _s_airline_code,
            _totalPieces,
            _totalWeight,
            _dailyStorage,
            _storageDays;
        const { s_logo } = airlineDetails;

        if (multipleMode) {
            const useAwb = selectedMap[Object.keys(selectedMap)[0]];
            _s_mawb = useAwb.s_mawb || '';
            _s_flight_id = useAwb.s_flight_id || '';
            _s_airline_code = useAwb.s_airline_code || '';
        } else if (selectedAwb) {
            _s_mawb = selectedAwb.s_mawb || '';
            _s_flight_id = selectedAwb.s_flight_id || '';
            _s_airline_code = selectedAwb.s_airline_code || '';
        }

        _flightPieces = flightPieces;
        _flightWeight = flightWeight;
        _totalPieces = totalPieces;
        _totalWeight = totalWeight;
        _dailyStorage = autoDailyStorage;

        const allEmails = [
            ...(selectedCompanyEmails || []),
            ...(ccEmails || []),
        ];

        const { previewHtml, bodyHtml } = handleComposeEmail(
            skylineEmail,
            user,
            iscCost,
            unitInfo,
            firmsCode,
            s_import_distribution_email,
            s_logo,
            _.get(selectedAwb, 's_destination', ''),
            //
            lastFreeDate,
            goDate,
            storageStartDate,
            partNumber,
            _s_mawb,
            _s_flight_id,
            _flightPieces,
            _flightWeight,
            _s_airline_code,
            _totalPieces,
            _totalWeight,
            storageKg,
            storageMinCost,
            _dailyStorage,
            //
            enableCustomFields,
            chfUldAmount,
            chfUldFactor,
            chfLoose,
            chfLooseKg,
            chfLooseFactor,
            futureNotification,
            allEmails,
            multipleMode,
            selectedMap
        );

        setEmailPreview(previewHtml);
        setEmailBody(bodyHtml);
    };

    //Attachments:
    const [fileInputKey, setFileInputKey] = useState(0);
    const [files, setFiles] = useState([]);

    const getFiles = (files) => setFiles(files);

    const removeFile = (name) => {
        const filtered = files.filter((f) => f.name !== name);
        setFiles(filtered);
    };

    //Send Email
    const [loadingSendEmail, setLoadingSendEmail] = useState(false);
    const [modalSendEmailOpen, setModalSendEmailOpen] = useState(false);

    const calcCarrierHandlingFee = (s_airline_code) => {
        const t8Logic = user.s_unit === 'CEWR1' && s_airline_code === 'T8';
    
        const uldCost = getNum(parseFloat(chfUldAmount) * parseFloat(chfUldFactor));
            
        const calcLooseCost = () => {
            let looseCost = 0;
    
            if (chfLoose) {
                looseCost = parseFloat(chfLooseFactor) * parseFloat(chfLooseKg);
                if (t8Logic) {
                    looseCost = Math.max(100, looseCost);
                } else {
                    if (isNaN(looseCost)) {
                        looseCost = 0;
                    }
                }
            }
    
            return looseCost;
        }
    
        const carrierHandlingFee = uldCost + calcLooseCost();
    
        const portFee = carrierHandlingFee * (user.s_unit === 'CORD1' ? 0 : 0.0526);
        return carrierHandlingFee + portFee;
    }

    const sendEmail = asyncHandler(async (push) => {
        setLoadingSendEmail(true);

        //emailData:
        let s_mawb;

        //procedureData:
        let i_payment_quantity, s_flight_id, s_airline_code, i_airline_prefix;

        i_payment_quantity =
            notificationData && notificationData.paymentData
                ? notificationData.paymentData.length
                : null;
        s_mawb = _.get(selectedAwb, 's_mawb', '').replace(/-/g, '');
        s_flight_id = selectedAwb.s_flight_id;
        s_airline_code = selectedAwb.s_airline_code;
        i_airline_prefix = selectedAwb.s_mawb.substr(0, 3);

        const s_unit = user && user.s_unit;

        let emailTo = emailArrayFormatter(selectedCompanyEmails);

        const email = user && user.s_email;
        const now = moment().local().format('MM/DD/YYYY hh:mm A');

        const s_emails_to = emailTo;
        let setEmailsToCc = emailArrayFormatter(ccEmails);

        const b_manual = false;

        const data = {
            emailData: {
                s_mawb,
                emailBody,
                emailTo,
                emailToCc: setEmailsToCc,
                attachments: files,
                skylineEmail,
                multipleMode,
                selectedMap,
            },
            procedureData: {
                t_created: now,
                s_created_by: email,
                t_modified: now,
                s_modified_by: email,
                s_unit,
                i_payment_quantity,
                s_flight_id,
                s_company_guid: selectedCompany.s_guid,
                i_company_record: selectedCompany.i_record,
                s_airline_code,
                i_airline_prefix,
                s_notification_type: 'EMAIL',
                s_emails_to,
                s_emails_to_cc: setEmailsToCc,
                s_emails_from: email,
                b_manual,
                i_pieces: flightPieces,
                f_weight: flightWeight.toFixed(1),
                f_import_service_charge: iscCost,
                f_daily_storage_charge: autoDailyStorage,
                d_last_free_date: lastFreeDate,
                d_storage_start_date: storageStartDate,
                s_cargo_location: unitInfo.s_address,
                s_firms_code: firmsCode
            },
            fwbDataConsigneeAddressName,
        };

        if (enableCustomFields && addCharge) {
            const carrierHandlingFee = calcCarrierHandlingFee(s_airline_code);

            data.createPayment = {
                s_cs_id: 'EOS',
                s_awb: s_mawb,
                f_amount: carrierHandlingFee,
                s_payment_type: 'CARRIER HANDLING FEE',
                s_payment_method: 'CHARGE',
                t_created_date: now,
                t_created: now,
                s_created_by: user.s_email,
                t_modified: now,
                s_modified_by: user.s_email,
                s_origin: selectedAwb.s_origin,
                s_destination: selectedAwb.s_destination,
                s_unit,
                s_status: 'ACTIVE',
                // s_name: selectedCompany.s_name
                // s_notification_email: emailTo,
            }
        }

        const response = await api('post', 'sendNotificationEmail', { data });

        setLoadingSendEmail(false);

        if (response.status === 200) {
            createSuccessNotification('Email sent');
            setModalSendEmailOpen(false);
            resetSendEmail();
            updateNotified(s_mawb);
            setMultipleMode(false);
            push('2');
        }
    });

    const resetSendEmail = () => {
        setPartNumber('');
        setSelectedAwb(null);
        setSelectedCompany(null);
        const newKey = fileInputKey + 1;
        setFileInputKey(newKey);
        setFiles([]);
    };

    // Call Phone

    const [modalCallPhoneOpen, setModalCallPhoneOpen] = useState(false);
    const [s_notes, set_s_notes] = useState('');
    const [s_number_called, set_s_number_called] = useState('');
    const [s_caller, set_s_caller] = useState('');

    const createCallPhoneRecord = () => {
        let s_mawb, s_flight_id, s_airline_code, s_mawb_prefix;

        s_mawb = selectedAwb.s_mawb;
        s_flight_id = selectedAwb.s_flight_id;
        s_airline_code = selectedAwb.s_airline_code;
        s_mawb_prefix =
            selectedAwb.s_mawb_prefix || selectedAwb.s_mawb.substr(0, 3);

        const s_unit = user && user.s_unit;
        const email = user && user.s_email;
        const now = moment().local().format('MM/DD/YYYY hh:mm A');
        const i_payment_quantity =
            notificationData && notificationData.paymentData
                ? notificationData.paymentData.length
                : null;
        const b_manual = false;

        const data = {
            main: {
                t_created: now,
                s_created_by: email,
                t_modified: now,
                s_modified_by: email,
                s_unit,
                s_mawb,
                i_payment_quantity,
                s_flight_id: s_flight_id,
                s_company_guid: selectedCompany.s_guid,
                i_company_record: selectedCompany.i_record,
                s_airline_code,
                i_airline_prefix: s_mawb_prefix,
                s_notification_type: 'PHONE',
                s_notes,
                s_number_called,
                s_caller,
                b_manual,
            },
            other: {
                fwbDataConsigneeAddressName,
            },
        };

        axios
            .post(
                `${baseApiUrl}/notificationCallPhone`,
                {
                    data,
                },
                {
                    headers: { Authorization: `Bearer ${headerAuthCode}` },
                }
            )
            .then((response) => {
                resetCallPhone();
                updateNotified(s_mawb);
                createSuccessNotification('Phone Notification Saved!');
            })
            .catch((error) => {});
    };

    const resetCallPhone = () => {
        set_s_number_called('');
        set_s_caller('');
        set_s_notes('');
    };

    // Processed/Exempt

    const [processedExemptAwb, setProcessedExemptAwb] = useState(null);
    const [modalProcessedOpen, setModalProcessedOpen] = useState(false);

    const launchModalProcessedExempt = (awb) => {
        setProcessedExemptAwb(awb);
        setModalProcessedOpen(true);
    };

    const markAsMailOrDelivered = (type) => {
        const email = user && user.s_email;
        const s_unit = user && user.s_unit;
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');

        axios
            .post(
                `${baseApiUrl}/notificationmarkAsMailOrDelivered`,
                {
                    t_created: now,
                    s_created_by: email,
                    t_modified: now,
                    s_modified_by: email,
                    s_unit,
                    s_mawb: selectedAwb.s_mawb,
                    i_payment_quantity:
                        notificationData && notificationData.paymentData
                            ? notificationData.paymentData.length
                            : null,
                    s_flight_id: selectedAwb.s_flight_id,
                    s_company_guid:
                        type === 'EXEMPT' || type === 'ALREADY DELIVERED'
                            ? null
                            : selectedCompany.s_guid,
                    i_company_record:
                        type === 'EXEMPT' || type === 'ALREADY DELIVERED'
                            ? null
                            : selectedCompany.i_record,
                    s_airline_code: selectedAwb.s_airline_code,
                    i_airline_prefix: selectedAwb.s_mawb.substr(0, 3),
                    s_notification_type: type,
                },
                {
                    headers: { Authorization: `Bearer ${headerAuthCode}` },
                }
            )
            .then((response) => {
                const message =
                    type === 'EXEMPT'
                        ? 'Marked as Exempt!'
                        : 'Marked as Delivered';
                updateNotified(selectedAwb.s_mawb);
                createSuccessNotification(message);
                setModalProcessedOpen(false);
            })
            .catch((error) => {});
    };

    // Procedures:

    const topNavClick = (stepItem, push) => {
        if (resolveEnableNext(stepItem)) {
            setTrackStep((parseInt(stepItem.id) - 1).toString());
            // step 4
            push(stepItem.id);
            if (stepItem.id === '1') {
                setSelectedMap({});
                setSelectedAwb(null);
            }
        }
    };

    const onClickNext = (goToNext, steps, step, push) => {
        step.isDone = true;
        if (steps.length - 1 <= steps.indexOf(step)) {
            return;
        } else if (!resolveEnableNext(step)) {
            step.disabled = true;
            return;
        } else {
            step.disabled = false;
        }

        setTrackStep(step.id);
        goToNext();
    };

    useEffect(() => {
        if (trackStep === '0') {
            setSelectedFlight(defaultFlightArrayItem);
            setSelectedCompany(null);
            setMultipleMode(false);
        } else if (trackStep === '1') {
            setSelectedAwb(null);
            setSelectedCompany(null);
            setMultipleMode(false);
        } else if (trackStep === '2') {
            setSelectedCompany(null);
        }
    }, [trackStep]);

    useEffect(() => {
        if (trackStep === '3') {
            composeEmail();
        }
    }, [
        trackStep,
        ccEmails,
        enableCustomFields,
        chfUldAmount,
        chfUldFactor,
        chfLoose,
        chfLooseKg,
        chfLooseFactor,
        futureNotification,
    ]);

    const resolveEnableNext = (step) => {
        if (step.id === '2') {
            if (selectedFlight.s_flight_number.length === 0) {
                return false;
            }
            return true;
        } else if (step.id === '3') {
            if (multipleMode && Object.keys(selectedMap).length > 0) {
                return true;
            } else if (selectedAwb) {
                return true;
            }
            return false;
        } else if (step.id === '4') {
            if (selectedCompany) {
                return true;
            }
            return false;
        } else {
            return true;
        }
    };

    const handleModalProcessed = () => {
        setModalProcessedOpen(!modalProcessedOpen);
    };

    return (
        <Fragment>
            <Card>
                <CardBody className="wizard wizard-default">
                    <Wizard>
                        <TopNavigation
                            className="justify-content-center"
                            disableNav={false}
                            topNavClick={topNavClick}
                        />
                        <Row>
                            <Col md={12}>
                                <Steps>
                                    <Step
                                        id="1"
                                        name={'Step 1'}
                                        desc={'Select Flight'}
                                    >
                                        <div className="wizard-basic-step">
                                            <Flights
                                                user={user}
                                                d_arrival_date={d_arrival_date}
                                                set_d_arrival_date={
                                                    set_d_arrival_date
                                                }
                                                flightsArray={flightsArray}
                                                selectedFlight={selectedFlight}
                                                setSelectedFlight={
                                                    setSelectedFlight
                                                }
                                                lastFreeDate={lastFreeDate}
                                                setLastFreeDate={
                                                    setLastFreeDate
                                                }
                                                goDate={goDate}
                                                setGoDate={setGoDate}
                                                storageStartDate={
                                                    storageStartDate
                                                }
                                                onClickNext={onClickNext}
                                            />
                                        </div>
                                    </Step>
                                    <Step
                                        id="2"
                                        name={'Step 2'}
                                        desc={'Select AWB'}
                                    >
                                        <div className="wizard-basic-step">
                                            <AWBs
                                                selectedFlight={selectedFlight}
                                                lastFreeDate={lastFreeDate}
                                                setLastFreeDate={
                                                    setLastFreeDate
                                                }
                                                goDate={goDate}
                                                setGoDate={setGoDate}
                                                handleSelectAwb={setSelectedAwb}
                                                launchModalProcessedExempt={
                                                    launchModalProcessedExempt
                                                }
                                                multipleMode={multipleMode}
                                                setMultipleMode={
                                                    setMultipleMode
                                                }
                                                selectedMap={selectedMap}
                                                manageSelectedMap={
                                                    manageSelectedMap
                                                }
                                                refresh={refresh}
                                                onClickNext={onClickNext}
                                                setRefresh={setRefresh}
                                            />
                                        </div>
                                    </Step>
                                    <Step
                                        id="3"
                                        name={'Step 3'}
                                        desc={'Select Profile'}
                                    >
                                        <div className="wizard-basic-step">
                                            <CompanyProfiles
                                                user={user}
                                                selectedAwb={selectedAwb}
                                                notificationData={
                                                    notificationData
                                                }
                                                companyData={companyData}
                                                setCompanyData={setCompanyData}
                                                emailData={emailData}
                                                setEmailData={setEmailData}
                                                phoneData={phoneData}
                                                setPhoneData={setPhoneData}
                                                selectedCompany={
                                                    selectedCompany
                                                }
                                                setSelectedCompany={
                                                    setSelectedCompany
                                                }
                                                blacklist={blacklist}
                                                multipleMode={multipleMode}
                                                flightRackPcs={flightRackPcs}
                                                onClickNext={onClickNext}
                                                handleSearchAwb={
                                                    handleSearchAwb
                                                }
                                            />
                                        </div>
                                    </Step>
                                    <Step
                                        id="4"
                                        name={'Step 4'}
                                        desc={'Send Notification'}
                                    >
                                        <div className="wizard-basic-step">
                                            <Finalize
                                                s_unit={user.s_unit}
                                                selectedCompany={
                                                    selectedCompany
                                                }
                                                ccEmails={ccEmails}
                                                addCcEmail={addCcEmail}
                                                setAddCcEmail={setAddCcEmail}
                                                handleAddCcEmail={
                                                    handleAddCcEmail
                                                }
                                                setCcEmails={setCcEmails}
                                                removeCcEmail={removeCcEmail}
                                                emailData={emailData}
                                                selectedCompanyEmails={
                                                    selectedCompanyEmails
                                                }
                                                phoneData={phoneData}
                                                validateEmail={validateEmail}
                                                selectedAwb={selectedAwb}
                                                goDate={goDate}
                                                lastFreeDate={lastFreeDate}
                                                iscCost={iscCost}
                                                emailPreview={emailPreview}
                                                notificationData={
                                                    notificationData
                                                }
                                                user={user}
                                                setModalSendEmailOpen={
                                                    setModalSendEmailOpen
                                                }
                                                setModalCallPhoneOpen={
                                                    setModalCallPhoneOpen
                                                }
                                                //Attachments
                                                files={files}
                                                getFiles={getFiles}
                                                removeFile={removeFile}
                                                fileInputKey={fileInputKey}
                                                //
                                                enableCustomFields={
                                                    enableCustomFields
                                                }
                                                setEnableCustomFields={
                                                    setEnableCustomFields
                                                }
                                                chfUldAmount={chfUldAmount}
                                                setChfUldAmount={
                                                    setChfUldAmount
                                                }
                                                chfUldFactor={chfUldFactor}
                                                setChfUldFactor={
                                                    setChfUldFactor
                                                }
                                                chfLoose={chfLoose}
                                                setChfLoose={setChfLoose}
                                                chfLooseFactor={chfLooseFactor}
                                                setChfLooseFactor={
                                                    setChfLooseFactor
                                                }
                                                chfLooseKg={chfLooseKg}
                                                setChfLooseKg={setChfLooseKg}
                                                addCharge={addCharge}
                                                setAddCharge={setAddCharge}
                                                futureNotification={
                                                    futureNotification
                                                }
                                                setFutureNotification={
                                                    setFutureNotification
                                                }
                                                skylineEmail={skylineEmail}
                                                setSkylineEmail={
                                                    setSkylineEmail
                                                }
                                                partNumber={partNumber}
                                                setPartNumber={setPartNumber}
                                                blacklist={blacklist}
                                                handleSearchAwb={
                                                    handleSearchAwb
                                                }
                                                composeEmail={composeEmail}
                                            />
                                        </div>
                                    </Step>
                                </Steps>
                            </Col>
                        </Row>
                        <ModalSendEmail
                            open={modalSendEmailOpen}
                            handleModal={() =>
                                setModalSendEmailOpen(!modalSendEmailOpen)
                            }
                            selectedCompanyEmails={selectedCompanyEmails}
                            loadingSendEmail={loadingSendEmail}
                            ccEmails={ccEmails}
                            sendEmail={sendEmail}
                            files={files}
                        />
                    </Wizard>
                </CardBody>
            </Card>

            <ModalCallPhone
                open={modalCallPhoneOpen}
                handleModal={() => setModalCallPhoneOpen(!modalCallPhoneOpen)}
                selectedCompanyPhones={selectedCompanyPhones}
                s_notes={s_notes}
                set_s_notes={set_s_notes}
                s_number_called={s_number_called}
                set_s_number_called={set_s_number_called}
                s_caller={s_caller}
                set_s_caller={set_s_caller}
                createCallPhoneRecord={createCallPhoneRecord}
            />

            <ModalProcessedExempt
                open={modalProcessedOpen}
                handleModal={() => handleModalProcessed()}
                selectedAwb={selectedAwb}
                markAsMailOrDelivered={markAsMailOrDelivered}
            />
        </Fragment>
    );
}
