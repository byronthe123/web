import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion'; 

import AppLayout from '../AppLayout';

interface Props {
    children: React.ReactNode;
}

export default function Layout ({
    children
}: Props) {
    return (
        <AppLayout>
            <Wrapper>
                { children }
            </Wrapper>
        </AppLayout>
    );
}

const Wrapper = styled.div`
    background-color: '#f8f8f8';
    height: calc(100vh - 120px);
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 10px;
`;

