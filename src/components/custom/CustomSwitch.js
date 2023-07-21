import React from 'react';
import {FormGroup, Label} from 'reactstrap';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";

const CustomSwitch = ({
    label,
    value,
    handleSwitch
}) => {
    return (
        <FormGroup className='custom-form-group pb-1 px-2 text-center'>
            <Label className='custom-label pl-0'>{label}</Label>
            <Switch
                className="custom-switch custom-switch-primary"
                checked={value}
                onClick={handleSwitch}
            />
        </FormGroup>
    );
}

export default CustomSwitch;

