import { useState } from 'react';
import styled from 'styled-components';
import { Input } from 'reactstrap';


import { IFFM, IULD } from '../../../globals/interfaces';
import apiClient from '../../../apiClient';
import ReactTable from '../../../components/custom/ReactTable';
import ModalHistory from './ModalHistory';

export interface UldWithMasters extends IULD {
    ffms: Array<IFFM>;
}

export default function UldHistory () {

    const [s_uld, set_s_uld] = useState('');
    const [ulds, setUlds] = useState<Array<UldWithMasters>>([]);
    const [uld, setUld] = useState<UldWithMasters>();
    const [modalHistory, setModalHistory] = useState(false);

    const searchUlds = async (e: any) => {
        e.preventDefault();
        if (!s_uld || !s_uld.length) return;

        const res = await apiClient.get(`/uld/${s_uld}`);
        if (res.status === 200) {
            setUlds(res.data);
        }
    }

    const viewUld = (uld: UldWithMasters) => {
        setUld(uld);
        setModalHistory(true);
    }

    return (
        <Container>
            <FlexContainer onSubmit={searchUlds}>
                <h6>Search ULD</h6>
                <CustomInput value={s_uld} onChange={(e: any) => set_s_uld(e.target.value)} />
                <CustomIcon className="fa-solid fa-magnifying-glass hover" onClick={searchUlds} />
            </FlexContainer>
            <ReactTable 
                data={ulds}
                mapping={[{
                    name: 'Flight ID',
                    value: 's_flight_id'
                }, {
                    name: 'Time Accepted',
                    value: 't_user_accepted_uld',
                    datetime: true,
                    utc: true
                }, {
                    name: 'Time Opened',
                    value: 't_user_opened_uld',
                    datetime: true,
                    utc: true
                }, {
                    name: 'Time Closed',
                    value: 't_user_closed_uld',
                    datetime: true,
                    utc: true
                }, {
                    name: 'SHC',
                    value: 's_shc'
                }]}
                numRows={10}
                enableClick
                handleClick={(item: UldWithMasters) => viewUld(item)}
            />
            <ModalHistory 
                modal={modalHistory}
                setModal={setModalHistory}
                uld={uld}
            />
        </Container>
    );
}

const Container = styled.div`

`;

const FlexContainer = styled.form`
    display: flex;
    align-items: baseline;
    gap: 10px;
`;

const CustomInput = styled(Input)`
    width: 200px;
`;

const CustomIcon = styled.i`
    font-size: 20px;
    padding-top: 5px;
`;