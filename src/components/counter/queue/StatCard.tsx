import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import Card from '../../custom/Card';

interface Props {
    children: React.ReactNode;
}

export default function StatCard ({
    children
}: Props) {
    return (
        <Card>
            { children }
        </Card>
    );
}
