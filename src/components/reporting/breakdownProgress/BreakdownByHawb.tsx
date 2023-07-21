import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';

import BackButton from '../../custom/BackButton';
import ActionIcon from '../../custom/ActionIcon';
import { Table } from 'reactstrap';
import apiClient from '../../../apiClient';
import { formatMawb, print } from '../../../utils';
import { ICorpStation, IUser } from '../../../globals/interfaces';
import { renderToString } from 'react-dom/server';
import CreateBreakdownProgressByHawbReport from './CreateBreakdownProgressByHawbReport';

interface DataMapValues {
    breakdownType: string;
    masterPcs: number;
    masterBrokenDown: number;
    hawbs: Array<{
        s_hawb: string;
        pcs: number;
        pcsBrokenDown: number;
    }>;
}

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    s_flight_id: string;
    stationInfo: Array<ICorpStation>;
    user: IUser;
}

export default function BreakdownByHawb({
    modal,
    setModal,
    s_flight_id,
    stationInfo,
    user,
}: Props) {
    const toggle = () => setModal(!modal);
    const [dataMap, setDataMap] = useState<Record<string, DataMapValues>>({});

    useEffect(() => {
        const getBreakdownProgressByHawb = async (s_flight_id: string) => {
            const parts = s_flight_id.split('/');
            const res = await apiClient.get(
                `/breakdownProgressByHawb?s_flight_number=${parts[0]}&d_arrival_date=${parts[1]}`
            );
            if (res.status === 200) {
                setDataMap(res.data);
            }
        };
        if (s_flight_id) {
            getBreakdownProgressByHawb(s_flight_id);
        }
    }, [s_flight_id]);

    const printReport = () => {
        print(
            <CreateBreakdownProgressByHawbReport
                user={user}
                s_flight_id={s_flight_id}
                stationInfo={stationInfo}
                dataMap={dataMap}
            />
        );
    };

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>
                        Breakdown by HAWB for Flight {s_flight_id}
                    </h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <CustomTable striped bordered>
                    <thead>
                        <tr>
                            <th>MAWB</th>
                            <th>HAWB</th>
                            <th>Pieces</th>
                            <th>Breakdown Type</th>
                            <th>Pieces Broken Down</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(dataMap).map((key) => (
                            <tr key={key}>
                                <td>
                                    <MasterParagraph>
                                        {formatMawb(key)}
                                    </MasterParagraph>
                                    <p>{dataMap[key].hawbs.length} HAWBs</p>
                                </td>
                                <td>
                                    <MasterParagraph>{'-'}</MasterParagraph>
                                    {dataMap[key].hawbs.map((hawb, i) => (
                                        <p key={i}>{hawb.s_hawb}</p>
                                    ))}
                                </td>
                                <td className={'text-right'}>
                                    <MasterParagraph>
                                        {dataMap[key].masterPcs}
                                    </MasterParagraph>
                                    {dataMap[key].hawbs.map((hawb, i) => (
                                        <p key={i}>{hawb.pcs}</p>
                                    ))}
                                </td>
                                <td className={'text-center'}>
                                    <p>{dataMap[key].breakdownType}</p>
                                </td>
                                <td className={'text-right'}>
                                    <MasterParagraph>
                                        {dataMap[key].masterBrokenDown}
                                    </MasterParagraph>
                                    {dataMap[key].hawbs.map((hawb, i) => (
                                        <p key={i}>{hawb.pcsBrokenDown}</p>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </CustomTable>
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <FooterButtonsContainer>
                        <ActionIcon
                            type={'print'}
                            onClick={() => printReport()}
                        />
                    </FooterButtonsContainer>
                </FooterContentContainer>
            </ExpandedFooter>
        </Modal>
    );
}

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const ExpandedFooter = styled(ModalFooter)`
    width: 100%;
`;

const FooterContentContainer = styled.div`
    width: 100%;
`;

const FooterButtonsContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
`;

const CustomTable = styled(Table)`
    thead {
        font-size: 16px;
    }
    p {
        font-size: 16px;
    }
`;

const MasterParagraph = styled.p`
    font-weight: bold;
    font-size: 18px;
`;
