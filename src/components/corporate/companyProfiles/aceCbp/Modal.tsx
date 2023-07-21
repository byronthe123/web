import React, { useEffect, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label } from 'reactstrap';
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from 'dayjs';

import { createSchema, updateSchema } from './utils';
import BackButton from '../../../custom/BackButton';
import ActionIcon from '../../../custom/ActionIcon';
import { ICbpAceCode, IUser } from '../../../../globals/interfaces';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    selectedItem: ICbpAceCode | undefined;
    update: boolean;
    user: IUser;
    createUpdateData: (data: any) => Promise<void>;
    deleteCbpAceCode: (id: number) => Promise<void>;
}

export default function ModalManage ({
    modal,
    setModal,
    selectedItem,
    update,
    user,
    createUpdateData,
    deleteCbpAceCode
}: Props) {

    const { register, reset, handleSubmit, formState: { isDirty, isValid }, trigger } = useForm({
        defaultValues: useMemo(() => {
            if (update && selectedItem) {
                return selectedItem;
            } else {
                return undefined;
            }
        }, [selectedItem, update]),
        resolver: update ? yupResolver(updateSchema) : yupResolver(createSchema),
        mode: 'all'
    });

    useEffect(() => {
        const now = dayjs().local().format('MM/DD/YYYY HH:mm');
        if (update && selectedItem) {
            selectedItem.t_modified = now;
            selectedItem.s_modified_by = user.s_email;
            reset(selectedItem);
        } else {
            reset({
                t_created: now,
                s_created_by: user.s_email,
                t_modified: now,
                s_modified_by: user.s_email
            });
        }
        trigger();
    }, [selectedItem, update, user]);

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <FooterHeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2 pt-2'}>
                        {update ? 'Update' : 'Create'} Disposition Code
                    </h4>
                </FooterHeaderContainer>
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label>Code</Label>
                    <InputCode {...register('s_code')} className={'form-control'} />
                </FormGroup>
                <CheckBoxContainer>
                    <CheckFormGroup>
                        <CustomCheckBox type="checkbox" {...register('b_usda_hold')} className={'form-control'} />
                        {' '}
                        <Label check>   
                            Customs Hold
                        </Label>
                    </CheckFormGroup>
                    <CheckFormGroup>
                        <CustomCheckBox type="checkbox" {...register('b_customs_hold')} className={'form-control'} />
                        {' '}
                        <Label check>   
                            USDA Hold
                        </Label>
                    </CheckFormGroup>
                    <CheckFormGroup>
                        <CustomCheckBox type="checkbox" {...register('b_hold')} className={'form-control'} />
                        {' '}
                        <Label check>   
                            Choice Hold
                        </Label>
                    </CheckFormGroup>
                    <CheckFormGroup>
                        <CustomCheckBox type="checkbox" {...register('b_general_order')} className={'form-control'} />
                        {' '}
                        <Label check>   
                            General Order
                        </Label>
                    </CheckFormGroup>
                </CheckBoxContainer>
                <FormGroup>
                    <Label>Description</Label>
                    <textarea {...register('s_description')} className={'form-control'} />
                </FormGroup>
                <FormGroup>
                    <Label>Reason</Label>
                    <textarea {...register('s_reason')} className={'form-control'} />
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <FooterContentContainer>
                    {
                        (update && selectedItem) &&
                        <Label>Modified by {selectedItem.s_modified_by} at {dayjs.utc(selectedItem.t_modified).format('MM/DD/YYYY HH:mm')}</Label>
                    }
                    <FooterButtonsContainer>
                        <ActionIcon 
                            type={'delete'}
                            onClick={() => selectedItem && deleteCbpAceCode(selectedItem.id)}
                            disabled={!selectedItem}
                        />
                        <ActionIcon 
                            type={'save'}
                            onClick={handleSubmit(createUpdateData)}
                            disabled={!isValid || !isDirty}
                        />
                    </FooterButtonsContainer>
                </FooterContentContainer>
            </ModalFooter>
        </Modal>
    );
}

const InputCode = styled.input`
    width: 200px;
`;

const CheckBoxContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const CustomCheckBox = styled.input`
    width: 30px;
`;

const CheckFormGroup = styled(FormGroup)`
    display: flex;
    align-items: center;
`;

const FooterHeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const FooterContentContainer = styled.div`
    width: 100%;
`;

const FooterButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;