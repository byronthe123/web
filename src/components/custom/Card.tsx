import React from 'react';
import { Card as ReactCard, CardBody as ReactCardBody } from 'reactstrap';
import styled, { css } from 'styled-components';
import { dropIn } from '../animations';

interface Props {
    children: React.ReactNode,
    flex?: boolean;
    flexDirection?: 'row' | 'column';
    className?: string;
    bodyClassName?: string;
    onClick?: (props?: any) => any;
    strongShadow?: boolean;
    dropIn?: boolean;
    // All other props
    [x:string]: any;
}

export default function Card ({
    children,
    flex,
    flexDirection,
    className,
    bodyClassName,
    onClick,
    strongShadow,
    dropIn
}: Props) {
    return (
        <Outer 
            className={className} 
            onClick={onClick}
            strongShadow={strongShadow}
            dropIn={dropIn}
        >
            <CardBody className={bodyClassName} flex={flex} flexDirection={flexDirection}>
                { children }
            </CardBody>
        </Outer>
    );
}

const Outer = styled(ReactCard)`
    border-radius: 15px;
    width: 100%;
    background-color: rgba(255,255,255,1);
    box-shadow: ${p => p.strongShadow && '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'};
    animation: ${p => p.dropIn ? css`${(dropIn)} 500ms` : null};
`;

const CardBody = styled(ReactCardBody)`
    display: ${p => p.flex ? 'flex' : null};
    flex-direction: ${p => p.flexDirection || null}
`;