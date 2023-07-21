import React, { useState, useEffect, useMemo } from 'react';
import { useImportContext } from './context';
import { Button, Label, Row, Col } from 'reactstrap';
import  { Field } from 'formik';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

interface Props {
    name: string, 
    label: string, 
    labelClassName?: string, 
    fieldName: string,
    fieldClassName?: string,
    fieldType: string,
    handleChange: (e: any) => void,
    reviewIdentification: boolean 
}

export default function ConfirmField ({ 
    name, 
    label, 
    labelClassName, 
    fieldName,
    fieldClassName,
    fieldType,
    handleChange,
    reviewIdentification 
}: Props) {
    const { module } = useImportContext();
    const { formFields, setFormFields, values, setFieldValue } = module;
    const [init, setInit] = useState(false);
    const [confidence, setConfidence] = useState('');
    const validFormFields = useMemo(() => {
        return Object.keys(formFields).length > 0;
    }, [formFields]);

    useEffect(() => {
        const resolveConfidence = () => {
            const num = _.get(formFields, `[${name}].confidence`, 0);
            return `${(num * 100).toFixed(0)}%`;
        }
        if (!init && validFormFields && !reviewIdentification && (_.get(values, `[${fieldName}].length`, 0) === 0)) {
            setInit(true);
            setConfidence(resolveConfidence());
            const value = _.get(formFields, `[${name}].value`, '');
            if (
                fieldType === 'date' && 
                (!moment(value).isValid() || moment(value).isBefore(moment().format('YYYY-MM-DD')))
            ) {
                setFieldValue(fieldName, null);
                alert('Please set the expiration date manually');
            } else {
                setFieldValue(fieldName, value);
            }
        }
    }, [init, formFields, name, fieldName, fieldType, reviewIdentification, values]);

    const confirmFormField = (name: string) => {
        if (validFormFields) {
            const copy = Object.assign({}, formFields);
            copy[name].confirmed = true;
            setFormFields(copy);
        }
    }

    const enableConfirm = useMemo(() => {
        return values[fieldName] && values[fieldName].length > 0;
    }, [values, fieldName]);

    return (
        <Row>
            <Col md={12}>
                <Label className={classNames('d-block', labelClassName)}>{label}:</Label>
                {
                    fieldType === 'date' ? 
                        <Field 
                            name={fieldName} 
                            type={'date'} 
                            className={classNames('form-control d-inline', fieldClassName)} 
                            min={moment().format('YYYY-MM-DD')}
                            style={{ width: '350px' }}
                            onChange={(e: any) => handleChange(e)}
                        />
                        :
                        <Field 
                            name={fieldName} 
                            type={'text'} 
                            className={classNames('form-control d-inline', fieldClassName)} 
                            style={{ width: '350px' }} 
                        />
                }
                {
                    !validFormFields ? 
                        <></> : 
                    _.get(formFields, `[${name}].confirmed`, null) === false ?
                    <>
                        <Label className={'d-inline ml-2'}>Accuracy: {confidence}</Label>
                        <Button 
                            className={'d-inline ml-2'} 
                            onClick={() => confirmFormField(name)}
                            disabled={!enableConfirm}
                        >
                            Confirm
                        </Button>
                    </> :
                    <i className="fa fa-check-circle d-inline text-success ml-2 font-size-lg"></i>
                }
            </Col>
        </Row>
    );

}