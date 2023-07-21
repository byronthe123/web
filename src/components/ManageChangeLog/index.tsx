import { useEffect, useState } from "react";
import { IChangeLog } from "../../globals/interfaces";
import apiClient from "../../apiClient";
import VirtualTable from "../custom/VirtualTable";
import ActionIcon from "../custom/ActionIcon";
import ModalChageLog from "./ModalChageLog";
import { useAppContext } from "../../context";
import { notify, omit } from "../../utils";
import _ from 'lodash';

interface Props {
    activeTab: string;
}

export default function ManageChangeLog ({
    activeTab
}: Props) {

    const { user } = useAppContext();
    const [data, setData] = useState<Array<IChangeLog>>([]);
    const [modal, setModal] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<IChangeLog>();

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await apiClient.get(`/change-log`);
                setData(res.data);
            } catch (err) {
                alert(err);
            }
        }
        if (activeTab === 'changeLog') {
            getData();
        }
    }, [activeTab]);

    const handleCreateUpdate = (item?: IChangeLog) => {
        if (item) {
            setSelectedEntry(item);
        } else {
            setSelectedEntry(undefined);
        }
        setModal(true);
    }

    const handleCloseModal = (message: string) => {
        setModal(false);
        notify(message);
    }

    const submit = async (data: IChangeLog) => {
        if (selectedEntry) {
            try {
                const useData: Omit<IChangeLog, 'id'> = omit(data, 'id');
                await apiClient.put(`/change-log/${data.id}`, useData);
                setData(prev => {
                    const copy = _.cloneDeep(prev);
                    const updateIndex = copy.findIndex(item => item.id === selectedEntry.id);
                    copy[updateIndex] = data;
                    return copy;
                });
                handleCloseModal('Updated');
            } catch (err) {
                alert(err);
            }
        } else {
            try {
                const res = await apiClient.post(`/change-log`, data);
                setData(prev => [res.data, ...prev]);
                setModal(false);
                handleCloseModal('Created');
            } catch (err) {
                alert(err);
            }
        }
    }

    const deleteEntry = async (id: number) => {
        try {
            await apiClient.delete(`/change-log/${id}`);
            setData(prev => prev.filter(item => item.id !== id));
            setModal(false);
            handleCloseModal('Deleted');
        } catch (err) {
            alert(err);
        }
    }

    return (
        <div>
            <ActionIcon type={'add'} onClick={() => handleCreateUpdate()} />
            <VirtualTable 
                data={data}
                mapping={[{
                    name: 'Version',
                    value: 'version'
                }, {
                    name: 'Release Date',
                    value: 'date',
                    date: true,
                    utc: true
                }, {
                    name: 'Type',
                    value: 'type'
                }, {
                    name: 'Title',
                    value: 'title'
                }, {
                    name: 'Detail',
                    value: 'detail'
                }, {
                    name: 'URL',
                    value: 'url'
                }]}
                numRows={10}
                handleClick={item => handleCreateUpdate(item)}
            />
            <ModalChageLog 
                modal={modal}
                setModal={setModal}
                selectedEntry={selectedEntry}
                user={user}
                submit={submit}
                deleteEntry={deleteEntry}
            />
        </div>
    );
}