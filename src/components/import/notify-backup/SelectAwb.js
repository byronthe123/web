import React from 'react';
import moment from 'moment';
import {
    CustomInput,
  } from "reactstrap";
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import {Table, Card, CardBody} from 'reactstrap';

import {useEffect, useRef, useState} from 'react';

const SelectAwb = ({
    selectedMawb,
    filteredAwbs,
    flightPieces,
    flightWeight,
    resolveEnableMarkExempt,
    markAsMailOrDelivered,
    additionalNotificationData,
    handleSetMawb
}) => {
    return (
        <div className='row py-2 px-3' style={{fontSize: '16px'}}>
            <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                <CardBody className='custom-card-transparent py-3' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                    <h4>Select AWB:</h4>
                    <Table striped>
                        <tdead>
                        </tdead>
                        <tbody>
                            <tr>
                                <td>AWBs - {filteredAwbs.length}</td>
                                <td>PCS</td>
                                <td>Weight</td>
                            </tr>
                            <tr>
                                <td>
                                    <select onChange={(e) => handleSetMawb(e)}>
                                        {
                                            filteredAwbs && filteredAwbs.map((a, i) => 
                                                <option key={i} value={a.s_mawb}>{a.s_mawb}</option>
                                            )
                                        }
                                    </select>
                                </td>
                                <td>{flightPieces}</td>
                                <td>{flightWeight}</td>
                            </tr>
                            <tr>
                                <td>Type</td>
                                <td colSpan='2'>Commodity</td>
                            </tr>
                            <tr>
                                <td>{selectedMawb && selectedMawb[0].s_pieces_type}</td>
                                <td colSpan='2'>{selectedMawb && selectedMawb[0].s_commodity}</td>
                            </tr>
                            {/* <tr style={{widtd: '0px', display: 'hidden'}}>
                                <td className='py-0' colSpan='3' style={{widtd: '0px', border: '0px'}}></td>
                            </tr>
                            <tr>
                                <td colSpan='3'>
                                    <button className='btn btn-primary' disabled={!resolveEnableMarkExempt()} onClick={() => markAsMailOrDelivered('EXEMPT')} style={{marginLeft: '100px', widtd: '150px'}}>Mail [Exempt]</button>
                                </td>
                            </tr> */}
                            <tr>
                                <td colSpan='3'>Consignee:</td>
                            </tr>
                            <tr>
                                <td colSpan='3'>
                                    {additionalNotificationData.fwbData && additionalNotificationData.fwbData.length > 0 && additionalNotificationData.fwbData[0].s_consignee_address_name1}                                
                                </td>
                            </tr>
                            <tr>
                                <td colSpan='3'>Consignee Address:</td>
                            </tr>
                            <tr>
                                <td colSpan='3'>{additionalNotificationData.fwbData && additionalNotificationData.fwbData.length > 0 ? `${additionalNotificationData.fwbData[0].s_consignee_address_street_address1}, ${additionalNotificationData.fwbData[0].s_consignee_address_place}, ${additionalNotificationData.fwbData[0].s_consignee_address_state}, ${additionalNotificationData.fwbData[0].s_consignee_address_country}, ${additionalNotificationData.fwbData[0].s_consignee_address_postcode}` : ''}</td>
                            </tr>
                            <tr>
                                <td colSpan='3'>Consignee Contact Number:</td>
                            </tr>
                            <tr>
                                <td colSpan='3'>{additionalNotificationData.fwbData && additionalNotificationData.fwbData.length > 0 ? additionalNotificationData.fwbData[0].s_consignee_contact_number: ''}</td>
                            </tr>
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </div>

    );
}

export default SelectAwb;