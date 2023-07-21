import moment from 'moment';
import { formatCost, getNum } from '../../../utils';
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
    _totalStorage,
    //
    enableCustomFields,
    chfUldAmount,
    chfUldFactor,
    chfLoose,
    chfLooseKg,
    chfLooseFactor,
    futureNotification,
    allEmails
) => {

    const flightIdParts = (_s_flight_id || '').split('/');
    const flight = _.get(flightIdParts, `[0]`, '');
    const date = _.get(flightIdParts, `[1]`, '');

    const t8Logic = user.s_unit === 'CEWR1' && _s_airline_code === 'T8';
    
    const replyEmail = 
        s_import_distribution_email && s_import_distribution_email.length > 0 ?
            s_import_distribution_email :
            `${user.s_destination}.${resolveDirectory(_s_airline_code)}.imp@choice.aero`;

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

    const portFee = carrierHandlingFee * 0.0526;

    const totalManualFee = 
        parseFloat(carrierHandlingFee) 
        + parseFloat(portFee) 
        + parseFloat(iscCost);

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

    const header = `
        <tr height="31" style="mso-height-source:userset;height:23.25pt">
         <td height="31" style="height:23.25pt"></td>
         <td colspan="4" class="xl92" style="border-right:.5pt solid black; text-align: center; font-weight: bolder;">CARGO ARRIVAL
         NOTIFICATION</td>
        </tr>
        <tr height="65" style="mso-height-source:userset;height:48.75pt">
         <td height="65" style="height:48.75pt"></td>
         <td class="xl85">&nbsp;</td>
         <td height="65" class="xl65" width="248" style="height:48.75pt;width:186pt;"><span style="mso-ignore:vglayout">
         <table cellpadding="0" cellspacing="0">
          <tbody><tr>
           <td width="34" height="10"></td>
          </tr>
          <tr>
           <td></td>
           <td><img width="175" height="auto" src="${s_logo}"></td>
           <td width="286"></td>
          </tr>
          <tr>
           <td height="20"></td>
          </tr>
         </tbody></table>
         </span></td>
         <td height="65" class="xl65" width="248" style="height:48.75pt;width:186pt; float: right;"><span style="mso-ignore:vglayout">
           <table cellpadding="0" cellspacing="0">
            <tbody><tr>
             <td width="34" height="10"></td>
            </tr>
            <tr>
             <td></td>
             <td><img width="175" height="auto" src="https://ewrstorage1.blob.core.windows.net/pics/skylinelogo.png" /></td>
             <td width="286"></td>
            </tr>
            <tr>
             <td height="20"></td>
            </tr>
           </tbody></table>
           </span></td>
         <td class="xl68">&nbsp;</td>
        </tr>
    `;

    const base = `
        <tr height="33" style="mso-height-source:userset;height:24.75pt;">
            <td height="33" style="height:24.75pt;"></td>
            <td rowspan="16" class="xl95" style="border-bottom:.5pt solid black">&nbsp;</td>
            <td class="table-left">AWB</td>
            <td class="table-right">${_s_mawb}</td>
            <td class="xl68">&nbsp;</td>
        </tr>
        <tr height="19" style="height:14.25pt">
            <td height="19" style="height:14.25pt"></td>
            <td class="table-left">FLIGHT</td>
            <td class="table-right">${flight}</td>
            <td class="xl68">&nbsp;</td>
        </tr>
        <tr height="19" style="height:14.25pt">
            <td height="19" style="height:14.25pt"></td>
            <td class="table-left">DATE</td>
            <td class="table-right">${date}</td>
            <td class="xl68">&nbsp;</td>
        </tr>
        <tr height="19" style="height:14.25pt">
            <td height="19" style="height:14.25pt"></td>
            <td class="table-left">PIECE</td>
            <td class="table-right">${_flightPieces}</td>
            <td class="xl68">&nbsp;</td>
        </tr>
        <tr height="19" style="height:14.25pt">
            <td height="19" style="height:14.25pt"></td>
            <td class="table-left">WEIGHT</td>
            <td class="table-right">${Number(_flightWeight).toFixed(1)}</td>
            <td class="xl68">&nbsp;</td>
        </tr>
        ${
            !transfers ? 
            `
                <tr height="24" style="height:18.0pt">
                    <td height="24" style="height:18.0pt"></td>
                    <td class="table-left">LFD / LAST FREE DAY</td>
                    <td class="table-right">${lastFreeDate}</td>
                    <td class="xl68">&nbsp;</td>
                </tr>
                <tr height="19" style="height:14.25pt">
                    <td height="19" style="height:14.25pt"></td>
                    <td class="table-left">STORAGE PER DAY</td>
                    <td class="table-right">${formatCost(_dailyStorage)}</td>
                    <td class="xl68">&nbsp;</td>
                </tr>
                <tr height="32" style="mso-height-source:userset;height:24.0pt">
                    <td height="32" style="height:24.0pt"></td>
                    <td class="table-left">FIRMS CODE</td>
                    <td class="table-right">${firmsCode}</td>
                    <td class="xl68">&nbsp;</td>
                </tr> 
            ` : 
            `
                <tr height="32" style="mso-height-source:userset;height:24.0pt">
                    <td height="32" style="height:24.0pt"></td>
                    <td class="table-left">DESTINATION</td>
                    <td class="table-right">${s_destination}</td>
                    <td class="xl68">&nbsp;</td>
                </tr> 
            `

        }
        <tr height="7" style="mso-height-source:userset;height:5.25pt">
            <td height="7" style="height:5.25pt"></td>
            <td class="xl65"></td>
            <td></td>
            <td class="xl68">&nbsp;</td>
        </tr>
        <tr height="72" style="mso-height-source:userset;height:54.0pt">
            <td height="72" style="height:54.0pt"></td>
            <td class="table-left">CARGO LOCATION</td>
            <td class="table-right" width="297" style="width:223pt">
                ${unitInfo.s_address}
            </td>
            <td class="xl68">&nbsp;</td>
        </tr>
        <tr height="71" style="mso-height-source:userset;height:53.25pt">
            <td height="71" style="height:53.25pt"></td>
            <td class="table-left">HOURS OF OPERATIONS</td>
            <td class="table-right" width="297" style="width:223pt">
                M – F ${unitInfo.s_weekday_hours} <br/>
                S - S ${unitInfo.s_weekend_hours}
            </td>
        </tr>
        <tr height="85" style="height:63.75pt">
            <td height="85" style="height:63.75pt"></td>
            <td class="table-left">CONTACT</td>
            <td class="table-right" width="297" style="width:223pt">JFKOPS@SKYLINELS.COM<br>
            JFKOPS2@SKYLINELS.COM<br>
            +1 917 942 7350<br>
            <font class="font10">OPT 1 - SLS1<br>
            OPT 2 - SLS2</font></td>
            <td class="xl68">&nbsp;</td>
        </tr>
        <tr height="7" style="mso-height-source:userset;height:5.25pt">
            <td height="7" style="height:5.25pt"></td>
            <td class="xl86"></td>
            <td class="xl87"></td>
            <td class="xl68">&nbsp;</td>
        </tr>
        ${
            !transfers && 
            `
                <tr height="57" style="height:42.75pt">
                    <td height="57" style="height:42.75pt"></td>
                    <td class="table-left">PAYMENT:</td>
                    <td class="table-right" width="297" style="width:223pt">Via CargoSprint Search for
                    <br>
                    <font class="font6">SLS-JFK01<br>
                    SLS-JFK02</font></td>
                    <td class="xl68">&nbsp;</td>
                </tr>
                <tr height="19" style="height:14.25pt">
                    <td height="19" style="height:14.25pt"></td>
                    <td class="table-left">FEE:</td>
                    <td class="table-right" width="297" style="width:223pt">${formatCost(iscCost)} per HAWB</td>
                    <td class="xl68">&nbsp;</td>
                </tr>
            `
        }
        <tr height="8" style="mso-height-source:userset;height:6.0pt">
            <td height="8" style="height:6.0pt"></td>
            <td class="xl88">&nbsp;</td>
            <td class="xl89">&nbsp;</td>
            <td class="xl90">&nbsp;</td>
        </tr>
        <tr height="0" style="display:none">
            <td width="13" style="width:10pt"></td>
            <td width="20" style="width:15pt"></td>
            <td width="248" style="width:186pt"></td>
            <td width="297" style="width:223pt"></td>
            <td width="20" style="width:15pt"></td>
        </tr>
    `.replace(/false/g, '');

    const previewHtml = `
        <!DOCTYPE html>
        <html>
            <body>
                <style>
                    * {
                        font-family: Arial, sans-serif;
                    }
                    .table-left {
                        text-align: right; 
                        padding-right: 10px; 
                        background-color: rgb(197, 197, 197);
                        font-weight: bold;
                    }
        
                    .table-right {
                        padding-left: 10px; 
                    }
                </style>
                <table border="0" cellpadding="0" cellspacing="0" width="598" style="border-collapse:
                collapse;table-layout:fixed;width:449pt; border: 1px solid black; margin: 0 auto;">
                <colgroup><col width="13" style="mso-width-source:userset;mso-width-alt:443;width:10pt">
                <col width="20" style="mso-width-source:userset;mso-width-alt:665;width:15pt">
                <col class="xl65" width="248" style="mso-width-source:userset;mso-width-alt:8448;
                width:186pt">
                <col width="297" style="mso-width-source:userset;mso-width-alt:10137;width:223pt">
                <col width="20" style="mso-width-source:userset;mso-width-alt:665;width:15pt">
                </colgroup><tbody><tr height="8" style="mso-height-source:userset;height:6.0pt">
                <td height="8" width="13" style="height:6.0pt;width:10pt"></td>
                <td width="20" style="width:15pt"></td>
                <td class="xl65" width="248" style="width:186pt"></td>
                <td width="297" style="width:223pt"></td>
                <td width="20" style="width:15pt"></td>
                </tr>
                ${base}
            </tbody></table>
            </body>
        </html>
    `;

    const bodyHtml = `
        <!DOCTYPE html>
        <html>
            <body>
                <style>
                    * {
                        font-family: Arial, sans-serif;
                    }
                    .table-left {
                        text-align: right; 
                        padding-right: 10px; 
                        background-color: rgb(197, 197, 197);
                        font-weight: bold;
                    }
        
                    .table-right {
                        padding-left: 10px; 
                    }
                </style>
                <table border="0" cellpadding="0" cellspacing="0" width="598" style="border-collapse:
                collapse;table-layout:fixed;width:449pt; border: 1px solid black; margin: 0 auto;">
                <colgroup><col width="13" style="mso-width-source:userset;mso-width-alt:443;width:10pt">
                <col width="20" style="mso-width-source:userset;mso-width-alt:665;width:15pt">
                <col class="xl65" width="248" style="mso-width-source:userset;mso-width-alt:8448;
                width:186pt">
                <col width="297" style="mso-width-source:userset;mso-width-alt:10137;width:223pt">
                <col width="20" style="mso-width-source:userset;mso-width-alt:665;width:15pt">
                </colgroup><tbody><tr height="8" style="mso-height-source:userset;height:6.0pt">
                <td height="8" width="13" style="height:6.0pt;width:10pt"></td>
                <td width="20" style="width:15pt"></td>
                <td class="xl65" width="248" style="width:186pt"></td>
                <td width="297" style="width:223pt"></td>
                <td width="20" style="width:15pt"></td>
                </tr>
                ${header}
                ${base}
            </tbody></table>
            </body>
        </html>
    `;

    return {
        previewHtml,
        bodyHtml
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

        if (iagcMap[(_s_airline_code || '').toUpperCase()]) {
            directory = 'iagc';
        } else {
            directory = _s_airline_code.toLowerCase();
        }

        return directory;
    } else {
        return '';
    }
}