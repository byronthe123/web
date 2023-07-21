import React from 'react';
import { Modal, ModalHeader, ModalBody, Label } from 'reactstrap';
import styled from 'styled-components';

import BackButton from '../custom/BackButton';
import { formatDatetime, formatEmail, formatMawb } from '../../utils';
import { ILog } from '../../globals/interfaces';
import { Table } from 'reactstrap';
import { ModalFooter } from 'reactstrap';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    selectedItem: ILog | undefined;
}

export default function LogModal ({
    modal,
    setModal,
    selectedItem
}: Props) {

    const toggle = () => setModal(!modal);

    if (selectedItem) {
        return (
            <Modal isOpen={modal} toggle={toggle} size={'lg'}>
                <ModalHeader className={'d-flex'}>
                    <HeaderContainer>
                        <BackButton onClick={toggle} />
                        <h4 className={'pl-2'}>Log</h4>
                    </HeaderContainer>
                </ModalHeader>
                <CustomModalBody>
                    <div className={'d-flex justify-content-between'}>
                        <Label>MAWB: {formatMawb(selectedItem.s_mawb)}</Label>
                        <Label>HAWB: {selectedItem.s_hawb}</Label>
                        <Label>Priority: {selectedItem.s_priority}</Label>
                    </div>
                    <div className={'d-flex'}>
                        <Label>Notes: </Label>
                        <NotesContainer>
                            {selectedItem.s_notes}
                        </NotesContainer>
                    </div>
                    <div className={'d-flex'}>
                        <Label>Page: {selectedItem.s_page}</Label>
                    </div>
                </CustomModalBody>
                <ExpandedFooter>
                    <FooterContentContainer>
                        <Label>Created by {formatEmail(selectedItem.s_created_by)} on {formatDatetime(selectedItem.t_created)}</Label>
                    </FooterContentContainer>
                </ExpandedFooter>
            </Modal>
        );    
    }
    return null;
}

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: space-between;
`;

const NotesContainer = styled.div`
    flex: 1;
    margin-left: 5px;
    margin-bottom: 5px;
`;

const ExpandedFooter = styled(ModalFooter)`
    width: 100%;
`;

const FooterContentContainer = styled.div`
    width: 100%;
`;

const CustomModalBody = styled(ModalBody)`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;