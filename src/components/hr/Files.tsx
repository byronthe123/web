import { useEffect, useState } from 'react';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { IEmployeeFile, IEmployee, IUser, IHrFile } from '../../globals/interfaces';
import UploadFiles from '../custom/UploadScanFiles';
import apiClient from '../../apiClient';
import { getTsDate, notify } from '../../utils';
import VirtualTable from '../custom/VirtualTable';
import ActionIcon from '../custom/ActionIcon';
import ViewFile from './ViewFile';

export type FileTypesMap = Record<string, IHrFile>;

export type PostSave = (files: Array<IEmployeeFile>, expirationReminder?: number, category?: string, s_file_type?: string) => Promise<void>;

interface Props {
    user: IUser;
    employeeFiles: Array<IEmployeeFile>;
    setEmployeeFiles: React.Dispatch<React.SetStateAction<Array<IEmployeeFile>>>;
    selectedEmployee: IEmployee;
}

export default function Files({ user, employeeFiles, setEmployeeFiles, selectedEmployee }: Props) {

    const [fileTypesMap, setFileTypesMap] = useState<FileTypesMap>({});
    const [open, setOpen] = useState(false);
    const [s_transaction_id, set_s_transaction_id] = useState('');
    const [expiration_date, set_expiration_date] = useState('');
    const [selectedFile, setSelectedFile] = useState<IEmployeeFile>();
    const [viewFile, setViewFile] = useState(false);

    useEffect(() => {
        const getFileTypes = async () => {
            try {
                const res = await apiClient.get(`/hr-settings/file-type`);
                const fileTypes: Array<IHrFile> = res.data;
                const map: FileTypesMap = {};
                for (const type of fileTypes) {
                    map[type.name] = type;
                }
                setFileTypesMap(map);
            } catch (err) {
                alert(err);
            }
        }
        set_s_transaction_id(uuidv4());
        getFileTypes();
    }, []);

    const postSave: PostSave = async (files: Array<IEmployeeFile>, expirationReminder?: number, category?: string, s_file_type?: string) => {
        if (!files || !files.length) return;
        try {
            const file = files[0];
            let reminder_date;
            if (expirationReminder) {
                reminder_date = moment(expiration_date).subtract(expirationReminder, 'days');
            }
            const employee_id = selectedEmployee.id;
            const data = {
                file: {
                    employee_id,
                    file_id: file.id,
                    expiration_date,
                    reminder_date,
                    category
                },
                log: {
                    employee_id,
                    employeeLog: `Employee file created: ${s_file_type}`,
                    created: getTsDate(),
                    createdBy: user.s_email
                }
            }
            await apiClient.post('/employeeFiles', data);
            const addFile: IEmployeeFile = file;
            addFile.employee_id = employee_id;
            addFile.file_id = file.id;
            // @ts-ignore
            addFile.expiration_date = expiration_date;

            setEmployeeFiles(prev => [...prev, addFile]);
            set_expiration_date('');
            notify('File Added');
        } catch (err) {
            alert(err);
        }
    }

    const handleViewFile = async (file: IEmployeeFile) => {
        const { s_file_name, s_container } = file;
        console.log(s_file_name);
        try {
            const res = await apiClient.post('getBlobAccessLink', {
                data: {
                    s_file_name,
                    s_container
                }
            });
            file.accessLink = res.data;
            setSelectedFile(file);
            setViewFile(true);
        } catch (err) {
            alert(err);
        }
    }

    const deleteHrFile = async () => {
        if (!selectedFile) return;
        try {
            const log = `Employee File Deleted: ${selectedFile.s_file_type}`;
            await apiClient.post(`/deleteHrFile`, {
                employee_id: selectedFile.employee_id,
                file_id: selectedFile.file_id,
                name: selectedFile.s_file_name,
                log: log,
                created: getTsDate(),
                createdBy: user.s_email
            });
            setEmployeeFiles(prev => {
                const deleteIndex = prev.findIndex(file => file.employee_id === selectedFile.employee_id && file.file_id === selectedFile.file_id);
                const filtered = prev.filter((file, index) => index !== deleteIndex);
                return filtered;
            });
            setViewFile(false);
            notify('File Deleted');
        } catch (err) {
            alert(err);
        }  
    }

    return (
        <div>
            <ActionIcon type={'add'} onClick={() => setOpen(true)} />
            <VirtualTable 
                data={employeeFiles}
                mapping={[{
                    name: 'Type',
                    value: 's_file_type'
                }, {
                    name: 'Expires',
                    value: 'expiration_date',
                    date: true,
                    utc: true
                }, {
                    name: 'Created by',
                    value: 's_created_by',
                    email: true
                }, {
                    name: 'Created',
                    value: 't_created',
                    datetime: true
                }]}
                numRows={5}
                handleClick={(file: IEmployeeFile) => handleViewFile(file)}
                enableClick
            />
            <UploadFiles<IEmployeeFile>
                open={open}
                setOpen={setOpen}
                requiredName={''}
                user={user}
                s_container={'hr-files'}
                s_type={'HR'}
                s_transaction_id={s_transaction_id}
                fileTypesMap={fileTypesMap}
                postSave={postSave}
                additionalDisabled={false}
                expiration_date={expiration_date}
                set_expiration_date={set_expiration_date}
                requiredFileType={'jpeg'}
                multiple
            />
            <ViewFile 
                modal={viewFile}
                setModal={setViewFile}
                file={selectedFile}
                deleteHrFile={deleteHrFile}
            />
        </div>
    );
}
