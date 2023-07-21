import React, { useEffect, useMemo } from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup } from 'reactstrap';
import styled from 'styled-components';
import Select, { Creatable } from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import BackButton from '../custom/BackButton';
import ActionIcon from '../custom/ActionIcon';
import { createdUpdatedInfo, getTsDate } from '../../utils';
import { IChangeLog, ISelectOption, IUser } from '../../globals/interfaces';
import FormInput from '../custom/hookForm/FormInput';
import { baseSchema, updateSchema } from './yup';
import map from '../../constants/sidebarMap';
import pkg from '../../../package.json';
import moment from 'moment';
const version = pkg.version;

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    selectedEntry: IChangeLog | undefined;
    user: IUser;
    submit: (data: IChangeLog) => Promise<void>;
    deleteEntry: (id: number) => Promise<void>;
}

export default function ModalChageLog ({
    modal,
    setModal,
    selectedEntry,
    user,
    submit,
    deleteEntry
}: Props) {

    const {
        register,
        formState: { isValid, isDirty, errors },
        handleSubmit,
        setValue,
        trigger,
        reset,
        watch
    } = useForm<IChangeLog>({
        mode: 'all',
        resolver: selectedEntry ? 
            yupResolver(updateSchema) : 
            yupResolver(baseSchema)
    });

    useEffect(() => {
        if (selectedEntry) {
            selectedEntry.created = moment(selectedEntry.created).format('YYYY-MM-DD');
            reset(selectedEntry);
        } else {
            reset({
                version: version,
                date: undefined,
                type: '',
                title: '',
                detail: '',
                url: '',
                created: getTsDate(),
                createdBy: user.s_email
            });
        }
        trigger();
    }, [modal, selectedEntry, user, version]);

    const type = watch('type');
    const url = watch('url');

    const handleSelectTypeUrl = (value: 'type' | 'url', option: ISelectOption) => {
        setValue(value, String(option.value), { shouldDirty: true, shouldValidate: true });
    }

    const urls = useMemo(() => {
        const array: Array<ISelectOption> = [];
        for (const tab in map) {
            const { subs } = map[tab];
            for (const sub1 in subs) {
                if (!subs[sub1].to || !subs[sub1].to.length) continue;
                array.push({
                    value: subs[sub1].to,
                    label: subs[sub1].to,
                });
                if (subs[sub1].subs && Object.keys(subs[sub1].subs).length > 0) {
                    const subs2 = subs[sub1].subs;
                    for (const sub2 in subs2) {
                        if (!subs2[sub2].to || !subs2[sub2].to.length) continue;
                        array.push({
                            value: subs2[sub2].to,
                            label: subs2[sub2].to,
                        });
                    }
                }
            }
        }
        return array;
    }, [map]);


    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>{selectedEntry ? 'Update' : 'Add'} Entry</h4>
                </HeaderContainer>
            </ModalHeader>
            <CustomModalBody>
                <FormInput<IChangeLog> 
                    label={'Version'}
                    name={'version'}
                    register={register}
                    errors={errors}
                />
                <FormInput<IChangeLog> 
                    label={'Release Date'}
                    name={'date'}
                    register={register}
                    errors={errors}
                    type={'date'}
                />
                <FormGroup>
                    <Label>Type</Label>
                    <Select 
                        options={[{
                            label: 'ADDED',
                            value: 'ADDED'
                        }, {
                            label: 'CHANGED',
                            value: 'CHANGED'
                        }, {
                            label: 'FIXED',
                            value: 'FIXED'
                        }]}
                        value={{
                            label: type,
                            value: type
                        }}
                        onChange={(selectedOption: ISelectOption) => handleSelectTypeUrl('type', selectedOption)}
                    />
                </FormGroup>
                <FormInput<IChangeLog> 
                    label={'Title'}
                    name={'title'}
                    register={register}
                    errors={errors}
                />
                <FormInput<IChangeLog> 
                    label={'Details'}
                    name={'detail'}
                    register={register}
                    errors={errors}
                />
                <FormGroup>
                    <Label>URL</Label>
                    <Creatable 
                        options={urls}
                        value={{
                            label: url,
                            value: url
                        }}
                        onChange={(selectedOption: ISelectOption) => handleSelectTypeUrl('url', selectedOption)}
                        creatable
                    />
                </FormGroup>
            </CustomModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    {
                        selectedEntry && (
                            <Label>
                                {createdUpdatedInfo({})}
                            </Label>
                        )
                    }
                    <FooterButtonsContainer update={Boolean(selectedEntry)}>
                        {
                            selectedEntry && (
                                <ActionIcon type={'delete'} onClick={() => deleteEntry(selectedEntry.id)} />
                            )
                        }
                        <ActionIcon type={'save'} onClick={handleSubmit(submit)} disabled={!isDirty || !isValid} />
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

const FooterButtonsContainer = styled.div<{update?: boolean}>`
    width: 100%;
    display: flex;
    justify-content: ${p => p.update ? 'space-between' : 'flex-end'};
`;

const CustomModalBody = styled(ModalBody)`
    text-transform: none;
    input {
        text-transform: none;
    }
`;