import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';

import BackButton from '../custom/BackButton';

export default function NewModal ({
    modal,
    setModal
}) {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <FooterHeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2 pt-2'}></h4>
                </FooterHeaderContainer>
            </ModalHeader>
            <ModalBody>
                
            </ModalBody>
            <ModalFooter>
            <ExpandedFooter>
                <FooterContentContainer>

                </FooterContentContainer>
            </ExpandedFooter>
            </ModalFooter>
        </Modal>
    );
}

const ExpandedFooter = styled(ModalFooter)`
    width: 100%;

`;

const FooterHeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const FooterContentContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;