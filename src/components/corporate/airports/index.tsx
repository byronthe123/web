import { useEffect, useState } from "react";
import _ from "lodash";
import styled from "styled-components";

import ReactTable from '../../custom/ReactTable';
import { useAppContext } from "../../../context";
import { IAirport } from "../../../globals/interfaces";
import { api, getTsDate, notify } from "../../../utils";
import ActionIcon from "../../custom/ActionIcon";
import ModalManage from "./ModalManage";

interface Props {
    activeTabId: string;
    tabId: string;
}

export default function Airports ({
    activeTabId,
    tabId
}: Props) {
    const { user } = useAppContext();
    const [data, setData] = useState<Array<IAirport>>([]);
    const [selectedItem, setSelectedItem] = useState<IAirport>();
    const [modal, setModal] = useState(false);

    const createAirport = async (data: any) => {
        const res = await api('post', '/airport', data);
        if (res.status === 200) {
            setData(prev => {
                const copy = _.cloneDeep(prev);
                copy.push(res.data);
                return copy;
            });
            setModal(false);
            notify('Created');
        }
    }

    const updateAirport = async (data: any) => {
        if (!selectedItem) return;
        delete data.id;

        const res = await api('put', `/airport/${selectedItem.id}`, data);
        if (res.status === 204) {
            setData(prev => {
                const copy = _.cloneDeep(prev);
                const updateItemIndex = copy.findIndex(item => item.id === selectedItem.id);
                copy[updateItemIndex] = data;
                return copy;
            });
            setModal(false);
            notify('Updated');
        }
    }

    const deleteAirport = async (id: number) => {
        const res = await api('delete', `/airport/${id}`);
        if (res.status === 204) {
            setData(prev => {
                const filtered = prev.filter(item => item.id !== id);
                return filtered;
            });
            notify('Deleted');
            setModal(false);
        }
    }

    const handleCreateUpdate = (item?: IAirport) => {
        if (item) {
            setSelectedItem(item);
        } else {
            setSelectedItem(undefined);
        }
        setModal(true);
    }

    useEffect(() => {
        const getData = async () => {
            const res = await api('get', '/airport');
            console.log(res.data);
            setData(res.data);
        }
        if (activeTabId === tabId) {
            getData();
        }
    }, [activeTabId, tabId]);

    return (
        <Container>
            <ActionIcon 
                type={'add'}
                onClick={() => handleCreateUpdate()}
            />
            <ReactTable 
                data={data}
                mapping={[{
                    name: 'Code',
                    value: 'code'
                },{
                    name: 'ICAO',
                    value: 'icao'
                }, {
                    name: 'Airport Name',
                    value: 'name'
                }, {
                    name: 'Country Code',
                    value: 'countryCode'
                }, {
                    name: 'Country',
                    value: 'country'
                }, {
                    name: 'City Code',
                    value: 'cityCode'
                }, {
                    name: 'City',
                    value: 'city'
                }, {
                    name: 'Created by',
                    value: 'createdBy',
                    email: true
                }, {
                    name: 'Created at',
                    value: 'createdAt',
                    datetime: true,
                    utc: true
                },{
                    name: 'Modified by',
                    value: 'modifiedBy',
                    email: true
                }, {
                    name: 'Modified at',
                    value: 'modifiedAt',
                    datetime: true,
                    utc: true
                }]}
                index
                enableClick
                numRows={15}
                handleClick={item => handleCreateUpdate(item)}
            />
            <ModalManage 
                modal={modal}
                setModal={setModal}
                user={user}
                selectedItem={selectedItem}
                createAirport={createAirport}
                updateAirport={updateAirport}
                deleteAirport={deleteAirport}
            />
        </Container>
    );
}

const Container = styled.div``;