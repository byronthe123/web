import { ICharge, IStep } from '../../../../globals/interfaces';
import { Charge } from "../ChargeClass";
import { 
    FFM, 
    FHL, 
    FWB, 
    IscData, 
    File, 
    Location, 
    FSN,
    IOtherCharge
} from "../interfaces";
import { IMap, IQueue, IPayment, ICorpStation } from '../../../../globals/interfaces';
import { IFileTypes } from '../fileTypes';

type InputNumber = number | string;

export interface IContext {
    global: {
        user: {
            s_email: string,
            s_unit: string
        }
    },
    module: {
        refresh: boolean,
        setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
        awbsLoading: boolean,
        awbs: Array<any>,
        manualMode: boolean,
        setManualMode: (state: boolean) => void,
        selectedAwb: IQueue,
        setSelectedAwb: (awb: IQueue) => void,
        values: IMap<any>, 
        setFieldValue: (fieldName: string, value: any) => void, 
        resetForm: () => void,
        topNavClick: (stepItem: IStep, push: (id: string) => void) => void,
        formQuery: boolean,
        formFields: any, 
        setFormFields: (state: any) => void,
        saveAndRecognizeForm: (file: object, modelId: string) => Promise<void>
    },
    additionalData: {
        payments: Array<IPayment>,
        setPayments: (payments: Array<IPayment>) => void,
        ffms: Array<FFM>,
        fhls: Array<FHL>,
        fwbs: Array<FWB>,
        locations: Array<Location>,
        locatedPieces: number,
        iscData: IscData,
        clearanceData: Array<FSN>,
        handleSelectFfm: (ffm: FFM) => void,
        stationInfo: ICorpStation,
        hold: boolean
    },
    paymentsCharges: {
        f_import_per_kg: number, 
        f_import_min_charge: number, 
        isc: number,
        hmCharge: Charge,
        jfkChfCharge: Charge,
        bosChfCharge: Charge,
        otherCharges: IOtherCharge,
        totalCharges: number,
        balanceDue: number,
        totalPaid: number, 
        credits: number, 
        postEntryFee: boolean,
        voidIsc: boolean,
        setVoidIsc: (state: boolean) => void,
        comat: boolean,
        generalOrder: boolean;
        charges: Array<ICharge>;
    },
    storage: {
        autoStorageDays: number,
        storageDays: number,    
        storageStartDate: string, 
        lastArrivalDate: string, 
        setLastArrivalDate: (state: string) => void,
        dailyStorage: number, 
        totalStorage: number,
        autoTotalStorage: number,
        altStorage: boolean, 
        altStorageAmount: number
    },
    piecesWeight: {
        autoPieces: number, 
        autoWeight: number, 
        pieces: InputNumber, 
        setPieces: (pieces: number) => void, 
        weight: InputNumber, 
        setWeight: (weight: number) => void,
        allMasterPiecesLocated: boolean,
        overrideLocateAllByHouse: boolean,
        setOverrideLocateAllByHouse: (state: boolean) => void
    },
    fileProps: {
        fileTypes: IFileTypes,
        files: Array<File>,
        addToFiles: (file: File, s_file_type: string) => void,
        file: File,
        setFile: (file: File) => void,
        selectedFileType: string,
        setSelectedFileType: (fileType: string) => void,
        modelId: string,
        setModelId: (id: string) => void,
        updateFile: (prop: string, value: any) => void,
        removeFile: (file: File) => void,
        resetFiles: () => void,
        validFiles: boolean
    },
    identification: {
        saveIdentificationInformation: () => void, 
        validIdentification: boolean, 
        removeIdentificationInfo: (file?: File) => void 
    }
}

