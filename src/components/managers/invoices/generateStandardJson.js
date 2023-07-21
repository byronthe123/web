const rowCreater = (reportType, dataItem, weightType, formatCost) => {

    const factor = weightType === 'KG' ? 1 : 2.205;

    const row = {
        flight: dataItem.flight,
        loose: formatCost(dataItem.loose * factor),
        bup: formatCost(dataItem.bup * factor),
        total: formatCost(dataItem.total * factor),
        mail: formatCost(dataItem.mail * factor),
        [weightType === 'KG'? 'flight_kg' : 'flight_lb']: formatCost(dataItem.flight_kg * factor),
        dg_count: formatCost(dataItem.dg_count)
    }

    if (reportType && reportType.toLowerCase() === 'bup') {
        row.bup_ld3 = formatCost(dataItem.bup_ld3);
        row.bup_ld7 = formatCost(dataItem.bup_ld7);
    } else if (reportType && reportType.toLowerCase() === 'screened') {
        row[weightType === 'KG'? 'screened_kg' : 'screened_lb'] = formatCost(dataItem.screened_kg * factor);
    } else if (reportType && reportType.toLowerCase() === 'transfer') {
        row[weightType === 'KG' ? 'transfer_kg' : 'transfer_lb'] = formatCost(dataItem.transfer_kg * factor);
    }

    return row;
}

const generateStandardReportEnd = (reportType, weightType) => {
    const rows = [];

    const headingRow = {
        flight: 'flight',
        loose: 'loose',
        bup: 'bup',
        total: 'total',
        mail: 'mail',
        [weightType === 'KG'? 'flight_kg' : 'flight_lb']: weightType === 'KG'? 'flight_kg' : 'flight_lb',
        dg_count: 'dg_count'
    }

    if (reportType && reportType.toLowerCase() === 'bup') {
        headingRow.bup_ld3 = 'bup_ld3';
        headingRow.bup_ld7 = 'bup_ld7';
    } else if (reportType && reportType.toLowerCase() === 'screened') {
        headingRow[weightType === 'KG'? 'screened_kg' : 'screened_lb'] = weightType === 'KG'? 'screened_kg' : 'screened_lb';
    } else if (reportType && reportType.toLowerCase() === 'transfer') {
        headingRow[weightType === 'KG' ? 'transfer_kg' : 'transfer_lb'] = weightType === 'KG'? 'transfer_kg' : 'transfer_lb';
    }

    rows.push({
        flight: '',
        loose: '',
        bup: '',
        total: '',
        mail: '',
        [weightType === 'KG' ? 'flight_kg' : 'flight_lb']: '',
        dg_count: ''
    }, headingRow);

    return rows;
}

export const generateStandardJson = (reportType, data, weightType, formatCost) => {
    const jsonData = [];
    
    const typesArray = ['EXPORT TOTAL', 'EXPORT', 'IMPORT TOTAL', 'IMPORT', 'GRAND TOTAL'];

    for (let i = 0; i < typesArray.length; i++) {
        data.monthly.map(d => d.type === typesArray[i] && jsonData.push(rowCreater(reportType, d, weightType, formatCost)));
    }

    generateStandardReportEnd(reportType, weightType).map(r => jsonData.push(r));

    return jsonData;
}