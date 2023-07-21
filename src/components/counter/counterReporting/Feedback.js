import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card, CardBody, CardTitle, CardSubtitle, Table } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import Timeline from './Timeline';
import PulseLoader from 'react-spinners/PulseLoader';
import { api } from '../../../utils';

const FeedbackCard = ({
    item,
    setSelectedItem,
    selectedItem,
}) => {
    return (
        <Col md={12} className='my-2'>
            <Card style={{borderRadius: '0.75rem'}} className='card-hover pointer' onClick={() => setSelectedItem(item)}>
                <CardBody className='custom-card-transparent' style={{backgroundColor: `${selectedItem && selectedItem.s_transaction_id === item.s_transaction_id ? 'lightgrey' : 'white'}`}}>
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
    const [groupedFeedback, setGroupedFeedback] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [graphApiToken, setGraphApiToken] = useState('');
    const [monthYear, setMonthYear] = useState(`${moment().format('YYYY-MM')}`);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDriverPhoto, setSelectDriverPhoto] = useState('');
    const [selectedAwb, setSelectedAwb] = useState({});
    const [refreshTimeline, setRefreshTimeline] = useState(0);

    useEffect(() => {
        const selectFeedback = async () => {
            setIsLoading(true);
            const s_unit = user && user.s_unit;
            const monthYearArray = monthYear.split('-');
            
            const data = {
                s_unit,
                i_year: monthYearArray[0],
                i_month: monthYearArray[1],
                s_airline_code: user.s_airline_code
            }
            
            const response = await api('post', 'selectFeedback', { data });

            if (response.status === 200) {
                const sorted = response.data.feedback.sort((a, b) => moment(b.fb_created) - moment(a.fb_created));
                setFeedback(sorted);
                setGroupedFeedback(groupFeedback(sorted));
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
    }, [user.s_unit,, user.s_airline_code, activeFirstTab, monthYear]);

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
                    s_driver_photo_link: current.s_driver_photo_link,
                    awbArray: [
                        current.s_mawb
                    ]
                });
            }
        }
        return grouped;
    }

    const handleSelectAwb = (s_mawb) => {
        const awb = feedback.find(f => f.s_mawb === s_mawb);
        setSelectedAwb(awb);
    }

    const getDriverPhoto = async (awb) => {
        try {
            const { s_transaction_id } = selectedItem;
            const response = await axios.get(`${baseApiUrl}/getDriverPhoto/${s_transaction_id}`, {
                headers: {
                    Authorization: `Bearer ${headerAuthCode}`
                }
            }); 

            if (response.status === 200) {
                if (response.data.length > 0) {
                    setSelectDriverPhoto(response.data[0].sm_driver_photo);
                    console.log(response.data[0].sm_driver_photo);
                }
            }
        } catch (err) {
            alert('Error getting driver photo');
        }
    }

    useEffect(() => {
        if (selectedItem) {
            console.log(selectedItem);
            // getDriverPhoto(selectedItem);
            handleSelectAwb(selectedItem.awbArray[0]);
            setRefreshTimeline(refreshTimeline + 1);
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
                    groupedFeedback && groupedFeedback.map((f, i) => 
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
                                awb={selectedAwb}
                                graphApiToken={graphApiToken}
                                refreshTimeline={refreshTimeline}
                            />
                        </Col>
                        <Col md={4}>
                            <Row>
                            </Row>
                            <Row>
                                {
                                    selectedAwb && 
                                    <Table striped style={{fontWeight: 'bold'}}>
                                        <thead></thead>
                                        <tbody>
                                            <tr>
                                                <td>AWB</td>
                                                <td style={{fontWeight: 'bold', color:'white', backgroundColor: `${selectedAwb.s_type === 'IMPORT' ? '#61b996' : '#6bb4dd'}`}}>
                                                    <select onChange={(e) => handleSelectAwb(e.target.value)}>
                                                    {
                                                        selectedItem && selectedItem.awbArray.map((awb, i) =>
                                                            <option key={i} value={awb}>{awb}</option>
                                                        )
                                                    }
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Driver:</td>
                                                <td>
                                                    {selectedAwb.s_trucking_driver}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>
                                                    <img style={{width: '500px', height: 'auto'}} src={`${selectedAwb.s_driver_photo_link}`} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Type:</td>
                                                <td>{selectedAwb.s_type}</td>
                                            </tr>
                                            <tr>
                                                <td>Company:</td>
                                                <td>{selectedAwb.s_trucking_company}</td>
                                            </tr>
                                            <tr>
                                                <td>Cell:</td>
                                                <td>{selectedAwb.s_trucking_cell}</td>
                                            </tr>
                                            <tr>
                                                <td>SMS:</td>
                                                <td>{selectedAwb.b_trucking_sms ? 'YES' : 'NO'}</td>
                                            </tr>
                                            <tr>
                                                <td>Email:</td>
                                                <td>{selectedAwb.s_trucking_email}</td>
                                            </tr>
                                            <tr>
                                                <td>Language:</td>
                                                <td>{selectedAwb.s_trucking_language}</td>
                                            </tr>
                                            <tr>
                                                <td>Engagement Time:</td>
                                                <td>{selectedAwb.ic_total_engagement_time}</td>
                                            </tr>
                                        </tbody>
                                    </Table>

                                }
                            </Row>
                        </Col>
                    </Row>
                </Col>
            }
        </Row>
    );
}

