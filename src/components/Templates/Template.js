import React, { useState, useEffect, useRef  } from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';

import { Button, Row, Col } from 'reactstrap';

import AppLayout from '../../components/AppLayout';

const Invoices = ({
    user, baseApiUrl, headerAuthCode, createSuccessNotification, eightyWindow, width
}) => {
    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>

                    </Row>
                </div>
            </div>
        </AppLayout>
    );
}

export default withRouter(Invoices);