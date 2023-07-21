import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

interface Props {
    onClick: () => void;
    classNames?: string;
}

export default function BackButton ({
    onClick,
    classNames
}: Props) {
    return (
        <Icon 
            className={classnames(
                'fa-solid fa-arrow-left text-succes',
                classNames
            )}
            onClick={() => onClick()}
        />
    );
}

const Icon = styled.i`
    font-size: 36px;
    position: relative;
    bottom: 5px;
`;