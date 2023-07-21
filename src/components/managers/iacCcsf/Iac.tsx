import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../../context';
import { IIac } from '../../../globals/interfaces';
import { api, notify } from '../../../utils';
import ActionIcon from '../../custom/ActionIcon';

import ReactTable from '../../custom/ReactTable';
import IacModal from './IacModal';

interface Props {
    activeTabId: string;
}

export default function Iac ({
    activeTabId
}: Props) {

    const { user } = useAppContext();
    const [data, setData] = useState<Array<IIac>>([]);
    const [modal, setModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IIac>();

    useEffect(() => {
        const getIacData = async () => {
            const res = await api('get', '/iacCcsf/iac');
            if (res.status === 200) {
                setData(res.data);
            }
        }
        if (activeTabId === 'iac' && data.length === 0) {
            getIacData();
        }
    }, [activeTabId, data]);

    const manageItem = (selectedItem?: IIac) => {
        if (selectedItem) {
            setSelectedItem(selectedItem);
        } else {
            setSelectedItem(undefined);
        }
        setModal(true);
    }

    const createItem = async (data: IIac) => {
        const res = await api('post', '/iacCcsf/iac', data);
        if (res.status === 200) {
            notify('Created');
            setData(prev => {
                const copy = _.cloneDeep(prev);
                copy.push(res.data);
                return copy;
            });
            setModal(false);
        }
    }

    const updateItem = async (data: IIac) => {
        const res = await api('put', '/iacCcsf/iac', data);
        if (res.status === 200) {
            notify('Updated');
            setData(prev => {
                const copy = _.cloneDeep(prev);
                const updateIndex = copy.findIndex(item => item.id === data.id);
                copy[updateIndex] = res.data;
                return copy;
            });
            setModal(false);
        }
    }

    const handleCreateUpdate = (update: boolean, data: IIac) => {
        const fn = update ? updateItem : createItem;
        fn(data);
    }

    const deleteItem = async (id: number) => {
        const res = await api('delete', `/iacCcsf/iac/${id}`);
        if (res.status === 204) {
            notify('Deleted');
            setData(prev => {
                const filtered = prev.filter(item => item.id !== id);
                return filtered;
            });
            setModal(false);
        }
    }

    return (
        <div>
            <div className={'text-right'}>
                <ActionIcon 
                    type={'add'}
                    onClick={manageItem}
                />
            </div>
            <ReactTable 
                data={data}
                mapping={[{
                    name: 'Number',
                    value: 'approval_number'
                }, {
                    name: 'Carrier',
                    value: 'indirect_carrier_name'
                }, {
                    name: 'IACSSP_08_001',
                    value: 'IACSSP_08_001'
                }, {
                    name: 'City',
                    value: 'city'
                }, {
                    name: 'State',
                    value: 'state',
                    customWidth: 50
                }, {
                    name: 'Zip code',
                    value: 'postal_code',
                    customWidth: 150
                }, {
                    name: 'Expiration',
                    value: 'expiration_date',
                    date: true,
                    utc: true
                }, {
                    name: 'Valid',
                    value: 'valid',
                    boolean: true,
                    customWidth: 50
                }]}
                index
                enableClick
                handleClick={manageItem}
            />
            <IacModal 
                modal={modal}
                setModal={setModal}
                selectedItem={selectedItem}
                handleCreateUpdate={handleCreateUpdate}
                deleteItem={deleteItem}
                user={user}
            />
        </div>
    );
}