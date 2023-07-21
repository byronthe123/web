import { useEffect, useState } from 'react';
import { Input } from 'reactstrap';
import styled from 'styled-components';
import { Label } from 'reactstrap';
import { ChangeEvent } from '../../globals/interfaces';
import { Button } from 'reactstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface Props {
    showGenerator: boolean;
}

export default function PasswordGenerator({ showGenerator }: Props) {
    const [length, setLength] = useState(8);
    const [password, setPassword] = useState('');
    const [specialChars, setSpecialChars] = useState(true);
    const [ambiguousChars, setAmbiguousChars] = useState(false);

    const setNewPassword = async () => {
        const password = generatePassword(length, specialChars, ambiguousChars);
        setPassword(password);
    };

    useEffect(() => {
        setNewPassword();
    }, [length, specialChars, ambiguousChars]);

    if (!showGenerator) {
        return null;
    }

    return (
        <Container>
            <h6>Password Generator</h6>
            <GeneratedPasswordContainer>{password}</GeneratedPasswordContainer>
            <FlexBetween>
                <CopyToClipboard text={password}>
                    <Button>
                        <i className="fa-duotone fa-copy text-white hover mr-2" />
                        Copy
                    </Button>
                </CopyToClipboard>
                <Button onClick={() => setNewPassword()}>
                    <i
                        className={'fa-duotone fa-rotate-right text-white mr-2'}
                    />
                    Regenerate
                </Button>
            </FlexBetween>
            <div>
                <LengthContainer>
                    <LabelContainer>
                        <Label>Length: {length}</Label>
                    </LabelContainer>
                    <LengthInput
                        type={'range'}
                        value={length}
                        onChange={(e: ChangeEvent) =>
                            setLength(Number(e.target.value))
                        }
                        min={'6'}
                        max={'18'}
                    />
                </LengthContainer>
                <CheckboxContainer>
                    <FlexContainer>
                        <Input
                            type={'checkbox'}
                            checked={specialChars}
                            onClick={() => setSpecialChars((prev) => !prev)}
                            className={'mr-3'}
                            id={'specialChars'}
                        />
                        <Label for={'specialChars'}>Special Characters</Label>
                    </FlexContainer>
                    <FlexContainer>
                        <Input
                            type={'checkbox'}
                            checked={ambiguousChars}
                            onClick={() => setAmbiguousChars((prev) => !prev)}
                            className={'mr-3'}
                            id={'ambiguousChars'}
                        />
                        <Label for={'ambiguousChars'}>
                            Ambiguous Characters
                        </Label>
                    </FlexContainer>
                </CheckboxContainer>
            </div>
        </Container>
    );
}

export const generatePassword = (
    length: number,
    useSpecialChars: boolean,
    useAmbiguousChars: boolean
) => {
    // Define all possible characters we want in the password
    const numbers = '0123456789';
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialChars = '@#$%';
    const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';

    // Start with letters and numbers
    let possibleChars = numbers + lowerCaseLetters + upperCaseLetters;

    // Add special characters if wanted
    if (useSpecialChars) {
        possibleChars += specialChars;
    }

    // Add ambiguous characters if wanted
    if (useAmbiguousChars) {
        possibleChars += ambiguousChars;
    }

    let password = '';

    // Generate password by picking a random character from the possibleChars string
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * possibleChars.length);
        password += possibleChars[randomIndex];
    }

    // Check if password includes a special character when useSpecialChars is true
    // If not, replace the first character with a random special character
    if (
        useSpecialChars &&
        !password.split('').some((char) => specialChars.includes(char))
    ) {
        const randomSpecialChar =
            specialChars[Math.floor(Math.random() * specialChars.length)];
        password = password.slice(1) + randomSpecialChar;
    }

    return password;
};

const getRandomIndex = (str: string) => {
    return Math.floor(Math.random() * str.length - 1) + 0;
};

const Container = styled.div`
    width: 323px;
`;

const FlexContainer = styled.div`
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 10px;
`;

const LengthContainer = styled(FlexContainer)`
    width: 125px;
    margin-top: 10px;
`;

const CheckboxContainer = styled.div`
    position: relative;
    left: 20px;
`;

const LabelContainer = styled.div`
    width: 65px;
`;

const LengthInput = styled(Input)`
    width: 50px;
    position: relative;
    top: 4px;
`;

const GeneratedPasswordContainer = styled.div`
    background-color: #caefdb;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    /* padding-top: 15px; */
    width: 323px;
    height: 66px;
`;

const FlexBetween = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
`;
