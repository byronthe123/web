import React from 'react';
import { FormGroup, Label } from 'reactstrap';
import Select from 'react-select';
import _ from 'lodash';

import FormError from '../../custom/FormError';

export default function SelectAirline ({
    selectedAirline,
    handleSelectAirline,
    airlineOptions,
    setFieldValue
}) {

    const selectAirlineWrapper = (selectedOption) => {
        handleSelectAirline(selectedOption);
        setFieldValue('s_airline_code', selectedOption.value);
    }

    return (
        <FormGroup>
            <Label>Airline Code {selectedAirline.value} {_.get(selectedAirline, 'value.length', 0) === 0 && <FormError message={'Airline code required'} />}</Label>
            <Select 
                value={selectedAirline}
                options={airlineOptions}
                onChange={selectedOption => selectAirlineWrapper(selectedOption)}
            />
        </FormGroup>
    );
}