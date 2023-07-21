import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';
import BackButton from '../custom/BackButton';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    headerContent: React.ReactNode;
    bodyContent: React.ReactNode;
    footerContent: React.ReactNode;
    width?: number;
    responsive?: boolean;
}

export default function NewModal ({
    modal,
    setModal,
    headerContent,
    bodyContent,
    footerContent,
    width,
    responsive
}: Props) {

    const toggle = () => setModal(!modal);

    return (
        <ModalContainer 
            isOpen={modal} 
            toggle={toggle} 
            width={width}
            responsive={responsive}
        >
            <ModalHeader className={'d-flex'}>
                <BackButton 
                    onClick={toggle} 
                    classNames={'pr-2'}
                />
                { headerContent }
            </ModalHeader>
            <ModalBody>
                { bodyContent }
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    { footerContent }
                </FooterContentContainer>
            </ExpandedFooter>
        </ModalContainer>
    );
}

const ModalContainer = styled(Modal)`
    width: ${p => p.width + 'px'};
    max-width: ${p => p.responsive && '80%'};
`;

const ExpandedFooter = styled(ModalFooter)`
    width: 100%;
`;

const FooterContentContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;