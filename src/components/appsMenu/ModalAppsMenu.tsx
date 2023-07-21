import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Modal } from 'reactstrap';

import useMenuAppsData from './useMenuAppsData';
import { IMenuApp, IMenuApps, MenuAppType } from '../../globals/interfaces';
import { HandleCreateUpdate } from './interfaces';
import { ModalBody } from 'reactstrap';
import { useAppContext } from '../../context';
import ModalManageMenu from './ModalManageMenu';
import { api } from '../../utils';
import _ from 'lodash';
import useDev from '../../customHooks/useDev';
import RenderApps from './RenderApps';
import ModalLoading from '../custom/ModalLoading';

interface Props {
    modal: boolean;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalAppsMenu = ({ modal, setModal }: Props) => {

    const {
        user,
        appDataLoaded,
        menuApps, 
        isDev,
        handleCreateUpdate,
        modalManageMenu,
        setModalManageMenu,
        indexNum,
        selectedType,
        selectedItem,
        createUpdateMenuItem,
        deleteMenuItem
    } = useMenuAppsData();

    const toggle = () => setModal((prev) => !prev);

    if (modal && !appDataLoaded) {
        return <ModalLoading modal={!appDataLoaded} setModal={null} />
    }

    return (
        <Fragment>
            <Modal isOpen={modal} toggle={toggle} size={'lg'}>
                <CustomModalBody isdev={isDev}>
                    <RenderApps
                        apps={menuApps.system}
                        num={12}
                        enableEdit={isDev}
                        type={'SYSTEM'}
                        handleCreateUpdate={handleCreateUpdate}
                    />
                    <RenderApps
                        apps={menuApps.user}
                        num={8}
                        enableEdit={true}
                        type={'USER'}
                        handleCreateUpdate={handleCreateUpdate}
                    />
                </CustomModalBody>
            </Modal>
            <ModalManageMenu
                modal={modalManageMenu}
                setModal={setModalManageMenu}
                indexNum={indexNum}
                type={selectedType}
                user={user}
                selectedItem={selectedItem}
                createUpdateMenuItem={createUpdateMenuItem}
                deleteMenuItem={deleteMenuItem}
            />
        </Fragment>
    );
};

const CustomModalBody = styled(ModalBody)`
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: ${(p) => (!p.isdev ? '15px' : null)};
`;

export default ModalAppsMenu;
