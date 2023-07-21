import React from 'react';
import moment from 'moment';
import {
    CustomInput,
  } from "reactstrap";
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import {Table, Card, CardBody, Row} from 'reactstrap';

import {useEffect, useRef, useState} from 'react';

const SelectStatus = ({
    filterNotified,
    handleFilterNotified
}) => {
    return (
        <div className='row py-2 px-3' style={{fontSize: '16px'}}>
            <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                <CardBody className='custom-card-transparent py-3' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                    <h4 className='mb-0'>Select Status:</h4>
                    <Row>
                        <div className="modal-body px-0 py-0">
                            <div className="row py-0">
                                <div className="col-12 py-0">
                                    <div className={`btn-group aircraft-type ml-2 mt-3`} data-toggle="buttons">
                                        <label className="btn btn-info" style={{backgroundColor: `${!filterNotified ? '#118496' : '#19A2B4'}`}}>
                                            <input type="radio" id='filterNotified' value={false} onClick={(e) => handleFilterNotified(false)} style={{display: 'none'}} /> Not Notified
                                        </label>
                                        <label className="btn btn-info" style={{backgroundColor: `${filterNotified ? '#118496' : '#19A2B4'}`}}>
                                            <input type="radio" id='filterNotified' value={true} onClick={(e) => handleFilterNotified(true)} style={{display: 'none'}} /> Notified
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>
                </CardBody>
            </Card>
        </div>
    );
}

export default SelectStatus;