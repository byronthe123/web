import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';
import { atom, useRecoilState } from 'recoil'

import BackButton from '../custom/BackButton';
import { Button } from 'reactstrap';
import ActionIcon from './ActionIcon';

interface Props {
    modal: boolean;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    message: string;
    confirm: () => any;
}

export default function ModalConfirmation ({
    modal, 
    setModal,
    message,
    confirm
}: Props) {

    const toggle = () => setModal(!modal);
    const handleClick = async () => {
        await confirm();
        toggle();
    }

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>Confirmation</h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <h4>{message}</h4>
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <FooterButtonsContainer>
                        <ActionIcon 
                            type={'cancel'}
                            onClick={toggle}
                        />
                        <ActionIcon 
                            type={'check'}
                            onClick={() => handleClick()}
                        />
                    </FooterButtonsContainer>
                </FooterContentContainer>
            </ExpandedFooter>
        </Modal>
    );
}

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const CustomBody = styled(ModalBody)`
    text-align: center;
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