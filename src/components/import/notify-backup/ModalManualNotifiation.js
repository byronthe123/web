import React, {Fragment} from 'react';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    Button,
    Modal,
  } from "reactstrap";
import moment, { relativeTimeRounding } from 'moment';

const ModalManualNotification = ({
    open, 
    handleModal,
    handleInput,
    selectedMawb,
    totalPieces,
    totalWeight,
    getIscCharge,
    goDate,
    manual_s_mawb,
    manual_s_airline_code,
    manual_i_airline_prefix,
    manual_d_flight_date,
    manual_total_pieces,
    manual_total_weight,
    manual_flight_pieces,
    manual_flight_weight,
    manual_storage_start_date,
    manual_goDate,
    manual_isc_cost,
    resolveReplyEmail,
    footerJsx
}) => {

    const validDate = (date) => {
        const checkDate = moment(date, 'YYYY-MM-DD');
        return checkDate.isValid() && !moment(checkDate).isBefore(moment().format('MM/DD/YYYY'));
    }

    const resolveReadyToEmail = () => {
        return manual_s_mawb.length === 11 && manual_s_airline_code.length > 0 && manual_i_airline_prefix.length > 0 && validDate(manual_d_flight_date) > 0 && manual_flight_pieces.length > 0 && manual_flight_weight.length > 0 && validDate(manual_storage_start_date);
    }

    return (
        <Fragment>
            <Modal isOpen={open} toggle={() => handleModal('modalManualNotificationOpen')}>
                <div className="modal-content" style={{width: '700px'}}>
                    <h6 style={{textAlign: 'right', color: `${resolveReadyToEmail() ? 'green' : 'red'}`}} className={`${resolveReadyToEmail() ? 'fas fa-check-square' : 'far fa-times-circle'}  pt-2`}>{resolveReadyToEmail() ? 'Ready to Email' : 'Please fill all open fields'}</h6>
                    <table border={0} cellSpacing={0} cellPadding={0}>
                        <tbody>
                            <tr>
                                <td style={{padding: '10px 0 30px 0'}}>
                                <table style={{border: '0px', borderCollapse: 'collapse'}} width={600} cellSpacing={0} cellPadding={0} align="center">
                                    <tbody>
                                    <tr>
                                        <td style={{padding: '40px 0 30px 0', color: '#153643', fontSize: '28px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif'}} align="center" bgcolor="#d8dce5"><img style={{display: 'block'}} src="https://choice.aero/wp-content/uploads/2019/07/CAS-Logo-v2.png" alt="Choice Aviation Services" width={330} height={110} /></td>
                                    </tr>
                                    <tr>
                                        <td style={{padding: '40px 30px 40px 30px', backgroundColor: '#ffffff'}}>
                                        <table style={{border: '0px'}} width="100%" cellSpacing={0} cellPadding={0}>
                                            <tbody>
                                            <tr>
                                                {/* <input type='date' id='manual_d_flight_date' data-date-format="YYYY-MM-DD" value={moment(manual_d_flight_date).format('YYYY-MM-DD')} onChange={(e) => handleInput(e)} style={{width: '155px', fontSize: '15px'}} /> */}
                                                <p>This is an unmanaged mailbox. <span style={{color: 'red', fontWeight: 'bold'}}>Please do not reply to this message.</span></p>
                                            </tr>
                                            <tr>
                                                <td style={{color: '#153643', fontFamily: 'Arial, sans-serif', fontSize: '24px'}}>
                                                <strong>Your AWB  
                                                    <input type='number' id='manual_s_mawb' className={'px-2 mx-2'} value={manual_s_mawb} onChange={(e) => handleInput(e)} style={{width: '200px'}} />
                                                    has arrived.
                                                </strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{padding: '20px 0 30px 0', color: '#153643', fontFamily: 'Arial, sans-serif', fontSize: '16px', lineHeight: '20px'}}>
                                                <p>This is a notification about the arrival of your shipment to our warehouse.</p>
                                                <table style={{width: '640px'}}>
                                                    <tbody>
                                                    <tr style={{height: '64px'}}>
                                                        <td style={{width: '302px', backgroundColor: '#bbbbbb', textAlign: 'center', height: '64px'}}><span face="arial, helvetica, sans-serif" style={{fontFamily: 'arial, helvetica, sans-serif'}}><span style={{fontSize: '24px'}}> 
                                                            {/* <b>$ selectedMawb[0].s_flight_id</b> */}
                                                            <input type='text' id={'manual_s_airline_code'} value={manual_s_airline_code} onChange={(e) => handleInput(e)} style={{width: '50px'}} placeholder='BA' />/
                                                            <input type='number' id={'manual_i_airline_prefix'} value={manual_i_airline_prefix} onChange={(e) => handleInput(e)} style={{width: '75px'}} placeholder='185' />
                                                            <input type='date' id='manual_d_flight_date' value={moment(manual_d_flight_date).format('YYYY-MM-DD')} onChange={(e) => handleInput(e)} style={{width: '155px', fontSize: '15px', height: '34px', position: 'relative', top: '-3px'}} />
                                                            {/* <span style={{fontSize: '24px'}}>{manual_d_flight_date}</span> */}
                                                            </span></span>
                                                        </td>
                                                        <td style={{width: '30px', height: '86px'}} rowSpan={2} />
                                                        <td style={{width: '302px', backgroundColor: '#bbbbbb', textAlign: 'center', height: '64px'}}><span face="arial, helvetica, sans-serif" style={{fontFamily: 'arial, helvetica, sans-serif'}}><span style={{fontSize: '24px'}}> 
                                                            {/* <b>$ totalPieces / totalWeight</b> */}
                                                            <b>
                                                                <input type='number' id='manual_flight_pieces' value={manual_flight_pieces} value={manual_flight_pieces} onChange={(e) => handleInput(e)} style={{width: '100px'}} />/
                                                                <input type='number' id='manual_flight_weight' value={manual_flight_weight} value={manual_flight_weight} onChange={(e) => handleInput(e)} style={{width: '100px'}} />
                                                            </b>
                                                            </span></span>
                                                        </td>
                                                    </tr>
                                                    <tr style={{height: '22px'}}>
                                                        <td style={{width: '302px', textAlign: 'center', height: '22px'}}><span style={{fontSize: '14px'}}><em><span face="arial, helvetica, sans-serif" style={{fontFamily: 'arial, helvetica, sans-serif'}}>Arrival Flight</span></em></span></td>
                                                        <td style={{width: '302px', textAlign: 'center', height: '22px'}}><span style={{fontSize: '14px'}}><em><span face="arial, helvetica, sans-serif" style={{fontFamily: 'arial, helvetica, sans-serif'}}>Pieces/Weight</span></em></span></td>
                                                    </tr>
                                                    <tr style={{height: '9px'}}>
                                                        <td style={{width: '634px', height: '9px'}} colSpan={3} />
                                                    </tr>
                                                    <tr style={{height: '64px'}}>
                                                        <td style={{width: '302px', backgroundColor: '#bbbbbb', textAlign: 'center', height: '64px'}}><span face="arial, helvetica, sans-serif" style={{fontFamily: 'arial, helvetica, sans-serif'}}><span style={{fontSize: '24px'}}> 
                                                            <b>{manual_isc_cost}</b> 
                                                            </span></span>
                                                        </td>
                                                        <td style={{width: '30px', height: '86px'}} rowSpan={2} />
                                                        <td style={{width: '302px', backgroundColor: '#bbbbbb', textAlign: 'center', height: '64px'}}><span face="arial, helvetica, sans-serif" style={{fontFamily: 'arial, helvetica, sans-serif'}}><span style={{fontSize: '24px'}}> 
                                                            {/* <b>$ moment(selectedMawb[0].d_storage_start_day).format('MM/DD/YYYY')</b> */}
                                                            <b>
                                                                <input type='date' id={'manual_storage_start_date'} value={manual_storage_start_date} onChange={(e) => handleInput(e)} />
                                                            </b>
                                                            </span></span>
                                                        </td>
                                                    </tr>
                                                    <tr style={{height: '22px'}}>
                                                        <td style={{width: '302px', textAlign: 'center', height: '22px'}}><span style={{fontSize: '14px'}}><em><span face="arial, helvetica, sans-serif" style={{fontFamily: 'arial, helvetica, sans-serif'}}>Import Service Charge</span></em></span></td>
                                                        <td style={{width: '302px', textAlign: 'center', height: '22px'}}><span style={{fontSize: '14px'}}><em><span face="arial, helvetica, sans-serif" style={{fontFamily: 'arial, helvetica, sans-serif'}}>Storage Start Date</span></em></span></td>
                                                    </tr>
                                                    <tr style={{height: '5px'}}>
                                                        <td style={{width: '634px', height: '5px'}} colSpan={3} />
                                                    </tr>
                                                    <tr style={{height: '34px'}}>
                                                        <td style={{width: '634px', backgroundColor: '#d8dce5', textAlign: 'center', height: '64px'}} colSpan={3}><em><a href="https://pay.choice.aero/" target="_blank" rel="noopener" title="https://pay.choice.aero/"><span style={{fontSize: '24px'}}><strong><span face="arial, helvetica, sans-serif" style={{fontFamily: 'arial, helvetica, sans-serif'}}>Make a payment at https://pay.choice.aero/</span></strong></span></a></em></td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p>
                                                        For shipments with multiple parts : we may have received other parts from other flights. Please contact us to know how many parts have already arrived for the master AWB.                                               
                                                    </p>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <p>If you have any questions about this shipment please email <a href="mailto:ewr.12.imp@choice.aero?subject=Question about $ selectedMawb[0].s_mawb ">{resolveReplyEmail()}</a></p>
                                        <p> Storage is calculated at 1.50 per kg with a minimun of $150.00 per day.</p>
                                        <p>
                                            Due to Title 19, United States Code (U.S.C.), section 1555, this shipment will go to a General Order Warehouse (G.O.) if not claimed by {moment(manual_goDate).format('MM/DD/YYYY')}.
                                        </p>
                                        <p>Thank you for your business.</p>
                                        <p>PS. Please do not reply to this email.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{padding: '30px 30px 30px 30px', backgroundColor: '#ee4c50'}}>
                                        <table style={{border: '0px'}} width="100%" cellSpacing={0} cellPadding={0}>
                                            <tbody>
                                            <tr>
                                                <td style={{color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '14px'}} width="75%">
                                                {
                                                    footerJsx
                                                }  
                                                </td>  
                                                <td style={{textAlign: 'right'}} width="25%">
                                                <table style={{border: '0px'}} cellSpacing={0} cellPadding={0}>
                                                    <tbody>
                                                    <tr>
                                                        <td style={{fontFamily: 'Arial, sans-serif', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#ee4c50'}}>
                                                        <a style={{color: '#ffffff', border: '0px'}} href="https://twitter.com/aviation_choice "> <img style={{display: 'block'}} src="https://ewrstorage1.blob.core.windows.net/pics/twitter.gif" alt="Twitter" width={38} height={38} /></a>
                                                        </td>
                                                        <td style={{fontFamily: 'Arial, sans-serif', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#ee4c50'}}>
                                                        <a style={{color: '#ffffff', border: '0px'}} href="https://www.facebook.com/choiceaviationservices"> <img style={{display: 'block'}} src="https://ewrstorage1.blob.core.windows.net/pics/facebook.gif" alt="Facebook" width={38} height={38} /></a>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Modal>
        </Fragment>
    );
}

export default ModalManualNotification;