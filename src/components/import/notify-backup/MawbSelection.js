import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {Table} from 'reactstrap';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";

const MawbSelection = ({
    d_arrival_date,
    goDate,
    ffmData,
    s_airline_code,
    s_flight_serial,
    orderedAirlineCodes,
    orderedFlightSerials,
    filteredAwbs,
    selectedMawb,
    handleSetMawb,
    totalPieces,
    totalWeight,
    flightPieces,
    flightWeight,
    setAirlineCode,
    handleInput,
    additionalNotificationData,
    ffmSearchNumber,
    ffmSearch,
    enableFfmSearch,
    filterNotified,
    handleFilterNotified,
    resolveEnableMarkExempt,
    markAsMailOrDelivered,
    outStatus,
    manualMode,
    handleToggleManualMode
}) => {

    const resolveImportProcessed = () => {
        return additionalNotificationData && additionalNotificationData.importData && additionalNotificationData.importData.length;
    }

    return (
        <div className='row'>
            <div className='col-12'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='row'>
                            <div className='col-3'>
                                <h4>MAWB Selection</h4>
                            </div>
                            <div className='col-4'>
                                <h4>{outStatus}</h4>
                            </div>
                            <div className='col-5'>
                                <div className='row'>
                                    <label className="col-form-label mr-5" style={{fontSize: '12px', position: 'relative', left: '10%'}} id="outPhotoMatchLabel">Filter Notified {filterNotified ? 'On' : 'Off'}</label>
                                    <Switch
                                        className="custom-switch custom-switch-primary"
                                        checked={filterNotified}
                                        onClick={handleFilterNotified}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-12'>
                        <Table striped borderless style={{tableLayout: 'fixed'}} className='mb-0'>
                            <thead>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Flight Date</td>
                                    <td><input type='date' id={'d_arrival_date'} value={moment(d_arrival_date).format('YYYY-MM-DD')} onChange={(e) => handleInput(e)} /></td>
                                    <td>
                                        <p style={{width: '150px'}}>
                                        <label className="col-form-label ml-5" style={{fontSize: '12px', float: 'left'}} id="outPhotoMatchLabel">Manual</label>
                                        <Switch
                                            className="custom-switch custom-switch-primary"
                                            checked={manualMode}
                                            onClick={handleToggleManualMode}
                                            style={{float: 'right'}}
                                        /> 
                                        </p>
                                   
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>Airline - {orderedAirlineCodes.length}</p>
                                    </td>
                                    <td>
                                        <select value={s_airline_code} id={'s_airline_code'} onChange={(e) => handleInput(e)}>
                                            {
                                                orderedAirlineCodes && orderedAirlineCodes.map((c, i) => 
                                                    <option key={i} value={c}>{c}</option>
                                                )
                                            }
                                        </select> 
                                    </td>
                                    <td>
                                        <p>Flight - {orderedFlightSerials.length}</p>                   
                                    </td>
                                    <td>
                                        <select value={s_flight_serial} id={'s_flight_serial'} onChange={(e) => handleInput(e)}>
                                            {
                                                orderedFlightSerials && orderedFlightSerials.map((s, i) => 
                                                    <option key={i} value={s}>{s}</option>
                                                )
                                            }
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>AWBs - {filteredAwbs.length}</p>
                                    </td>
                                    <td>
                                        <select onChange={(e) => handleSetMawb(e)}>
                                            {
                                                filteredAwbs && filteredAwbs.map((a, i) => 
                                                    <option key={i} value={a.s_mawb}>{a.s_mawb}</option>
                                                )
                                            }
                                        </select>
                                    </td>
                                    <td style={{width: '70px', paddingRight: '0px'}}>Flight ID</td>
                                    <td className='pl-0'>
                                        <p style={{width: '140px'}}>{selectedMawb && selectedMawb[0].s_flight_id}</p>                                      
                                    </td>
                                </tr>
                                <tr>
                                    <td>Consignee</td>
                                    <td>
                                        <p className='mb-0' style={{width: '400px'}}>{additionalNotificationData.fwbData && additionalNotificationData.fwbData.length > 0 && additionalNotificationData.fwbData[0].s_consignee_address_name1}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Consignee Address</td>
                                    <td><p className='mb-0' style={{width: '350px'}}>{additionalNotificationData.fwbData && additionalNotificationData.fwbData.length > 0 ? `${additionalNotificationData.fwbData[0].s_consignee_address_street_address1}, ${additionalNotificationData.fwbData[0].s_consignee_address_place}, ${additionalNotificationData.fwbData[0].s_consignee_address_state}, ${additionalNotificationData.fwbData[0].s_consignee_address_country}, ${additionalNotificationData.fwbData[0].s_consignee_address_postcode}` : ''}</p></td>
                                    <td width='0' className='py-0' style={{width: '0px'}}></td>
                                    <td width='0' className='py-0' style={{width: '0px'}}></td>
                                </tr>
                                <tr>
                                    <td><p className='mb-0' style={{width: '300px'}}>Consignee Contact Number</p></td>
                                    <td><p style={{width: '300px', marginLeft: '40px'}}>{additionalNotificationData.fwbData && additionalNotificationData.fwbData.length > 0 ? additionalNotificationData.fwbData[0].s_consignee_contact_number: ''}</p></td>
                                    <td width='0' style={{width: '0px'}}></td>
                                    <td width='0' style={{width: '0px'}}></td>
                                </tr>
                                <tr>
                                    <td>Storage Start</td>
                                    <td><input type='date' value={selectedMawb && selectedMawb !== null ? moment.utc(selectedMawb[0].d_storage_start_day).format('YYYY-MM-DD') : ''} /></td>
                                    <td style={{paddingLeft: '50px'}}>GO Date</td>
                                    <td className='pl-0'><input type='date' value={goDate} style={{width: '130px'}} /></td>
                                </tr>
                                <tr>
                                    <td>Weight: {flightWeight}</td>
                                    <td>Type: {selectedMawb && selectedMawb[0].s_pieces_type}</td>
                                    <td>
                                        <p style={{width: '300px'}}>Commodity: {selectedMawb && selectedMawb[0].s_commodity}</p>
                                    </td>
                                    <td width='0' style={{width: '0px'}}></td>
                                </tr>
                                <tr>
                                    <td>FLT PCS: {flightPieces}</td>
                                    <td>TOTAL PCS: {totalPieces}</td>
                                    <td>FLT WHT: {flightWeight}</td>
                                    <td>TOTAL WHT: {totalWeight}</td>  
                                </tr>
                                <tr>
                                    <td style={{fontWeight: `${resolveImportProcessed() > 0 ? 'bolder' : 'normal'}`}} className={`${resolveImportProcessed() > 0 ? 'text-primary' : 'text-dark'}`}>Processed or Delivered: {resolveImportProcessed()}</td>
                                    <td>
                                        <button className={`btn btn-info ${resolveImportProcessed() > 0 && 'pulse'}`} disabled={resolveImportProcessed() > 0 ? false : true} onClick={() => markAsMailOrDelivered('ALREADY DELIVERED')} style={{width: '180px', backgroundColor: 'rgba(30,144,255, 1)'}}>Mark Already Delivered</button>
                                    </td>
                                    <td>
                                        <button className='btn btn-primary' disabled={!resolveEnableMarkExempt()} onClick={() => markAsMailOrDelivered('EXEMPT')} style={{marginLeft: '100px', width: '150px'}}>Mail [Exempt]</button>
                                    </td>                                    
                                    <td width='0' style={{width: '0px'}}></td>
                                </tr>
                            </tbody>
                        </Table>
                        <Table striped className='mb-0'>
                            <thead className='table-info'>
                                <tr>
                                    <th>PC</th>
                                    <th>Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </Table>
                        <div style={{overflowY: 'scroll', height: '135px'}}>
                            <Table striped>
                                <thead className='table-info'>
                                    <tr>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        selectedMawb && selectedMawb.map((m, i) => 
                                            <tr key={i}>
                                                <td>{m.i_actual_piece_count}</td>
                                                <td>{m.f_weight}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MawbSelection;