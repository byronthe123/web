import React, { useMemo } from 'react';
import moment from 'moment';
import { Col, Card, CardBody, Row } from 'reactstrap';
import classnames from 'classnames';
import { ICompany } from './interfaces';
import { IUser } from '../../../globals/interfaces';
import { formatEmail } from '../../../utils';
import _ from 'lodash';

interface Props {
    selectedCompany: ICompany,
    company: ICompany, 
    handleSelectCompany: (company: ICompany, viewDetails?: boolean, viewAwbs?: boolean) => void,
    user: IUser,
    firstId: string,
    testId?: string
}

const CompanyCard = ({ 
    selectedCompany,
    company, 
    handleSelectCompany,
    user,
    firstId,
    testId
}: Props) => {

    const backgroundColor = useMemo(() => {
        if (_.get(company, 's_dock_ownership.length', 0) === 0) {
            const { s_state } = company;

            switch(s_state) {
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
        return 'grey'
    }, [company]);

    const flashit = useMemo(() => {
        const t_dock_ownership = _.get(company, 'awbs[0].t_dock_ownership', new Date());
        const start = t_dock_ownership
        const now = moment();
        const diff = moment.duration(moment(now).diff(moment(start)));
        var days = Number(diff.asDays()); //84
        var hours = Number(diff.asHours()); //2039 hours, but it gives total hours in given miliseconds which is not expacted.
        hours = hours - days*24;  // 23 hours
        hours = hours - 4;

        if(hours > 1) {
            return true;
        }
        return false;
    }, [company]);

    const displayCompanyName = useMemo(() => {
        const name = company.s_trucking_company;
        if (name.length > 20) {
            return `${name.substr(0, 28)}..`;
        }
        return name;
    }, [company]);

    const disabled = useMemo(() => {
        return company.s_transaction_id !== firstId && user.i_access_level < 3;
    }, [company, firstId, user.i_access_level]);

    return(
        <Row data-testId={'card-dock-co'}>
            <Col md={12} className={`px-2 ${disabled && 'customDisabledHover'}`} onClick={() => !disabled && handleSelectCompany(company, true)} data-testid={'company-cards'}>
                <Card className={`card my-2 px-0 ${flashit ? 'flashit' : null}`} style={{borderRadius: '0.75rem', backgroundColor: backgroundColor, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', fontSize: '16px'}}>
                    <CardBody className="card-body-waiting px-3 pb-1">
                        <h5 
                            className={`mt-0 mb-2`}
                            data-testid={'company-name'}
                        >
                            {displayCompanyName}
                        </h5>
                        <div style={{position: 'absolute', right: '2%', top: '10%'}}>
                            <span className="bg-info px-1 ml-1">{company.exportCount}</span>
                            <span className="bg-success px-1">{company.importCount}</span>
                        </div>
                        <div className={`d-flex align-content-center flex-wrap justify-content-center my-auto waiting-card-subtitle bg-white mb-1 text-center`}>
                            {company.s_trucking_driver}
                        </div>
                        <div className="mb-0 mt-2" >
                            <p style={{fontSize: '16px'}} className={classnames('mb-0','float-left')}>{moment(_.get(company, 'awbs[0].t_counter_end', new Date())).utc().format('hh:mm A')}</p>
                            <p style={{fontSize: '16px'}} className={classnames('mb-0', 'float-right')}>{company.waitTime}</p>
                        </div>
                    </CardBody>
                    {
                        _.get(company, 's_dock_ownership.length', 0) > 0 && 
                        <div className='div-processing-agent' style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                            <p className='mb-0'>Agent: {formatEmail(company.s_dock_ownership)}</p>
                            <p className='mb-0'>{company.processingTime}</p>
                        </div>
                    }
                </Card>
            </Col>
        </Row>
    );
}

export default CompanyCard;