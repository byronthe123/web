import React, { useEffect, useState } from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';

import BackButton from '../../custom/BackButton';
import ActionIcon from '../../custom/ActionIcon';
import { createdUpdatedInfo } from '../../../utils';
import { NotificationIssue } from './Rejections';
import { ButtonGroup } from 'reactstrap';
import { Button } from 'reactstrap';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    issue: NotificationIssue | undefined;
    updateIssue: (b_resolved: boolean) => Promise<void>;
}

export default function ManageRejectionsModal({
    modal,
    setModal,
    issue,
    updateIssue
}: Props) {
    const [b_resolved, set_b_resolved] = useState(false);

    useEffect(() => {
        issue && set_b_resolved(issue?.b_resolved);
    }, [issue]);

    const toggle = () => setModal(!modal);

    if (!issue) return null;

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>Notification to {issue.s_mawb}</h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <h6>Email to {issue.s_email} failed.</h6>
                <IssueResolvedContainer>
                    <h6 className={'mr-2'}>Issue resolved?</h6>
                    <ButtonGroup>
                        <Button
                            active={!b_resolved}
                            onClick={() => set_b_resolved(false)}
                        >
                            No
                        </Button>
                        <Button
                            active={b_resolved}
                            onClick={() => set_b_resolved(true)}
                        >
                            Yes
                        </Button>
                    </ButtonGroup>
                </IssueResolvedContainer>
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <Label>{createdUpdatedInfo(issue)}</Label>
                    <FooterButtonsContainer>
                        <ActionIcon type={'save'} onClick={() => updateIssue(b_resolved)} />
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
    justify-content: flex-end;
`;

const IssueResolvedContainer = styled.div`
    display: flex;
    align-items: baseline;
`;
