import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup as BtFormGroup,
    Input,
    Label,
} from 'reactstrap';
import styled from 'styled-components';
import FileBase64 from 'react-file-base64';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';

import BackButton from '../custom/BackButton';
import ActionIcon from '../custom/ActionIcon';
import { createdUpdatedInfo, getDate } from '../../utils';
import { IMenuApp, IUser, MenuAppType } from '../../globals/interfaces';
import FormError from '../custom/FormError';
import FormGroup from '../custom/hookForm/FormGroup';
import { createSchema, updateSchema } from './utils';
import { CreateUpdate, Delete } from './interfaces';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    indexNum: number;
    type: MenuAppType;
    user: IUser;
    selectedItem?: IMenuApp;
    createUpdateMenuItem: CreateUpdate;
    deleteMenuItem: Delete;
}

export default function ModalManageMenu({
    modal,
    setModal,
    indexNum,
    type,
    user,
    selectedItem,
    createUpdateMenuItem,
    deleteMenuItem
}: Props) {

    const update =
        selectedItem && Object.keys(selectedItem).length > 0 ? true : false;

    const {
        register,
        control,
        reset,
        trigger,
        handleSubmit,
        formState: { isValid, isDirty, errors },
    } = useForm({
        mode: 'onChange',
        resolver: update
            ? yupResolver(updateSchema)
            : yupResolver(createSchema),
    });

    useEffect(() => {
        if (selectedItem) {
            const copy = _.cloneDeep(selectedItem);
            copy.modifiedAt = getDate();
            copy.modifiedBy = user.s_email;
            reset(copy);
        } else {
            reset({
                createdBy: user.s_email,
                createdAt: getDate(),
                modifiedBy: user.s_email,
                modifiedAt: getDate(),
                indexNum,
                type
            });
        }
        trigger();
    }, [modal, reset, trigger, selectedItem, user.s_email, indexNum, type]);

    const handleCreateUpdate = (data: any) => {
        createUpdateMenuItem(data, update);
    };

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>{update ? 'Update' : 'Add'} App</h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <FormGroup
                    label={'Title'}
                    name={'title'}
                    register={register}
                    errors={errors}
                />
                <FormGroup
                    label={'Link'}
                    name={'link'}
                    register={register}
                    errors={errors}
                />
                {type === 'SYSTEM' && (
                    <BtFormGroup>
                        <Label className={'d-block'}>
                            Upload {selectedItem?.logoUrl ? ' New ' : ''} Logo{' '}
                            <FormError
                                message={
                                    errors['file']
                                        ? 'Logo is required for SYSTEM apps'
                                        : ''
                                }
                            />
                        </Label>
                        <Controller
                            control={control}
                            name={'file'}
                            render={({ field: { onChange } }) => (
                                <FileBase64 onDone={onChange} />
                            )}
                        />
                    </BtFormGroup>
                )}
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    {selectedItem && (
                        <Label>{createdUpdatedInfo(selectedItem, true)}</Label>
                    )}
                    <FooterButtonsContainer>
                        <ActionIcon
                            type={'delete'}
                            onClick={() => selectedItem && deleteMenuItem(selectedItem?.id, selectedItem?.type)}
                            disabled={!selectedItem}
                        />
                        <ActionIcon
                            type={'save'}
                            onClick={handleSubmit(handleCreateUpdate)}
                            disabled={!isValid}
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
