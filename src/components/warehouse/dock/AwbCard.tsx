import React from 'react';
import { Row, Col } from 'reactstrap';
import { formatMawb } from '../../../utils';

import { IDockAwb } from './interfaces';

interface Props {
    awb: IDockAwb;
    selectedAwb: IDockAwb;
    setSelectedAwb: (awb: IDockAwb) => void;
}

export default function AwbCard({ awb, selectedAwb, setSelectedAwb }: Props) {
    const useBorder =
        selectedAwb.id === awb.id ? '2px solid red' : '2px solid black';

    return (
        <Row
            style={{
                borderRadius: '0.75rem',
                backgroundColor: '#e6e6e6',
                border: useBorder,
            }}
            className={'mb-2'}
            onClick={() => setSelectedAwb(awb)}
        >
            <Col md={2} style={{ borderRight: useBorder }}>
                <h1 className={'my-4'}>{awb.s_type.substring(0, 2)}</h1>
            </Col>
            <Col md={4}>
                <h1 className={'my-4'}>{formatMawb(awb.s_mawb)}</h1>
            </Col>
            <Col md={4}>
                <h1 className={'my-4'}>{awb.s_status}</h1>
            </Col>
        </Row>
    );
}
