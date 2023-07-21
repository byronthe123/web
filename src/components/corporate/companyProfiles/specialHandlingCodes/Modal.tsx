import React, { useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup } from 'reactstrap';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import BackButton from '../../../custom/BackButton';
import ActionIcon from '../../../custom/ActionIcon';
import { createdUpdatedInfo, getDate } from '../../../../utils';
import { ISpecialHandlingCode, IUser } from '../../../../globals/interfaces';
import { Input, Textarea } from '../../../custom/hookForm/Input';
import { CheckFormGroup, CustomCheckBox } from '../../../custom/hookForm/Checkbox';
import { createSchema, updateSchema } from './utils';
import FormError from '../../../custom/FormError';
import _ from 'lodash';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    selectedItem?: ISpecialHandlingCode;
    user: IUser;
    createUpdateShc: (data: ISpecialHandlingCode, update: boolean) => Promise<void>;
    deleteShc: (id: number) => Promise<void>;
}

export default function ModalManage ({
    modal,
    setModal,
    selectedItem,
    user,
    createUpdateShc,
    deleteShc
}: Props) {

    const update = selectedItem?.id !== undefined;

    const {
        register,
        handleSubmit,
        trigger,
        reset,
        formState: { isValid, isDirty, errors },
    } = useForm({
        mode: 'onTouched',
        resolver: update
            ? yupResolver(updateSchema)
            : yupResolver(createSchema),
    });

    useEffect(() => {
        const now = getDate();
        if (update) {
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
    }, [update, selectedItem, trigger, user.s_email, reset]);

    const toggle = () => setModal(!modal);

    const submit = (data: any) => {
        createUpdateShc(data, update);
    }

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>
                        {update ? 'Update' : 'Create'} Special Handling Code
                    </h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label>Special Handling Code <FormError message={errors['s_special_handling_code']?.message as string | undefined} /> </Label>
                    <Input
                        {...register('s_special_handling_code')}
                        error={Boolean(errors['s_special_handling_code'])}
                        maxLength={3}
                    />
                </FormGroup>
                <FormGroup>
                    <CheckFormGroup>
                        <CustomCheckBox 
                            type={'checkbox'}
                            {...register('b_dg')}
                        />
                        <Label check>DG</Label>
                    </CheckFormGroup>
                </FormGroup>
                <FormGroup>
                    <CheckFormGroup>
                        <CustomCheckBox 
                            type={'checkbox'}
                            {...register('b_requires_refrigeration')}
                        />
                        <Label check>Requires Refrigeration</Label>
                    </CheckFormGroup>
                </FormGroup>
                <FormGroup>
                    <Label>DG Class</Label>
                    <Textarea
                        {...register('s_dg_class')}
                        error={Boolean(errors['s_dg_class'])}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Description</Label>
                    <Textarea
                        {...register('s_description')}
                        error={Boolean(errors['s_description'])}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Example</Label>
                    <Textarea
                        {...register('s_example')}
                        error={Boolean(errors['s_example'])}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Detail</Label>
                    <Textarea
                        {...register('s_detail')}
                        error={Boolean(errors['s_detail'])}
                    />
                </FormGroup>
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    {update && (
                        <Label>{createdUpdatedInfo(selectedItem)}</Label>
                    )}
                    <FooterButtonsContainer>
                        <ActionIcon 
                            type={'delete'} 
                            onClick={() => selectedItem && deleteShc(selectedItem.id)}
                            disabled={!update}
                        />
                        <ActionIcon 
                            type={'save'} 
                            onClick={handleSubmit(submit)} 
                            disabled={!isDirty || !isValid}
                        />
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
