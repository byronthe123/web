import React from 'react';
import styled from 'styled-components';

interface Props {
    title: string;
    logoUrl?: string; 
}

export default function CardContent ({
    title,
    logoUrl
}: Props) {

    return (
        <div className={'text-center'}>
            {
                logoUrl ? 
                    <Image src={logoUrl} /> :
                    <PlaceHolderLogo className="fa-solid fa-up-right-from-square" />
            }
            <Title className='mb-0' style={{fontWeight: 'bold'}}>{title}</Title>
        </div>
    ); 
}

const Image = styled.img`
    height: 50px;
    width: auto; 
    max-width: 120px;
`;

const Title = styled.p`
    font-weight: bold;
`;

const PlaceHolderLogo = styled.i`
    font-size: 24px;
`;