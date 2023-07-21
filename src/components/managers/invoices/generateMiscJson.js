import moment from 'moment';

const rowCreater = (dataItem, total) => {

    const row = {
        date: total ? dataItem.s_misc_type : moment.utc(dataItem.d_flight).format('MMM-DD'),
        amount: dataItem.f_misc,
        uom: dataItem.s_misc_uom,
        notes: total ? '' : dataItem.s_notes
    }

    return row;
}

export const generateMiscJson = (reportType, data, weightType, formatCostTwoDecimals) => {
    const jsonData = [];

    jsonData.push({
        date: 'date',
        amount: 'amount',
        uom: 'uom',
        notes: 'notes'
    });

    data.total.map(t => 
        {
            jsonData.push(rowCreater(t, true));
            data.daily.map(d => d.s_misc_type === t.s_misc_type && d.s_misc_uom === t.s_misc_uom && 
                jsonData.push(rowCreater(d, false))
            );
        }                        
    )

    console.log(jsonData);
    
    return jsonData;
}