import React, { useState, useEffect } from 'react';
import { Button, Label } from 'reactstrap';

export default ({
    formFields,
    setFormFields,
    name
}) => {

    const [confidence, setConfidence] = useState('');
    const [validFormFields, setValidFormFields] = useState(false);

    useEffect(() => {
        const validFormFields = formFields && Object.keys(formFields).length > 0 && name && name.length > 0;
        setValidFormFields(validFormFields);
        if (validFormFields) {
            setConfidence(resolveConfidence());
        }
    }, [formFields, name]);


    const resolveConfidence = () => {
        if (formFields[name]) {
            const num = isNaN(formFields[name].confidence) ? 0 : formFields[name].confidence;
            return `${(num * 100).toFixed(0)}%`;    
        }
        return '';
    }

    const confirmFormField = (name) => {
        if (formFields) {
            const copy = Object.assign({}, formFields);
            copy[name].confirmed = true;
            setFormFields(copy);
        }
    }

    console.log(name);
    console.log(formFields);

    if (validFormFields && formFields[name] && !formFields[name].confirmed) {
        return (
            <>
                <Label className={'d-inline ml-2'}>Accuracy: {confidence}</Label>
                <Button className={'d-inline ml-2'} onClick={() => confirmFormField(name)}>Confirm</Button>
            </>
        );
    } else if (validFormFields && formFields[name] && formFields[name].value && formFields[name].confirmed) {
        return <i className="d-inline ml-2 fas fa-check"></i>
    } else {
        return '';
    }

}