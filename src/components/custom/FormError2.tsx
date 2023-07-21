import React from 'react';
import { FieldErrorsImpl, DeepRequired, FieldValues } from 'react-hook-form';


interface Props {
    errors: any,
    name: string
}

export default function FormError ({ errors, name }: Props) {
    if (errors && name && errors[name]) {
        return (
            // @ts-ignore
            <span className={'ml-2 text-danger'}>{errors[name].message}</span>
        );
    }
    return null;
}