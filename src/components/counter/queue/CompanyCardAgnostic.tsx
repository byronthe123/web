import React, { useMemo } from 'react';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import { CircularProgressbarWithChildren, buildStyles   } from 'react-circular-progressbar';
import classnames from 'classnames';

import Card from '../../custom/Card';
import { ICompany } from './interfaces';
import { ICompany as IDockCompany } from '../../warehouse/dock/interfaces';
import { IUser, IMap } from '../../../globals/interfaces';
import { formatEmail } from '../../../utils';
import styled from 'styled-components';

interface Props {
    queueCompany: ICompany;
    dockCompany: IDockCompany;
    variation: 'QUEUE' | 'DOCK';
    viewCompany: (queueCompany: ICompany) => void;
    timeSince: (start: string) => string;
    user: IUser;
}

const getMinutes = (start: string) => {
    const now = moment();
    const diff = moment.duration(moment(now).diff(moment(start)));
    const minutes = diff.asMinutes() - (moment().isDST() ? 4 : 5) * 60; //122360 minutes,but it gives total minutes in given miliseconds which is not expacted.    
    return minutes;
}

const stringToMin = (time: string) => {
    const segments = time.split(':');
    const hours = parseInt(segments[0]);
    const minutes = parseInt(segments[1]);

    return (hours * 60) + minutes;
}

const CompanyCard = ({
    queueCompany,
    dockCompany,
    variation,
    viewCompany,
    timeSince,
    user,
}: Props) => {

    const disabled = useMemo(() => {
        if (variation === 'QUEUE') {
            return user.i_access_level < 3 && !queueCompany.firstWaitingCo;
        }
        return false;
    }, [user, queueCompany, variation]);

    const awbsList = useMemo(() => {
        const { awbs=[] } = queueCompany;

        const map: IMap<boolean> = {};

        for (let i = 0; i < awbs.length; i++) {
            const { s_mawb } = awbs[i];
            const prefix = s_mawb.substring(0, 3);
            if (map[prefix] === undefined) {
                map[prefix] = true;
            }
        }

        return Object.keys(map).join(',');
    }, [queueCompany]);

    const background = useMemo(() => {
        if (
            (variation === 'QUEUE' && queueCompany.s_status === 'WAITING') ||
            (variation === 'DOCK' && dockCompany.s_status === 'DOCUMENTED')
        ) {
            const { s_state } = queueCompany;
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
    }, [queueCompany, dockCompany, variation]);

    const flashit = useMemo(() => {
        if (variation === 'QUEUE') {
            if (queueCompany.s_status === 'WAITING') {
                const waitingMinutes = getMinutes(queueCompany.t_kiosk_submitted);
                if (waitingMinutes > 10) {
                    return true;
                }
            } else if (queueCompany.s_status === 'DOCUMENTING') {
                const processingMinutes = getMinutes(queueCompany.t_counter_ownership);
                const timeAllowed = queueCompany.total * 10;
                if (timeAllowed < processingMinutes) {
                    return true;
                }
            } 
            return false;
        } else {
            if (dockCompany.s_status === 'DOCUMENTED') {
                if (stringToMin(dockCompany.waitTime) > 10) {
                    return true;
                }
            } else if (dockCompany.s_status === 'DOCUMENTING') {
                const processingMinutes = stringToMin(dockCompany.processingTime);
                const timeAllowed = (dockCompany.importCount + dockCompany.exportCount) * 10;
                if (timeAllowed < processingMinutes) {
                    return true;
                }
            } 
            return false;
        }
    }, [queueCompany, dockCompany, variation]);

    const waitingTime = useMemo(() => {
        if (variation === 'QUEUE') {
            const ownershipTime = moment
                .utc(queueCompany.t_counter_ownership)
                .format('hh:mm A');

            const timeWaitingSinceOwnership = timeSince(
                queueCompany.t_counter_ownership
            );
            return `${ownershipTime} / ${timeWaitingSinceOwnership}`;
        } else {
            return `${dockCompany.processingTime}`;
        }
    }, [queueCompany, dockCompany, variation]);

    const truckingCompanyName = useMemo(() => {
        let companyName: string = '';

        if (variation === 'QUEUE') {
            companyName = queueCompany.s_trucking_company;
        } else {
            companyName = dockCompany.s_trucking_company;
        }

        if (companyName.length > 20) {
            return `${companyName.substring(0, 28)}..`;
        }
    }, [queueCompany, dockCompany, variation]);

    const completionPercentage = (queueCompany.processed / queueCompany.total) * 100;
    
    return (
        <Wrapper
            className={classnames(
                {'flashit': flashit},
                {'customDisabledHover': disabled}
            )}
            bodyClassName={'py-3 px-3'}
            onClick={() => !disabled && viewCompany(queueCompany)}
            data-testid={'queueCompany-cards'}
            background={background}
            strongShadow={true}
            s_status={queueCompany.s_status}
        >
            <ReactTooltip />
            <FlexWrapper>
                <CompanyInfo>
                    <h5
                        className={`mt-0 mb-2`}
                        data-testid={'queueCompany-name'}
                        data-tip={awbsList}
                    >
                        {truckingCompanyName} / {queueCompany.s_trucking_driver}
                    </h5>
                    <h6>
                        Kiosk: {moment
                            .utc(queueCompany.t_kiosk_submitted)
                            .format('hh:mm A')} / {timeSince(queueCompany.t_kiosk_submitted)}
                    </h6>
                </CompanyInfo>
                <ProgressBarWrapper>
                    <CircularProgressbarWithChildren 
                        strokeWidth={8}
                        value={completionPercentage}
                        styles={buildStyles({
                            pathColor: `#6fb327`
                        })}
                    >
                        <div>
                            <span className="bg-info px-1 ml-1">
                                {queueCompany.exportCount}
                            </span>
                            <span className="bg-success px-1">
                                {queueCompany.importCount}
                            </span>
                        </div>
                    </CircularProgressbarWithChildren>
                </ProgressBarWrapper>
            </FlexWrapper>
            {queueCompany.s_status === 'DOCUMENTING' && (
                <ProcessingInfo>
                    <p>Counter: {waitingTime}</p>
                    <p>
                        Agent:{' '}
                        {formatEmail(
                            queueCompany.s_counter_ownership_agent
                        )}
                    </p>
                </ProcessingInfo>
            )}
        </Wrapper>
    );
};

const Wrapper = styled(Card)`
    margin: 10px 0px;
    background-color: ${p => p.background};

    &:hover {
        cursor: pointer;
    }

    @media (max-width: 1400px) {
        width: 50%;
        min-height: ${p => p.s_status !== 'DOCUMENTING' && '137.5px'}
    }
`;

const FlexWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const CompanyInfo = styled.div`
    flex: 1 1;
    min-width: 160px;
    
    display: flex;
    flex-direction: column;
    justify-content: space-between; 
    max-height: 100px;
`;

const ProgressBarWrapper = styled.div`
    width: 75px;
    margin: 0 auto;
`;

const ProcessingInfo = styled.div`
    display: flex;
    justify-content: space-between;
    color: white;
    margin-top: 10px;

    p {
        margin-bottom: 0px;
    }
`;

export default CompanyCard;


