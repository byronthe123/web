import {
    FieldError,
    Merge,
    FieldErrorsImpl,
    DeepRequired,
} from 'react-hook-form';
import styled from 'styled-components';

interface Props {
    error: boolean;
}

export const Textarea = styled.textarea.attrs({
    className: 'form-control',
})<Props>`
    border: ${(p) => (p.error ? '1px solid red !important' : null)};
`;

export const Input = styled.input.attrs({ className: 'form-control' })<Props>`
    border: ${(p) => (p.error ? '1px solid red !important' : null)};
`;
