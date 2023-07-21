import React from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';

import BackButton from '../custom/BackButton';
import { formatDatetime, formatEmail } from '../../utils';
import { IEmployee, IEmployeeLog } from '../../globals/interfaces';
import _ from 'lodash';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    selectedEmployee: IEmployee | undefined;
    selectedLog: IEmployeeLog | undefined;

}

export default function ModalEmployeeLog ({
    modal,
    setModal,
    selectedEmployee,
    selectedLog
}: Props) {

    const toggle = () => setModal(!modal);

    if (!selectedLog || !selectedEmployee) return null;

    const parts = selectedLog.changes.split(' - ');
    let sections: Array<string> = [];

    if (parts && parts.length > 1) {
        sections = parts[1].split(';');
    }

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>Employee Log for {selectedEmployee.s_first_name} {selectedEmployee.s_last_name}</h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                {
                    parts.length > 1 ? (
                        <div>
                            <h6>Changes made to the following fields:</h6>
                            <ol>
                            {
                                sections.map((section, i) => section.length > 1 && (
                                    <li key={i}>{section}</li>
                                ))
                            }
                            </ol>
                        </div>
                    ) : (
                        <h6>{selectedLog.changes}</h6>
                    )
                }
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <Label>
                        Changes made by {formatEmail(selectedLog.createdBy)} on {formatDatetime(selectedLog.created)}
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