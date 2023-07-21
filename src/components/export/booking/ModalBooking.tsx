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
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import BackButton from '../../custom/BackButton';
import ActionIcon from '../../custom/ActionIcon';
import { createdUpdatedInfo, getTsDate } from '../../../utils';
import {
    IBooking,
    IBookingMawb,
    CreateUpdateBooking,
    DeleteBooking,
} from './interfaces';
import { IFlightSchedule, ISpecialHandlingCode, IUser } from '../../../globals/interfaces';
import FormGroup from '../../custom/hookForm/FormGroup';
import { createBookingSchema, updateBookingSchema } from './utils';
import useSelection from '../../../customHooks/useSelection';
import SpecialHandlingCodes from '../../custom/SpecialHandlingCodes';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    user: IUser;
    bookingMawb: IBookingMawb;
    selectedFlight: IFlightSchedule;
    selectedBooking: IBooking | undefined;
    availableKg: number;
    shcs: Array<ISpecialHandlingCode>;
    createUpdateBooking: CreateUpdateBooking;
    deleteBooking: DeleteBooking;
}

export default function ModalBooking ({
    modal,
    setModal,
    user,
    bookingMawb,
    selectedFlight,
    selectedBooking,
    availableKg,
    shcs,
    createUpdateBooking,
    deleteBooking,
}: Props) {
    const update = selectedBooking && selectedBooking.id ? true : false;

    const {
        trigger,
        reset,
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid, isDirty },
    } = useForm({
        mode: 'all',
        resolver: update
            ? yupResolver(updateBookingSchema)
            : yupResolver(createBookingSchema),
    });

    const { selected, setSelected, selectedString } = useSelection(_.get(selectedBooking, 's_shc', ''));

    useEffect(() => {
        const { s_email } = user;
        const now = getTsDate();
        if (update && selectedBooking) {
            const copy = _.cloneDeep(selectedBooking);
            copy.s_modified_by = s_email;
            copy.t_modified = now;
            reset(copy);
        } else {
            reset({
                i_flight_id: Number(selectedFlight.id),
                s_mawb: bookingMawb.s_mawb,
                s_created_by: s_email,
                t_created: now,
                s_modified_by: s_email,
                t_modified: now,
                s_status: 'NEW',
            });
        }
        trigger();
    }, [
        update,
        selectedBooking,
        reset,
        trigger,
        bookingMawb,
        user,
        selectedFlight.id,
    ]);

    useEffect(() => {
        setValue('s_shc', selectedString, { shouldDirty: true });
    }, [selectedString, setValue])

    const handleCreateUpdateBooking = async (data: any) => {
        const result = await createUpdateBooking(data, update);
        if (result) {
            setModal(false);
        }
    };

    const handleDeleteBooking = async (id: number) => {
        const result = await deleteBooking(id);
        if (result) {
            setModal(false);
        }
    };

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>
                        {update ? 'Update Booking' : 'Book Piece on Flight'}
                    </h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <FlightDataContainer>
                    <div>
                        <Label>Flight Selected:</Label>
                        <Label>{selectedFlight.s_flight_id}</Label>
                    </div>
                    <div>
                        <Label>Available Space:</Label>
                        <Label className={'d-block'}>{availableKg}</Label>
                    </div>
                    <div>
                        <Label className={'d-block'}>Available Volume: </Label>
                    </div>
                </FlightDataContainer>
                <FormGroup
                    label={'Pieces to Book'}
                    name={'i_pieces'}
                    register={register}
                    errors={errors}
                />
                <FormGroup
                    label={'Weight to Book'}
                    name={'f_weight'}
                    register={register}
                    errors={errors}
                />
                <BtFormGroup>
                    <Label>Special Handling Code</Label>
                    <SpecialHandlingCodes 
                        shcs={shcs}
                        selectedShcs={selected}
                        setSelectedShcs={setSelected}
                    />
                </BtFormGroup>
                <FormGroup
                    label={'Remarks'}
                    name={'s_remarks'}
                    register={register}
                    errors={errors}
                />
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    {update && selectedBooking && (
                        <Label>{createdUpdatedInfo(selectedBooking)}</Label>
                    )}
                    <FooterButtonsContainer>
                        <ActionIcon
                            type={'delete'}
                            onClick={() => selectedBooking && handleDeleteBooking(selectedBooking.id)}
                            disabled={!update}
                        />
                        <ActionIcon
                            type={'save'}
                            onClick={handleSubmit(handleCreateUpdateBooking)}
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

const FlightDataContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;

    div {
        flex: 1;
    }
`;

const FlightDataSubContainer = styled.div`
    display: flex;
    flex-direction: row;
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
