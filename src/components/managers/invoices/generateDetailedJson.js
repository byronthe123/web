import moment from 'moment';

const rowCreater = (reportType, dataItem, weightType, formatCost, showDate=false) => {

    const factor = weightType === 'KG' ? 1 : 2.205;

    const row = {
        flight: showDate ? moment.utc(dataItem.date).format('MMM-DD') : dataItem.flight,
        loose: formatCost(dataItem.loose * factor),
        bup: formatCost(dataItem.bup * factor),
        total: formatCost(dataItem.total * factor),
        mail: formatCost(dataItem.mail * factor),
        [weightType === 'KG' ? 'flight_kg' : 'flight_lb']: formatCost(dataItem.flight_kg * factor),
        dg_count: formatCost(dataItem.dg_count)
    }

    if (reportType && reportType.toLowerCase() === 'bup') {
        row.bup_ld3 = formatCost(dataItem.bup_ld3);
        row.bup_ld7 = formatCost(dataItem.bup_ld7);
    } else if (reportType && reportType.toLowerCase() === 'screened') {
        row[weightType === 'KG' ? 'screened_kg' : 'screened_lb'] = formatCost(dataItem.screened_kg * factor);
    } else if (reportType && reportType.toLowerCase() === 'transfer') {
        row[weightType === 'KG' ? 'transfer_kg' : 'transfer_lb'] = formatCost(dataItem.transfer_kg * factor);
    }

    return row;
}

const checkAllZeroes = (dataItem) => {
    const checkArray = ['loose', 'bup', 'total', 'mail', 'flight_kg', 'flight_lb', 'dg_count', 'bup_ld3', 'bup_ld7', 'screened_kg'];
    let allZeroes = true;
    
    for (let i = 0; i < checkArray.length; i++) {
        if (dataItem[checkArray[i]] > 0) {
            allZeroes = false;
        }
    }

    return allZeroes;
}

export const generateDetailedJson = (reportType, data, weightType, formatCost) => {
    const jsonData = [];
    
    // const typesArray = ['EXPORT TOTAL', 'EXPORT', 'IMPORT TOTAL', 'IMPORT', 'GRAND TOTAL'];

    // for (let i = 0; i < typesArray.length; i++) {
    //     data.monthly.map(d => d.type === typesArray[i] && jsonData.push(rowCreater(reportType, d, weightType, formatCost)));
    // }

    const typesArray = [
        {
            itemType: 'EXPORT TOTAL',
            dataType: 'daily',
            showDate: false,
            category: 1
        },
        {
            itemType: 'EXPORT',
            dataType: 'dailyTotals',
            showDate: true,
            category: 2
        },
        {
            itemType: 'IMPORT TOTAL',
            dataType: 'daily',
            showDate: false,
            category: 1
        },
        {
            itemType: 'IMPORT',
            dataType: 'dailyTotals',
            showDate: true,
            category: 2
        },
        {
            itemType: 'GRAND TOTAL',
            dataType: 'daily',
            showDate: false,
            category: 1
        }
    ];

    for (let i = 0; i < typesArray.length; i++) {

        const {dataType, itemType, showDate, category} = typesArray[i];

        if (category === 1) {

            data[dataType].map(d => d.type === itemType && jsonData.push(rowCreater(reportType, d, weightType, formatCost, showDate)));
        
        } else if (category === 2) {

            for (let j = 0; j < data[dataType].length; j++) {

                const d = data[dataType][j];

                if (d.type === itemType) {

                    jsonData.push(rowCreater(reportType, d, weightType, formatCost, showDate));
                
                    data.daily.map(m => m.type === itemType && m.date === d.date &&
                        jsonData.push(rowCreater(reportType, m, weightType, formatCost, false))
                    ); 
                    
                }

  
            }   
        }

    }

    console.log(jsonData);

    return jsonData;
}