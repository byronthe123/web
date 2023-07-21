import React from 'react';
import { Modal, ModalBody, Button } from 'reactstrap';
import styled from 'styled-components';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    manageAlert: (resetForm: boolean) => void;
}

export default function NewModal({ modal, setModal, manageAlert }: Props) {
    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalBody className={'text-center'}>
                <h1>Do you want to edit this MAWB or add a new MAWB?</h1>
                <ButtonsContainer>
                    <Button onClick={() => manageAlert(false)} color={'warning'}>
                        EDIT THIS MAWB
                    </Button>
                    <Button onClick={() => manageAlert(true)}>
                        ADD NEW MAWB
                    </Button>
                </ButtonsContainer>
            </ModalBody>
        </Modal>
    );
}

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;
