import { useEffect, useState } from "react";
import { IHrFile, IUser } from "../../../globals/interfaces";
import { notify, omit } from "../../../utils";
import apiClient from "../../../apiClient";
import _ from "lodash";
import ModalFile from "./ModalFile";
import ActionIcon from "../../../components/custom/ActionIcon";
import VirtualTable from "../../../components/custom/VirtualTable";

interface Props {
    user: IUser;
}

export default function Files ({
    user
}: Props) {

    const [hrFiles, setHrFiles] = useState<Array<IHrFile>>([]);
    const [selectedFile, setSelectedFile] = useState<IHrFile>();
    const [modal, setModal] = useState(false);

    useEffect(() => {
        const getFileTypes = async () => {
            try {
                const res = await apiClient.get(`/hr-settings/file-type`);
                setHrFiles(res.data);
            } catch (err) {
                alert(err);
            }
        }
        getFileTypes();
    }, []);

    const handleAddUpdate = (file?: IHrFile) => {
        if (file) {
            setSelectedFile(file);
        } else {
            setSelectedFile(undefined);
        }
        setModal(true);
    }

    const createUpdateFile = async (data: IHrFile) => {
        const useData: Omit<IHrFile, 'id'> = omit(data, 'id');
        if (selectedFile) {
            try {
                await apiClient.put(`/hr-settings/file-type/${selectedFile.id}`, useData);
                setHrFiles(prev => {
                    const copy = _.cloneDeep(prev);
                    const updateId = copy.findIndex(c => c.id === selectedFile.id);
                    copy[updateId] = data;
                    return copy;
                });
                setModal(false);
                notify('Updated');
            } catch (err) {
                alert(err);
            }
        } else {
            try {
                const res = await apiClient.post(`/hr-settings/file-type`, useData);
                setHrFiles(prev => {
                    const copy = _.cloneDeep(prev);
                    copy.push(res.data);
                    return copy;
                });
                setModal(false);
                notify('Success');
            } catch (err) {
                alert(err);
            }
        }
    }

    const deleteFile = async (id: number) => {
        try {
            await apiClient.delete(`/hr-settings/file-type/${id}`);
            setHrFiles(prev => {
                const filtered = prev.filter(file => file.id !== id);
                return filtered;
            });
            notify('Deleted');
            setModal(false);
        } catch (err) {
            alert(err);
        }
    }

    return (
        <div>
            <ActionIcon type={'add'} onClick={() => handleAddUpdate()} />
            <VirtualTable 
                data={hrFiles}
                mapping={[{
                    name: 'Name',
                    value: 'name'
                }, {
                    name: 'Category',
                    value: 'category'
                }, {
                    name: 'Expires',
                    value: 'expires',
                    boolean: true
                }, {
                    name: 'Expiration Reminder in Days',
                    value: 'expirationReminder',
                    number: true
                }, {
                    name: 'Created by',
                    value: 'createdBy',
                    email: true
                }, {
                    name: 'Created',
                    value: 'created',
                    datetime: true,
                    utc: true
                }, {
                    name: 'Modified by',
                    value: 'modifiedBy',
                    email: true
                }, {
                    name: 'Modified',
                    value: 'modified',
                    datetime: true,
                    utc: true
                }]}
                numRows={10}
                handleClick={(item: IHrFile) => handleAddUpdate(item)}
            />
            <ModalFile 
                modal={modal}
                setModal={setModal}
                user={user}
                selectedFile={selectedFile}
                createUpdateFile={createUpdateFile}
                deleteFile={deleteFile}
            />
        </div>
    );
}