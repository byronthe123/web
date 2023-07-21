import { Dispatch, SetStateAction } from 'react';
import { Charge } from "./ChargeClass";
import { File } from "./interfaces";
import { queueRecord } from "../../../globals/defaults";
import { IQueue, IPayment } from "../../../globals/interfaces";

export const defaultSelectedMawb = {
    s_mawb: '',
    s_transaction_id: '',
    s_type: '',
    s_trucking_driver: '',
    s_unit: '',
    s_airline: '',
    s_mawb_id: '',
    s_driver_photo_link: ''
}

export const defaultContext = {
    global: {
        user: {
            s_email: '',
            s_unit: ''
        }
    },
    module: {
        refresh: false,
        setRefresh: () => {},
        awbsLoading: true,
        awbs: [],
        manualMode: false,
        setManualMode: (state: boolean) => {},
        selectedAwb: queueRecord,
        setSelectedAwb: (awb: IQueue) => {},
        values: {}, 
        setFieldValue: (fieldName: string, value: any) => {}, 
        resetForm: () => {},
        topNavClick: (stepItem: any, push: any) => {},
        formQuery: false,
        formFields: {}, 
        setFormFields: (state: any) => {},
        saveAndRecognizeForm: (file: object, modelId: string) => Promise.resolve()
    },
    additionalData: {
        payments: [],
        setPayments: (payments: Array<IPayment>) => {},
        ffms: [],
        fhls: [],
        fwbs: [],
        locations: [],
        locatedPieces: 0,
        iscData: {},
        clearanceData: [],
        handleSelectFfm: (ffm: {}) => {},
        stationInfo: {
            id: 0,
            s_unit: '',
            s_address: '',
            s_phone: '',
            s_firms_code: '',
            s_weekday_hours: '',
            s_weekend_hours: '',
            s_airport: '',
            i_add_first_free_day: 0,
            i_add_second_free_day: 0
        },
        hold: false
    },
    paymentsCharges: {
        f_import_per_kg: 0, 
        f_import_min_charge: 0, 
        isc: 0,
        hmCharge: new Charge(),
        jfkChfCharge: new Charge(),
        bosChfCharge: new Charge(),
        otherCharges: {
            amount: 0,
            description: ''
        },
        totalCharges: 0,
        balanceDue: 0,
        totalPaid: 0, 
        credits: 0, 
        postEntryFee: false,
        voidIsc: false,
        setVoidIsc: (state: boolean) => {},
        comat: false,
        generalOrder: false,
        charges: []
    },
    storage: {
        autoStorageDays: 0,
        storageDays: 0,    
        storageStartDate: '', 
        lastArrivalDate: '', 
        setLastArrivalDate: (state: string) => {},
        dailyStorage: 0, 
        totalStorage: 0,
        autoTotalStorage: 0,
        altStorage: false, 
        altStorageAmount: 0
    },
    piecesWeight: {
        autoPieces: 0, 
        autoWeight: 0, 
        pieces: 0, 
        setPieces: (pieces: number) => {}, 
        weight: 0, 
        setWeight: (weight: number) => {},
        allMasterPiecesLocated: false,
        overrideLocateAllByHouse: false,
        setOverrideLocateAllByHouse: (state: boolean) => {}
    },
    fileProps: {
        fileTypes: {},
        files: [],
        addToFiles: (file: File, s_file_type: string) => {},
        file: {
            base64: '',
            type: '',
            guid: ''
        },
        setFile: (file: File) => {},
        selectedFileType: '',
        setSelectedFileType: (fileType: string) => {},
        modelId: '',
        setModelId: (id: string) => {},
        updateFile: (prop: string, value: any) => {},
        removeFile: (file: File) => {},
        resetFiles: () => {},
        validFiles: false
    },
    identification: {
        saveIdentificationInformation: () => {}, 
        validIdentification: false, 
        removeIdentificationInfo: (file?: File) => {} 
    }
}