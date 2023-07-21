import React from 'react';
import { Row, Col, Input, Label } from 'reactstrap';

interface Props {
    pickUpOrderCheck: boolean;
    setPickUpOrderCheck: (state: boolean) => void;
    company: string;
    consignee: string;
}

export default function PickUpOrderCheck ({
    pickUpOrderCheck,
    setPickUpOrderCheck,
    company,
    consignee
}: Props) {
    return (
        <Row>
            <Col md={12} className={'text-center mb-3'}>
                <Input 
                    type={'checkbox'} 
                    value={pickUpOrderCheck}
                    onClick={() => setPickUpOrderCheck(!pickUpOrderCheck)}
                    className={'d-inline'}
                />
                <h5 className={'d-inline'}>{consignee} (consignee) and {company} (trucking company name) is on the document</h5>
            </Col>
        </Row>
    );
}