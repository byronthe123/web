import { formatCost, getNum, formatMawb } from '../../../utils';
import moment from 'moment';
import _ from 'lodash';

export default (
    skylineEmail,
    user,
    iscCost,
    unitInfo,
    firmsCode,
    s_import_distribution_email,
    s_logo,
    s_destination,
    //
    lastFreeDate,
    goDate,
    storageStartDate,
    partNumber,
    _s_mawb,
    _s_flight_id,
    _flightPieces,
    _flightWeight,
    _s_airline_code,
    _totalPieces,
    _totalWeight,
    storageKg,
    storageMinCost,
    _dailyStorage,
    //
    enableCustomFields,
    chfUldAmount,
    chfUldFactor,
    chfLoose,
    chfLooseKg,
    chfLooseFactor,
    futureNotification,
    allEmails,
    multipleMode,
    selectedMap
) => {

    const t8Logic = user.s_unit === 'CEWR1' && _s_airline_code === 'T8';
    
    const replyEmail = 
        s_import_distribution_email && s_import_distribution_email.length > 0 ?
            s_import_distribution_email :
            null;

    const uldCost = getNum(parseFloat(chfUldAmount) * parseFloat(chfUldFactor));
        
    const calcLooseCost = () => {
        let looseCost = 0;

        if (chfLoose) {
            looseCost = parseFloat(chfLooseFactor) * parseFloat(chfLooseKg);
            if (t8Logic) {
                looseCost = Math.max(100, looseCost);
            } else {
                if (isNaN(looseCost)) {
                    looseCost = 0;
                }
            }
        }

        return looseCost;
    }

    const carrierHandlingFee = uldCost + calcLooseCost();

    const portFee = carrierHandlingFee * (user.s_unit === 'CORD1' ? 0 : 0.0526);

    const totalManualFee = 
        parseFloat(carrierHandlingFee) 
        + parseFloat(portFee) 
        + parseFloat(iscCost);

    const resolveYourAwbs = multipleMode ? `AWBs ${futureNotification ? 'are scheduled to' : 'have'}` : `AWB ${_s_mawb} ${futureNotification ? 'is scheduled to' : 'has'}`;

    const resolveCarrierHandlingDescription = () => {
        const calcUld = chfUldAmount > 0;
        const uldDesc = calcUld ? `(${chfUldFactor}) $${formatCost(chfUldFactor)}/ULD` : '';
        const looseDesc = chfLoose ? `${chfLooseFactor}/kgs Loose ${t8Logic && '($100.00 min)'}` : '';

        if (calcUld && chfLoose) {
            return `${uldDesc} + ${looseDesc}`;
        } else if (calcUld) {
            return uldDesc;
        } else {
            return looseDesc;
        }
        //Carrier Handling Fee $225.0 / ULD or $0.15 / kgs Loose
    }

    const transfers = window.location.pathname === '/EOS/Operations/Transfers/Notify';

    /* 
        Change the widths of preview and body in the preview and bodyHtml code
        blocks at the very bottom.
    */

    const header = `<tr style="border: solid #CCCCCC 1.0pt">
        <td style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;" align="center" bgcolor="#d8dce5"><img style="display: block;" src="https://choice.aero/wp-content/uploads/2019/07/CAS-Logo-v2.png" alt="Choice Aviation Services" width="330" height="110"></td>
    </tr>`;

    const footer = `
        <tr style="border: solid #CCCCCC 1.0pt">
            <td style="padding: 30px 30px 30px 30px; background-color:#ee4c50">
            <table style="border: 0px" width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                    <tr>
                        <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">
                            <p>Choice Aviation Services Inc.</p>
                            <p>Address: ${unitInfo.s_address}</p>
                            <p>Phone: ${unitInfo.s_phone}</p>
                            <p>Firms Code: ${firmsCode}</p>
                            <p>Visit our website: <a href="http://www.choice.aero ">http://www.choice.aero </a></p>
                            <p>We are open Monday – Friday ${unitInfo.s_weekday_hours} & Saturday/Sunday ${unitInfo.s_weekend_hours}</p>                
                        </td>
                        <td style="text-align: right;" width="25%">
                        <table style="border: 0px" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; background-color: #ee4c50">
                                    <a style="color: #ffffff; border: 0px;" href="https://twitter.com/aviation_choice "> <img style="display: block;" src="https://ewrstorage1.blob.core.windows.net/pics/twitter.gif" alt="Twitter" width="38" height="38"></a>
                                    </td>
                                    <td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; background-color: #ee4c50">
                                    <a style="color: #ffffff; border: 0px;" href="https://www.facebook.com/choiceaviationservices"> <img style="display: block;" src="https://ewrstorage1.blob.core.windows.net/pics/facebook.gif" alt="Facebook" width="38" height="38"></a>
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
    `;

    const base = `
        <tr>
            <td style="border-top:none; border-left:solid #CCCCCC 1.0pt; border-bottom:none; border-right:solid #CCCCCC 1.0pt; background:white; padding:7.5pt 22.5pt 30.0pt 22.5pt">
                <table class="x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%">
                    <tbody>
                        <tr style="height:354.15pt">
                            <td style="padding:0in 0in 22.5pt 0in; height:354.15pt">
                            <table class="x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%">
                                <tbody>
                                    <tr>
                                        <td style="padding:0in 0in 0in 0in" colspan="2">
                                        <p class="x_MsoNormal" style="margin-bottom:0in; margin-bottom:.0001pt; line-height:normal"><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">This is an unmanaged mailbox.</span><span style="font-size:18.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">&nbsp;</span><b><i><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:red">Please do not reply to this message</span></i></b><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:red">.</span><span style="font-size:18.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643"><br><br>
                                            <b>
                                            ${futureNotification ?
                                                `Your ${resolveYourAwbs} arrive.` :
                                                `Your ${resolveYourAwbs} arrived.`
                                            }
                                            </b></span>
                                        </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0in 0in 22.5pt 0in" colspan="2">
                                        <p class="x_MsoNormal" style="line-height:15.0pt"><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643"><br>
                                        This is a notification about the ${futureNotification ? 'future': ''} arrival of your shipment to our warehouse.
                                        </span></p>
                                        </td>
                                    </tr>

                                    <tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                        <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;">
                                            Arrival Flight:
                                        </td>
                                        <td style="font-weight: bolder; padding-top: 10px; padding-bottom: 10px;">
                                            ${_s_flight_id}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;"></td>
                                    </tr>
                
                                    ${
                                        !multipleMode && 
                                        `
                                            <tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;">
                                                    Pieces:
                                                </td>
                                                <td style="font-weight: bolder; padding-top: 10px; padding-bottom: 10px;">
                                                    ${_flightPieces}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;"></td>
                                            </tr>
                                        `
                                    }

                                    ${
                                        (partNumber && partNumber.length > 0) && 
                                        `
                                            <tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;">
                                                    Part Number:
                                                </td>
                                                <td style="font-weight: bolder; padding-top: 10px; padding-bottom: 10px;">
                                                    ${partNumber}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;"></td>
                                            </tr>
                                        `
                                    } 

                                    ${
                                        !multipleMode && 
                                        `
                                            <tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;">
                                                    Weight:
                                                </td>
                                                <td style="font-weight: bolder; padding-top: 10px; padding-bottom: 10px;">
                                                    ${Number(_flightWeight).toFixed(1)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;"></td>
                                            </tr>
                                        `
                                    }
                
                                    ${
                                        !transfers && 
                                        `
                                            <tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;">
                                                    Import Service Charge:
                                                </td>
                                                <td style="font-weight: bolder; padding-top: 10px; padding-bottom: 10px;">
                                                    ${formatCost(iscCost)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;"></td>
                                            </tr>
                                        `
                                    }

                                    ${
                                        transfers && 
                                        `
                                            <tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;">
                                                    Destination:
                                                </td>
                                                <td style="font-weight: bolder; padding-top: 10px; padding-bottom: 10px;">
                                                    ${s_destination}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;"></td>
                                            </tr>
                                        `
                                    }

                                    ${
                                        multipleMode && 
                                        `
                                            <tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;">
                                                    AWB-PC-WGT
                                                </td>
                                                <td style="font-weight: bolder; padding-top: 10px; padding-bottom: 10px;">
                                                    ${transfers ? 'Destination' : 'Daily Storage Charges'}
                                                </td>
                                            </tr>
                                            ${
                                                Object.keys(selectedMap).map(key => (
                                                    `
                                                        <tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                                            <td style="width: 40%; padding-top: 1px; padding-bottom: 1px;">
                                                                ${formatMawb(key)} / ${selectedMap[key].i_actual_piece_count} / ${selectedMap[key].f_weight.toFixed(1)}
                                                            </td>
                                                            <td style="font-weight: bold; margin-left: 10px">
                                                                ${transfers ? selectedMap[key].s_destination : formatCost(selectedMap[key].storageCost)}
                                                            </td>
                                                        </tr>
                                                    `
                                                )).join('')
                                            }
                                            <tr>
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;"></td>
                                            </tr>
                                        `
                                    }

                                    ${
                                        !multipleMode && !transfers &&
                                        `
                                            <tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;">
                                                    Daily Storage Charge:
                                                </td>
                                                <td style="font-weight: bolder; padding-top: 10px; padding-bottom: 10px;">
                                                    ${formatCost(_dailyStorage)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;"></td>
                                            </tr>
                                        `

                                    }
    
                                    ${
                                        !transfers && 
                                        `
                                            <tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;">
                                                    Last Free Day:
                                                </td>
                                                <td style="font-weight: bolder; padding-top: 10px; padding-bottom: 10px;">
                                                    ${moment(lastFreeDate).format('MM/DD/YYYY')}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;"></td>
                                            </tr>

                                            <tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;">
                                                    Storage Start Date:
                                                </td>
                                                <td style="font-weight: bolder; padding-top: 10px; padding-bottom: 10px;">
                                                    ${moment(storageStartDate).format('MM/DD/YYYY')}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;"></td>
                                            </tr>
                        
                                            <tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;">
                                                    Firms Code:
                                                </td>
                                                <td style="font-weight: bolder; padding-top: 10px; padding-bottom: 10px;">
                                                    ${firmsCode}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;"></td>
                                            </tr>
                                        `
                                    }

                                    <tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                        <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;">
                                            Cargo Location:
                                        </td>
                                        <td style="font-weight: bolder; padding-top: 10px; padding-bottom: 10px;">
                                            ${unitInfo.s_address}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;"></td>
                                    </tr>
                
                                    ${
                                    enableCustomFields && 
                                    `<div>
                        
                                        <tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                            <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;">
                                                Carrier Handling Fee:
                                            </td>
                                            <td style="font-weight: bolder; padding-top: 10px; padding-bottom: 10px;">
                                                ${formatCost(carrierHandlingFee)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;"></td>
                                        </tr>
                        
                                        ${
                                            user.s_unit !== 'CORD1' && 
                                            `<tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;">
                                                    Port Fee 5.26%:
                                                </td>
                                                <td style="font-weight: bolder; padding-top: 10px; padding-bottom: 10px;">
                                                    ${formatCost(portFee)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;"></td>
                                            </tr>`
                                        }
                                        
                                        <tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                            <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;">
                                                Total to Pay
                                            </td>
                                            <td style="font-weight: bolder; padding-top: 10px; padding-bottom: 10px;">
                                                ${formatCost(totalManualFee)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;"></td>
                                        </tr>
                        
                                    </div>`
                                    }
                
                                    ${
                                        !transfers && 
                                        `
                                            <tr style="background:#BBBBBB; font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;">
                                                    Make a Payment:
                                                </td>
                                                <td style="font-weight: bolder; padding-top: 10px; padding-bottom: 10px;">
                                                    <a href='https://my.choice.aero/'>https://my.choice.aero/</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 40%; padding-top: 10px; padding-bottom: 10px;"></td>
                                            </tr>
                                        `
                                    }

                                </tbody>
                            </table>
                            </td>
                        </tr>

                    </tbody>
                </table>
               
                <p>If you have any questions about this shipment please email ${replyEmail ? `<a href="mailto:${replyEmail}?subject=Question about ${_s_mawb}">${replyEmail}</a>` : ''}</p>
                <p>Storage is calculated at ${storageKg} per kg with a minimun of ${formatCost(storageMinCost)} per day.</p>
                <p>This email was sent to ${allEmails.join(' AND ').toString()}.</p>
                <p>Payments for items under $300 are not refundable.</p>
                <p>
                    Due to Title 19, United States Code (U.S.C.), section 1555, this shipment will go to a General Order Warehouse (G.O.) if not claimed by ${goDate}.
                </p>
                <p>Thank you for your business.</p>             
            </td>
        </tr>
    `.replace(/false/g, '');

    const previewHtml = `
        <div align="center">
            <table class="x_MsoNormalTable" border="1" cellspacing="0" cellpadding="0" width="600" style="width:${multipleMode ? '9' : '6.25'}in; background:#BACAE2; border-collapse:collapse; border:none">
                <tbody>
                    ${base}
                </tbody>
            </table>
            <style>
                * {
                    font-family: Arial, sans-serif;
                }
            </style>
        </div>
    `;

    const bodyHtml = `
        <div align="center">
            <table class="x_MsoNormalTable" border="1" cellspacing="0" cellpadding="0" width="600" style="width:${multipleMode ? '9' : '6.25'}in; background:#BACAE2; border-collapse:collapse; border:none">
                <tbody>
                    ${header}
                    ${base}
                    ${footer}
                </tbody>
            </table>
            <style>
                * {
                    font-family: Arial, sans-serif;
                }
            </style>
        </div>
    `;

    return {
        previewHtml,
        bodyHtml
    } 
}

