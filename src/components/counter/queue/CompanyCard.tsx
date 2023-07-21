import React, { useMemo } from 'react';
import moment from 'moment';
import 'moment-timezone';
import ReactTooltip from 'react-tooltip';
import { CircularProgressbarWithChildren, buildStyles   } from 'react-circular-progressbar';
import classnames from 'classnames';

import Card from '../../custom/Card';
import { ICompany } from './interfaces';
import { IUser, IMap } from '../../../globals/interfaces';
import { formatEmail } from '../../../utils';
import styled from 'styled-components';
import { timeSince, getMinutes } from '../../../utils';

interface Props {
    company: ICompany;
    viewCompany: (company: ICompany) => void;
    user: IUser;
}

const CompanyCard = ({
    company,
    viewCompany,
    user,
}: Props) => {
    
    const disabled = useMemo(() => {
        return user.i_access_level < 3 && !company.firstWaitingCo;
    }, [user, company]);

    const awbsList = useMemo(() => {
        const { awbs=[] } = company;

        const map: IMap<boolean> = {};

        for (let i = 0; i < awbs.length; i++) {
            const { s_mawb } = awbs[i];
            const prefix = s_mawb.substring(0, 3);
            if (map[prefix] === undefined) {
                map[prefix] = true;
            }
        }

        return Object.keys(map).join(',');
    }, [company]);

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
        if (company.s_status === 'WAITING' && company.t_kiosk_submitted) {
            const waitingMinutes = getMinutes(company.t_kiosk_submitted);
            if (waitingMinutes > 10) {
                return true;
            }
        } else if (company.s_status === 'DOCUMENTING' && company.t_counter_ownership) {
            const processingMinutes = getMinutes(company.t_counter_ownership);
            const timeAllowed = company.total * 10;
            if (timeAllowed < processingMinutes) {
                return true;
            }
        }   

        return false;
    }, [company]);

    const waitingTime = useMemo(() => {
        if (!company.t_counter_ownership) return '';
        const ownershipTime = moment
            .utc(company.t_counter_ownership)
            .format('hh:mm A');
        const timeWaitingSinceOwnership = timeSince(
            company.t_counter_ownership
        );
        return `${ownershipTime} / ${timeWaitingSinceOwnership}`;
    }, [company]);

    const truckingCompanyName = useMemo(() => {
        const { s_trucking_company } = company;
        if (s_trucking_company.length > 20) {
            return `${s_trucking_company.substring(0, 28)}..`;
        }
        return s_trucking_company;
    }, [company]);

    const completionPercentage = (company.processed / company.total) * 100;

    return (
        <Wrapper
            className={classnames(
                {'flashit': flashit},
                {'customDisabledHover': disabled}
            )}
            bodyClassName={'py-3 px-3'}
            onClick={() => !disabled && viewCompany(company)}
            data-testid={'company-cards'}
            background={background}
            strongShadow={true}
            flashit={flashit}
            s_status={company.s_status}
        >
            <ReactTooltip />
            <FlexWrapper>
                <CompanyInfo>
                    <h5
                        className={`mt-0 mb-2`}
                        data-testid={'company-name'}
                        data-tip={awbsList}
                    >
                        {truckingCompanyName} / {company.s_trucking_driver}
                    </h5>
                    <h6>
                        Kiosk: {moment
                            .utc(company.t_kiosk_submitted)
                            .format('hh:mm A')} / {timeSince(company.t_kiosk_submitted)}
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
                                {company.exportCount}
                            </span>
                            <span className="bg-success px-1">
                                {company.importCount}
                            </span>
                        </div>
                    </CircularProgressbarWithChildren>
                </ProgressBarWrapper>
            </FlexWrapper>
            {company.s_status === 'DOCUMENTING' && (
                <ProcessingInfo>
                    <p>Counter: {waitingTime}</p>
                    <p>
                        Agent:{' '}
                        {formatEmail(
                            company.s_counter_ownership_agent
                        )}
                    </p>
                </ProcessingInfo>
            )}
        </Wrapper>
    );
};

const Wrapper = styled(Card)`
    width: min(415px, 100%);
    background-color: ${p => p.flashit ? 'red' : p.background};
    animation: ${p => p.flashit ? 'flash-red linear 1s infinite alternate' : null};

    @keyframes flash-red  {
        0% {
            background-color: red;
        }

        100% {
            background-color: inherit;
        }
    }

    &:hover {
        cursor: pointer;
    }

    @media (max-width: 1400px) {
        width: 49%;
        min-height: ${p => p.s_status !== 'DOCUMENTING' && '137.5px'};
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


