import React, { useMemo } from 'react';
import { Col, Table } from 'reactstrap';
import { IAwbRackDataMap, IDockAwb } from './interfaces';

interface Props {
    awb: IDockAwb,
    rackDataMap: IAwbRackDataMap
}

export default function ChecklistTable ({
    awb,
    rackDataMap
}: Props) {

    return (
        <Col md={4} className={'text-left'}>
            <Table striped>
                <thead className='bg-success text-white'>
                    <tr>
                        <th colSpan={2}>
                            {
                                awb.s_mawb
                            }
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (rackDataMap[awb.s_mawb] ? rackDataMap[awb.s_mawb].rackData : []).map((rackItem, i) => (
                            <tr key={i}>
                                <td>{rackItem.s_location}</td>
                                <td>{rackItem.b_delivered ? rackItem.i_pieces : 0}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </Col>
    );
}