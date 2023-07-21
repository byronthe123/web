import React from 'react';
import { FieldError, Merge, FieldErrorsImpl, DeepRequired } from 'react-hook-form';

interface Props {
    message: string | undefined
}

export default function FormError ({ message }: Props) {
    if (message && typeof message === 'string') {
        return (
            <span className={'ml-2 text-danger'}>{message}</span>
        );
    }
    return null;
}