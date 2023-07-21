import MoonLoader from 'react-spinners/MoonLoader';
import { Button } from 'reactstrap';
import styled from 'styled-components';

interface Props {
    loading: boolean;
    title: string;
    onClick: () => any;
    disabled?: boolean;
}

export default function LoadingButton({
    loading,
    title,
    onClick,
    disabled,
}: Props) {
    
    if (loading) {
        return (
            <Container>
            <MoonLoader size={28} color={'#176c33'} />
        </Container>
        );
    }

    return (
        <Button onClick={() => onClick()} disabled={disabled}>
            {title}
        </Button>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;