import React, { useEffect, useMemo, useState } from 'react';
import { Label } from 'reactstrap';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup as BpFormGroup,
} from 'reactstrap';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';

import BackButton from '../../../custom/BackButton';
import ActionIcon from '../../../custom/ActionIcon';
import { api, createdUpdatedInfo, getDate } from '../../../../utils';
import {
    ICharge,
    ICorpStation,
    ISelectOption,
    IUser,
} from '../../../../globals/interfaces';
import _ from 'lodash';
import FormGroup from '../../../custom/hookForm/FormGroup';
import { createSchema, updateSchema } from './utils';
import FormError from '../../../custom/FormError2';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    user: IUser;
    selectedItem: ICharge | undefined;
    stations: Array<ICorpStation>;
    createUpdateCharge: (data: any, update: boolean) => Promise<void>;
    deleteCharge: (id: number) => Promise<void>;
}

export default function NewModal({
    modal,
    setModal,
    user,
    selectedItem,
    stations,
    createUpdateCharge,
    deleteCharge,
}: Props) {

    const update = selectedItem && Object.keys(selectedItem).length > 0;

    const {
        register,
        reset,
        setValue,
        handleSubmit,
        trigger,
        formState: { errors, isValid, isDirty },
    } = useForm({
        mode: 'onChange',
        resolver: update
            ? yupResolver(updateSchema)
            : yupResolver(createSchema),
    });

    const [selectedOption, setSelectedOption] = useState<ISelectOption>();

    const stationselection: Array<ISelectOption> = useMemo(() => {
        const options: Array<ISelectOption> = [{ label: '', value: NaN }];
        for (let i = 0; i < stations.length; i++) {
            options.push({
                label: stations[i].s_unit,
                value: stations[i].id,
            });
        }
        return options;
    }, [stations]);

    useEffect(() => {
        if (update) {
            const copy = _.cloneDeep(selectedItem);
            copy.s_modified_by = user.s_email;
            copy.t_modified = getDate();
            reset(copy);
            setSelectedOption({ 
                label: selectedItem.s_unit || '', 
                value: selectedItem.i_corp_station_id 
            });
        } else {
            reset({
                s_created_by: user.s_email,
                t_created: getDate(),
                s_modified_by: user.s_email,
                t_modified: getDate(),
            });
            setSelectedOption(undefined);
        }
        trigger();
    }, [modal, update, selectedItem, user.s_email, reset, trigger]);

    const handleSelectOption = (option: ISelectOption) => {
        console.log(option);
        setSelectedOption(option);
        setValue('i_corp_station_id', option.value, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const submitHandler = (data: any) => {
        createUpdateCharge(data, update || false);
    };

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>{update ? 'Update' : 'Create'} Charge</h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <BpFormGroup>
                    <Label>
                        Unit{' '}
                        <FormError errors={errors} name={'i_corp_station_id'} />
                    </Label>
                    <Select
                        options={stationselection}
                        onChange={handleSelectOption}
                        value={selectedOption}
                    />
                </BpFormGroup>
                <FormGroup
                    label={'Name'}
                    name={'s_name'}
                    register={register}
                    errors={errors}
                />
                <FormGroup
                    label={'Amount per unit'}
                    name={'f_multiplier'}
                    register={register}
                    errors={errors}
                    type={'number'}
                />
                <FormGroup
                    label={'UOM'}
                    name={'s_uom'}
                    register={register}
                    errors={errors}
                />
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <Label>{createdUpdatedInfo(selectedItem)}</Label>
                    <FooterButtonsContainer>
                        <ActionIcon
                            type={'delete'}
                            onClick={() =>
                                selectedItem && deleteCharge(selectedItem.id)
                            }
                            disabled={!update}
                        />
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

const FooterButtonsContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;
