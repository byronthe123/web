import React, { useMemo, useState, useContext, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import dayjs from 'dayjs';


import { AppContext } from '../../../context';
import useQueueData from '../../../components/counter/queue/useQueueData';
import useSortedActiveUsers from '../../../components/counter/queue/useSortedActiveUsers';
import ActiveUser from '../../../components/counter/queue/ActiveUser';
import { api } from '../../../utils';
import StatsView from './Stats';
import Companies from './Companies';
import './styles.css';
import { ICompany } from '../../../components/counter/queue/interfaces';

const styles = {
    view: {
        backgroundColor: 'black', 
        height: '100vh'
    },
    titleRow: {
        height: '100px', 
        color: 'gold'
    },
    largeTitle: {
        fontSize: '40px',
        marginBotton: '0px',
        paddingBottom: '0px'
    }
}

const queryParams = new URLSearchParams(window.location.search);
const unit = queryParams.get('unit') || 'CEWR1';

export default function QueueDisplay () {

    const { socket } = useContext(AppContext);
    const { activeUsers } = socket;
    const { companiesList, processingAgentsMap, stats } = useQueueData('display', unit);
    const { sortedActiveUsers } = useSortedActiveUsers(activeUsers, processingAgentsMap, unit);
    
    const waitingCompanies = useMemo(() => {
        return companiesList.filter(c => c.s_status === 'WAITING');
    }, [companiesList]);

    const processingCompanies = useMemo(() => {
        const filtered = companiesList.filter(c => c.s_status === 'DOCUMENTING');
        const sorted = filtered.sort((a: ICompany, b: ICompany) => +new Date(a.t_counter_ownership) - +new Date(b.t_counter_ownership));
        return sorted;
    }, [companiesList]);

    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const getAccessToken = async () => {
            const res = await api('get', 'accessToken');
            if (res.status === 200) {
                setAccessToken(res.data);
            }
        };

        getAccessToken();

        let interval = setInterval(() => {
            getAccessToken();
        }, 600000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <Row className={'px-2'} style={{ ...styles.view }}>
            <Col md={12}>
                <Row style={{ ...styles.titleRow }}>
                    <Col md={3}>
                        <h1 style={{ ...styles.largeTitle }}>Counter Stats</h1>
                    </Col>
                    <Col md={5}>
                        {

                        }
                        <h1>Customer Wait: {stats?.transactionsProcessed} / {stats?.aveWaitingTime}m Avg / {stats?.maxWaitingTime}m Max</h1>
                        <h1>AWBS Processed: {stats?.unitAwbsProcessed} / {stats?.unitAveProcessingTime}m Avg / {stats?.unitMaxProcessingTime}m Max</h1>
                    </Col>
                    <Col md={4} className={'text-right'}>
                        <div style={{ display: 'block !important' }}>
                            <h1 style={{ ...styles.largeTitle }}>Today is {dayjs().format('dddd MM/DD')}</h1>
                        </div>
                        <div>
                            <h1 style={{ ...styles.largeTitle }}>{dayjs().format('hh:mm A')}</h1>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={1}>
                        <Row className={'text-white bg-grey mb-1'}>
                            <Col md={12}>
                                <h4>Agents: {sortedActiveUsers.length}</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                {
                                    (sortedActiveUsers || []).map((u) => (
                                        <ActiveUser 
                                            user={u}
                                            accessToken={accessToken}
                                            processingAgentsMap={processingAgentsMap}
                                            showName={true}
                                            darkMode={true}
                                            key={u.s_email}
                                        />
                                    ))
                                }
                            </Col>
                        </Row>
                    </Col>
                    <Col md={11}>
                        {
                            (waitingCompanies.length === 0 && processingCompanies.length === 0) ? 
                                <StatsView stats={stats} /> :
                                <Companies  
                                    waitingCompanies={waitingCompanies}
                                    processingCompanies={processingCompanies} 
                                    accessToken={accessToken} 
                                    processingAgentsMap={processingAgentsMap}
                                />
                        }
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}