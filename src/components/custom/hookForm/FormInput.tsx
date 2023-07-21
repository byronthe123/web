import React from 'react';
import { FormGroup as BootstrapFormGroup, Label } from 'reactstrap';
import { DeepRequired, FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form';
import _ from 'lodash';
import type { FieldPath } from "react-hook-form"

import { Input, Textarea } from './Input';
import FormError from '../FormError';

interface Props<T extends FieldValues> {
    label: string;
    register: UseFormRegister<T>;
    name: FieldPath<T>;
    errors: FieldErrorsImpl<DeepRequired<T>>;
    type?: 'text' | 'number' | 'date' | 'textarea' | 'password';
}

export default function FormInput<T extends FieldValues>({
    label,
    register,
    name,
    errors,
    type,
}: Props<T>) {

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
