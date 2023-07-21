import React from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';

import BackButton from '../custom/BackButton';
import ActionIcon from '../custom/ActionIcon';
import ReactTable from '../custom/ReactTable';
import { IMenuApp, MenuAppType } from '../../globals/interfaces';
import { system, user } from './tableMapping';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    type: MenuAppType;
    apps: Array<IMenuApp>;
}

export default function NewModal ({
    modal,
    setModal,
    type,
    apps
}: Props) {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>{type === 'SYSTEM' ? 'SYSTEM' : 'MY'} Apps</h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <ReactTable 
                    data={apps}
                    mapping={type === 'SYSTEM' ? system : user}
                    numRows={10}
                    index
                />
            </ModalBody>
        </Modal>
    );
}

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const ExpandedFooter = styled(ModalFooter)`
    width: 100%;
`;

const FooterContentContainer = styled.div`
    width: 100%;
`;

const FooterButtonsContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;