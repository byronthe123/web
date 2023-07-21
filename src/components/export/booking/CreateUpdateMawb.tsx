import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';
import { FormGroup as BtFormGroup, Label, Button } from 'reactstrap';
import _ from 'lodash';

import { IBookingMawb, CreateUpdateBookingMawb } from './interfaces';
import { GoToNextStep, ISpecialHandlingCode, IUser } from '../../../globals/interfaces';
import { createdUpdatedInfo, getTsDate, validateAwb } from '../../../utils';
import FormGroup from '../../custom/hookForm/FormGroup';
import MawbInput from '../../custom/MawbInput';
import { createBookingMawbSchema, updateBookingMawbSchema } from './utils';
import useSelection from '../../../customHooks/useSelection';
import SpecialHandlingCodes from '../../custom/SpecialHandlingCodes';
import Card from '../../custom/Card';
import ModalAwbAlert from './ModalAwbAlert';

interface Props {
    bookingMawb: IBookingMawb | undefined;
    setBookingMawb: React.Dispatch<React.SetStateAction<IBookingMawb | undefined>>;
    user: IUser;
    shcs: Array<ISpecialHandlingCode>;
    set_s_mawb: React.Dispatch<React.SetStateAction<string>>;
    createUpdateBookingMawb: CreateUpdateBookingMawb;
    next: GoToNextStep;
}

export default function CreateUpdateMawb({
    bookingMawb,
    setBookingMawb,
    user,
    shcs,
    set_s_mawb,
    createUpdateBookingMawb,
    next
}: Props) {

    const update = (bookingMawb && bookingMawb.id) ? true : false;
    const defaultFormValue = useMemo(() => {
        return {
            s_mawb: '',
            s_origin: '',
            s_destination: '',
            s_nature_of_goods: '',
            i_pieces: '',
            f_weight: '',
            f_volume: '',
            s_shc: '',
            s_carrier_agent: '',
            s_carrier_iata: '',
            s_carrier_account: '',
            s_created_by: user.s_email,
            t_created: getTsDate(),
            s_modified_by: user.s_email,
            t_modified: getTsDate(),
        }
    }, [user.s_email]);

    const {
        trigger,
        register,
        reset,
        setValue,
        watch,
        handleSubmit,
        formState: { errors, isValid, isDirty },
    } = useForm({
        resolver: update
            ? yupResolver(updateBookingMawbSchema)
            : yupResolver(createBookingMawbSchema),
        mode: 'onChange',
    });

    console.log(errors);

    const { selected, setSelected, selectedString } = useSelection(_.get(bookingMawb, 's_shc', ''));
    const [lockAwb, setLockAwb] = useState(false);
    const [modalAlert, setModalAlert] = useState(false);
    
    useEffect(() => {
        const now = getTsDate();
        if (bookingMawb) {
            const copy = _.cloneDeep(bookingMawb);
            copy.s_modified_by = user.s_email;
            copy.t_modified = now;
            reset(copy);
        } else {
            reset(defaultFormValue);
        }
        trigger();
    }, [bookingMawb, user.s_email, reset, trigger, defaultFormValue]);

    useEffect(() => {
        setValue('s_shc', selectedString, { shouldDirty: true });
    }, [selectedString, setValue]);

    const s_mawb = watch('s_mawb');

    useEffect(() => {
        if (validateAwb(s_mawb)) {
            setLockAwb(true);
        } 
    }, [s_mawb]);

    const handleSetMawb = (value: string) => {
        setValue('s_mawb', value);
        if (validateAwb(value)) {
            set_s_mawb(value);
        } else {
            set_s_mawb('');
        }
        if (value.length === 0) {
            reset(defaultFormValue);
        }   
    };

    const handleCreateBookingMawb = async (data: any) => {
        if (update && !isDirty) {
            next();
        } else {
            const result = await createUpdateBookingMawb(data, update);
            if (result) {
                next();
            }
        }
    };

    const manageAlert = (resetForm: boolean) => {
        if (resetForm) {
            reset(defaultFormValue);
            setBookingMawb(undefined);
        }
        setModalAlert(false);
        setLockAwb(false);
    }

    return (
        <OuterGrid>
            <div></div>
            <Card>
                <Main>
                    <FormSection>
                        <Subtitle>Main Details</Subtitle>
                        <BtFormGroup>
                            <Label>MAWB</Label>
                            <MawbContainer>
                                <MawbInput
                                    value={watch('s_mawb')}
                                    onChange={handleSetMawb}
                                    classNames={
                                        lockAwb ? 'custom-disabled' : ''
                                    }
                                />
                                {lockAwb && (
                                    <i
                                        className={'fas fa-edit text-success'}
                                        onClick={() => setModalAlert(true)}
                                    />
                                )}
                            </MawbContainer>
                        </BtFormGroup>
                        <FormGroup
                            label={'Origin'}
                            register={register}
                            name={'s_origin'}
                            errors={errors}
                        />
                        <FormGroup
                            label={'Destination'}
                            register={register}
                            name={'s_destination'}
                            errors={errors}
                        />
                        <FormGroup
                            label={'Nature of Goods'}
                            register={register}
                            name={'s_nature_of_goods'}
                            errors={errors}
                            type={'textarea'}
                        />
                    </FormSection>
                    <FormSection justifySelf='center'>
                        <Subtitle>Unit Details</Subtitle>
                        <FormGroup
                            label={'Total Pieces'}
                            register={register}
                            name={'i_pieces'}
                            errors={errors}
                            type={'number'}
                        />
                        <FormGroup
                            label={'Total Weight'}
                            register={register}
                            name={'f_weight'}
                            errors={errors}
                            type={'number'}
                        />
                        <FormGroup
                            label={'Volume'}
                            register={register}
                            name={'f_volume'}
                            errors={errors}
                            type={'number'}
                        />
                        <BtFormGroup>
                            <Label>Special Handling Code {watch('s_shc')}</Label>
                            <SpecialHandlingCodes 
                                shcs={shcs}
                                selectedShcs={selected}
                                setSelectedShcs={setSelected}
                            />
                        </BtFormGroup>
                    </FormSection>
                    <FormSection justifySelf='flex-end'>
                        <Subtitle>Carriers</Subtitle>
                        <FormGroup
                            label={'Issuing Agent'}
                            register={register}
                            name={'s_carrier_agent'}
                            errors={errors}
                            type={'textarea'}
                        />
                        <FormGroup
                            label={'IATA Code'}
                            register={register}
                            name={'s_carrier_iata'}
                            errors={errors}
                            type={'textarea'}
                        />
                        <FormGroup
                            label={'Account Number'}
                            register={register}
                            name={'s_carrier_account'}
                            errors={errors}
                            type={'textarea'}
                        />
                    </FormSection>
                    <LabelContainer>
                        <Label>{createdUpdatedInfo(bookingMawb)}</Label>
                    </LabelContainer>
                    <ButtonContainer>
                        <Button
                            disabled={!isValid}
                            onClick={handleSubmit(handleCreateBookingMawb)}
                        >
                            {update ? 'Update' : 'Create'}
                        </Button>
                    </ButtonContainer>
                </Main>
            </Card>
            <div></div>
            <ModalAwbAlert 
                modal={modalAlert}
                setModal={setModalAlert}
                manageAlert={manageAlert}
            />
        </OuterGrid>
    );
}

const OuterGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 882px 1fr; 

    @media (max-width: 1050px) {
        grid-template-columns: 0fr 1fr 0fr; 
    }
`;

const Main = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-content: space-evenly;
    gap: 25px;
`;


const FormSection = styled.div<{justifySelf?: string}>`
    width: 250px;
    justify-self: ${p => p.justifySelf || 'flex-start'}; 
`;

const Subtitle = styled.h6`
    font-weight: bold;
`;

const MawbContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`;

const LabelContainer = styled.div`
    grid-row: 2;
    grid-column: 1 / 3;
`;

const ButtonContainer = styled.div`
    grid-row: 2;
    grid-column: 3;
    justify-self: flex-end;
    margin-top: -10px;
`;