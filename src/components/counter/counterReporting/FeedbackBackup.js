import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card, CardBody, CardTitle, CardSubtitle, Table } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import Timeline from './Timeline';
import PulseLoader from 'react-spinners/PulseLoader';

// const FeedbackCard = ({
//     item,
//     setSelectedItem,
//     selectedItem,
// }) => {
//     return (
//         <Col md={12} className='my-2'>
//             <Card style={{borderRadius: '0.75rem'}} className='card-hover pointer' onClick={() => setSelectedItem(item)}>
//                 <CardBody className='custom-card-transparent' style={{backgroundColor: `${selectedItem && selectedItem.id === item.id ? 'lightgrey' : 'white'}`}}>
//                     <h4 style={{fontWeight: 'bold'}}>{moment(item.fb_created).format('MM/DD/YYYY HH:mm:ss')}</h4>
//                     <h6>AWB {item.s_mawb}</h6>
//                     <hr/>
//                     <CardSubtitle>{item.fb_feedback}</CardSubtitle>
//                 </CardBody>
//             </Card>
//         </Col>
//     );
// }

const FeedbackCard = ({
    item,
    setSelectedItem,
    selectedItem,
}) => {
    return (
        <Col md={12} className='my-2'>
            <Card style={{borderRadius: '0.75rem'}} className='card-hover pointer' onClick={() => setSelectedItem(item)}>
                <CardBody className='custom-card-transparent' style={{backgroundColor: `${selectedItem && selectedItem.id === item.id ? 'lightgrey' : 'white'}`}}>
                    <h4 style={{fontWeight: 'bold'}}>{item.s_trucking_company} at {moment(item.fb_created).format('MM/DD/YYYY HH:mm:ss')}</h4>
                    <h6>AWBs</h6>
                    <ul>
                    {
                        item.awbArray.map((a, i) => 
                            <li key={i}>{a}</li>
                        )
                    }
                    </ul>
                    <hr/>
                    <CardSubtitle>{item.fb_feedback}</CardSubtitle>
                </CardBody>
            </Card>
        </Col>
    );
}

export default ({ 
    baseApiUrl,
    headerAuthCode,
    user,
    activeFirstTab
}) => {

    const [feedback, setFeedback] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [graphApiToken, setGraphApiToken] = useState('');
    const [monthYear, setMonthYear] = useState(`${moment().format('YYYY-MM')}`);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDriverPhoto, setSelectDriverPhoto] = useState('');

    useEffect(() => {
        const selectFeedback = async () => {
            setIsLoading(true);
            const s_unit = user && user.s_unit;
            const monthYearArray = monthYear.split('-');
            
            const data = {
                s_unit,
                i_year: monthYearArray[0],
                i_month: monthYearArray[1]
            }
            
            const response = await axios.post(`${baseApiUrl}/selectFeedback`, {
                data
            }, {
                headers: {'Authorization': `Bearer ${headerAuthCode}`}
            });

            if (response.status === 200) {
                const sorted = response.data.feedback.sort((a, b) => moment(b.fb_created) - moment(a.fb_created));
                // setFeedback(sorted);
                setFeedback(groupFeedback(sorted));
                setGraphApiToken(response.data.graphApiToken);   
                setIsLoading(false);
                setSelectedItem(null);
            } else {
                alert('Error getting Feedback data');
            }

        }
        if (user.s_unit && user.s_unit.length > 0 && activeFirstTab === '2') {
            selectFeedback();
        }
    }, [user.s_unit, activeFirstTab, monthYear]);

    const groupFeedback = (feedback) => {
        const grouped = [];
        for (let i = 0; i < feedback.length; i++) {
            const current = feedback[i];
            console.log(current);
            const index = grouped.findIndex(c => c.s_transaction_id === current.s_transaction_id);
            if (index !== -1) {
                grouped[index].awbArray.push(current.s_mawb);
            } else {
                grouped.push({
                    s_transaction_id: current.s_transaction_id,
                    s_trucking_company: current.s_trucking_company,
                    s_trucking_driver: current.s_trucking_driver,
                    s_trucking_cell: current.s_trucking_cell,
                    b_trucking_sms: current.b_trucking_sms,
                    s_trucking_email: current.s_trucking_email,
                    s_trucking_language: current.s_trucking_language,
                    s_status: current.s_status,
                    s_state: current.s_state,
                    t_modified: current.t_modified,
                    fb_created: current.fb_created,
                    fb_feedback: current.fb_feedback,
                    awbArray: [
                        current.s_mawb
                    ]
                });
            }
        }
        return grouped;
    }

    const getDriverPhoto = async (awb) => {
        try {
            const { id} = awb;
            const response = await axios.get(`${baseApiUrl}/getDriverPhoto/${id}`, {
                headers: {
                    Authorization: `Bearer ${headerAuthCode}`
                }
            }); 

            if (response.status === 200) {
                if (response.data.length > 0) {
                    setSelectDriverPhoto(response.data[0].sm_driver_photo);
                }
            }
        } catch (err) {
            alert('Error getting driver photo');
        }
    }

    useEffect(() => {
        if (selectedItem) {
            getDriverPhoto(selectedItem);
        }
    }, [selectedItem]);

    return (
        <Row className='px-3 py-2'>
            <Col md={3}>
                <Row>
                    <Col md={6}>
                        <h4>Feedback List</h4>
                    </Col>
                    <Col md={6}>
                        <input type='month' value={monthYear} onChange={(e) => setMonthYear(e.target.value)} />
                    </Col>
                </Row>
                <Row style={{height: '700px', overflowY: 'scroll'}}>
                {
                    feedback && feedback.map((f, i) => 
                        <FeedbackCard 
                            item={f} 
                            key={i} 
                            selectedItem={selectedItem}
                            setSelectedItem={setSelectedItem} 
                        />
                    )
                }
                </Row>
            </Col>
            {
                isLoading ? 
                <Col md={9} className='text-center' style={{marginTop: '150px'}}>
                    <PulseLoader 
                        size={50}
                        color={"#51C878"}
                        loading={true}
                    />
                </Col> :
                selectedItem && 
                <Col md={9}>
                    <Row>
                        <Col md={8}>
                            <Timeline 
                                awb={selectedItem}
                                graphApiToken={graphApiToken}
                            />
                        </Col>
                        <Col md={4}>
                            <Row>
                            </Row>
                            <Row>
                                <Table striped style={{fontWeight: 'bold'}}>
                                    <thead></thead>
                                    <tbody>
                                        <tr>
                                            <td>AWB</td>
                                            <td style={{fontWeight: 'bold', color:'white', backgroundColor: `${selectedItem && selectedItem.s_type === 'IMPORT' ? '#61b996' : '#6bb4dd'}`}}>{selectedItem.s_mawb}</td>
                                        </tr>
                                        <tr>
                                            <td>Driver:</td>
                                            <td>
                                                <Row>{selectedItem.s_trucking_driver}</Row>
                                                <Row>
                                                    <img style={{width: '250px', height: 'auto'}} src={`${selectedDriverPhoto}`} />
                                                </Row>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Type</td>
                                            <td>{selectedItem.s_type}</td>
                                        </tr>
                                        <tr>
                                            <td>Company:</td>
                                            <td>{selectedItem.s_trucking_company}</td>
                                        </tr>
                                        <tr>
                                            <td>Cell:</td>
                                            <td>{selectedItem.s_trucking_cell}</td>
                                        </tr>
                                        <tr>
                                            <td>SMS:</td>
                                            <td>{selectedItem.b_trucking_sms ? 'YES' : 'NO'}</td>
                                        </tr>
                                        <tr>
                                            <td>Email:</td>
                                            <td>{selectedItem.s_trucking_email}</td>
                                        </tr>
                                        <tr>
                                            <td>Language:</td>
                                            <td>{selectedItem.s_trucking_language}</td>
                                        </tr>
                                        <tr>
                                            <td>Status:</td>
                                            <td>{selectedItem.s_status}</td>
                                        </tr>
                                        <tr>
                                            <td>Engagement Time:</td>
                                            <td>{selectedItem.ic_total_engagement_time}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            }
        </Row>
    );
}

