import React from 'react';
import {Table, Card, CardBody} from 'reactstrap';
import moment from 'moment';

const NotificationPayments = ({
    additionalNotificationData
}) => {
    return (
        <div className='row py-2 px-3' style={{fontSize: '16px'}}>
            <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                <CardBody className='custom-card-transparent py-3' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                    <h4>Payments for this MAWB:</h4>
                    <div className='col-12 mt-0 mb-2 pr-0 pl-0'>
                        <Table className='mb-0' style={{tableLayout: 'fixed'}}>
                            <thead className='table-success'>
                                <th style={{width: '20%'}}>Date</th>
                                <th style={{width: '20%'}}>Type</th>
                                <th style={{width: '20%'}}>Amount</th>
                                <th style={{width: '40%'}}>Customer</th>
                            </thead>
                            <tbody>
                            </tbody>
                        </Table>
                        <div style={{maxHeight: '600px'}}>
                            <Table primary style={{tableLayout: 'fixed'}}>
                                <thead>
                                </thead>
                                <tbody>
                                    {
                                        additionalNotificationData && additionalNotificationData.paymentData && additionalNotificationData.paymentData.map((p, i) => 
                                            <tr key={i}>
                                                <td style={{width: '20%'}}>{moment(p.d_created).format('MM/DD/YYYY')}</td>
                                                <td style={{width: '20%'}}>{p.s_payment_type}</td>
                                                <td style={{width: '20%'}}>{p.f_amount}</td>
                                                <td style={{width: '40%'}}>
                                                    {p.s_name}
                                                    <br></br>
                                                    {p.s_notification_email}
                                                </td>
                                                {/* <td>{p.s_notification_email}</td> */}
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>

                </CardBody>
            </Card>
        </div>
    );
}


export default NotificationPayments;

{/* //card */}
{/* <div className='col-5' style={{backgroundColor: 'grey'}}>
    <div className='row'>
        1/28/2020
    </div>
    <div className='row'>
        <div className='col-6'>
            ISC
        </div>
        <div className='col-6'>
            $100.00
        </div>
    </div>
    <div className='row' className='text-center'>
        DB Schenker
    </div>
    <div className='row' className='text-center'>
        test@gmail.com
    </div>
</div> */}