import React from 'react';
import { Row, Col, Table } from 'reactstrap';
import dayjs from 'dayjs';
import { formatMawb } from '../../utils';

interface Props {
    data: any
}

export default function FSU ({
    data
}: Props) {
    return (
        <Row>
            <Col md={12}>
                <Table>
                    <thead></thead>
                    <tbody>
                        {
                            data.map((item: any, i: number) => (
                                <tr key={i}>
                                    <td style={{ width: '200px' }}>{dayjs(item.t_created).format('MM/DD/YYYY HH:mm')}</td>
                                    <td>
                                        <div className={'d-block'}>{item.s_method}/{item.s_version}</div>
                                        <div className={'d-block'}>{formatMawb(item.s_mawb)}{item.s_mawb_origin}{item.s_mawb_destination}\T{item.i_mawb_pieces}K{item.f_mawb_weight}</div>
                                        <div className={'d-block'}>DLV/{dayjs(item.t_created).format('DDMMMhhmm')}/{item.s_station}/T{item.i_delivered_pieces}K{item.f_delivered_weight}/{item.s_delivered_to}</div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
}