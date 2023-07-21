import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, Input } from 'reactstrap';
import styled from 'styled-components';

import BackButton from '../../../components/custom/BackButton';
import ActionIcon from '../../../components/custom/ActionIcon';
import { createdUpdatedInfo } from '../../../utils';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    customer: string,
    setCustomer: React.Dispatch<React.SetStateAction<string>>;
    directDeliver: () => Promise<void>;
}

export default function ModalDeliver ({
    modal,
    setModal,
    customer,
    setCustomer,
    directDeliver
}: Props) {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>Confirm Direct Deliver to Customer</h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <Label>Delivering to</Label>
                <Input type={'text'} value={customer} onChange={(e: any) => setCustomer(e.target.value)} />
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <FooterButtonsContainer>
                        <ActionIcon type={'save'} onClick={() => directDeliver()} />
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

const FooterButtonsContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;