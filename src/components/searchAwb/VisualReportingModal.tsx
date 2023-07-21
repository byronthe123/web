import React from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';

import BackButton from '../custom/BackButton';
import ActionIcon from '../custom/ActionIcon';
import { createdUpdatedInfo } from '../../utils';
import { IVisualReporting } from '../../globals/interfaces';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    item: IVisualReporting | undefined;
}

export default function NewModal ({
    modal,
    setModal,
    item
}: Props) {

    const toggle = () => setModal(!modal);

    if (item) {
        return (
            <Modal isOpen={modal} toggle={toggle} size={'lg'}>
                <ModalHeader className={'d-flex'}>
                    <HeaderContainer>
                        <BackButton onClick={toggle} />
                        <h4 className={'pl-2'}>{item.awb_uld}</h4>
                    </HeaderContainer>
                </ModalHeader>
                <ModalBody>
                    <Img src={item.file_link} />
                </ModalBody>
            </Modal>
        );
    }

    return null;

}

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const Img = styled.img`
    width: 100%;
    height: auto;
`;