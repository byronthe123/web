import React, { useMemo } from 'react';
import styled from 'styled-components';

import { IMenuApp, MenuAppType, IMap } from '../../globals/interfaces';
import { HandleCreateUpdate } from './interfaces';
import MenuButton from './MenuButton';
import AddButton from './AddButton';

interface RenderAppsProps {
    apps: Array<IMenuApp>; 
    num: number; 
    enableEdit: boolean;
    type: MenuAppType;
    handleCreateUpdate: HandleCreateUpdate;
}

export default function RenderApps ({
    apps,
    num,
    enableEdit,
    type,
    handleCreateUpdate
}: RenderAppsProps) {
    
    const renderApps: Array<IMenuApp | null> = useMemo(() => {
        const arr = [];

        const map: IMap<IMenuApp> = {}; 
        for (let i = 0; i < apps.length; i++) {
            const {indexNum} = apps[i];
            map[indexNum] = apps[i];
        }

        for (let i = 1; i <= num; i++) {
            if (map[i]) {
                arr.push(map[i]);
            } else if (enableEdit) {
                arr.push(null);
            }
        }
        return arr;
    }, [apps, num, enableEdit]);

    return (
        <Container>
            <Type>{type === 'SYSTEM' ? 'SYSTEM' : 'MY'} APPS</Type>
            <AppsContainer type={type}>
                {
                    renderApps.map((app, i) => app !== null ? 
                        <MenuButton 
                            app={app}
                            indexNum={i + 1}
                            enableEdit={enableEdit}
                            type={type}
                            handleCreateUpdate={handleCreateUpdate}
                            key={i}
                        /> :
                        <AddButton 
                            indexNum={i + 1}
                            type={type}
                            handleCreateUpdate={handleCreateUpdate}
                            key={i} 
                        />
                    )
                }
            </AppsContainer>
        </Container>
    );
}

const Container = styled.div`

`;

const AppsContainer = styled.div<{type: string}>`
    --border-color: ${p => p.type === 'SYSTEM' ? '#83cf33' : '#407705'};
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border: 2px solid var(--border-color);
    border-radius: 25px;
`;

const Type = styled.div`
    position: relative;
    margin-bottom: -12px;
    margin-left: 20px;
    background-color: white;
    z-index: 999999;
    width: fit-content;
    font-size: 14px;
`;