import styled from "styled-components";

interface Props {
    className: string;
    size: number;
    onClick?: () => any;
}

export default function Icon ({
    className,
    size,
    onClick
}: Props) {

    const useSize = `${size}px`;

    return (
        <CustomIcon className={className} useSize={useSize} onClick={onClick} />
    );
}

const CustomIcon = styled.i<{ useSize: string }>`
    font-size: ${p => p.useSize};
`;