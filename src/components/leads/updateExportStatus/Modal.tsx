import React, { useState, useMemo, useEffect } from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import styled from 'styled-components';
import Select from 'react-select';

import BackButton from '../../custom/BackButton';
import { IExport, ISelectOption, IUser } from '../../../globals/interfaces';
import { api, createdUpdatedInfo, formatMawb, getDate } from '../../../utils';
import ActionIcon from '../../custom/ActionIcon';
import _ from 'lodash';
import { FormGroup } from 'reactstrap';

const selectStatusOptions: Array<ISelectOption> = [{
    label: 'ACCEPTED',
    value: 'ACCEPTED'
}, {
    label: 'DELIVERED',
    value: 'DELIVERED'
}, {
    label: 'DOCK REJECTED',
    value: 'DOCK REJECTED'
}, {
    label: 'DOCUMENTED',
    value: 'DOCUMENTED'
}, {
    label: 'NOT ACCEPTED FULLY',
    value: 'NOT ACCEPTED FULLY'
}, {
    label: 'REJECTED',
    value: 'REJECTED'
}]

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    selectedItem: IExport | undefined;
    setAwbs: React.Dispatch<React.SetStateAction<Array<IExport>>>;
    user: IUser;
}

export default function ModalManage ({
    modal,
    setModal,
    selectedItem,
    setAwbs,
    user
}: Props) {

    const displayOptions: Array<ISelectOption> = useMemo(() => {
        if (selectedItem) {
            const filtered = selectStatusOptions.filter(o => o.value !== selectedItem.s_status);
            return filtered;
        }
        return [];
    }, [selectedItem]);

    const [selectedOption, setSelectedOption] = useState<ISelectOption>();

    const [s_notes, set_s_notes] = useState('');

    useEffect(() => {
        selectedItem && set_s_notes(selectedItem.s_notes);
    }, [selectedItem]);

    useEffect(() => {
        setSelectedOption(undefined);
    }, [modal]);

    const updateExportAwb = async () => {
        if (selectedItem && selectedOption) {
            const values = {
                i_id: selectedItem.i_id,
                s_notes,
                s_status: selectedOption.value,
                s_modified_by: user.s_email,
                t_modified: getDate()
            }
            await api('put', 'updateExportStatus', values);
            setModal(false);
            setAwbs(prev => (
                prev.map(awb => {
                    if (awb.i_id === selectedItem.i_id) {
                        const copy = _.cloneDeep(awb);
                        for (const key in values) {
                            // @ts-ignore
                            copy[key] = values[key];
                        }
                        return copy;
                    } else {
                        return awb;
                    }
                })
            ))
        }
    }

    const toggle = () => setModal(!modal);

    if (selectedItem) {
        return (
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader className={'d-flex'}>
                    <HeaderContainer>
                        <BackButton onClick={toggle} />
                        <div className={'pl-2'}>
                            <h4>Update Export Acceptance Status:</h4>
                            <h4>{formatMawb(selectedItem.s_mawb)}</h4>
                        </div>
                    </HeaderContainer>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>Current Status: {selectedItem.s_status}</Label>
                        <Select 
                            value={selectedOption}
                            onChange={setSelectedOption}
                            options={displayOptions}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Notes</Label>
                        <Input type={'textarea'} value={s_notes} onChange={(e: any) => set_s_notes(e.target.value)} />
                    </FormGroup>
                </ModalBody>
                <ExpandedFooter>
                    <FooterContentContainer>
                        <Label>{createdUpdatedInfo(selectedItem)}</Label>
                        <FooterButtonsContainer>
                            <ActionIcon 
                                type={'save'} 
                                onClick={updateExportAwb} 
                                disabled={!selectedOption}
                            />
                        </FooterButtonsContainer>
                    </FooterContentContainer>
                </ExpandedFooter>
            </Modal>
        );
    } else {
        return null;
    }
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