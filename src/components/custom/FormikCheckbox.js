import React, { Fragment } from 'react';
import { Label, FormGroup } from 'reactstrap';
import { Field } from 'formik';

const FormikCheckbox = ({
    name,
    checked,
    label,
    onClick
}) => {

    return (
        <FormGroup>
            <Field
                name={name}
                type="checkbox"
                checked={checked}
                component={'input'}
                onClick={onClick}
                label={label}
                id={name}
            />
            <Label className='ml-2' htmlFor={name}>
                {label}
            </Label>
        </FormGroup>
    );
}

export default FormikCheckbox;