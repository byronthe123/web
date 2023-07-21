import React from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';

import { ITaskItem } from '../../../globals/interfaces';
import { formatDatetime } from '../../../utils';
import BackButton from '../../../components/custom/BackButton';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    workItem: ITaskItem | undefined;
}

export default function TaskModal ({
    modal,
    setModal,
    workItem
}: Props) {

    const toggle = () => setModal(!modal);

    if (!workItem) return null;

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>{workItem.id} {workItem.title}</h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <ContentDiv dangerouslySetInnerHTML={{
                    __html: workItem.description
                }}></ContentDiv>
                <h6>Assigned to: {workItem.assignedTo}</h6>
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <Label>
                        Last Modified: {formatDatetime(workItem.changedDate, true)}
                    </Label>
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

const ContentDiv = styled.div`
    img {
        max-width: 100%;
        height: auto;
    }
`;

const FooterButtonsContainer = styled.div<{update?: boolean}>`
    width: 100%;
    display: flex;
    justify-content: ${p => p.update ? 'space-between' : 'flex-end'};
`;