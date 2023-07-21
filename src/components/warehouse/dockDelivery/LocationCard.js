import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';

export default ({
    location,
    selectLocation
}) => {

    const enableClick = () => location.s_location && location.i_pieces && location.i_pieces > 0;

    return (
        <Card className={'mb-2'} style={{ backgroundColor: '#61B996' }} onClick={() => enableClick() && selectLocation(location)}>
            <CardBody>
                <Row className={'text-center'}>
                    <Col xs={6}>
                        <h1>{ location.s_location || 'No Location'}</h1>
                    </Col>
                    <Col xs={6}>
                        <h1>{ location.i_pieces || 'No Pieces'}</h1>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}