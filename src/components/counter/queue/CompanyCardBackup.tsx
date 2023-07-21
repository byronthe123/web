import React, { useMemo } from 'react';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import { CircularProgressbarWithChildren, buildStyles   } from 'react-circular-progressbar';
import { Row, Col, Card, CardBody } from 'reactstrap';
import classnames from 'classnames';

import { ICompany } from './interfaces';
import { IUser, IMap } from '../../../globals/interfaces';
import { formatEmail } from '../../../utils';

interface Props {
    company: ICompany;
    viewCompany: (company: ICompany) => void;
    timeSince: (start: string) => string;
    user: IUser;
}

const getMinutes = (start: string) => {
    const now = moment();
    const diff = moment.duration(moment(now).diff(moment(start)));
    const minutes = diff.asMinutes() - (moment().isDST() ? 4 : 5) * 60; //122360 minutes,but it gives total minutes in given miliseconds which is not expacted.    
    return minutes;
}

const CompanyCard = ({
    company,
    viewCompany,
    timeSince,
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
        if (company.s_status === 'WAITING') {
            const waitingMinutes = getMinutes(company.t_kiosk_submitted);
            if (waitingMinutes > 10) {
                return true;
            }
        } else if (company.s_status === 'DOCUMENTING') {
            const processingMinutes = getMinutes(company.t_counter_ownership);
            const timeAllowed = company.total * 10;
            if (timeAllowed < processingMinutes) {
                return true;
            }
        }   

        return false;
    }, [company]);

    const waitingTime = useMemo(() => {
        const ownershipTime = moment
            .utc(company.t_counter_ownership)
            .format('hh:mm A');
        const timeWaitingSinceOwnership = timeSince(
            company.t_counter_ownership
        );
        return `${ownershipTime} ${timeWaitingSinceOwnership}`;
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
        <Col
            md={12}
            className={`px-2 company-card-hover my-3 ${
                disabled && 'customDisabledHover'
            }`}
            onClick={() => !disabled && viewCompany(company)}
            data-testid={'company-cards'}
        >
            <Card
                className={`card my-2 px-0 ${flashit && 'flashit'}`}
                style={{
                    borderRadius: '0.75rem',
                    backgroundColor: background,
                    boxShadow:
                        '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    fontSize: '16px',
                }}
            >
                <CardBody className="card-body-waiting px-3 pt-3 pb-1">
                    <ReactTooltip />
                    <Row>
                        <Col md={12} lg={9}>
                            <h5
                                data-tip={awbsList}
                                className={`mt-0 mb-2`}
                                data-testid={'company-name'}
                            >
                                {truckingCompanyName} / {company.s_trucking_driver}
                            </h5>
                            <div className="mb-0 d-flex align-items-end">
                                <p
                                    style={{ fontSize: '16px' }}
                                    className={classnames('mb-0', 'float-left')}
                                >
                                    {moment
                                        .utc(company.t_kiosk_submitted)
                                        .format('hh:mm A')} / {timeSince(company.t_kiosk_submitted)}
                                </p>
                            </div>
                        </Col>
                        <div style={{ position: 'relative', width: '75px' }}>
                            <div style={{ width: 75, height: 75 }}>
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
                            </div>
                            {/* <div
                                style={{ position: 'absolute', top: '35%', left: '25%', transform: 'translate(-50%, -50%);' }}
                            >
                                <span className="bg-info px-1 ml-1">
                                    {company.exportCount}
                                </span>
                                <span className="bg-success px-1">
                                    {company.importCount}
                                </span>
                            </div> */}
                        </div>
                    </Row>
                </CardBody>
                {company.s_status === 'DOCUMENTING' && (
                    <div
                        className="div-processing-agent px-2"
                        style={{
                            boxShadow:
                                '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                        }}
                    >
                        <p className="mb-0 float-left pl-2">{waitingTime}</p>
                        <p className="mb-0 float-right pr-2">
                            Agent:{' '}
                            {formatEmail(
                                company.s_counter_ownership_agent
                            )}
                        </p>
                    </div>
                )}
            </Card>
        </Col>
    );
};

export default CompanyCard;
