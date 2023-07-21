import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import classnames from 'classnames';

import { ICompany } from './interfaces';

interface Props {
    company: ICompany,
    handleSelectCompany: (company: ICompany, viewDetails?: boolean, viewAwbs?: boolean) => void,
    selectedCompany: ICompany
}

export default function CompanyCard ({
    company,
    handleSelectCompany,
    selectedCompany
}: Props) {

    return (
        <Col>
            <Card 
                className={classnames('custom-opacity-card mb-3 bg-light-grey', { 'bg-danger': company.overDue })} 
                style={{ borderRadius: '0.75rem', border: selectedCompany.s_transaction_id === company.s_transaction_id ? '4px solid red' : '' }}
                onClick={() => handleSelectCompany(company, false)}
            >
                <CardBody className='custom-card-transparent py-3 px-2' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                    <Row>
                        <Col md={12} className={'text-center'}>
                            <h1 
                                className={'mb-0 pb-1 font-weight-bold'}
                                onClick={() => handleSelectCompany(company, true)}
                            >
                                {company.s_trucking_company}
                            </h1>
                            <h4 
                                className={'font-weight-bold'}
                                onClick={() => handleSelectCompany(company, true)}
                            >
                                {company.s_trucking_driver}
                            </h4>
                            <h4 
                                className={'font-weight-bold'}
                                onClick={() => handleSelectCompany(company, false, true)}
                            >
                                AWBS
                            </h4>
                        </Col>
                        <Col md={12} className={'text-center'}>
                            <Row>
                                <Col md={12}>
                                    <div 
                                        style={{ 
                                            border: '2px solid black', 
                                            borderRadius: '0.75rem', 
                                            width: '75%',
                                            backgroundColor: 'white',
                                            color: company.overDue ? 'red' : 'black' 
                                        }} 
                                        className={'mx-auto pt-3'}
                                    >
                                        <h1>{company.waitTime}</h1>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={12} className={'px-5 pt-4'}>
                            <Row>
                                <Col md={8} className={'text-left'}>
                                    <h3>Assigned: {company.s_dock_ownership || ''}</h3>
                                </Col>
                                <Col md={4} className={'text-right'}>
                                    
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
    );
}