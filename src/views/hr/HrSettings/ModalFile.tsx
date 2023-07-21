import React, { useEffect, useState } from 'react';
import { Label } from 'reactstrap';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup as BtFormGroup,
} from 'reactstrap';
import styled from 'styled-components';
import BackButton from '../../../components/custom/BackButton';
import ActionIcon from '../../../components/custom/ActionIcon';
import { createdUpdatedInfo, getTsDate } from '../../../utils';
import { useForm } from 'react-hook-form';
import { IHrFile, IUser, hrFileCategories } from '../../../globals/interfaces';
import { yupResolver } from '@hookform/resolvers/yup';
import { createHrFileSchema, updateHrFileSchema } from './yup';
import _ from 'lodash';
import FormInput from '../../../components/custom/hookForm/FormInput';
import CustomSwitch from '../../../components/custom/CustomSwitch';
import Switch from 'rc-switch';
import { ButtonGroup } from 'reactstrap';
import { Button } from 'reactstrap';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    user: IUser;
    selectedFile: IHrFile | undefined;
    createUpdateFile: (file: IHrFile) => Promise<void>;
    deleteFile: (id: number) => Promise<void>;
}

export default function ModalFile({
    modal,
    setModal,
    user,
    selectedFile,
    createUpdateFile,
    deleteFile,
}: Props) {
    const update = Boolean(selectedFile);

    const {
        trigger,
        formState: { errors, isValid, isDirty },
        reset,
        register,
        watch,
        setValue,
        handleSubmit,
    } = useForm<IHrFile>({
        mode: 'all',
        resolver: update
            ? yupResolver(updateHrFileSchema)
            : yupResolver(createHrFileSchema),
    });

    useEffect(() => {
        const now = getTsDate();
        if (selectedFile) {
            const copy = _.cloneDeep(selectedFile);
            copy.modified = now;
            copy.modifiedBy = user.s_email;
            reset(selectedFile);
        } else {
            reset({
                name: '',
                expires: false,
                expirationReminder: 0,
                createdBy: user.s_email,
                created: now,
                modifiedBy: user.s_email,
                modified: now,
            });
        }
        trigger();
    }, [selectedFile]);

    const expires = watch('expires');
    const category = watch('category');

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>
                        {update ? 'Update' : 'Create'} File Setting
                    </h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <FormInput<IHrFile>
                    label={'File Name'}
                    register={register}
                    name={'name'}
                    errors={errors}
                />
                <BtFormGroup>
                    <Label className={'mr-2'}>Category</Label>
                    <ButtonGroup>
                        {hrFileCategories.map((cat, i) => (
                            <Button
                                key={i}
                                onClick={() => setValue('category', cat, { shouldDirty: true, shouldValidate: true })}
                                active={category === cat}
                            >
                                {cat}
                            </Button>
                        ))}
                    </ButtonGroup>
                </BtFormGroup>
                <BtFormGroup>
                    <Label className={'mr-2'}>Expires</Label>
                    <Switch
                        checked={expires}
                        onChange={() =>
                            setValue('expires', !expires, { shouldDirty: true })
                        }
                    />
                </BtFormGroup>
                {expires && (
                    <FormInput<IHrFile>
                        label={'Expiration Reminder in Days'}
                        register={register}
                        name={'expirationReminder'}
                        errors={errors}
                    />
                )}
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <Label>{createdUpdatedInfo({})}</Label>
                    <FooterButtonsContainer update={update}>
                        {selectedFile && (
                            <ActionIcon
                                type={'delete'}
                                onClick={() => deleteFile(selectedFile.id)}
                                disabled={!update}
                            />
                        )}
                        <ActionIcon
                            type={'save'}
                            onClick={handleSubmit(createUpdateFile)}
                            disabled={!isValid || !isDirty}
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

const FooterButtonsContainer = styled.div<{ update: boolean }>`
    width: 100%;
    display: flex;
    justify-content: ${(p) => (p.update ? 'space-between' : 'flex-end')};
`;
