import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/index';
import { withRouter } from 'react-router-dom';
import { api, asyncHandler, deleteLocalValue, getDate, updateLocalValue } from '../../utils';
import moment from 'moment';
import { Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Input } from 'reactstrap';
import classnames from 'classnames';

import AppLayout from '../../components/AppLayout';
import Manage from '../../components/managers/refundRequests/Manage';
import Overview from '../../components/managers/refundRequests/Overview';
import { IRefundRequest, IUpdateRefundRequestData, IManageRefundRequestData, IManageRefundRequest, IUpdateRefundRequest, IDeleteRefundRequest } from '../../components/managers/refundRequests/interfaces';

const RefundRequest = () => {

    const { user } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('1');
    const [d_start_date, set_d_start_date] = useState(moment().subtract(1, 'month').format('YYYY-MM-DD'));
    const [d_end_date, set_d_end_date] = useState(moment().format('YYYY-MM-DD'));
    const [items, setItems] = useState<Array<IRefundRequest>>([]);

    useEffect(() => {
        const getData = async () => {
            const data = {
                d_start_date,
                d_end_date,
                s_airport: user.s_unit 
            }
            const res = await api('post', 'getRefundRequests', { data });
            setItems(res.data);
        }
        if (user.s_unit && moment(d_start_date).isValid() && moment(d_end_date).isValid()) {
            getData();
        }
    }, [user.s_unit, d_start_date, d_end_date]);

    const updateRefundRequest: IUpdateRefundRequest = async (data: IUpdateRefundRequestData) => {
        await api('put', 'updateRefundRequest', { data });
        updateLocalValue(items, setItems, data.id, data);
    }

    const manageRefundRequest: IManageRefundRequest = async (data: IManageRefundRequestData) => {
        const { id, s_final_approver, b_approved, s_status, f_amount_approved, s_final_approval_notes } = data;
        let finalApproverGuid = null;

        const res = await api('post', 'getApproverGuid', { s_email: s_final_approver });
        if (res.status === 200) {
            finalApproverGuid = res.data.guid;
        }

        const url = `${process.env.REACT_APP_BASE_API_URL}/manageRefundRequest?id=${id}&s_final_approver=${finalApproverGuid}&b_approved=${b_approved}&f_amount_approved=${f_amount_approved}&s_final_approval_notes=${s_final_approval_notes}`;
        window.open(url, '_blank');
        const updatedItem = items.find(i => i.id === id);
        if (updatedItem) {
            updatedItem.s_status = s_status;
            updateLocalValue(items, setItems, id, updatedItem);
        }
    }

    const deleteRefundRequest: IDeleteRefundRequest = asyncHandler(async(id: number, s_mawb: string, s_hawb: string) => {
        await api('delete', `deleteRefundRequest/${id}`, {
            s_created_by: user.s_email,
            t_created: getDate(),
            s_mawb,
            s_hawb
        });
        deleteLocalValue(items, setItems, id);
    });

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll'}} data-testid={'view-refund-request'}>
                <div className="card-body mb-5 px-3 pb-2 pt-3">
                    <Row>
                        <Col md={12}>
                            <h1 className={'d-inline'}>Refund Requests</h1>
                        </Col>
                        <Col md={12} className={'mt-2'}>
                            <h6 className={'d-inline'}>Data Range: </h6>
                            <div className={'d-inline ml-2'}>
                                <Input type={'date'} value={d_start_date} onChange={(e: any) => set_d_start_date(e.target.value)} style={{ width: '200px' }} className={'d-inline'} />
                                <h6 className={'d-inline mx-1'}>to</h6>
                                <Input type={'date'} value={d_end_date} onChange={(e: any) => set_d_end_date(e.target.value)} style={{ width: '200px' }} className={'d-inline'} />
                            </div>
                        </Col>
                    </Row>
                    <Row className='mt-2'>
                        <Col mg='12' lg='12'>
                            <Nav tabs className="separator-tabs ml-0 mb-2">
                                <NavItem>
                                    <NavLink
                                        location={{}}
                                        to="#"
                                        className={classnames({
                                            active: activeTab === "1",
                                            "nav-link": true
                                        })}
                                        onClick={() => {
                                            setActiveTab("1");
                                        }}
                                    >
                                        Overview
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        location={{}}
                                        to="#"
                                        className={classnames({
                                            active: activeTab === "2",
                                            "nav-link": true
                                        })}
                                        onClick={() => {
                                            setActiveTab("2");
                                        }}
                                        data-testid={'tab-manage'}
                                    >
                                        Manage
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Col>
                    </Row>

                    <TabContent activeTab={activeTab} className='mt-2'>
                        <TabPane tabId="1">
                            <Overview 
                                items={items}
                            />
                        </TabPane>  
                        <TabPane tabId="2">
                            <Manage 
                                data={items}
                                updateRefundRequest={updateRefundRequest}
                                manageRefundRequest={manageRefundRequest}
                                deleteRefundRequest={deleteRefundRequest}
                            />
                        </TabPane>
                    </TabContent>
                </div>
            </div>
        </AppLayout>
    );
}

export default withRouter(RefundRequest);