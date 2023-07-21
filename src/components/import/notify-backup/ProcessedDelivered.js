import React from 'react';
import moment from 'moment';
import {
    CustomInput,
  } from "reactstrap";
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import {Table, Card, CardBody, Row} from 'reactstrap';

import {useEffect, useRef, useState} from 'react';

const ProcessedDelivered = ({
    resolveEnableMarkExempt,
    markAsMailOrDelivered,
    additionalNotificationData
}) => {

    const resolveImportProcessed = () => {
        return additionalNotificationData && additionalNotificationData.importData && additionalNotificationData.importData.length;
    }

    return (
        <div className='row py-2 px-3' style={{fontSize: '16px'}}>
            <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                <CardBody className='custom-card-transparent py-3' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                    <h4>Processed or Delivered:</h4>
                    <Row className='px-3'>
                        <h4 style={{fontWeight: `${resolveImportProcessed() > 0 ? 'bolder' : 'normal'}`}} className={`${resolveImportProcessed() > 0 ? 'text-primary' : 'text-dark'}`}>Already Delivered: {resolveImportProcessed()}</h4>
                    </Row>
                    <Row className='px-3'>
                        <button className={`btn btn-info ml-3 ${resolveImportProcessed() > 0 && 'pulse'}`} disabled={resolveImportProcessed() > 0 ? false : true} onClick={() => markAsMailOrDelivered('ALREADY DELIVERED')} style={{width: '180px', backgroundColor: 'rgba(30,144,255, 1)'}}>Mark Already Delivered</button>
                        <button className='btn btn-primary' disabled={!resolveEnableMarkExempt()} onClick={() => markAsMailOrDelivered('EXEMPT')} style={{marginLeft: '100px', widtd: '150px'}}>Mail [Exempt]</button>
                    </Row>
                </CardBody>
            </Card>
        </div>

    );
}

export default ProcessedDelivered;