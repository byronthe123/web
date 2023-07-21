import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Row, Col, ButtonGroup, Button } from 'reactstrap';
import ReactTable from '../../custom/ReactTable';
import Modal from './Modal';
import { 
    IRefundRequest, 
    RefundRequests, 
    IManageRefundRequest,
    IUpdateRefundRequest,
    IDeleteRefundRequest,
    RefundStatus
} from './interfaces';
import { api } from '../../../utils';
import { IPayment } from '../../../globals/interfaces';

interface Props {
    data: RefundRequests;
    updateRefundRequest: IUpdateRefundRequest;
    manageRefundRequest: IManageRefundRequest;
    deleteRefundRequest: IDeleteRefundRequest;
}

export default function Manage ({ 
    data, 
    updateRefundRequest, 
    manageRefundRequest,
    deleteRefundRequest 
}: Props) {

    const [filterStatus, setFilterStatus] = useState<RefundStatus>('OPEN');
    const filterStatusOptions: Array<RefundStatus> = ['OPEN', 'PREAPPROVED', 'CLOSED'];
    const [modal, setModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IRefundRequest>();
    const [filteredData, setFilteredData] = useState<RefundRequests>([]);
    const [payments, setPayments] = useState<Array<IPayment>>([]);

    const paymentsForRefundRequest = async (s_mawb: string) => {
        const res = await api('get', `paymentsForRefundRequest/${s_mawb}`);
        setPayments(res.data);
    }

    const handleSelect = async (item: IRefundRequest) => {
        setSelectedItem(item);
        await paymentsForRefundRequest(item.s_mawb);
        setModal(true);
    }

    useEffect(() => {
        let filtered;
        if (filterStatus === 'OPEN') {
            filtered = data.filter(i => i.s_status === 'OPEN');
        } else if (filterStatus === 'PREAPPROVED') {
            filtered = data.filter(i => i.s_status === 'PREAPPROVED');
        } else {
            filtered = data.filter(i => ['OPEN', 'PREAPPROVED'].indexOf(i.s_status) === -1);
        }
        setFilteredData(filtered);
    }, [data, filterStatus]);

    return (
        <Row>
            <Col md={12}>
                <ButtonGroup className={'mb-2'}>
                    {
                        filterStatusOptions.map((status, i) => (
                            <button 
                                key={i}
                                onClick={() => setFilterStatus(status)}
                                // @ts-ignore
                                active={(status === filterStatus).toString()}
                                className={classnames('btn', status === filterStatus ? 'btn-success' : 'btn-outline-dark' )}
                                data-testid={`btn-${status.toLowerCase()}`}
                            >
                                {status}
                            </button>
                        ))
                    }
                </ButtonGroup>
                <ReactTable 
                    data={filteredData}
                    enableClick={true}
                    handleClick={(item) => handleSelect(item)}
                    mapping={[
                        {
                            name: 'id',
                            value: 'id',
                            customWidth: 50
                        },
                        {
                            name: 'MAWB',
                            value: 's_mawb'
                        },
                        {
                            name: 'Amount',
                            value: 'f_amount',
                            money: true
                        },
                        {
                            name: 'Type',
                            value: 's_type'
                        },
                        {
                            name: 'Status',
                            value: 's_status'
                        },
                        {
                            name: 'Requested by',
                            value: 's_email'
                        },
                        {
                            name: 'Last Modified',
                            value: 't_modified',
                            datetime: true,
                            sortMethod: (a: string, b: string) => +new Date(a) - +new Date(b)
                        }
                    ]}
                    numRows={15}
                />
            </Col>
            <Modal 
                modal={modal}
                setModal={setModal}
                selectedItem={selectedItem}
                payments={payments}
                updateRefundRequest={updateRefundRequest}
                manageRefundRequest={manageRefundRequest}
                deleteRefundRequest={deleteRefundRequest}
                filterStatus={filterStatus}
            />
        </Row>
    );
}