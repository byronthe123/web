import React, { useMemo } from 'react';
import { Modal, Row, Col, ModalBody } from 'reactstrap';
import styled from 'styled-components';
import { IActiverUsers, IActiveUser, IUser } from '../../../globals/interfaces';
import { objectSorter } from '../../../utils';
import ActiveUser from './ActiveUser';
import CompanyCard from './CompanyCard';
import { ICompany, ProcessingAgentsMap } from './interfaces';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    activeUsers: IActiverUsers;
    accessToken: string;
    companiesList: Array<ICompany>;
    processingAgentsMap: ProcessingAgentsMap;
    viewCompany: (company: ICompany) => void;
    user: IUser
}

export default function ManagerView ({
    modal,
    setModal,
    activeUsers,
    accessToken,
    companiesList,
    processingAgentsMap,
    viewCompany,
    user
}: Props) {

    const toggle = () => setModal(!modal);

    const sortedCompanies: Array<ICompany> = useMemo(() => {
        return objectSorter('s_status', ['WAITING', 'DOCUMENTING'], companiesList);
    }, [companiesList]);

    const sortedActiveUsers: Array<IActiveUser> = useMemo(() => {
        let users = Object.keys(activeUsers).map(key => activeUsers[key]);
        const filtered = users.filter(u => u.s_unit === user.s_unit);
        
        // filtered.push({
        //     displayName: 'test',
        //     s_email: 'test',
        //     s_unit: 'CJFK2',
        //     path: '/EOS/Operations/Counter/Queue',
        //     online: true,
        //     status: 'Active'
        // }, {
        //     displayName: 'busy',
        //     s_email: 'busy',
        //     s_unit: 'CJFK2',
        //     path: '/EOS/Operations/Managers/Import',
        //     online: true,
        //     status: 'Active'
        // }, {
        //     displayName: 'active',
        //     s_email: 'active',
        //     s_unit: 'CJFK2',
        //     path: '/EOS/Operations/Counter/Queue',
        //     online: true,
        //     status: 'Active'
        // });

        let 
            freeUsers: Array<IActiveUser> = [], 
            busyUsers: Array<IActiveUser> = [], 
            inactiveUsers: Array<IActiveUser> = [];

        freeUsers = filtered.filter((user: IActiveUser) => user.online && user.path.includes('/EOS/Operations/Counter/') && !processingAgentsMap[user.s_email]);
        busyUsers = filtered.filter((user: IActiveUser) => user.online && (!user.path.includes('/EOS/Operations/Counter/') || processingAgentsMap[user.s_email]));
        inactiveUsers = filtered.filter((user: IActiveUser) => !user.online);
        
        return [...freeUsers, ...busyUsers, ...inactiveUsers];
    }, [activeUsers, processingAgentsMap, user.s_unit]);

    return (
        <Modal isOpen={modal} toggle={toggle} className={'responsive-modal'}>
            <ModalBody>
                <Container>
                    <OfficeQueueContainer>
                            <h6>Current Office Queue:</h6>
                            <OfficeQueue>
                                {
                                    (sortedActiveUsers || []).map((u) => (
                                        <ActiveUser 
                                            user={u}
                                            accessToken={accessToken}
                                            processingAgentsMap={processingAgentsMap}
                                            showName={true}
                                            key={u.s_email}
                                        />
                                    ))
                                }
                            </OfficeQueue>
                    </OfficeQueueContainer>
                    <CompanyCardsContainer>
                        {
                            sortedCompanies.map((c, i) =>
                                    <CompanyCard 
                                        company={c}
                                        viewCompany={viewCompany}
                                        user={user}
                                        key={i}
                                    />
                            )
                        }
                    </CompanyCardsContainer>
                </Container>
            </ModalBody>
        </Modal>
    );
}

const Container = styled.div`
    display: flex;
    gap: 12px;
`;

const OfficeQueueContainer = styled.div`
    flex: 1;
`;

const OfficeQueue = styled.div`
    overflow-y: scroll;
    overflow-x: hidden;
`;

const CompanyCardsContainer = styled.div`
    flex: 6;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
    align-items: flex-start;
    gap: 12px;
`;