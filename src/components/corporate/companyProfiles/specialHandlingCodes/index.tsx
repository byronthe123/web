import _ from 'lodash';
import React, { useState, useEffect } from 'react';

import { ISpecialHandlingCode, IUser } from '../../../../globals/interfaces';
import { api, notify } from '../../../../utils';
import ActionIcon from '../../../custom/ActionIcon';
import ReactTable from '../../../custom/ReactTable';
import Modal from './Modal';

interface Props {
    activeTabId: string;
    tabId: string;
    user: IUser;
}

export default function SpecialHandlingCodes ({
    activeTabId,
    tabId,
    user
}: Props) {

    const [data, setData] = useState<Array<ISpecialHandlingCode>>([]);
    const [modal, setModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ISpecialHandlingCode>();

    useEffect(() => {
        const getSpecialHandlingCodes = async () => {
            const res = await api('get', 'specialHandlingCodes');
            setData(res.data);
        }

        if (activeTabId === tabId) {
            getSpecialHandlingCodes();
        }
    }, [activeTabId, tabId]);

    const handleCreateUpdate = (selectedItem?: ISpecialHandlingCode) => {
        setModal(true);
        if (selectedItem) {
            setSelectedItem(selectedItem);
        } else {
            setSelectedItem(undefined);
        }
    }

    const createUpdateShc = async (data: ISpecialHandlingCode, update: boolean) => {
        const method = update ? 'put' : 'post';
        const res = await api(method, 'specialHandlingCodes', data);

        setData(prev => {
            const copy = _.cloneDeep(prev);
            if (update) {
                for (let i = 0; i < copy.length; i++) {
                    if (copy[i].id === data.id) {
                        for (const key in data) {
                            // @ts-ignore
                            copy[i][key] = data[key];
                        }
                        break;
                    }
                }
            } else {
                copy.push(res.data);
            }
            return copy;
        });
        setModal(false);
        notify('Success');
    }

    const deleteShc = async (id: number) => {
        await api('delete', `specialHandlingCodes/${id}`);
        setData(prev => {
            const filtered = prev.filter(item => item.id !== id);
            return filtered;
        });
        setModal(false);
        notify('Deleted');
    }

    return (
        <div>
            <ActionIcon 
                type={'add'}
                onClick={() => handleCreateUpdate()}
            />
            <ReactTable 
                data={data}
                mapping={[{
                    name: 'SHC',
                    value: 's_special_handling_code',
                    smallWidth: true
                }, {
                    name: 'Description',
                    value: 's_description'
                }]}
                index={true}
                enableClick
                handleClick={handleCreateUpdate}
            />
            <Modal 
                modal={modal}
                setModal={setModal}
                selectedItem={selectedItem}
                user={user}
                createUpdateShc={createUpdateShc}
                deleteShc={deleteShc}
            />
        </div>
    );
}