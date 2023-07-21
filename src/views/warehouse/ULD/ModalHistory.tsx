import React from 'react';
import { Modal, ModalHeader, ModalBody, Table } from 'reactstrap';
import styled from 'styled-components';


import BackButton from '../../../components/custom/BackButton';
import { UldWithMasters } from './History';
import { formatDatetime } from '../../../utils';
import ReactTable from '../../../components/custom/ReactTable';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    uld: UldWithMasters | undefined;
}

export default function ModalHistory ({
    modal,
    setModal,
    uld
}: Props) {

    const toggle = () => setModal(!modal);

    if (!uld) return null;

    return (
        <CustomModal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <FlexContainer>
                        <BackButton onClick={toggle} />
                        <h4 className={'pl-2'}>ULD Details</h4>
                    </FlexContainer>
                    <h4>{uld.s_status}</h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <DetailsContainer>
                    <UldInfo>
                        <Table>
                            <thead>
                                <tr>
                                    <th>ULD</th>
                                    <th>{uld.s_uld}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Flight Manifested</td>
                                    <td>{uld.s_flight_id}</td>
                                </tr>
                                <tr>
                                    <td>Special Handling Codes</td>
                                    <td>{uld.s_shc}</td>
                                </tr>
                                <tr>
                                    <td>Messaged</td>
                                    <td>{formatDatetime(uld.t_created)}</td>
                                </tr>
                                <tr>
                                    <td>Messaged by</td>
                                    <td>{uld.s_created_by}</td>
                                </tr>
                                <tr>
                                    <td>Accepted</td>
                                    <td>{formatDatetime(uld.t_user_accepted_uld)}</td>
                                </tr>
                                <tr>
                                    <td>Accepted by</td>
                                    <td>{uld.s_user_accepted_uld}</td>
                                </tr>
                                <tr>
                                    <td>Opened</td>
                                    <td>{formatDatetime(uld.t_user_accepted_uld)}</td>
                                </tr>
                                <tr>
                                    <td>Opened by</td>
                                    <td>{uld.s_user_accepted_uld}</td>
                                </tr>
                                <tr>
                                    <td>Closed</td>
                                    <td>{formatDatetime(uld.t_user_closed_uld)}</td>
                                </tr>
                                <tr>
                                    <td>Closed by</td>
                                    <td>{uld.s_user_closed_uld}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </UldInfo>
                    <MawbsInfo>
                        <h6>MAWBs in this ULD and Flight</h6>
                        <ReactTable 
                            data={uld.ffms}
                            mapping={[{
                                name: 'MAWB',
                                value: 's_mawb',
                                s_mawb: true
                            }]}
                            numRows={5}
                        />
                    </MawbsInfo>
                </DetailsContainer>
            </ModalBody>
        </CustomModal>
    );
}

const CustomModal = styled(Modal)`
    width: 900px;
    max-width: 100%;
`;

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const FlexContainer = styled.div`
    display: flex;
`;

const DetailsContainer = styled.div`
    display: flex;
    gap: 25px;
`;

const UldInfo = styled.div`
    flex: 2
`;

const MawbsInfo = styled.div`
    flex: 1
`;