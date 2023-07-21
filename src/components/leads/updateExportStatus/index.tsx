import React, { useState, useEffect } from 'react';
import { Label } from 'reactstrap';
import styled from 'styled-components';

import ReactTable from '../../custom/ReactTable';
import Layout from '../../custom/Layout';
import MawbInput from '../../custom/MawbInput';
import { api, validateAwb } from '../../../utils';
import useLoading from '../../../customHooks/useLoading';
import Modal from './Modal';
import { IExport } from '../../../globals/interfaces';
import { useAppContext } from '../../../context';

export default function UpdateExportStatus () {

    const { user } = useAppContext();
    const { setLoading } = useLoading();
    const [s_mawb, set_s_mawb] = useState('');
    const [awbs, setAwbs] = useState<Array<IExport>>([]);
    const [modal, setModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IExport>();

    const handleSelectItem = (item: IExport) => {
        setSelectedItem(item);
        setModal(true);
    }

    useEffect(() => {
        const searchExportAwbs = async () => {
            setLoading(true);
            const res = await api('get', `updateExportStatus/${s_mawb}`);
            setLoading(false);
            setAwbs(res.data);
        }
        if (validateAwb(s_mawb)) {
            searchExportAwbs();
        }
    }, [s_mawb]);

    return (
        <Layout>
            <h1>Update Export Record Status</h1>
            <SearchAwbContainer>
                <Label className={'mr-2'}>Search MAWB</Label>
                <MawbInput 
                    value={s_mawb}
                    onChange={set_s_mawb}
                />
            </SearchAwbContainer>
            <ReactTable 
                data={awbs}
                mapping={[{
                    name: 'MAWB',
                    value: 's_mawb',
                    s_mawb: true
                }, {
                    name: 'Status',
                    value: 's_status'
                }, {
                    name: 'Created',
                    value: 't_created',
                    datetime: true,
                    utc: true
                }, {
                    name: 'Created by',
                    value: 's_created_by',
                    email: true
                }, {
                    name: 'Modified',
                    value: 't_modified',
                    datetime: true,
                    utc: true
                }, {
                    name: 'Modified by',
                    value: 's_modified_by',
                    email: true
                }]}
                numRows={10}
                enableClick={true}
                handleClick={handleSelectItem}
            />
            <Modal 
                modal={modal}
                setModal={setModal}
                selectedItem={selectedItem}
                setAwbs={setAwbs}
                user={user}
            />
        </Layout>
    );
}

const SearchAwbContainer = styled.div`
    display: flex;
    align-items: baseline;
    padding-bottom: 10px;
`;
