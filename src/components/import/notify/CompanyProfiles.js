import React, { useEffect, useState, useMemo } from 'react';
import { Row, Col, CardBody, Table } from 'reactstrap';
import VirtualTable from '../../custom/VirtualTable';
import Card from '../../custom/Card';
import _ from 'lodash';
import { formatMawb } from '../../../utils';
import styled from 'styled-components';
import ManageNotificationData from './ManageNotificationData';

export default function CompanyProfiles ({
    user,
    selectedAwb,
    notificationData,
    companyData,
    setCompanyData,
    emailData,
    setEmailData,
    phoneData,
    setPhoneData,
    selectedCompany,
    setSelectedCompany,
    blacklist,
    multipleMode,
    flightRackPcs,
    onClickNext,
    handleSearchAwb
}) {

    let fwbData = null;

    if (notificationData) {
        fwbData = notificationData.fwbData && notificationData.fwbData[0];
    }

    const resolveWeight = (value) => {
        if (value) {
            return Number(value).toFixed(1);
        } else {
            return '';
        }
    }

    const flightPcs = _.get(selectedAwb, 'i_actual_piece_count', 0);

    return (
        <Row className='mx-2'>
            <Col md={12}>
                <Row>
                    <Col md={12}>
                        <Card>
                            <Row>
                                <h2 className={'mr-1'}>Notification for flight {selectedAwb.s_flight_id}</h2>
                            </Row>
                            <Row>
                                {
                                    multipleMode ? 
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Consignee:</th>
                                                    <th>Consignee Address:</th>
                                                    <th>Consignee Contact Number:</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <td>{fwbData && fwbData.s_consignee_name1}</td>
                                                <td>{fwbData && fwbData.s_consignee_streetaddress1}, {fwbData && fwbData.s_consignee_state_province}, {fwbData && fwbData.s_consignee_postcode}</td>
                                                <td>{fwbData && fwbData.s_consignee_contact_number}</td>
                                            </tbody>
                                        </Table> : 
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>AWB:</th>
                                                    <th>Consignee:</th>
                                                    <th>Consignee Address:</th>
                                                    <th>Consignee Contact Number:</th>
                                                    <th>FLT Pcs</th>
                                                    <th>FLT Weight</th>
                                                    <th>Located FLT Pcs</th>
                                                    <th>Total Pcs</th>
                                                    <th>Total Weight</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{fontSize: '14px'}}>
                                                <tr>
                                                    <td onClick={() => handleSearchAwb(null, selectedAwb.s_mawb)} className={'hyperlink'}>{formatMawb(selectedAwb.s_mawb)}</td>
                                                    <td>{fwbData && fwbData.s_consignee_name1}</td>
                                                    <td>{fwbData && fwbData.s_consignee_streetaddress1}, {fwbData && fwbData.s_consignee_state_province}, {fwbData && fwbData.s_consignee_postcode}</td>
                                                    <td>{fwbData && fwbData.s_consignee_contact_number}</td>
                                                    <td>{flightPcs}</td>
                                                    <td>{resolveWeight(_.get(selectedAwb, 'f_weight', 0))}</td>
                                                    <td className={`${(flightPcs && (flightRackPcs < flightPcs)) && 'text-danger bg-warning'}`}>{flightRackPcs}</td>
                                                    <td>{_.get(selectedAwb, 'i_pieces_total', 0)}</td>
                                                    <td>{resolveWeight(_.get(selectedAwb, 'f_weight', 0))}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                }
                            </Row>
                        </Card>
                    </Col>
                </Row>
                
                <ManageNotificationData 
                    user={user}
                    companyData={companyData}
                    setCompanyData={setCompanyData}
                    emailData={emailData}
                    setEmailData={setEmailData}
                    phoneData={phoneData}
                    setPhoneData={setPhoneData}
                    selectedCompany={selectedCompany}
                    setSelectedCompany={setSelectedCompany}
                    fwbData={fwbData}
                    blacklist={blacklist}
                    wizardNext={true}
                    onClickNext={onClickNext}                    
                />

                {
                    !multipleMode && 
                    <Row className='mt-3'>
                        <Col md={12}>
                            <Card>
                                <Row>
                                    <h4>Payments for this MAWB</h4>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <VirtualTable 
                                            data={notificationData && notificationData.paymentData ? notificationData.paymentData : []}
                                            mapping={[
                                                {
                                                    name: 'Date',
                                                    value: 'd_created',
                                                    datetime: true
                                                },
                                                {
                                                    name: 'Type',
                                                    value: 's_payment_type',
                                                },
                                                {
                                                    name: 'Amount',
                                                    value: 'f_amount',
                                                    money: true
                                                }, 
                                                {
                                                    name: 'Customer Name',
                                                    value: 's_name'
                                                },
                                                {
                                                    name: 'Email',
                                                    value: 's_notification_email'
                                                }
                                            ]}
                                            index={true}
                                            customPagination={true}
                                            numRows={3}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                }
            </Col>
        </Row>
    );
}

const CompanyInfoCardsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
`;

const CompanyInfoCardContainer = styled.div`
    flex: 1;
    min-width: 24%;

    @media (max-width: 1550px) {
        min-width: 32%;
    }

    @media (max-width: 1200px) {
        min-width: 49%;
    }
`;

const CompanyInfoCard = ({ children }) => {
    return (
        <CompanyInfoCardContainer>
            <Card>
                { children }
            </Card>
        </CompanyInfoCardContainer>
    );
}