import React, { Fragment } from 'react';
import {Table} from 'reactstrap';
import moment from 'moment';

const DisplayReportStandard = ({
    type,
    data,
    weightType,
    formatCost
}) => {

    const factor = weightType === 'KG' ? 1 : 2.205;

    const rowCreater = (dataItem, fontWeight='normal') => {
        return (
            <tr style={{fontWeight: fontWeight}}>
                <td>{dataItem.flight}</td>
                <td className='text-right'>{formatCost(dataItem.loose * factor)}</td>
                <td className='text-right'>{formatCost(dataItem.bup * factor)}</td>
                {
                    type && type.toLowerCase() === 'bup' && 
                    <Fragment>
                        <td>{formatCost(dataItem.bup_ld3)}</td>
                        <td>{formatCost(dataItem.bup_ld7)}</td>
                    </Fragment>
                }
                <td className='text-right'>{formatCost(dataItem.total * factor)}</td>
                <td className='text-right'>{formatCost(dataItem.mail * factor)}</td>
                {
                    type && type.toLowerCase() === 'transfer' && 
                    <td className='text-right'>{formatCost(dataItem.transfer_kg * factor)}</td>
                }
                <td className='text-right'>{formatCost(dataItem.flight_kg * factor)}</td>
                <td className='text-right'>{formatCost(dataItem.dg_count)}</td>
                {
                    type && type.toLowerCase() === 'screened' && 
                    <td className='text-right'>{formatCost(dataItem.screened_kg * factor)}</td>
                }
            </tr> 
        );
    }

    return (
        <Fragment>
            <h4>Standard:</h4>
            <Table striped>
                <thead>
                    <tr>
                        <th>FLIGHT</th>
                        <th className='text-right'>LOOSE</th>
                        <th className='text-right'>BUP</th>
                        {
                            type && type.toLowerCase() === 'bup' && 
                            <Fragment>
                                <th className='text-right'>BUP LD3</th>
                                <th className='text-right'>BUP LD7</th>
                            </Fragment>
                        }
                        <th className='text-right'>TOTAL</th>
                        <th className='text-right'>MAIL</th>
                        {
                            type && type.toLowerCase() === 'transfer' && 
                            <th className='text-right'>TRANSFER {weightType}</th>
                        }
                        <th className='text-right'>FLIGHT {weightType}</th>
                        <th className='text-right'>DG COUNT</th>
                        {
                            type && type.toLowerCase() === 'screened' && 
                            <th className='text-right'>SCREENED {weightType}</th>
                        }
                    </tr>
                </thead>
                <tbody>
                {
                    data.monthly.map(d => d.type === 'EXPORT TOTAL' &&
                        rowCreater(d, 'bold')
                    )
                }
                {
                    data.monthly.map(d => d.type === 'EXPORT' && 
                        rowCreater(d)
                    )
                }
                {
                    data.monthly.map(d => d.type === 'IMPORT TOTAL' && 
                        rowCreater(d, 'bold')
                    )
                }
                {
                    data.monthly.map(d => d.type === 'IMPORT' && 
                        rowCreater(d)
                    )
                }
                {
                    data.monthly.map(d => d.type === 'GRAND TOTAL' && 
                        rowCreater(d, 'bolder')
                    )
                }
                </tbody>
            </Table>
        </Fragment>
    );
}

export default DisplayReportStandard;