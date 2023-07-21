import { useEffect, useState, useContext, useMemo } from 'react';
import { AppContext } from '../../../context/index';
import { importTransferTypes, importTypes } from './fileTypes';
import _ from 'lodash';
import { File } from './interfaces';

interface BooleanMap {
    [x: string]: boolean
}

export default function useFiles (s_transaction_id: string, s_type: 'IMPORT' | 'TRANSFER-IMPORT') {
    const { counter } = useContext(AppContext);
    const { counterFiles, addCounterFile, removeCounterFile, clearCounterFiles } = counter;
    const [queryLocalStorage, setQueryLocalStorage] = useState<boolean>(false);
    const [fileTypes, setFileTypes] = useState(importTypes);
    const [files, setFiles] = useState<Array<File>>([]);
    const [file, setFile] = useState({
        base64: '',
        type: '',
        guid: ''
    });
    const [selectedFileType, setSelectedFileType] = useState('');
    const [modelId, setModelId] = useState('');

    useEffect(() => {
        if (s_type === 'TRANSFER-IMPORT') {
            const copy = _.cloneDeep(importTransferTypes);
            setFileTypes(copy);
        } 
    }, [s_type]);

    const validFiles = useMemo(() => {
        for (let key in fileTypes) {
            if (fileTypes[key].required && !fileTypes[key].uploaded) {
                return false;
            }
            if (key === 'AWB' && s_type === 'TRANSFER-IMPORT' && !fileTypes[key].uploaded) {
                return false;
            }
        }
        return true;  
    }, [fileTypes, s_type]);

    useEffect(() => {
        if (s_transaction_id && !queryLocalStorage) {
            const storageTranscation = (localStorage.getItem('s_transaction_id') || '').toString();
            if (storageTranscation !== s_transaction_id) {
                clearCounterFiles();
                const copy = Object.assign({}, fileTypes);
                for (let key in copy) {
                    copy[key].uploaded = false;
                }
                setFileTypes(copy);
            } else if (counterFiles.length > 0) {

                const map: BooleanMap = {};
                for (let i = 0; i < files.length; i++) {
                    const guid = _.get(files[i], 'guid', null);
                    if (guid) {
                        map[guid] = true;
                    }
                }

                const copy: File[] = Object.assign([], files);

                for (let i = 0; i < counterFiles.length; i++) {
                    if (!map[counterFiles[i].guid]) {
                        copy.push(counterFiles[i]);
                    }
                }

                setFiles(copy);
            }
            setQueryLocalStorage(true);
        } 
    }, [s_transaction_id, files, counterFiles, queryLocalStorage]);

    const addToFiles = (file: File, s_file_type: string): void => {
        file.s_file_type = s_file_type;
        const filesCopy = _.cloneDeep(files);
        filesCopy.push(file);
        setFiles(filesCopy);

        if (s_file_type === 'IDENTIFICATION') {
            addCounterFile(file);
        }

        if (fileTypes[s_file_type]) {
            setFileTypes(prev => {
                const fileTypesCopy = _.cloneDeep(prev);
                fileTypesCopy[s_file_type].uploaded = true;
                return fileTypesCopy;
            });
        }

    }

    const removeFile = (file: File): void => {
        const filtered = files.filter(f => f.guid !== file.guid);
        setFiles(filtered);
        if (file.s_file_type === 'IDENTIFICATION') {
            removeCounterFile(file);
        }
        if (fileTypes[file.s_file_type!]) {
            setFileTypes(prev => {
                const copy = _.cloneDeep(prev);
                copy[file.s_file_type!].uploaded = false;
                return copy;
            });
        }
    }

    const updateFile = (prop: string, value: any): void => {
        const copy: any =  _.cloneDeep(file);
        copy[prop] = value;
        setFile(copy);
    }

    const resetFiles = (): void => {
        const clearedFiles = files.filter(f => f.s_file_type === 'IDENTIFICATION');
        setFiles(clearedFiles);

        const copy = Object.assign({}, fileTypes);
        for (let key in copy) {
            if (key !== 'IDENTIFICATION') {
                copy[key].uploaded = false;
            }
        }
        setFileTypes(copy);
    }

    console.log(fileTypes);

    return {
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
    }
}