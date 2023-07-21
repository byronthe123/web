import React, { useMemo } from 'react';
import Select from 'react-select';
import styled from 'styled-components';

import { ISelectOption, ISpecialHandlingCode } from '../../globals/interfaces';

interface Props {
    shcs: Array<ISpecialHandlingCode>;
    selectedShcs: Array<ISelectOption>;
    setSelectedShcs: React.Dispatch<React.SetStateAction<ISelectOption>>;
}

export default function SpecialHandlingCodes ({
    shcs,
    selectedShcs,
    setSelectedShcs
}: Props) {

    const shcOptions: Array<ISelectOption> = useMemo(() => {
        const arr: Array<ISelectOption> = [];
        for (let i = 0; i < shcs.length; i++) {
            const { s_special_handling_code } = shcs[i];
            arr.push({
                label: s_special_handling_code,
                value: s_special_handling_code
            });
        }
        return arr;
    }, [shcs]);

    return (
        <SelectContainer>
            <Select
                isMulti
                name="shcs"
                value={selectedShcs}
                onChange={setSelectedShcs}
                options={shcOptions}
                className="basic-multi-select"
                classNamePrefix="select"
            />
        </SelectContainer>
    );
}

const SelectContainer = styled.div`

`;