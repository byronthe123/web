import React, { useEffect } from 'react';
import { Label } from 'reactstrap';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup as BtFormGroup,
} from 'reactstrap';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import BackButton from '../../custom/BackButton';
import ActionIcon from '../../custom/ActionIcon';
import { createdUpdatedInfo, formatMawb, getTsDate } from '../../../utils';
import FormGroup from '../../custom/hookForm/FormGroup';
import { Input } from '../../custom/hookForm/Input';
import FormError from '../../custom/FormError2';
import { IBookingMawb, IBookingMawbPiece, CreateUpdateBookingMawbPieces, DeleteBookMawbPieces } from './interfaces';
import {
    createBookingMawbPieceSchema,
    updateBookingMawbPieceSchema,
} from './utils';
import { ISpecialHandlingCode, IUser } from '../../../globals/interfaces';
import SpecialHandlingCodes from '../../custom/SpecialHandlingCodes';
import useSelection from '../../../customHooks/useSelection';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    user: IUser;
    bookingMawb: IBookingMawb;
    selectedMawbPiece: IBookingMawbPiece | undefined;
    shcs: Array<ISpecialHandlingCode>;
    createUpdateBookingMawbPieces: CreateUpdateBookingMawbPieces;
    deleteBookMawbPieces: DeleteBookMawbPieces;
}

export default function ModalAddPieces({
    modal,
    setModal,
    user,
    bookingMawb,
    selectedMawbPiece,
    shcs,
    createUpdateBookingMawbPieces,
    deleteBookMawbPieces
}: Props) {

    const update: boolean =
        selectedMawbPiece && selectedMawbPiece.id ? true : false;

    const {
        trigger,
        reset,
        register,
        watch,
        getValues,
        setValue,
        handleSubmit,
        formState: { isValid, isDirty, errors },
    } = useForm({
        mode: 'all',
        resolver: update
            ? yupResolver(updateBookingMawbPieceSchema)
            : yupResolver(createBookingMawbPieceSchema),
    });

    const { selected, setSelected, selectedString } = useSelection(_.get(selectedMawbPiece, 's_shc', ''));

    const f_volume = watch('f_volume');

    useEffect(() => {
        const now = getTsDate();
        const { s_email } = user;
        if (selectedMawbPiece) {
            const copy = _.cloneDeep(selectedMawbPiece);
            copy.s_modified_by = s_email;
            copy.t_modified = now;
            reset(copy);
        } else {
            reset({
                s_pieces_guid: uuidv4(),
                i_booking_mawb_id: bookingMawb.id,
                s_created_by: s_email,
                t_created: now,
                s_modified_by: s_email,
                t_modified: now,
                s_status: 'DEFAULT'
            });
        }
        trigger();
    }, [bookingMawb.id, reset, selectedMawbPiece, trigger, user]);

    useEffect(() => {
        setValue('s_shc', selectedString, { shouldDirty: true });
    }, [selectedString, setValue]);

    const toggle = () => setModal(!modal);

    const handleCreateUpdateBookingMawbPieces = async (data: any) => {
        const result = await createUpdateBookingMawbPieces(data, update);
        if (result) {
            setModal(false);
        }
    }

    const handleDeleteBookingMawbPiece = async (id: number) => {
        const result = await deleteBookMawbPieces(id);
        if (result) {
            setModal(false);
        }
    }

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>
                        {update ? 'Update' : 'Add'} Pieces
                    </h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <BookingDataContainer>
                    <Label>MAWB: {formatMawb(bookingMawb.s_mawb)}</Label>
                    <Label>Total Pieces: {bookingMawb.i_pieces}</Label>
                    <Label>Total Weight: {bookingMawb.f_weight}</Label>
                </BookingDataContainer>
                <FieldsContainer>
                    <div>
                        <FormGroup
                            label={'Pieces'}
                            register={register}
                            name={'i_pieces'}
                            errors={errors}
                            type={'number'}
                        />
                        <BtFormGroup>
                            <Label>Height (in.) <FormError errors={errors} name={'f_height'} /></Label>
                            <Input
                                {...register('f_height', {
                                    valueAsNumber: true,
                                    onChange: (e: any) => {
                                        const [f_width, f_length] = getValues([
                                            'f_width',
                                            'f_length',
                                        ]);
                                        const volume =
                                            f_width *
                                            f_length *
                                            parseFloat(e.target.value);
                                        setValue('f_volume', volume);
                                    },
                                })}
                                error={Boolean(errors['f_height'])}
                            />
                        </BtFormGroup>
                        <BtFormGroup>
                            <Label>Length (in.) <FormError errors={errors} name={'f_length'} /></Label>
                            <Input
                                {...register('f_length', {
                                    valueAsNumber: true,
                                    onChange: (e: any) => {
                                        const [f_width, f_height] = getValues([
                                            'f_width',
                                            'f_height',
                                        ]);
                                        const volume =
                                            f_width *
                                            f_height *
                                            parseFloat(e.target.value);
                                        setValue('f_volume', volume);
                                    },
                                })}
                                error={Boolean(errors['f_length'])}
                            />
                        </BtFormGroup>
                        <BtFormGroup>
                            <Label>Width (in.) <FormError errors={errors} name={'f_width'} /></Label>
                            <Input
                                {...register('f_width', {
                                    valueAsNumber: true,
                                    onChange: (e: any) => {
                                        const [f_height, f_length] = getValues([
                                            'f_height',
                                            'f_length',
                                        ]);
                                        const volume =
                                            f_height *
                                            f_length *
                                            parseFloat(e.target.value);
                                        setValue('f_volume', volume);
                                    },
                                })}
                                error={Boolean(errors['f_width'])}
                            />
                        </BtFormGroup>
                    </div>
                    <div>
                        <BtFormGroup>
                            <Label>Volume</Label>
                            <input
                                className={'form-control'}
                                value={f_volume || 0}
                                disabled
                            />
                        </BtFormGroup>
                        <FormGroup
                            label={'Gross Weight (kg)'}
                            register={register}
                            name={'f_weight'}
                            errors={errors}
                            type={'number'}
                        />
                        <BtFormGroup>
                            <Label>Chargeable Weight</Label>
                            <input
                                className={'form-control'}
                                value={0}
                                disabled
                            />
                        </BtFormGroup>
                    </div>
                </FieldsContainer>
                <div>
                    <Label>Special Handling Codes</Label>
                    <SpecialHandlingCodes 
                        shcs={shcs}
                        selectedShcs={selected}
                        setSelectedShcs={setSelected}
                    />
                </div>
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    {update && <Label>{createdUpdatedInfo(selectedMawbPiece)}</Label>}
                    <FooterButtonsContainer>
                        <ActionIcon
                            type={'delete'}
                            onClick={() => selectedMawbPiece && handleDeleteBookingMawbPiece(selectedMawbPiece.id)}
                            disabled={!update}
                        />
                        <ActionIcon
                            type={'save'}
                            onClick={handleSubmit(handleCreateUpdateBookingMawbPieces)}
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

const BookingDataContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const FieldsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
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
