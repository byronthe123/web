import React, { useState, useEffect } from 'react';
import { asyncHandler, api } from '../../../utils';
import ReactTable from '../../custom/ReactTable';
import { Row, Col } from 'reactstrap';
import axios from 'axios';
import io from 'socket.io-client';

const REACT_APP_EMAIL_QUEUE_ENDPOINT = process.env.REACT_APP_EMAIL_QUEUE_ENDPOINT;
const REACT_APP_EMAIL_QUEUE_PASSWORD = process.env.REACT_APP_EMAIL_QUEUE_PASSWORD;

// let socket = io('http://localhost:3007');


export default function EmailsQueue ({
    activeFirstTab,
    setLoading 
}) {

    const [data, setData] = useState([]);

    useEffect(() => {
        const getEmailsQueue = asyncHandler(async() => {
            console.log(`running getEmailsQueue`);
            console.log(REACT_APP_EMAIL_QUEUE_ENDPOINT);
            console.log(REACT_APP_EMAIL_QUEUE_PASSWORD);
            const res = await axios.get(`${REACT_APP_EMAIL_QUEUE_ENDPOINT}/emailsQueue`, {
                headers: {
                    Authorization: `Bearer ${REACT_APP_EMAIL_QUEUE_PASSWORD}` 
                }
            });
            console.log(res);
            setData(res.data);
        });
        if (activeFirstTab === '-5') {
            getEmailsQueue();

            const queryInterval = setInterval(() => {
                getEmailsQueue();
            }, 5000);

            return () => {
                clearInterval(queryInterval);
            }
        }
    }, [activeFirstTab]);

    return (
        <Row>
            <Col md={12}>
                <ReactTable 
                    index={true}
                    data={data}
                    mapping={[
                        {
                            name: 'To', 
                            value: 'to'
                        },
                        {
                            name: 'CC', 
                            value: 'cc'
                        },
                        {
                            name: 'BCC', 
                            value: 'bcc'
                        },
                        {
                            name: 'Subject', 
                            value: 'subject'
                        },
                        {
                            name: 'Title', 
                            value: 'title'
                        }
                    ]}
                />
            </Col>
        </Row>
    );
}