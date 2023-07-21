import React, { useMemo } from 'react';
import { Row, Col, Card } from 'reactstrap';
import dayjs from 'dayjs';

import { getName } from './utils';
import { timeSince, getMinutes } from '../../../utils';
import { ICompany } from '../../../components/counter/queue/interfaces';
import styled from 'styled-components';

interface Props {
    company: ICompany
}

export default function WaitingCard ({
    company
}: Props) {

    const background = useMemo(() => {
        if (company.s_status === 'WAITING') {
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
        }
        return 'grey';
    }, [company]);

    const flashit = useMemo(() => {
        const waitingMinutes = getMinutes(company.t_kiosk_submitted);
        console.log(waitingMinutes);
        if (waitingMinutes > 15) {
            return true;
        }
        return false;
    }, [company]);

    return (
        <Card 
            style={{ 
                backgroundColor: background,
                borderRadius: '0.75rem'
            }}
            className={`px-2 mb-2 d-flex ${flashit && 'flashit'}`}
        >
            <div>
                <CompanyInfo>{company.s_trucking_company} / {company.s_trucking_driver}</CompanyInfo>
            </div>
            <div className={'d-flex'}>
                <div className={'pr-0'}>
                    <h6>{company.s_state}</h6>
                    <div className={'type-count'}>
                        <span className="bg-info px-1 ml-1">
                            {company.exportCount}
                        </span>
                        <span className="bg-success px-1">
                            {company.importCount}
                        </span>
                    </div>
                </div>
                <div className={'text-right'}>
                    <h6 className={'waiting-time-absolute'}>Kiosk - {dayjs(company.t_kiosk_submitted).utc().format('hh:mm A')}</h6>
                    <h1 className={'waiting-time pb-0 mb-0 mt-2'}>{timeSince(company.t_kiosk_submitted)}</h1>
                </div>
            </div>
        </Card>
    );
}

const CompanyInfo = styled.h6`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;