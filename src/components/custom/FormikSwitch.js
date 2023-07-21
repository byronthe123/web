import React from 'react';
import { Row, Col, Label } from 'reactstrap';
import Switch from "rc-switch";
import "rc-switch/assets/index.css"; 

export default ({
    label,
    name, 
    values, 
    setFieldValue
}) => {

    return (
        <Row>
            <Col md={12}>
                <Label className={'float-left'}>{label}</Label>
                <Switch 
                    className="custom-switch custom-switch-primary float-right"
                    checked={values[name]}
                    onClick={() => setFieldValue([name], !values[name])}
                />
            </Col>
        </Row>
    );
}