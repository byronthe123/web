import React from 'react';
import { Row, Col, Button } from 'reactstrap';

export default ({
    previous,
    resolveDriverCoName
}) => {
    
    return (
        <Row className={'mb-2'}>
            <Col md={12}>
                <Button 
                    className={'float-left mr-2 py-1'} 
                    onClick={() => previous()}
                >
                    Back
                </Button>
                <h6 className={'float-right mt-2'}>
                    {resolveDriverCoName()}
                </h6>
            </Col>
        </Row>
    );
}