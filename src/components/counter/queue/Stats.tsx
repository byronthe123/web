import React from 'react';
import { Row, Col } from 'reactstrap';
import styled from 'styled-components';

import StatCard from './StatCard';
import { IQueueStats, ICompany } from './interfaces';
import { timeSince } from '../../../utils';
import { defaultQueueStat } from './defaults';

interface Props {
    stats: IQueueStats | undefined;
    myAssignmentCompany: ICompany;
}   

const resolveMin = (num: number) => (num !== null && num > 0) ? num : 1;

export default function Stats ({
    stats,
    myAssignmentCompany
}: Props) {

    const useStats = stats || defaultQueueStat;

    return (
        <Wrapper>
            <StatCard>
                <h4>Customer Wait</h4>
                <h6>{useStats.transactionsProcessed} Transactions</h6>
                <Row>
                    <Col md={12}>
                        <Row>
                            <Col md={12}>
                                <i className='fas fa-arrow-up d-inline mr-3' />
                                <h6 className='d-inline'>Max: {useStats.maxWaitingTime}</h6>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <i className='fas fa-ellipsis-h d-inline mr-3' />
                                <h6 className='d-inline'>Avg: {useStats.aveWaitingTime}</h6>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <i className='fas fa-arrow-down d-inline mr-3' />
                                <h6 className='d-inline'>Min: {resolveMin(useStats.minWaitingTime)}</h6>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </StatCard>
            <StatCard>
                <h4>Counter Process</h4>
                    <h6>{useStats.unitAwbsProcessed} AWBs</h6>
                    <Row>
                        <Col md={12}>
                            <i className='fas fa-arrow-up d-inline mr-3' />
                            <h6 className='d-inline'>Max: {useStats.unitMaxProcessingTime}</h6>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <i className='fas fa-ellipsis-h d-inline mr-3' />
                            <h6 className='d-inline'>Avg: {useStats.unitAveProcessingTime}</h6>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <i className='fas fa-arrow-down d-inline mr-3' />
                            <h6 className='d-inline'>Min: {resolveMin(useStats.unitMinProcessingTime)}</h6>
                        </Col>
                    </Row>
            </StatCard>
            <StatCard>
                <h4>My Process</h4>
                <h6>{useStats.userAwbsProcessed} AWBs</h6>
                <Row>
                    <Col md={12}>
                        <i className='fas fa-arrow-up d-inline mr-3' />
                        <h6 className='d-inline'>Max: {useStats.userMaxProcessingTime}</h6>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <i className='fas fa-ellipsis-h d-inline mr-3' />
                        <h6 className='d-inline'>Avg: {useStats.userAveProcessingTime}</h6>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <i className='fas fa-arrow-down d-inline mr-3' />
                        <h6 className='d-inline'>Min: {useStats.userMinProcessingTime || 0}</h6>
                    </Col>
                </Row>
            </StatCard>
            <StatCard>
                <h4>Current Customer</h4>
                {
                    myAssignmentCompany.awbs.length > 0 && 
                    <>
                        <h6>Waiting Time: {timeSince(myAssignmentCompany.t_kiosk_submitted)}</h6>
                        <h6>Processing Time: {timeSince(myAssignmentCompany.t_counter_ownership)}</h6>
                    </>
                }
            </StatCard>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    padding-bottom: 10px;
`;