import React, { Fragment } from 'react';
import {Table, Row, Col} from 'reactstrap';
import moment from 'moment';

import { rampFields } from './mapFields';

export default ({
    type,
    data,
    weightType,
    formatCost,
    formatCostTwoDecimals
}) => {

    console.log(data);

    const rowCreater = (dataItem, fontWeight='normal') => {

        return (
            <tr style={{fontWeight: fontWeight}}>
                {
                    rampFields.map((f, i) => f.value === 'd_flight' ?
                        <td key={i}>{moment.utc(dataItem.d_flight).format('MMM-DD')}</td> : f.value === 's_flight_number' ?
                        <td key={i}>{dataItem.s_flight_number === null ? '' : dataItem.s_flight_number}</td> : f.value === 's_aircraft_type' ?
                        <td key={i}>{dataItem.s_aircraft_type === null ? '' : dataItem.s_aircraft_type}</td> : f.num ?
                        <td key={i} className='text-right'>{formatCostTwoDecimals(dataItem[f.value])}</td> :
                        <td key={i} className='text-right'>{dataItem[f.value]}</td>
                    )
                }
            </tr> 
        );
    }

    const validValue = (value) => {
        // return value && value !== null && parseFloat(value) > 0;
        if (value && value !== null && parseFloat(value) > 0) {
            return true;
        }
        return false;
    }

    const renderSecondTable = () => {
        const totalItem = data.daily.filter(d => d.s_flight_number === 'grand_total')[0];
        const valid = validValue(totalItem.flight_turn) || validValue(totalItem.parking) || validValue(totalItem.drayage);
        return valid;
    }

    const renderSecondTableRow = (row) => {
        return true;
        const valid = validValue(row.flight_turn) || validValue(row.parking) || validValue(row.drayage);
        return valid;
    }


    return (
        <Col md={12}>
            <h4>Ramp:</h4>
            {
                // renderSecondTable() && 
                <Row className='pt-3'>
                    <Table striped>
                        <thead>
                            <tr>
                                {
                                    rampFields.map((f, i) =>
                                        <th key={i} className={`${!f.nonTotal ? 'text-right' : ''}`}>{f.name}</th>
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody>
                        {
                            data.daily.map(d => d.s_flight_number !== 'grand_total' && renderSecondTableRow(d) &&
                                rowCreater(d, 'normal')
                            )
                        }
                        {
                            data.daily.map(d => d.s_flight_number === 'grand_total' &&        
                                <tr style={{fontWeight: 'bolder'}}>
                                    <td colSpan='3'>Grand Total</td>
                                    {
                                        rampFields.map((f, i) =>  f.num &&
                                            <td key={i} className='text-right'>{formatCostTwoDecimals(d[f.value])}</td>
                                        )
                                    }
                                    <td className='text-right'></td> 
                                </tr>                                       
                            )
                        }
                        </tbody>
                    </Table>
                </Row>
            }
        </Col>
    );
}
