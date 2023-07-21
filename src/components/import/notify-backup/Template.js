import React from 'react';
import moment from 'moment';
import {
    CustomInput,
  } from "reactstrap";
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import {Table, Card, CardBody} from 'reactstrap';

import {useEffect, useRef, useState} from 'react';

const DriversInfo = ({

}) => {
    return (
        <div className='row py-2 px-3' style={{fontSize: '16px'}}>
            <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                <CardBody className='custom-card-transparent py-3' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                    <h4>FFM:</h4>
                    <Table>
                        <thead>
                            <tr style={{backgroundColor: '#F3F3F3'}}>
                                <th className='py-1'>Type</th>
                                <th className='py-1'>Total Pcs</th>
                                <th className='py-1'>ARR pcs</th>
                                <th className='py-1'>Storage Start</th>
                                <th className='py-1'>Destination</th>
                                <th className='py-1'>All Arrived</th>
                                <th className='py-1'>ARR Weight</th>
                                <th className='py-1'>Daily Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ffmData && ffmData[0] &&
                                <tr>
                                    <td>{ffmData[0].s_pieces_type}</td>
                                    <td>{getTotalPieces()}</td>
                                    <td>{getArrivedPieces()}</td>
                                    <td>{moment.utc(ffmData[0].d_storage_start_day).format('MM/DD/YYYY')}</td>
                                    {/* <td>{getMostRecentStorageStartDate()}</td> */}
                                    <td>{ffmData[0].s_destination}</td>
                                    <td>{getAllArrived()}</td>
                                    <td>{getArrivedWeight()}</td>
                                    <td>{getDailyCost()}</td>
                                </tr>
                            }
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </div>

    );
}

export default DriversInfo;