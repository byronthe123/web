import React from 'react';
import styled from 'styled-components';

import ActionIcon from '../custom/ActionIcon';
import { IMenuApp, MenuAppType } from '../../globals/interfaces';
import { HandleCreateUpdate } from './interfaces';

interface Props {
    indexNum: number;
    type: MenuAppType;
    handleCreateUpdate: HandleCreateUpdate;
}

export default function MenuButton({
    indexNum,
    type,
    handleCreateUpdate
}: Props) {
    return (
        <Container>
            <CustomCard>
                <ActionIcon type={'add'} onClick={() => handleCreateUpdate(indexNum, type)} />
            </CustomCard>
        </Container>
    );
}

const Container = styled.div`
    width: 23%;
`;

const CustomCard = styled.div`
    border-radius: 0.75rem;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important;
    padding: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;
