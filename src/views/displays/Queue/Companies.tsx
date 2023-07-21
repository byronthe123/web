import React from 'react';
import { Row, Col } from 'reactstrap';

import { ICompany, ProcessingAgentsMap } from '../../../components/counter/queue/interfaces';
import WaitingCard from './WaitingCard';
import ProcessingCard from './ProcessingCard';
import styled from 'styled-components';

interface Props {
    waitingCompanies: Array<ICompany>;
    processingCompanies: Array<ICompany>;
    accessToken: string;
    processingAgentsMap: ProcessingAgentsMap;
}

export default function Companies ({
    waitingCompanies,
    processingCompanies,
    accessToken,
    processingAgentsMap
}: Props) {
    return (
        <Row>
            <Col md={6} className={'px-3'}>
                <Row className={'text-white bg-grey'}>
                    <Col md={12}>
                        <h4>Waiting to be serviced: {waitingCompanies.length}</h4>
                    </Col>
                </Row>
                <div className={'text-white bg-grey-content d-flex flex-wrap mt-1'} style={{ gap: '5px' }}>
                    {
                        waitingCompanies.map((c: ICompany, i: number) => (
                            <WaitingCardContainer key={`${c.s_transaction_id}-${i}`}>
                                <WaitingCard
                                    company={c}
                                />
                            </WaitingCardContainer>
                        ))
                    }
                </div>
            </Col>
            <Col md={6}>
                <Row className={'text-white bg-grey mb-1'}>
                    <Col md={12}>
                        <h4>Currently Servicing: {processingCompanies.length}</h4>
                    </Col>
                </Row>
                <Row className={'bg-grey-content'}>
                    
                </Row>
                <div className={'d-flex flex-wrap '} style={{ gap: '5px' }} >
                    {
                        processingCompanies.map((c: ICompany, i: number) => (
                            <ProcessingCardContainer key={`${c.s_transaction_id}-${i}`}>
                                <ProcessingCard
                                    company={c}
                                    accessToken={accessToken}
                                    processingAgentsMap={processingAgentsMap}
                                />
                            </ProcessingCardContainer>
                        ))
                    }
                </div>
            </Col>
        </Row>
    );
}

const ProcessingCardContainer = styled.div`
    flex: 1;
    max-width: 50%;
`;

const WaitingCardContainer = styled.div`
    flex: 1;
    max-width: 33%;
`;