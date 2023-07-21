import React from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';

import BackButton from '../custom/BackButton';
import ActionIcon from '../custom/ActionIcon';
import { createdUpdatedInfo } from '../../utils';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
}

export default function NewModal ({
    modal,
    setModal
}: Props) {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}></h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>

            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <Label>
                        {createdUpdatedInfo({})}
                    </Label>
                    <FooterButtonsContainer>
                        <ActionIcon type={'save'} onClick={() => {}} />
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

const ExpandedFooter = styled(ModalFooter)`
    width: 100%;
`;

const FooterContentContainer = styled.div`
    width: 100%;
`;

const FooterButtonsContainer = styled.div<{update?: boolean}>`
    width: 100%;
    display: flex;
    justify-content: ${p => p.update ? 'space-between' : 'flex-end'};
`;