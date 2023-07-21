import { useMemo } from 'react';
import moment from 'moment';
import { formatCost } from '../../utils';

export default function EmailFormatter (
    user,
    iscCost,
    unitInfo,
    manualMode,
    address,
    firmsCode,
    s_import_distribution_email,
    //
    _s_mawb,
    _s_flight_id,
    _flightPieces,
    _flightWeight,
    _d_storage_start_day,
    _go_date,
    _s_airline_code,
    _totalPieces,
    _totalWeight,
    storageKg,
    storageMinCost,
    //
    enableCustomFields,
    chfUldAmount,
    chfUldFactor,
    chfLoose,
    chfLooseKg,
    chfLooseFactor,
    futureNotification,
    allEmails
) {

    const replyEmail = useMemo(() => {
        if (s_import_distribution_email && s_import_distribution_email.length > 0) {
            return s_import_distribution_email;
        } else {
            const s_unit = user.s_unit;
            const destination = s_unit && s_unit.substr(1, 3).toLowerCase();
            const directory = resolveDirectory(_s_airline_code);
            return `${destination}.${directory}.imp@choice.aero`;
        }
    }, [_s_airline_code, s_import_distribution_email, user.s_unit]);

    const t8Logic = user.s_unit === 'CEWR1' && _s_airline_code === 'T8';

    const uldCost = useMemo(() => {
        let _uldCost = parseFloat(chfUldAmount) * parseFloat(chfUldFactor);

        if (isNaN(_uldCost)) {
            _uldCost = 0;
        }

        return _uldCost;
    }, [chfUldAmount, chfUldFactor])

    const looseCost = useMemo(() => {
        let _looseCost = 0;

        if (chfLoose) {
            _looseCost = parseFloat(chfLooseFactor) * parseFloat(chfLooseKg);
            if (t8Logic) {
                _looseCost = Math.max(100, _looseCost);
            } else {
                if (isNaN(_looseCost)) {
                    _looseCost = 0;
                }
            }
        }

        return _looseCost;
    }, [chfLoose, chfLooseFactor, chfLooseKg, t8Logic]);

    const carrierHandlingFee = uldCost + looseCost;
    
    const portFee = carrierHandlingFee * 0.0526;

    const totalManualFee = useMemo(() => {
        const sum = 
            parseFloat(carrierHandlingFee) 
            + parseFloat(portFee) 
            + parseFloat(iscCost);
        return sum;
    }, [carrierHandlingFee, iscCost, portFee]);

    const carrierHandlingDescription = useMemo(() => {
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
    }, [chfUldAmount, chfUldFactor, chfLoose, chfLooseFactor, t8Logic]);

    const header = `<tr style="border: solid #CCCCCC 1.0pt">
        <td style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;" align="center" bgcolor="#d8dce5"><img style="display: block;" src="https://choice.aero/wp-content/uploads/2019/07/CAS-Logo-v2.png" alt="Choice Aviation Services" width="330" height="110"></td>
    </tr>`;

    const footer = useMemo(() => {
        return `
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
        `
    }, [firmsCode, unitInfo.s_address, unitInfo.s_phone, unitInfo.s_weekday_hours, unitInfo.s_weekend_hours]);


    const base = useMemo(() => {
        return `
            <tr>
                <td style="border-top:none; border-left:solid #CCCCCC 1.0pt; border-bottom:none; border-right:solid #CCCCCC 1.0pt; background:white; padding:7.5pt 22.5pt 30.0pt 22.5pt">
                <table class="x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%">
                    <tbody>
                        <tr style="height:354.15pt">
                            <td style="padding:0in 0in 22.5pt 0in; height:354.15pt">
                            <table class="x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%">
                                <tbody>
                                    <tr>
                                        <td style="padding:0in 0in 0in 0in">
                                        <p class="x_MsoNormal" style="margin-bottom:0in; margin-bottom:.0001pt; line-height:normal"><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">This is an unmanaged mailbox.</span><span style="font-size:18.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">&nbsp;</span><b><i><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:red">Please do not reply to this message</span></i></b><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:red">.</span><span style="font-size:18.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643"><br><br>
                                            <b>
                                            ${futureNotification ?
                                                `Your AWB ${_s_mawb} is scheduled to arrive.` :
                                                `Your AWB ${_s_mawb} has arrived.`
                                            }
                                            </b></span>
                                        </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0in 0in 22.5pt 0in">
                                        <p class="x_MsoNormal" style="line-height:15.0pt"><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643"><br>
                                        This is a notification about the ${futureNotification ? 'future': ''} arrival of your shipment to our warehouse.
                                        </span></p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="x_MsoTableGrid" border="1" cellspacing="0" cellpadding="0" width="544" style="width:408.0pt; border-collapse:collapse; border:none">
                                <tbody>
                                    <tr style="height:229.5pt">
                                        <td width="254" valign="top" style="width:190.2pt; border:none; padding:0in 5.4pt 0in 5.4pt; height:229.5pt">
                                        <table class="x_MsoTableGrid" border="0" cellspacing="0" cellpadding="0" style="margin-left:.05pt; border-collapse:collapse; border:none">
                                            <tbody>
                                                <tr style="height:31.5pt">
                                                    <td width="243" style="width:182.3pt; background:#BBBBBB; padding:0in 5.4pt 0in 5.4pt; height:31.5pt">
                                                    <p class="x_MsoNormal" align="center" style="text-align:center"><b><span style="font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">
                                                        ${_s_flight_id}</span></b>
                                                    </p>
                                                    </td>
                                                </tr>
                                                <tr style="height:29.95pt">
                                                    <td width="243" valign="top" style="width:182.3pt; padding:0in 5.4pt 0in 5.4pt; height:29.95pt">
                                                    <p class="x_MsoNormal" align="center" style="text-align:center; line-height:15.0pt"><i><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">Arrival flight</span></i></p>
                                                    </td>
                                                </tr>
                                                <tr style="height:31.5pt">
                                                    <td width="243" style="width:182.3pt; background:#BBBBBB; padding:0in 5.4pt 0in 5.4pt; height:31.5pt">
                                                    <p class="x_MsoNormal" align="center" style="text-align:center"><b><span style="font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">${_flightPieces} / ${_flightWeight && Number(_flightWeight).toFixed(1)}</span></b></p>
                                                    </td>
                                                </tr>
                                                <tr style="height:31.5pt">
                                                    <td width="243" valign="top" style="width:182.3pt; padding:0in 5.4pt 0in 5.4pt; height:31.5pt">
                                                    <p class="x_MsoNormal" align="center" style="text-align:center; line-height:15.0pt"><i><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">
                                                        Pieces/Weight</span></i>
                                                    </p>
                                                    </td>
                                                </tr>
                                                <tr style="height:29.95pt">
                                                    <td width="243" style="width:182.3pt; background:#BBBBBB; padding:0in 5.4pt 0in 5.4pt; height:29.95pt">
                                                    <p class="x_MsoNormal" align="center" style="text-align:center"><b><span style="font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">$${formatCost(iscCost)}</span></b></p>
                                                    </td>
                                                </tr>
                                                <tr style="height:31.5pt">
                                                    <td width="243" valign="top" style="width:182.3pt; padding:0in 5.4pt 0in 5.4pt; height:31.5pt">
                                                    <p class="x_MsoNormal" align="center" style="text-align:center; line-height:15.0pt"><i><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">Import Service Charge</span></i></p>
                                                    </td>
                                                </tr>
                                                <tr style="height:31.5pt">
                                                    <td width="243" style="width:182.3pt; background:#BBBBBB; padding:0in 5.4pt 0in 5.4pt; height:31.5pt">
                                                    <p class="x_MsoNormal" align="center" style="text-align:center"><b><span style="font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">${moment(_d_storage_start_day).format('MM/DD/YYYY')}</span></b></p>
                                                    </td>
                                                </tr>
                                                <tr style="height:29.95pt">
                                                    <td width="243" valign="top" style="width:182.3pt; padding:0in 5.4pt 0in 5.4pt; height:29.95pt">
                                                    <p class="x_MsoNormal" align="center" style="text-align:center; line-height:15.0pt"><i><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">Storage Start Date</span></i></p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </td>
                                        <td width="290" valign="top" style="width:217.8pt; border:none; padding:0in 5.4pt 0in 5.4pt; height:229.5pt">
                                        <table class="x_MsoTableGrid" border="0" cellspacing="0" cellpadding="0" width="282" style="width:211.4pt; margin-left:.05pt; border-collapse:collapse; border:none">
                                            <tbody>
                                                <tr style="height:93.15pt">
                                                    <td width="282" style="width:211.4pt; background:#BBBBBB; padding:0in 5.4pt 0in 5.4pt; height:93.15pt">
                                                    <p class="x_MsoNormal" align="center" style="text-align:center"><b><span style="font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">${address}</span></b></p>
                                                    </td>
                                                </tr>
                                                <tr style="height:31.55pt">
                                                    <td width="282" valign="top" style="width:211.4pt; padding:0in 5.4pt 0in 5.4pt; height:31.55pt">
                                                    <p class="x_MsoNormal" align="center" style="text-align:center; line-height:15.0pt"><i><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">Cargo Location</span></i></p>
                                                    </td>
                                                </tr>
                                                <tr style="height:94.75pt">
                                                    <td width="282" style="width:211.4pt; background:#BBBBBB; padding:0in 5.4pt 0in 5.4pt; height:94.75pt">
                                                    <p class="x_MsoNormal" align="center" style="text-align:center"><b><span style="font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">${firmsCode}</span></b><b><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643"></span></b></p>
                                                    </td>
                                                </tr>
                                                <tr style="height:20.25pt">
                                                    <td width="282" valign="top" style="width:211.4pt; padding:0in 5.4pt 0in 5.4pt; height:20.25pt">
                                                    <p class="x_MsoNormal" align="center" style="text-align:center; line-height:15.0pt"><i><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">Firms Code</span></i></p>
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
            
                        ${
                        enableCustomFields && 
                        `<div>
            
                            <tr style="background:#BBBBBB;">
                                <td style="padding-top: 7px;">
                                    <table class="x_MsoTableGrid" border="1" cellspacing="0" cellpadding="0" width="544" style="width:408.0pt; border-collapse:collapse; border:none;">
                                        <tbody>
                                            <tr>
                                            <p class="x_MsoNormal" align="center" style="text-align:center"><b><span style="font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643;">
                                                $${formatCost(carrierHandlingFee())}</span></b>
                                            </p>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <table class="x_MsoTableGrid" border="1" cellspacing="0" cellpadding="0" width="544" style="width:408.0pt; border-collapse:collapse; border:none;">
                                        <tbody>
                                            <tr style="">
                                            <p class="x_MsoNormal" align="center" style="text-align:center; line-height:15.0pt"><i><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">
                                                Carrier Handling Fee: ${carrierHandlingDescription}
                                            </span></i></p>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
            
                            <tr style="background:#BBBBBB;">
                            <td style="padding-top: 7px;">
                                <table class="x_MsoTableGrid" border="1" cellspacing="0" cellpadding="0" width="544" style="width:408.0pt; border-collapse:collapse; border:none">
                                    <tbody>
                                        <tr>
                                        <p class="x_MsoNormal" align="center" style="text-align:center"><b><span style="font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">
                                            $${formatCost(portFee)}</span></b>
                                        </p>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table class="x_MsoTableGrid" border="1" cellspacing="0" cellpadding="0" width="544" style="width:408.0pt; border-collapse:collapse; border:none;">
                                    <tbody>
                                        <tr style="">
                                            <p class="x_MsoNormal" align="center" style="text-align:center; line-height:15.0pt"><i><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">
                                                Port Fee 5.26%
                                            </span></i></p>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
            
            
                                <tr style="background:#BBBBBB;">
                                <td style="padding-top: 7px;">
                                    <table class="x_MsoTableGrid" border="1" cellspacing="0" cellpadding="0" width="544" style="width:408.0pt; border-collapse:collapse; border:none">
                                        <tbody>
                                            <tr>
                                            <p class="x_MsoNormal" align="center" style="text-align:center"><b><span style="font-size:16.0pt; background:#BBBBBB; font-family:&quot;Arial&quot;,sans-serif; color:#153643">
                                                $${formatCost(totalManualFee)}</span></b>
                                            </p>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                </tr>
                                <tr>
                                <td>
                                    <table class="x_MsoTableGrid" border="1" cellspacing="0" cellpadding="0" width="544" style="width:408.0pt; border-collapse:collapse; border:none;">
                                        <tbody>
                                            <tr style="">
                                                <p class="x_MsoNormal" align="center" style="text-align:center; line-height:15.0pt"><i><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">
                                                    Total to Pay
                                                </span></i></p>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
            
                        </div>`
                        }
            
                    </tbody>
                </table>
                <table class="x_MsoTableGrid" border="0" cellspacing="0" cellpadding="0" width="550" style="width:412.75pt; border-collapse:collapse; border:none">
                    <tbody>
                        <tr style="height:29.2pt">
                            <td width="550" style="width:412.75pt; background:#BBBBBB; padding:0in 5.4pt 0in 5.4pt; height:29.2pt">
                            <p class="x_MsoNoSpacing" align="center" style="text-align:center"><b><span style="font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif; color:black"><a href="https://my.choice.aero/" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable">https://my.choice.aero/</a> </span></b><b><span style="font-size:16.0pt; font-family:&quot;Arial&quot;,sans-serif"></span></b></p>
                            </td>
                        </tr>
                        <tr style="height:25.95pt">
                            <td width="550" valign="top" style="width:412.75pt; padding:0in 5.4pt 0in 5.4pt; height:25.95pt">
                            <p class="x_MsoNormal" align="center" style="text-align:center; line-height:normal"><i><span style="font-size:12.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#153643">Make a payment in our website.</span></i></p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p>
                    ${
                        manualMode ? 
                        'For shipments with multiple parts : we may have received other parts from other flights. Please contact us to know how many parts have already arrived for the master AWB. These charges are per awb/hawb as applicable to the shipment.' :
                        `(For shipments with multiple parts : we have received a total of ${_totalPieces || ''} piece(s) with a total weight of ${_totalWeight} kg for this AWB. These charges are per awb/hawb as applicable to the shipment.)`
                    }
                </p>                
                <p>If you have any questions about this shipment please email <a href="mailto:${replyEmail}?subject=Question about ${_s_mawb}">${replyEmail}</a></p>
                <p>Storage is calculated at ${storageKg} per kg with a minimun of ${formatCost(storageMinCost)} per day.</p>
                <p>This email was sent to ${allEmails.join(' AND ').toString()}.</p>
                <p>Payments under $300 are not refundable.</p>
                <p>
                    Due to Title 19, United States Code (U.S.C.), section 1555, this shipment will go to a General Order Warehouse (G.O.) if not claimed by ${_go_date}.
                </p>
                <p>Thank you for your business.</p>             
            </td>
            </tr>
        `.replace(/false/g, ''); 
    }, [
        _d_storage_start_day, 
        _flightPieces, 
        _flightWeight, 
        _go_date, 
        _s_flight_id, 
        _s_mawb, 
        _totalPieces, 
        _totalWeight, 
        address, 
        allEmails, 
        carrierHandlingFee, 
        portFee, 
        enableCustomFields, 
        firmsCode, 
        futureNotification, 
        iscCost, 
        manualMode, 
        carrierHandlingDescription, 
        replyEmail, 
        storageKg,
        storageMinCost, 
        totalManualFee
    ]);
    
    const emailPreview = useMemo(() => {
        return `
            <div align="center">
                <table class="x_MsoNormalTable" border="1" cellspacing="0" cellpadding="0" width="600" style="width:6.25in; background:#BACAE2; border-collapse:collapse; border:none">
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
    }, [base]);

    const emailBody = useMemo(() => {
        return `
            <div align="center">
                <table class="x_MsoNormalTable" border="1" cellspacing="0" cellpadding="0" width="600" style="width:6.25in; background:#BACAE2; border-collapse:collapse; border:none">
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
    }, [base, header, footer]);

    return {
        emailPreview,
        emailBody
    }  
}

const resolveDirectory = (_s_airline_code) => {
    if (_s_airline_code) {
        const iagcMap = {
            'BA': true, 
            'EI': true, 
            'IB': true
        }

        let directory = '';

        if (iagcMap[_s_airline_code.toUpperCase()]) {
            directory = 'iagc';
        } else {
            directory = _s_airline_code.toLowerCase();
        }

        return directory;
    } else {
        return '';
    }
}