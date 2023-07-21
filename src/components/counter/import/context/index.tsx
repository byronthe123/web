import React, { useState, createContext, useContext, useMemo, useEffect } from "react";
import { AppContext } from "../../../../context/index";
import useAwbs from "../useAwbs";
import useAdditionalData from "../useAdditionalData";
import usePiecesWeight from "../usePiecesWeight";
import useMinCharges from "../useMinCharges";
import useStorageDays from "../useStorageDays";
import useStorage from "../useStorage";
import useAltStorage from "../useAltStorage";
import useHmCharge from "../useHmCharge";
import useJfkChfCharge from "../useJfkChfCharge";
import useEwrChfCharge from "../useEwrChfCharge";
import useOtherCharges from "../useOtherCharges";
import usePaidCredits from "../usePaidCredits";
import useLocatedPieces from "../useLocatedPieces";
import useFiles from "../useFiles";
import useIdentification from "../useIdentification";
import useNavigation from "../useNavigation";
import useFormRecognizer from "../useFormRecognizer";
import useComatGo from "../useComatGo";
import useMasterPiecesLocated from "../useMasterPiecesLocated";
import useHold from "../useHold";
import { getNum } from "../localUtils";
import { IContext } from "./contextInterface";
import { IMap, IQueue } from "../../../../globals/interfaces";
import { defaultContext } from "../defaultValues";
import { queueRecord } from '../../../../globals/defaults';

const ImportContext = createContext<IContext>(defaultContext);

interface IProviderProps {
    values: IMap<any>;
    setFieldValue: (fieldName: string, value: string) => void;
    resetForm: () => void;
    children: any;
}

const ImportProvider = ({
    values,
    setFieldValue,
    resetForm,
    children,
}: IProviderProps) => {
    const { user, appData: {charges} } =
        useContext(AppContext);
    const [refresh, setRefresh] = useState(false);
    const { awbsLoading, awbs } = useAwbs(
        user.s_email,
        user.s_unit,
        "IMPORT",
        refresh
    );
    const [manualMode, setManualMode] = useState(false);
    const [selectedAwb, setSelectedAwb] =
        useState<IQueue>(queueRecord);
    const {
        payments,
        setPayments,
        ffms,
        fhls,
        fwbs,
        locations,
        iscData,
        clearanceData,
        handleSelectFfm,
        stationInfo,
    } = useAdditionalData(
        selectedAwb.s_mawb,
        user.s_unit,
        manualMode,
        values.s_hawb,
        selectedAwb.s_type
    );

    const { totalPaid, credits, postEntryFee } = usePaidCredits(payments);
    const locatedPieces = useLocatedPieces(locations);
    const allMasterPiecesLocated = useMasterPiecesLocated(ffms, locations);
    const [overrideLocateAllByHouse, setOverrideLocateAllByHouse] =
        useState(false);
    const [voidIsc, setVoidIsc] = useState(false);
    const { hold } = useHold(locations);

    const {
        autoStorageDays,
        storageDays,
        storageStartDate,
        lastArrivalDate,
        setLastArrivalDate,
    } = useStorageDays(
        ffms, 
        manualMode, 
        selectedAwb.s_mawb, 
        selectedAwb.s_airline_code, 
        selectedAwb.s_unit
    );

    const { f_import_per_kg, f_import_min_charge, isc } = useMinCharges(
        postEntryFee,
        iscData,
        voidIsc,
        lastArrivalDate,
        user.s_unit,
        selectedAwb.s_mawb
    );

    const { autoPieces, autoWeight, pieces, setPieces, weight, setWeight } =
        usePiecesWeight(ffms, fhls, manualMode, values.s_hawb);
    const { altStorage, altStorageAmount } = useAltStorage(payments);
    const { dailyStorage, totalStorage } = useStorage(
        Number(weight),
        storageDays,
        f_import_per_kg,
        f_import_min_charge,
        altStorage,
        altStorageAmount
    );
    const { totalStorage: autoTotalStorage } = useStorage(
        Number(weight),
        autoStorageDays,
        f_import_per_kg,
        f_import_min_charge,
        altStorage,
        altStorageAmount
    );

    // Other charges are all based on the OtherCharge class
    const { comat, generalOrder } = useComatGo(locations);
    const hmCharge = useHmCharge(selectedAwb.s_mawb, user.s_unit, lastArrivalDate);
    const jfkChfCharge = useJfkChfCharge(
        selectedAwb.s_mawb,
        user.s_unit,
        Number(weight)
    );
    const bosChfCharge = useEwrChfCharge(ffms, user.s_unit, Number(weight));
    const otherCharges = useOtherCharges(
        payments,
        hmCharge,
        jfkChfCharge,
        bosChfCharge
    );
    const totalCharges = useMemo(() => {
        if (comat || generalOrder || selectedAwb.s_type === 'IMPORT TRANSFER') {
            return 0;
        } else {
            return getNum(isc + totalStorage + (otherCharges.amount || 0));
        }
    }, [isc, totalStorage, otherCharges.amount, comat, generalOrder, selectedAwb.s_type]);

    const balanceDue = useMemo(() => {
        return getNum(totalCharges - (totalPaid + credits));
    }, [totalCharges, totalPaid, credits]);

    const {
        fileTypes,
        files,
        addToFiles,
        file,
        setFile,
        selectedFileType,
        setSelectedFileType,
        modelId,
        setModelId,
        updateFile,
        removeFile,
        resetFiles,
        validFiles
        // @ts-ignore
    } = useFiles(selectedAwb.s_transaction_id, selectedAwb.s_type);

    const { formQuery, formFields, setFormFields, saveAndRecognizeForm } =
        useFormRecognizer();

    const {
        saveIdentificationInformation,
        validIdentification,
        removeIdentificationInfo,
    } = useIdentification(
        selectedAwb.s_transaction_id,
        values.s_trucking_driver,
        values,
        setFieldValue,
        formFields,
        modelId,
        refresh
    );

    const topNavClick = useNavigation(
        locatedPieces,
        pieces,
        weight,
        lastArrivalDate,
        selectedAwb.s_type,
        balanceDue,
        validIdentification,
        validFiles,
        overrideLocateAllByHouse,
        hold
    );

    useEffect(() => {
        setManualMode(false);
        setFieldValue('s_hawb', '');
        resetFiles();
    }, [refresh, selectedAwb]);

    return (
        <ImportContext.Provider
            value={{
                global: {
                    user
                },
                module: {
                    refresh,
                    setRefresh,
                    awbsLoading,
                    awbs,
                    manualMode,
                    setManualMode,
                    selectedAwb,
                    setSelectedAwb,
                    values,
                    setFieldValue,
                    resetForm,
                    topNavClick,
                    formQuery,
                    formFields,
                    setFormFields,
                    saveAndRecognizeForm,
                },
                additionalData: {
                    payments,
                    setPayments,
                    ffms,
                    fhls,
                    fwbs,
                    locations,
                    locatedPieces,
                    iscData,
                    clearanceData,
                    handleSelectFfm,
                    stationInfo,
                    hold,
                },
                paymentsCharges: {
                    f_import_per_kg,
                    f_import_min_charge,
                    isc,
                    hmCharge,
                    jfkChfCharge,
                    bosChfCharge,
                    otherCharges,
                    totalCharges,
                    balanceDue,
                    totalPaid,
                    credits,
                    postEntryFee,
                    voidIsc,
                    setVoidIsc,
                    comat,
                    generalOrder,
                    charges
                },
                storage: {
                    autoStorageDays,
                    storageDays,
                    storageStartDate,
                    lastArrivalDate,
                    setLastArrivalDate,
                    dailyStorage,
                    totalStorage,
                    autoTotalStorage,
                    altStorage,
                    altStorageAmount,
                },
                piecesWeight: {
                    autoPieces,
                    autoWeight,
                    pieces,
                    setPieces,
                    weight,
                    setWeight,
                    allMasterPiecesLocated,
                    overrideLocateAllByHouse,
                    setOverrideLocateAllByHouse,
                },
                fileProps: {
                    fileTypes,
                    files,
                    addToFiles,
                    file,
                    setFile,
                    selectedFileType,
                    setSelectedFileType,
                    modelId,
                    setModelId,
                    updateFile,
                    removeFile,
                    resetFiles,
                    validFiles,
                },
                identification: {
                    saveIdentificationInformation,
                    validIdentification,
                    removeIdentificationInfo,
                },
            }}
        >
            {children}
        </ImportContext.Provider>
    );
};

const useImportContext = () => {
    const context = useContext(ImportContext);
    if (context === undefined) {
        throw new Error("useCount must be used within a CountProvider");
    }
    return context;
};

export { ImportProvider, useImportContext };
