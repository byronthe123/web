import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';

export default ({
    awb,
    selectAwb
}) => {

    return (
        <Col md={6} sm={12} >
            <Card className={'mb-2'} style={{ backgroundColor: awb.s_type === 'EXPORT' ? '#add8e6' : '#61B996' }} onClick={() => selectAwb && selectAwb(awb)}>
                <CardBody>
                    <Row>
                        <Col md={12}>
                            <div className={'float-left'}>
                                <h6>{awb.s_mawb}</h6>
                            </div>
                            {/* <div className={'float-right'}>
                                <h6 className={'float-right'}>{awb.locations.length}</h6>
                            </div> */}
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>

    );
}