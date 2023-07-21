import React from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button, Table, Row, Col } from "reactstrap";

const Step8TableRows = ({
    bool,
    boolId,
    string,
    stringId,
    label,
    handleCheckBoxes,
    handleInput
}) => {
    return (
        <tr>
            <td style={{width: '30%'}}>
                <CustomInput
                    type="checkbox"
                    id={boolId}
                    onClick={(e) => handleCheckBoxes(e)}
                    checked={bool}
                    label={label}
                    className="mb-2"
                />
            </td>
            <td>
                <Input type='text' value={string} id={stringId} onChange={(e) => handleInput(e)} />
            </td>
        </tr>
    );
}

export default Step8TableRows;