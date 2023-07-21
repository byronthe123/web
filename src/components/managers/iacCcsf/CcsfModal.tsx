import React, { useEffect } from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import BackButton from '../../custom/BackButton';
import ActionIcon from '../../custom/ActionIcon';
import FormGroup from '../../custom/hookForm/FormGroup';
import { createdUpdatedInfo } from '../../../utils';
import { ICcsf, IUser } from '../../../globals/interfaces';
import { createCcsfSchema, updateCcsfSchema } from './utils';
import dayjs from 'dayjs';
import _ from 'lodash';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    handleCreateUpdate: (update: boolean, data: ICcsf) => void;
    deleteItem: (id: number) => Promise<void>;
    user: IUser;
    selectedItem?: ICcsf;
}

export default function IacModal ({
    modal,
    setModal,
    handleCreateUpdate,
    deleteItem,
    user,
    selectedItem
}: Props) {

    const update = selectedItem !== undefined;

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        getValues
    } = useForm({
        mode: 'onChange',
        resolver: update ? yupResolver(updateCcsfSchema) : yupResolver(createCcsfSchema)
    });

    useEffect(() => {
        const now = dayjs().format('MM/DD/YYYY HH:mm');
        if (selectedItem) {
            const selectedItemCopy = _.cloneDeep(selectedItem);
            selectedItemCopy.ccsf_expiration_date = dayjs(selectedItemCopy.ccsf_expiration_date).format('YYYY-MM-DD');
            selectedItemCopy.s_modified_by = user.s_email;
            selectedItemCopy.t_modified = now;
            reset(selectedItemCopy);
        } else {
            reset({
                s_created_by: user.s_email,
                t_created: now,
                s_modified_by: user.s_email,
                t_modified: now,
            });
        }
    }, [modal, selectedItem, user.s_email, reset]);

    const toggle = () => setModal(!modal);

    const submitHandler = (data: any) => {
        handleCreateUpdate(update, data);
    }

    console.log(errors, isValid);
    console.log(getValues())

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>{update ? 'Update' : 'Create'} Item</h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <FormGroup 
                    label={'Approval Number'}
                    register={register}
                    name={'approval_number'}
                    errors={errors}
                />
                <FormGroup 
                    label={'IAC Number'}
                    register={register}
                    name={'iac_number'}
                    errors={errors}
                />
                <FormGroup 
                    label={'Certified Cargo Screening Facility'}
                    register={register}
                    name={'certified_cargo_screening_facility_name'}
                    errors={errors}
                />
                <FormGroup 
                    label={'Street'}
                    register={register}
                    name={'street_address'}
                    errors={errors}
                />
                <FlexContainer>
                    <FormGroup 
                        label={'City'}
                        register={register}
                        name={'city'}
                        errors={errors}
                    />
                    <FormGroup 
                        label={'State'}
                        register={register}
                        name={'state'}
                        errors={errors}
                    />
                </FlexContainer>
                <FormGroup 
                    label={'Expiration Date'}
                    register={register}
                    name={'ccsf_expiration_date'}
                    errors={errors}
                    type={'date'}
                />
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    {
                        selectedItem && (
                            <Label>
                                {createdUpdatedInfo(selectedItem)}
                            </Label>
                        )
                    }
                    <FooterButtonsContainer
                        update={update}
                    >
                        {
                            (update && selectedItem) && (
                                <ActionIcon 
                                    type={'delete'} 
                                    onClick={() => deleteItem(selectedItem.id)}
                                />
                            )
                        }
                        <ActionIcon 
                            type={'save'} 
                            onClick={handleSubmit(submitHandler)} 
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

const FooterButtonsContainer = styled.div<{update: boolean}>`
    width: 100%;
    display: flex;
    justify-content: ${p => p.update ? 'space-between' : 'flex-end'};
`;

const FlexContainer = styled.div`
    display: flex;
    gap: 10px;
`;