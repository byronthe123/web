import React, { useState, useEffect } from 'react';

import { useAppContext } from '../../../../context';
import { ICbpAceCode } from '../../../../globals/interfaces';
import { addLocalValue, api, deleteLocalValue, updateLocalValue, notify } from '../../../../utils';
import ReactTable from '../../../custom/ReactTable';
import ActionIcon from '../../../custom/ActionIcon';
import Modal from './Modal';

interface Props {
    activeTabId: string;
    tabId: string;
}

export default function AceCbp ({
    activeTabId,
    tabId
}: Props) {
    const { user } = useAppContext();
    const [cbpAceCodes, setCbpAceCodes] = useState<Array<ICbpAceCode>>([]);
    const [modal, setModal] = useState(false);
    const [update, setUpdate] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ICbpAceCode>();

    useEffect(() => {
        const getAbpAceCodes = async () => {
            const res = await api('get', 'cbpAceCodes');
            setCbpAceCodes(res.data);
        }

        if (activeTabId === tabId) {
            getAbpAceCodes();
        }
    }, [activeTabId, tabId]);

    const handleCreateUpdate = (update: boolean, item?: ICbpAceCode) => {
        if (update && item) {
            setSelectedItem(item);
        } else {
            setSelectedItem(undefined);
        }
        setUpdate(update);
        setModal(true);
    }

    const createUpdateData = async (data: any) => {
        let method = 'post';
        if (update) {
            method = 'put';
        }
        const res = await api(method, 'cbpAceCodes', data);

        if (update && selectedItem) {
            updateLocalValue(cbpAceCodes, setCbpAceCodes, selectedItem.id, res.data);
        } else {
            addLocalValue(cbpAceCodes, setCbpAceCodes, res.data);
        }

        setModal(false);
        notify('Success');
    }

    const deleteCbpAceCode = async (id: number) => {
        await api('delete', `cbpAceCodes/${id}`);
        deleteLocalValue(cbpAceCodes, setCbpAceCodes, id);
        setModal(false);
        notify('Deleted');
    }

    return (
        <div>
            <ActionIcon 
                type={'add'}
                onClick={() => handleCreateUpdate(false)}
            />
            <ReactTable 
                data={cbpAceCodes}
                mapping={[{
                    name: 'Code',
                    value: 's_code',
                    smallWidth: true
                }, {
                    name: 'Customs Hold',
                    value: 'b_customs_hold',
                    boolean: true,
                    customWidth: 140
                }, {
                    name: 'USDA Hold',
                    value: 'b_usda_hold',
                    boolean: true,
                    customWidth: 140
                }, {
                    name: 'Choice Hold',
                    value: 'b_hold',
                    boolean: true,
                    customWidth: 140
                }, {
                    name: 'General Order',
                    value: 'b_general_order',
                    boolean: true,
                    customWidth: 140
                },{
                    name: 'Description',
                    value: 's_description'
                }, {
                    name: 'Reason',
                    value: 's_reason'
                }]}
                index={true}
                numRows={10}
                enableClick={true}
                handleClick={(item: ICbpAceCode) => handleCreateUpdate(true, item)}
            />
            <Modal 
                modal={modal}
                setModal={setModal}
                selectedItem={selectedItem}
                update={update}
                user={user}
                createUpdateData={createUpdateData}
                deleteCbpAceCode={deleteCbpAceCode}
            />
        </div>
    );
}