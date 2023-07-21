import React, { useState, useEffect } from 'react';
import { Row, Col, Button, ButtonGroup } from 'reactstrap';
import FileBase64 from 'react-file-base64';

export default function IacCcsf () {

    const [selectedType, setSelectedType] = useState('');

    const handleUpload = (file) => {
        const parser = new (require('simple-excel-to-json').XlsParser)();
        const doc = parser.parseXls2Json('./example/sample.xlsx');
    }

    const enableSubmit = () => false;

    return (
        <Row>
            <Col md={12}>
                <ButtonGroup data-testid={'btn-group-options'}>
                    {
                        ['IAC', 'CCSF'].map((item, i) => (
                            <Button 
                                key={i}
                                active={selectedType === item}
                                onClick={() => setSelectedType(item)}
                                data-testid={`btn-${item}`}
                            >
                                {item}
                            </Button>
                        ))
                    }
                </ButtonGroup>
                <FileBase64 
                    data-testid={'file-upload'}
                />
                <Button
                    disabled
                >
                    Submit
                </Button>
            </Col>
        </Row>
    );  
}