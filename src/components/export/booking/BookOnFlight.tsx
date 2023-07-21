import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { Input, Label, Table } from 'reactstrap';
import styled from 'styled-components';

import { IBooking, IBookingMawb, CreateUpdateBooking, DeleteBooking } from './interfaces';
import { IFlightSchedule, ISpecialHandlingCode, IUser } from '../../../globals/interfaces';
import { defaultFlightSchedule } from '../../../globals/defaults';
import { formatMawb } from '../../../utils';
import useFlightData from './useFlightData';
import ReactTable from '../../custom/ReactTable';
import ActionIcon from '../../custom/ActionIcon';
import ModalBooking from './ModalBooking';
import Card from '../../custom/Card';
import useTotalBooked from './useTotalBooked';
import { InfoTable } from '../../custom/InfoTable';
import SelectFlights from './SelectFlights';

interface Props {
    user: IUser;
    bookingMawb: IBookingMawb | undefined;
    bookings: Array<IBooking>;
    shcs: Array<ISpecialHandlingCode>;
    createUpdateBooking: CreateUpdateBooking;
    deleteBooking: DeleteBooking;
}

export default function BookOnFlight({ 
    user,
    bookingMawb,
    bookings,
    shcs,
    createUpdateBooking,
    deleteBooking
}: Props) {

    const [flightDate, setFlightDate] = useState(
        dayjs().format('YYYY-MM-DD')
    );
    const { flights } = useFlightData(flightDate, user.s_unit);
    const [selectedFlight, setSelectedFlight] = useState<IFlightSchedule>(defaultFlightSchedule);
    const [selectedBooking, setSelectedBooking] = useState<IBooking>();
    const [modalBooking, setModalBooking] = useState(false);
    const totalBookedKg = useTotalBooked(selectedFlight.id);
    const availableKg = (selectedFlight.f_aircraft_capacity || 0) - totalBookedKg; 
    const flightBooking = useMemo(() => {
        console.log(bookings);
        console.log(selectedFlight);
        return bookings.filter(b => Number(b.i_flight_id) === selectedFlight.id);
    }, [bookings, selectedFlight]);

    const handleCreateUpdateBooking = (booking: IBooking | undefined = undefined) => {
        if (selectedFlight.id > 0) {
            setSelectedBooking(booking);
            setModalBooking(true);
        }
    }

    if (!bookingMawb) {
        return null;
    }

    return (
        <OuterContainer>
            <Card>
                <MainContainer>
                    <FlightsContainer>
                        <SelectFlights 
                            flightDate={flightDate}
                            setFlightDate={setFlightDate}
                            flights={flights}
                            setSelectedFlight={setSelectedFlight}
                        />
                    </FlightsContainer>
                    <BookingContainer>
                        <BookingInfoContainer>
                        <div>
                            <InfoTable>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>Flight Selected</td>
                                        <td>{selectedFlight.s_flight_id}</td>
                                    </tr>
                                    <tr>
                                        <td>Flight ID</td>
                                        <td>{selectedFlight.id}</td>
                                    </tr>
                                    <tr>
                                        <td>Aircraft</td>
                                        <td>{selectedFlight.s_aircraft}</td>
                                    </tr>
                                    <tr>
                                        <td>Registration</td>
                                        <td>?</td>
                                    </tr>
                                </tbody>
                            </InfoTable>
                        </div>
                        <div>
                            <InfoTable>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>Capacity</td>
                                        <td>{selectedFlight.f_aircraft_capacity}</td>
                                    </tr>
                                    <tr>
                                        <td>Booked</td>
                                        <td>{totalBookedKg}</td>
                                    </tr>
                                    <tr>
                                        <td>Available</td>
                                        <td>{availableKg}</td>
                                    </tr>
                                </tbody>
                            </InfoTable>
                        </div>
                        <div>
                            <InfoTable>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>MAWB</td>
                                        <td>{formatMawb(bookingMawb.s_mawb)}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Pieces</td>
                                        <td>{bookingMawb.i_pieces}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Weight</td>
                                        <td>{bookingMawb.f_weight}</td>
                                    </tr>
                                    <tr>
                                        <td>Destination</td>
                                        <td>{bookingMawb.s_destination}</td>
                                    </tr>
                                </tbody>
                            </InfoTable>
                        </div>
                        </BookingInfoContainer>
                        <BookingLabelContainer>
                            <Label>Booking</Label>
                            <ActionIcon 
                                type={'add'}
                                onClick={handleCreateUpdateBooking}
                                disabled={selectedFlight.id === 0}
                            />
                        </BookingLabelContainer>
                        <ReactTable 
                            data={flightBooking}
                            mapping={[{
                                name: 'Pieces',
                                value: 'i_pieces',
                                customWidth: 75
                            }, {
                                name: 'Weight',
                                value: 'f_weight',
                                customWidth: 100
                            }, {
                                name: 'Specials',
                                value: 's_shc'
                            }, {
                                name: 'Update',
                                value: 'fas fa-edit',
                                icon: true,
                                function: (item: IBooking) => handleCreateUpdateBooking(item)
                            }]}
                            numRows={5}
                            index
                        />
                    </BookingContainer>
                    <ModalBooking 
                        modal={modalBooking}
                        setModal={setModalBooking}
                        user={user}
                        bookingMawb={bookingMawb}
                        selectedBooking={selectedBooking}
                        selectedFlight={selectedFlight}
                        availableKg={availableKg}
                        shcs={shcs}
                        createUpdateBooking={createUpdateBooking}
                        deleteBooking={deleteBooking}
                    />
                </MainContainer>
            </Card>
        </OuterContainer>
    );
}

const OuterContainer = styled.div`
    --gap: 10px;

    max-width: 1100px;
    margin: 0 auto;
`;

const MainContainer = styled.div`
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
`;

const FlightsContainer = styled.div`
    flex: 1;
`;

const FlightDateContainer = styled.div`
    display: flex;
    gap: var(--gap);
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: var(--gap);
`;

const CustomDateInput = styled(Input)`
    width: 150px;
`;

const BookingContainer = styled.div`
    flex: 4;
    min-width: 675px;
`;

const BookingInfoContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const BookingLabelContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
`;
