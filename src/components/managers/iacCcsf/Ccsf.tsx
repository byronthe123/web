import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../../context';
import { ICcsf } from '../../../globals/interfaces';
import { api, notify } from '../../../utils';
import ActionIcon from '../../custom/ActionIcon';

import ReactTable from '../../custom/ReactTable';
import CcsfModal from './CcsfModal';

interface Props {
    activeTabId: string;
}

export default function Iac ({
    activeTabId
}: Props) {

    const { user } = useAppContext();
    const [data, setData] = useState<Array<ICcsf>>([]);
    const [modal, setModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ICcsf>();

    useEffect(() => {
        const getIacData = async () => {
            const res = await api('get', '/iacCcsf/ccsf');
            if (res.status === 200) {
                setData(res.data);
            }
        }
        if (activeTabId === 'ccsf' && data.length === 0) {
            getIacData();
        }
    }, [activeTabId, data]);

    const manageItem = (selectedItem?: ICcsf) => {
        if (selectedItem) {
            setSelectedItem(selectedItem);
        } else {
            setSelectedItem(undefined);
        }
        setModal(true);
    }

    const createItem = async (data: ICcsf) => {
        const res = await api('post', '/iacCcsf/ccsf', data);
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

    const updateItem = async (data: ICcsf) => {
        const res = await api('put', '/iacCcsf/ccsf', data);
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

    const handleCreateUpdate = (update: boolean, data: ICcsf) => {
        const fn = update ? updateItem : createItem;
        fn(data);
    }

    const deleteItem = async (id: number) => {
        const res = await api('delete', `/iacCcsf/ccsf/${id}`);
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
                    name: 'CCSF Number',
                    value: 'approval_number'
                }, {
                    name: 'IAC Number',
                    value: 'iac_number'
                }, {
                    name: 'Cargo Screening Facility',
                    value: 'certified_cargo_screening_facility_name'
                }, {
                    name: 'Street',
                    value: 'street_address'
                },  {
                    name: 'City',
                    value: 'city'
                }, {
                    name: 'State',
                    value: 'state',
                    customWidth: 50
                }, {
                    name: 'Expiration',
                    value: 'ccsf_expiration_date',
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
            <CcsfModal 
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