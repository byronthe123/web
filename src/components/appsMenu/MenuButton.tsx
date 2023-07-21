import React from 'react';
import styled from 'styled-components';

import { IMenuApp, MenuAppType } from '../../globals/interfaces';
import { HandleCreateUpdate } from './interfaces';
import CardContent from './CardContent';

interface Props {
    app: IMenuApp;
    indexNum: number;
    enableEdit: boolean;
    type: MenuAppType;
    handleCreateUpdate: HandleCreateUpdate;
}

const MenuButton = ({
    app,
    indexNum,
    enableEdit,
    type,
    handleCreateUpdate
}: Props) => {
    return (
        <Container>
            {
                enableEdit ? 
                    <EditButtonContainer>
                        <i 
                            className={'fa-solid fa-pen-to-square'} 
                            onClick={() => handleCreateUpdate(indexNum, type, app)}
                        />
                    </EditButtonContainer> :
                    <Spacer />
            }
            <a href={`${app.link}`} target='blank'>
                <CustomCard enableEdit={enableEdit}>
                    <CardContent 
                        title={app.title}
                        logoUrl={app.logoUrl}
                    />
                </CustomCard>            
            </a> 
        </Container>
    );
}

const Container = styled.div`
    width: 23%;
    position: relative;
    margin-top: -20px;
`;

const CustomCard = styled.div<{enableEdit: boolean}>`
    border-radius: 0.75rem;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important;
    padding: 25px;
`;

const EditButtonContainer = styled.div`
    position: relative;
    right: -150px;
    top: 20px;
    font-size: 20px;
    background-color: #d3d3d3;
    width: 26px;
    height: 26px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    visibility: hidden;

    &:hover {
        cursor: pointer;
        color: #6fb327;
    }

    ${Container}:hover && {
        visibility: visible;
    }
`;

const Spacer = styled.div`
    height: 20px;
`;

export default MenuButton;