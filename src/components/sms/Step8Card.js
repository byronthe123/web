import React from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button, Table, Row, Col } from "reactstrap";

import Step8TableRows from './Step8TableRows'

const Step8Card = ({
    factorsArray,
    title,
    handleCheckBoxes,
    handleInput
}) => {
    return (
        <Col md='12' lg='6' className='pb-3'>
            <Card>
                <CardBody>
                    <Row>
                        <h3 className='text-center'>{title}</h3>
                    </Row>
                    <Row>
                        <Table borderless style={{tableLayout: 'fixed'}}>
                            <thead>

                            </thead>
                            <tbody>
                                {
                                    factorsArray.map((f, i) =>
                                        <Step8TableRows
                                            bool={f.bool}
                                            boolId={f.boolId}
                                            string={f.string}
                                            stringId={f.stringId}
                                            label={f.label}
                                            handleCheckBoxes={handleCheckBoxes}
                                            handleInput={handleInput}
                                            key={i}
                                        />
                                    )
                                }
                            </tbody>
                        </Table>
                    </Row>
                </CardBody>
            </Card>
        </Col>
    );
}

export default Step8Card;