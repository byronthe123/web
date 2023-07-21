import React from 'react';
import { FormGroup as BootstrapFormGroup, Label } from 'reactstrap';
import { FieldErrors } from 'react-hook-form';
import { UseFormReturn } from 'react-hook-form';
import _ from 'lodash';

import { Input, Textarea } from './Input';
import FormError from '../FormError';

interface Props {
    label: string;
    register: UseFormReturn['register'];
    name: string;
    errors: FieldErrors;
    type?: 'text' | 'number' | 'date' | 'textarea';
}

export default function FormGroup({
    label,
    register,
    name,
    errors,
    type,
}: Props) {

    const error = errors[name]?.message as string | undefined;

    return (
        <BootstrapFormGroup>
            <Label>
                {label}{' '}
                <FormError message={error} />
            </Label>
            {type === 'textarea' ? (
                <Textarea
                    {...register(name)}
                    error={Boolean(errors[name])}
                />
            ) : (
                <Input
                    type={type || 'text'}
                    {...register(name)}
                    error={Boolean(errors[name])}
                />
            )}
        </BootstrapFormGroup>
    );
}