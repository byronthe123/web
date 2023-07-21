import { useEffect, useState } from 'react';
import _ from 'lodash';

import { ICharge, ICorpStation, IUser } from '../../../../globals/interfaces';
import ActionIcon from '../../../custom/ActionIcon';
import ReactTable from '../../../custom/ReactTable';
import Modal from './Modal';
import { api, notify } from '../../../../utils';

interface Props {
    activeTabId: string;
    tabId: string;
    user: IUser;
    charges: Array<ICharge>;
    setCharges: React.Dispatch<React.SetStateAction<Array<ICharge>>>;
    stations: Array<ICorpStation>;
}

export default function Charges ({  
    activeTabId,
    tabId,
    user, 
    stations
}: Props) {

    const [charges, setCharges] = useState<Array<ICharge>>([]);
    const [modal, setModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ICharge>();

    useEffect(() => {
        const getCharges = async () => {
            const res = await api('get', 'charge');
            if (res.status === 200) {
                setCharges(res.data);
            }
        }
        if (
            (activeTabId === tabId) && 
            charges.length === 0
        ) {
            getCharges();
        }
    }, [activeTabId, tabId, charges]);

    const handleCreateUpdate = (selectedItem?: ICharge) => {
        if (selectedItem) {
            setSelectedItem(selectedItem);
        } else {
            setSelectedItem(undefined);
        }
        setModal(true);
    }

    const createUpdateCharge = async (data: ICharge, update: boolean) => {
        const method = update ? 'put' : 'post';
        const res = await api(method, 'charge', data);
        if ([200, 204].includes(res.status)) {
            console.log(res.data);
            setCharges(prev => {
                const copy = _.cloneDeep(prev);
                if (update) {
                    for (let i = 0; i < copy.length; i++) {
                        if (copy[i].id === data.id) {
                            for (let key in data) {
                                // @ts-ignore
                                copy[i][key] = data[key];
                            }
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
    }

    const deleteCharge = async (id: number) => {
        const res = await api('delete', `charge/${id}`);
        if (res.status === 204) {
            setCharges(prev => {
                const filtered = prev.filter(c => c.id !== id);
                return filtered;
            });
            setModal(false);
            notify('Deleted');
        }
    }

    return (
        <div>
            <ActionIcon 
                type='add'
                onClick={() => handleCreateUpdate()}
            />
            <ReactTable 
                data={charges}
                mapping={[{
                    name: 'Unit',
                    value: 's_unit'
                }, {
                    name: 'Name',
                    value: 's_name'
                }, {
                    name: 'Multiplier',
                    value: 'f_multiplier'
                }, {
                    name: 'UOM',
                    value: 's_uom'
                }, {
                    name: 'Created by',
                    value: 's_created_by',
                    email: true
                }, {
                    name: 'Created',
                    value: 't_created',
                    datetime: true,
                    utc: true
                }, {
                    name: 'Modified by',
                    value: 's_modified_by',
                    email: true
                }, {
                    name: 'Modified',
                    value: 't_modified',
                    datetime: true,
                    utc: true
                }]}
                enableClick
                handleClick={handleCreateUpdate}
                numRows={10}
            />
            <Modal 
                modal={modal}
                setModal={setModal}
                user={user}
                stations={stations}
                selectedItem={selectedItem}
                createUpdateCharge={createUpdateCharge}
                deleteCharge={deleteCharge}
            />
        </div>
    );
}