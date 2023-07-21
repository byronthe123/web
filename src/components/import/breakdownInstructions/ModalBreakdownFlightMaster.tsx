import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import styled from 'styled-components';

import BackButton from '../../custom/BackButton';
import { IExtendedULD, IExtendedFFM } from './interfaces';
import ReactTable from '../../custom/ReactTable';
import ModalConfirmation from '../../custom/ModalConfirmation';
import { formatMawb, getTsDate, notify } from '../../../utils';
import apiClient from '../../../apiClient';
import { IUser } from '../../../globals/interfaces';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    ulds: Array<IExtendedULD>;
    s_flight_id: string;
    user: IUser;
    updateAwbs: (s_mawb: string, s_flight_id: string) => void;
}

export default function ModalBreakdownFlightMaster({
    modal,
    setModal,
    ulds,
    s_flight_id,
    user,
    updateAwbs
}: Props) {
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [awbs, setAwbs] = useState<Array<IExtendedFFM>>([]);
    const [s_mawb, set_s_mawb] = useState('');

    useEffect(() => {
        const awbsMap: Record<string, IExtendedFFM> = {};
        for (const uld of ulds) {
            const { awbs } = uld;
            for (const awb of awbs) {
                if (!awbsMap[awb.s_mawb]) {
                    awbsMap[awb.s_mawb] = awb;
                }
            }
        }
        const _awbs = Object.keys(awbsMap).map((key: string) => awbsMap[key]);
        setAwbs(_awbs);
    }, [ulds]);

    const launchConfirmation = (awb: string) => {
        set_s_mawb(awb);
        setModalConfirmation(true);
    };

    const breakdownAwbsByFlightMaster = async () => {
        await apiClient.put('/breakdownAwbsByFlightMaster', {
            s_flight_id,
            s_mawb,
            s_modified_by: user.s_email,
            t_modified: getTsDate(),
        });
        updateAwbs(s_mawb, s_flight_id);
        notify('Breakdown Instructions updated');
    };

    const toggle = () => setModal(!modal);

    return (
        <>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader className={'d-flex'}>
                    <HeaderContainer>
                        <BackButton onClick={toggle} />
                        <h4 className={'pl-2'}>{s_flight_id}</h4>
                    </HeaderContainer>
                </ModalHeader>
                <ModalBody>
                    <ReactTable
                        data={awbs}
                        mapping={[
                            {
                                name: 'MAWB',
                                value: 's_mawb',
                                s_mawb: true,
                            },
                            {
                                name: 'HAWB',
                                value: 'hawbsCount',
                                mediumWidth: true,
                                number: true
                            },
                            {
                                name: 'Breakdown by HAWB',
                                value: 'fas fa-edit text-success hover-pointer',
                                icon: true,
                                customWidth: 150,
                                function: (item: IExtendedFFM) => {
                                    launchConfirmation(item.s_mawb);
                                },
                                showCondition: (item: IExtendedFFM) =>
                                    item.hasHawb,
                            },
                        ]}
                        numRows={10}
                    />
                </ModalBody>
            </Modal>
            <ModalConfirmation
                modal={modalConfirmation}
                setModal={setModalConfirmation}
                message={`Are you sure you want to change this MAWB ${formatMawb(
                    s_mawb
                )} to breakdown by house in Flight ${s_flight_id}?`}
                confirm={() => breakdownAwbsByFlightMaster()}
            />
        </>
    );
}

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;
