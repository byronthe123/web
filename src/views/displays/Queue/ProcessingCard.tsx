import React, { useMemo } from 'react';
import { Row, Col, Card } from 'reactstrap';
import dayjs from 'dayjs';
import { CircularProgressbarWithChildren, buildStyles   } from 'react-circular-progressbar';

import { formatEmail, timeSince, getMinutes } from '../../../utils';
import { ICompany, ProcessingAgentsMap } from '../../../components/counter/queue/interfaces';
import ActiveUser from '../../../components/counter/queue/ActiveUser';
import { IActiveUser } from '../../../globals/interfaces';
import { getName } from './utils';
import styled from 'styled-components';

interface Props {
    company: ICompany;
    accessToken: string;
    processingAgentsMap: ProcessingAgentsMap
}

export default function WaitingCard ({
    company,
    accessToken,
    processingAgentsMap
}: Props) {

    const background = useMemo(() => {
        const { s_state } = company;
        switch (s_state) {
            case 'EXPORT':
                return '#6BB4DD';
            case 'IMPORT':
                return '#61B996';
            case 'MIXED':
                return 'goldenrod';
            case 'TRANSFER-IMPORT':
                return '#BBA0CA';
        }
    }, [company]);

    const flashit = useMemo(() => {
        const processingMinutes = getMinutes(company.t_counter_ownership);
        const timeAllowed = company.total * 10;
        if (timeAllowed < processingMinutes) {
            return true;
        }

        return false;
    }, [company]);

    const user: IActiveUser = useMemo(() => {
        return {
            s_email: company.s_counter_ownership_agent,
            displayName: company.s_counter_ownership_agent,
            s_unit: '', 
            path: '/EOS/Counter/Queue', 
            online: true, 
            status: 'Processing'
        }
    }, [company]);

    const completionPercentage = (company.processed / company.total) * 100;

    return (
        <Card 
            style={{ 
                backgroundColor: background,
                borderRadius: '0.75rem'
            }}
            className={`px-2 mb-2 text-white ${flashit && 'flashit'}`}
        >
            <Header>
                <CompanyInfoContainer className={'pr-0'}>
                    <h6>{getName(company.s_trucking_company, 10)} / {getName(company.s_trucking_driver, 12)}</h6>
                </CompanyInfoContainer>
                <KioskTimeContainer className={'pl-0'}>
                    <h6>{dayjs(company.t_kiosk_submitted).utc().format('hh:mm A')}/{timeSince(company.t_kiosk_submitted)}</h6>
                </KioskTimeContainer>
            </Header>
            <Body>
                <div>
                    <ActiveUser 
                        user={user}
                        accessToken={accessToken}
                        processingAgentsMap={processingAgentsMap}
                        showName={false}
                    />
                </div>
                <div>
                    <h6 className={'processing-ownership-time'}>{getName(formatEmail(company.s_counter_ownership_agent), 9)} - {dayjs(company.t_counter_ownership).utc().format('hh:mm A')}</h6>
                    <h1 className={'waiting-time mt-2 mb-0'}>
                        {timeSince(company.t_counter_ownership)}
                    </h1>
                </div>
                <div>
                    <div style={{ height: 87, width: 87 }}>
                        <CircularProgressbarWithChildren 
                            strokeWidth={8}
                            value={completionPercentage}
                            styles={buildStyles({
                                pathColor: 'red'
                            })}
                        >
                            <div className={'type-count'}>
                                <span className="bg-info px-1 ml-1">
                                    {company.exportCount}
                                </span>
                                <span className="bg-success px-1">
                                    {company.importCount}
                                </span>
                            </div>
                        </CircularProgressbarWithChildren>
                    </div>
                </div>
            </Body>
        </Card>
    );
}

const Header = styled.div`
    display: flex;
    gap: 10px;
    /* h1, h6 {
        font-size: 1vw;
    } */
`;

const CompanyInfoContainer = styled.div`
    flex-grow: 3;
    /* white-space: nowrap; */
    margin-right: 5px;
`;

const KioskTimeContainer = styled.div`
    flex-grow: 1;
`;

const Body = styled.div`
    display: flex;
    justify-content: space-between;
`;