import moment from 'moment';

import { rampFields } from './mapFields';

const rowCreater = (reportType, dataItem, weightType, formatCostTwoDecimals) => {

    const factor = weightType === 'KG' ? 1 : 2.205;

    // const row = {
    //     description: dataItem.s_flight_number === 'grand_total' ? 'Grand Total' : moment.utc(dataItem.d_flight).format('MMM-DD'),
    //     total: dataItem.s_flight_number === 'grand_total' ? '' : dataItem.s_flight_number === null ? '' : dataItem.s_flight_number,
    //     flight_turn: formatCostTwoDecimals(dataItem.flight_turn),
    //     parking: formatCostTwoDecimals(dataItem.parking),
    //     drayage: formatCostTwoDecimals(dataItem.drayage),
    // }

    const row = {};

    for (let i = 0; i < rampFields.length; i++) {
        const current = rampFields[i];
        let setValue;

        if (current.value === 'd_flight') {
            if (dataItem.s_flight_number === 'grand_total') {
                setValue = 'grand_total';
            } else {
                setValue = moment.utc(dataItem.d_flight).format('MMM-DD');
            }
        } else if (current.value === 's_flight_number') {
            if (dataItem.s_flight_number === 'grand_total') {
                setValue = '';
            } else {
                setValue = dataItem.s_flight_number;
            }
        } else if (current.num) {
            setValue = formatCostTwoDecimals(dataItem[current.value]);
        } else {
            setValue = dataItem[current.value];
        }

        // row[current.json] = current.value === 'd_flight' ? 
        //     moment.utc(dataItem.d_flight).format('MMM-DD') :
        //     current.num ?
        //     formatCostTwoDecimals(dataItem[current.value]) :
        //     dataItem[current.value];

        row[current.json] = setValue;
    }   

    return row;
}

export const generateRampJson = (reportType, data, weightType, formatCostTwoDecimals) => {
    const jsonData = [];

    // const heading = {};

    // for (let i = 0; i < rampFields.length; i++) {
    //     const current = rampFields[i];
    //     heading[current.json] = current.name
    // }
    
    // jsonData.push(heading);

    data.daily.map(d => d.s_flight_number !== 'grand_total' && 
        jsonData.push(rowCreater(reportType, d, weightType, formatCostTwoDecimals))
    );

    data.daily.map(d => d.s_flight_number === 'grand_total' &&
        jsonData.push(rowCreater(reportType, d, weightType, formatCostTwoDecimals))
    );


    return jsonData;
}