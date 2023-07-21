import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { useHistory  } from 'react-router-dom';
import { Row, Col, Button, Input, FormGroup } from 'reactstrap';
import _ from 'lodash';

import { api } from '../utils';

type ApprovalTypes = 'refund' | 'override' | '';

export default function Approvals () {
    const history = useHistory();
    const [ready, setReady] = useState(false);
    const [type, setType] = useState<ApprovalTypes>('');
    const [link, setLink] = useState('');
    const [approvalParam, setApprovalParam] = useState<'b_override_approved' | 'b_approved'>('b_override_approved');
    const [approveAmount, setApproveAmount] = useState(0);
    const [awb, setAwb] = useState('');
    const [hawb, setHawb] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [notes, setNotes] = useState('');
    const [approved, setApproved] = useState<'PENDING' | 'APPROVED' | 'DISAPPROVED'>('PENDING');
    const [approvedBy, setAprovedBy] = useState('');
    const [approvedDate, setApprovedDate] = useState('');

    const checkAlreadyApproved = async (type: string, id: number, approvalParam: string) => {
        const res = await api('post', 'checkAlreadyApproved', {
            table: type === 'refund' ? 'RefundRequest' : 'OCargoSprint_Payment',
            id, 
            idParam: type === 'refund' ? 'id' : 'i_id'
        });

        const userApproved = res.data[type === 'refund' ? 's_final_approver' : 's_override_approver'];
        if (userApproved) {
            setApproved(res.data[approvalParam]);
        }

        setAprovedBy(userApproved);
        setApprovedDate(res.data[type === 'refund' ? 't_final_approved' : 't_override_approved']);
    }

    useEffect(() => {
        const getLongUrl = async (urlId: string): Promise<string> => {
            const res = await api('get', `longUrl/${urlId}`);
            return _.get(res, 'data.longUrl', null);
        }

        const params = new URLSearchParams(history.location.search); 
        const urlId = params.get('urlId');
        if (urlId) {
            getLongUrl(urlId).then(longUrl => {
                console.log(longUrl);
                if (longUrl) {
                    window.location.href = longUrl;
                } else {
                    history.push('/error/404');
                }
            });
        } else {
            setReady(true);
        }

        const _type = params.get('type') || '';

        const id = Number(params.get('id') || 0);
        const user = params.get('user');

        // @ts-ignore
        setType(_type);
        setAwb(params.get('awb') || '');
        setHawb(params.get('hawb') || '');
        setCreatedBy(params.get('createdBy') || '');
        setNotes((params.get('notes') || '').replace(/~/g, ' '));

        let endpoint = '', approvalParam = 'b_override_approved';

        if (_type === 'override') {
            endpoint = `${process.env.REACT_APP_BASE_API_URL}/manageOverrideRequest?i_id=${id}&s_override_approver=${user}`;
            approvalParam = 'b_override_approved';
        } else  {
            endpoint = `${process.env.REACT_APP_BASE_API_URL}/manageRefundRequest?id=${id}&s_final_approver=${user}&f_amount_approved=${approveAmount}`;
            approvalParam = 'b_approved';
        }

        //@ts-ignore
        setApprovalParam(approvalParam);
        setApproveAmount(Number(params.get('amount') || 0));
        setLink(endpoint);

        checkAlreadyApproved(_type, id, approvalParam);
    }, [history.location.search, approveAmount]);

    if (!ready) {
        return null;
    }

    return (
        <Row>
            <Col md={12} className={'text-center'}>
                <h1>Manage {type.toUpperCase()} Request</h1>
                <h3>AWB: {awb}. HAWB {hawb}. Created by {createdBy}</h3>
                <h3>Notes: {notes}</h3>
                <br></br>
                {
                    approved === 'PENDING' ? 
                    <>
                        {
                            type !== 'refund' && 
                            <>
                                <FormGroup className={'mb-4'}>
                                    <h3>Amount</h3>
                                    <Input 
                                        type={'number'} 
                                        value={approveAmount} 
                                        onChange={(e: any) => setApproveAmount(e.target.value)} 
                                        style={{ width: '300px' }}
                                        className={'mx-auto'}
                                    />
                                </FormGroup>
                                <a href={`${link}&${approvalParam}=true`}>
                                    <Button style={{ fontSize: '50px' }}>Approve</Button>
                                </a>
                                <div className={'mt-5 d-block'}></div>
                                <a href={`${link}&${approvalParam}=false`}>
                                    <Button style={{ fontSize: '50px', width: '233px' }} color={'danger'}>Deny</Button>
                                </a>
                            </>
                        }
                    </> : 
                    <h1>Already {approved ? 'Approved' : 'Denied'} by {approvedBy} at {moment.utc(approvedDate).format('MM/DD/YYYY HH:mm')}</h1>
                }
            </Col>
        </Row>
    );
}
