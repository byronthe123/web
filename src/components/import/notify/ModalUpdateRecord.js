import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input
  } from "reactstrap";
import styled from 'styled-components';

import BackButton from '../../custom/BackButton';
import ActionIcon from '../../custom/ActionIcon';
import moment from 'moment';

export default function ModalUpdateRecord ({
    open, 
    handleModal,
    selectedItem,
    initialValue,
    updateType,
    updateValue,
    setUpdateValue,
    handleUpdateRecord,
    launchModalDeleteRecord,
    blacklist
}) {

    const toggle = () => handleModal(false);

    const resolveUpdateTypeTitle = () => {
        if (updateType) {
            const stringArray = Array.from(updateType);
            stringArray[0] = stringArray[0].toUpperCase();
            return stringArray.toString().replace(/,/g, '');
        }
    }

    const enableUpdateRecord = () => {
        if (updateType === 'phone') {
            return initialValue !== updateValue && updateValue.length >= 10;
        } 
        return initialValue !== updateValue;
    }

    return (
        <Modal isOpen={open} toggle={toggle} style={{ maxWidth: '550px' }}>
            <ModalHeader>
                <FooterHeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2 pt-2'}>Update {resolveUpdateTypeTitle()}</h4>
                </FooterHeaderContainer>
            </ModalHeader>
            <ModalBody>
                {
                    selectedItem && 
                        <h6>Last modified by {selectedItem.s_modified_by} at {moment(selectedItem.t_modified).utc().format('MM/DD/YYYY HH:mm')}</h6>
                }
                <Input 
                    type={'text'} 
                    value={updateValue} 
                    onChange={(e) => setUpdateValue(e.target.value)} 
                />
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <ActionIcon 
                        type={'delete'}
                        onClick={() => launchModalDeleteRecord()}
                    />
                    <ActionIcon 
                        type={'save'}
                        onClick={() => handleUpdateRecord()}
                        disabled={!enableUpdateRecord()}
                    />
                </FooterContentContainer>
            </ExpandedFooter>
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