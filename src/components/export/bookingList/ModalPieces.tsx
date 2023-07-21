import React from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';

import ReactTable from '../../custom/ReactTable';
import BackButton from '../../custom/BackButton';
import { createdUpdatedInfo } from '../../../utils';
import { IExtendedBooking } from '../booking/interfaces';
import { bookingMawbPiecesMapping } from '../booking/tableMapping';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    selectedBooking: IExtendedBooking | undefined;
}

export default function ModalPieces ({
    modal,
    setModal,
    selectedBooking
}: Props) {

    const toggle = () => setModal(!modal);

    if (!selectedBooking) {
        return null;
    }

    return (
        <Modal isOpen={modal} toggle={toggle} className={'responsive-modal'}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>Booking Pieces</h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <ReactTable
                    data={selectedBooking.bookingMawbPieces || []}
                    mapping={bookingMawbPiecesMapping}
                    numRows={10}
                    index
                />
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <Label>
                        {createdUpdatedInfo(selectedBooking)}
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

const FooterButtonsContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;