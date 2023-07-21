import React, { Fragment } from 'react';
import {Table, Row, Col} from 'reactstrap';
import moment from 'moment';

const DisplayReportMisc = ({
    type,
    data,
    weightType,
    formatCost,
    formatCostTwoDecimals
}) => {

    const factor = weightType === 'KG' ? 1 : 2.205;

    const rowCreater = (dataItem, fontWeight='normal', total=false) => {
        return (
            <tr style={{fontWeight: fontWeight}}>
                <td>{total ? dataItem.s_misc_type : moment.utc(dataItem.d_flight).format('MMM-DD')}</td>
                <td className='text-right'>{formatCostTwoDecimals(dataItem.f_misc)}</td>
                <td>{dataItem.s_misc_uom}</td>
                <td>{total ? '' : dataItem.s_notes}</td>
            </tr> 
        );
    }

    const checkMap = (totalMiscType, dailyMiscType, totalUom, dailyUom) => {
        if (totalMiscType, dailyMiscType, totalUom, dailyUom) {
            // console.log(`totalMiscType = ${totalMiscType}\ndailyMiscType = ${dailyMiscType}\ntotalUom = ${totalUom}\ndailyUom = ${dailyUom}`);
            // console.log(`matchType = ${matchType}`);
            // console.log(`matchUom = ${matchUom}`);
            const matchType = (totalMiscType && totalMiscType.trim()) === (dailyMiscType && dailyMiscType.trim());
            const matchUom = (totalUom && totalUom.trim()) === (dailyUom && dailyUom.trim());    
            return matchType && matchUom;
        } else {
            return (totalMiscType === dailyMiscType) && (totalUom === dailyUom);
        }
    }

    return (
        <Col md={12}>
            <h4>Misc:</h4>
            <Row className='pt-3'>
                <Table striped>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th className='text-right'>Amount</th>
                            <th>UOM</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                    {

                        data.total.map(t => 
                            <Fragment>
                                {rowCreater(t, 'bold', true)}
                                {
                                    data.daily.map(d => checkMap(d.s_misc_type, t.s_misc_type, d.s_misc_uom, t.s_misc_uom) &&
                                        rowCreater(d, 'normal', false)
                                    )
                                } 
                            </Fragment>                            
                        )
                    }
                    </tbody>
                </Table>
            </Row>
        </Col>
    );
}

export default DisplayReportMisc;