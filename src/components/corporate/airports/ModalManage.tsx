import React, { useEffect, useState } from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import BackButton from '../../custom/BackButton';
import ActionIcon from '../../custom/ActionIcon';
import { createdUpdatedInfo, getTsDate } from '../../../utils';
import { IAirport, IUser } from '../../../globals/interfaces';
import { Input } from 'reactstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import FormGroup from '../../custom/hookForm/FormGroup';
import { createSchema, updateSchema } from './utils';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    user: IUser;
    createAirport: (data: any) => Promise<void>;
    updateAirport: (data: any) => Promise<void>;
    deleteAirport: (id: number) => Promise<void>;
    selectedItem?: IAirport;
}

export default function ModalManage({
    modal,
    setModal,
    user,
    createAirport,
    updateAirport,
    deleteAirport,
    selectedItem,
}: Props) {
    const {
        register,
        control,
        reset,
        trigger,
        handleSubmit,
        formState: { isValid, isDirty, errors },
    } = useForm({
        mode: 'onChange',
        resolver: selectedItem
            ? yupResolver(updateSchema)
            : yupResolver(createSchema),
    });

    const toggle = () => setModal(!modal);

    useEffect(() => {
        if (selectedItem) {
            const copy = _.cloneDeep(selectedItem);
            copy.modifiedAt = getTsDate();
            copy.modifiedBy = user.s_email;
            reset(copy);
        } else {
            reset({
                createdBy: user.s_email,
                createdAt: getTsDate(),
                modifiedBy: user.s_email,
                modifiedAt: getTsDate(),
                code: '',
                icao: '',
                name: '',
                countryCode: '',
                country: '',
                cityCode: '',
                city: '',
            });
        }
    }, [selectedItem]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>
                        {selectedItem ? 'Update' : 'Create'} Airport
                    </h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <FormGroup
                    label={'Code'}
                    name={'code'}
                    register={register}
                    errors={errors}
                />
                <FormGroup
                    label={'ICAO'}
                    name={'icao'}
                    register={register}
                    errors={errors}
                />
                <FormGroup
                    label={'Name'}
                    name={'name'}
                    register={register}
                    errors={errors}
                />
                <FormGroup
                    label={'Country Code'}
                    name={'countryCode'}
                    register={register}
                    errors={errors}
                />
                <FormGroup
                    label={'Country'}
                    name={'country'}
                    register={register}
                    errors={errors}
                />
                <FormGroup
                    label={'City Code'}
                    name={'cityCode'}
                    register={register}
                    errors={errors}
                />
                <FormGroup
                    label={'City'}
                    name={'city'}
                    register={register}
                    errors={errors}
                />
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <Label>{createdUpdatedInfo(selectedItem, true)}</Label>
                    <FooterButtonsContainer>
                        <ActionIcon
                            type={'delete'}
                            disabled={!selectedItem}
                            onClick={() =>
                                selectedItem && deleteAirport(selectedItem.id)
                            }
                        />
                        <ActionIcon
                            type={'save'}
                            onClick={
                                selectedItem
                                    ? handleSubmit(updateAirport)
                                    : handleSubmit(createAirport)
                            }
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

const FooterButtonsContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;
