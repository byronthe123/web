import React from 'react';
import {FormGroup, Label, Input} from 'reactstrap';

const CustomFormInput = ({
    label,
    value,
    setValue
}) => {
    return (
        <FormGroup className='custom-form-group'>
            <Label className='custom-label'>{label}</Label>
            <Input type='text' value={value} onChange={(e) => setValue(e)}  style={{border: 'none'}} />
        </FormGroup>
    );
}

export default CustomFormInput;