import React from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import styled from 'styled-components';

import BackButton from '../../custom/BackButton';
import ActionIcon from '../../custom/ActionIcon';
import { createdUpdatedInfo } from '../../../utils';
import { IFHL, IRack } from '../../../globals/interfaces';
import { FormGroup } from 'reactstrap';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    selectedLocation: IRack | undefined;
    fhls: Array<IFHL>;
    updateLocationPcs: number | string;
    setUpdateLocationPcs: React.Dispatch<React.SetStateAction<number | string>>;
    updateLocationHawb: string;
    setUpdateLocationHawb: React.Dispatch<React.SetStateAction<string>>;
    deliverHawbUpdateLocation: () => Promise<void>;
}

export default function ModalUpdateLocation({
    modal,
    setModal,
    selectedLocation,
    fhls,
    updateLocationPcs,
    setUpdateLocationPcs,
    updateLocationHawb,
    setUpdateLocationHawb,
    deliverHawbUpdateLocation,
}: Props) {
    const toggle = () => setModal(!modal);

    const enableSubmit =
        updateLocationHawb !== selectedLocation?.s_hawb ||
        (Number(updateLocationPcs) > 0 &&
            Number(updateLocationPcs) !== Number(selectedLocation.i_pieces));

    if (selectedLocation) {
        return (
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader className={'d-flex'}>
                    <HeaderContainer>
                        <BackButton onClick={toggle} />
                        <h4 className={'pl-2'}>Update Location</h4>
                    </HeaderContainer>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>MAWB: {selectedLocation.s_mawb}</Label>
                    </FormGroup>
                    <FormGroup>
                        <Label>HAWB:</Label>
                        <Input
                            type={'select'}
                            value={updateLocationHawb}
                            onChange={(e: any) =>
                                setUpdateLocationHawb(e.target.value)
                            }
                        >
                            <option value={selectedLocation.s_hawb}>
                                {selectedLocation.s_hawb}
                            </option>
                            {fhls.map((fhl, i) => fhl.s_hawb !== selectedLocation.s_hawb && (
                                <option value={fhl.s_hawb} key={i}>
                                    {fhl.s_hawb}
                                </option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Location: {selectedLocation.s_location}</Label>
                    </FormGroup>
                    <Label>Pieces: </Label>
                    <Input
                        type={'number'}
                        value={updateLocationPcs}
                        onChange={(e: any) =>
                            setUpdateLocationPcs(e.target.value)
                        }
                    />
                </ModalBody>
                <ExpandedFooter>
                    <FooterContentContainer>
                        <Label>{createdUpdatedInfo(selectedLocation)}</Label>
                        <FooterButtonsContainer>
                            <ActionIcon
                                type={'save'}
                                onClick={() => deliverHawbUpdateLocation()}
                                disabled={!enableSubmit}
                            />
                        </FooterButtonsContainer>
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
