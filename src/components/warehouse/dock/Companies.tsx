import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import classnames from 'classnames';

import { IMap, IUser } from '../../../globals/interfaces';
import { ICompany } from './interfaces';
import CompanyCard from './CompanyCard';

const buttonTypes: IMap<string> = {
    'ALL': 'btn-grey',
    'IMPORT': 'btn-success',
    'EXPORT': 'btn-blue'
}

interface Props {
    companiesMap: IMap<ICompany>,
    selectedCompany: ICompany
    handleSelectCompany: (company: ICompany, viewDetails?: boolean) => void,
    user: IUser,
    firstId: string
}

type ButtonTypes = 'ALL' | 'EXPORT' | 'IMPORT';

const renderCompany = (selectedType: ButtonTypes, companyState: string) => {
    if (selectedType === 'ALL') {
        return true;
    } else {
        return selectedType === companyState;
    }
}

export default function Companies ({
    companiesMap,
    selectedCompany,
    handleSelectCompany,
    user,
    firstId
}: Props) {

    const [selectedType, setSelectedType] = useState<ButtonTypes>('ALL');

    return (
        <Row className='px-0 py-3' data-testId={'div-companies'}>
            <Col md={12}>
                <h1 className={'d-inline mr-5'}>Dock</h1>
                {
                    Object.keys(buttonTypes).map((key, i) => (
                        <button 
                            key={i} 
                            className={classnames('d-inline mx-2 btn', buttonTypes[key], { 'active button-border': selectedType === key })}
                            // @ts-ignore
                            onClick={() => setSelectedType(key)}
                        >
                            {key}
                        </button>
                    ))
                }
            </Col>
            <Col md={12} className={'mt-2'}>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-2' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row>
                            <Col md={6}>
                                <h6>Queue</h6>
                                <Row style={{ height: 'calc(100vh - 300px)', overflowY: 'scroll' }}>
                                    <Col md={12}>
                                        {
                                            Object.keys(companiesMap).map((key, i) => companiesMap[key].s_dock_ownership !== user.s_email.toUpperCase() && renderCompany(selectedType, companiesMap[key].s_state) && (
                                                <CompanyCard 
                                                    selectedCompany={selectedCompany}
                                                    company={companiesMap[key]}
                                                    handleSelectCompany={handleSelectCompany}
                                                    user={user}
                                                    firstId={firstId}
                                                    key={i}
                                                    testId={'card-dock-co'}
                                                />
                                            ))
                                        }
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={6}>
                                <h6>My Assignments</h6>
                                <Row style={{ height: 'calc(100vh - 300px)', overflowY: 'scroll' }}>
                                    <Col md={12}>
                                        {
                                            Object.keys(companiesMap).map((key, i) => companiesMap[key].s_dock_ownership === user.s_email.toUpperCase() && renderCompany(selectedType, companiesMap[key].s_state) && (
                                                <CompanyCard 
                                                    selectedCompany={selectedCompany}
                                                    company={companiesMap[key]}
                                                    handleSelectCompany={handleSelectCompany}
                                                    user={user}
                                                    firstId={firstId}
                                                    key={i}
                                                    testId={'card-my-assignment-co'}
                                                />
                                            ))
                                        }
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}

{/* <Col md={12} className={'text-right'}>
    <Button 
        style={{ fontSize: '24px' }}
        disabled={selectedCompany.s_transaction_id.length === 0}
    >
        Confirm Selected
    </Button>
</Col> */}