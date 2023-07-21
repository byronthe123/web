import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { Row, Col, Input, Button, FormGroup } from 'reactstrap';
import axios from 'axios';
import { api, asyncHandler } from '../../utils';


export default function CargoSprintApi () {

    const [awb, setAwb] = useState('');
    const [json, setJson] = useState({});

    const handleSearch = asyncHandler(async() => {
        const res = await api('get', `csApi/${awb}`);
        setJson(res.data);
    });

    return (
        <Row>
            <Col md={12}>
                <FormGroup>
                    <Input 
                        type={'text'} 
                        style={{ width: '200px' }} 
                        className={'d-inline mr-2'}
                        value={awb}
                        onChange={(e) => setAwb(e.target.value)}
                    />
                    <Button onClick={() => handleSearch()}>Search</Button>
                </FormGroup>
                <h4>Results:</h4>
                {
                    Object.keys(json).length > 0 && 
                    <ReactJson src={json} displayDataTypes={false} />
                }
            </Col>
        </Row>
    );
}