import React from 'react';
import moment from 'moment';
import {
    CustomInput,
  } from "reactstrap";
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import {Table, Card, CardBody} from 'reactstrap';

import {useEffect, useRef, useState} from 'react';

const FlightsInfo = ({
    flightPieces,
    totalPieces,
    flightWeight,
    totalWeight
}) => {
    return (
        <div className='row py-2 px-3' style={{fontSize: '16px'}}>
            <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                <CardBody className='custom-card-transparent py-3' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                    <h4>This Flight/All Flights Received:</h4>
                    <Table striped>
                        <thead>
                            <tr></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>FLT PCS: {flightPieces && flightPieces}</td>
                                <td>TOTAL PCS: {totalPieces && totalPieces}</td>
                            </tr>
                            <tr>
                                <td>FLT WHT: {flightWeight && flightWeight}</td>
                                <td>TOTAL WHT: {totalWeight && totalWeight}</td>
                            </tr>
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
}

export default FlightsInfo;