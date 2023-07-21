import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { Label } from 'reactstrap';
import { Input } from 'reactstrap';
import styled from 'styled-components';

import { IAirport } from '../../../globals/interfaces';
import ModalAirports from './Modal';

enum Validation {
    PENDING,
    VALID,
    INVALID,
}

interface Props {
    airports: Array<IAirport>;
    airportCodesMap: Record<string, string>;
    code: string;
    setCode: React.Dispatch<React.SetStateAction<string>>;
    label?: string;
}

export default function SelectAirport({ airports, airportCodesMap, code, setCode, label }: Props) {
    const [modal, setModal] = useState(false);

    const validCode: Validation = useMemo(() => {
        if (code.length < 3) {
            return Validation.PENDING;
        }
        return airportCodesMap[code] ? Validation.VALID : Validation.INVALID;
    }, [airportCodesMap, code]);

    const handleSetCode = (str: any) => {
        setCode(
            (str || '').substring(0, 3).toUpperCase()
        );
    };

    return (
        <Container>
            <CustomLabel>{label}</CustomLabel>
            <CustomInput
                value={code}
                onChange={(e: any) => handleSetCode(e.target.value)}
                validCode={validCode}
            />
            <ListIcon className="fa-duotone fa-list" onClick={() => setModal(true)} />
            <ValidationResult validCode={validCode}>
                {validCode === Validation.INVALID
                    ? 'Invalid Code'
                    : validCode === Validation.VALID
                    ? airportCodesMap[code]
                    : null}
            </ValidationResult>
            <ModalAirports 
                modal={modal}
                setModal={setModal}
                data={airports}
            />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    width: 450px;
`;

const CustomInput = styled(Input)<{ validCode: Validation }>`
    width: 75px;
    border: ${(p) => p.validCode === Validation.INVALID && '1px solid red !important'};
`;

const CustomLabel = styled(Label)`
    margin-right: 10px;
    padding-top: 10px;
`;

const ValidationResult = styled.h6<{ validCode: Validation }>`
    margin-left: 10px;
    padding-top: 10px;
    color: ${(p) => p.validCode === Validation.INVALID && 'red'};
`;

const ListIcon = styled.i`
    font-size: 24px;
    margin-left: 5px;
    margin-right: 5px;

    &:hover {
        cursor: pointer;
        color: #6FB327;
    }
`;
