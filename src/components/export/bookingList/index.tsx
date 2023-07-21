import dayjs from 'dayjs';
import _ from 'lodash';
import { useState, useRef } from 'react';
import { Label } from 'reactstrap';
import styled from 'styled-components';

import { useAppContext } from '../../../context';
import { defaultFlightSchedule } from '../../../globals/defaults';
import { IFlightSchedule } from '../../../globals/interfaces';
import { formatDatetime, fileDownload, getStationDetails, print, formatMawb } from '../../../utils';
import ActionIcon from '../../custom/ActionIcon';
import Card from '../../custom/Card';
import Layout from '../../custom/Layout';
import ReactTable from '../../custom/ReactTable';
import { IBooking, IExtendedBooking } from '../booking/interfaces';
import SelectFlights from '../booking/SelectFlights';
import useBooking from '../booking/useBooking';
import useFlightData from '../booking/useFlightData';
import GeneratePrint from './GeneratePrint';
import ModalPieces from './ModalPieces';

export default function BookingList() {
    const { user, appData: { stations } } = useAppContext();
    const [flightDate, setFlightDate] = useState(dayjs().format('YYYY-MM-DD'));
    const { flights } = useFlightData(flightDate, user.s_unit);
    const [selectedFlight, setSelectedFlight] = useState<IFlightSchedule>(
        defaultFlightSchedule
    );
    const booking = useBooking(null, selectedFlight.id, true);
    const flightSelected = selectedFlight.id > 0;
    const bookedWeight = booking.reduce(
        (total: number, current: IBooking) => (total += current.f_weight),
        0
    );

    const bookingTableRef = useRef();
    const exportToCsv = () => {
        if (bookingTableRef.current) {
            // @ts-ignore
            const raw = bookingTableRef.current.getResolvedState().sortedData;
            if (raw.length > 0) {
                const copy = _.cloneDeep(raw);
                const data = copy.map((record: any) => record._original);
                const filtered = data.map((booking: IExtendedBooking) => {
                    delete booking.bookingMawbPieces;
                    const formatted = {
                        'ID': booking.id,
                        'Flight ID': booking.i_flight_id,
                        'Status': booking.s_status,
                        'Flight': booking.s_flight_id,
                        'Origin': booking.s_origin_airport,
                        'Destination': booking.s_destination_airport,
                        'MAWB': formatMawb(booking.s_mawb),
                        'Pieces': booking.i_pieces,
                        'Weight': booking.f_weight ? booking.f_weight.toFixed(1) : '',
                        'CW': booking.f_cw,
                        'Volume': booking.f_volume,
                        'SHC': booking.s_shc,
                        'Remarks': booking.s_remarks,
                        'Carrier Agent': booking.s_carrier_agent,
                        'Created By': booking.s_created_by,
                        'Created Date': dayjs(booking.t_created).format('YYYY-MM-DD HH:mm'),
                        'Modified By': booking.s_modified_by,
                        'Modified Date': dayjs(booking.t_modified).format('YYYY-MM-DD HH:mm'),
                        'Accepted Date': booking.acceptedTime ? dayjs.utc(booking.acceptedTime).format('YYYY-MM-DD HH:mm') : ''
                    }
                    return formatted;
                });
                fileDownload(filtered, `Booking List ${selectedFlight.s_flight_id}.csv`);
            }
        }
    }
    const [selectedBooking, setSelectedBooking] = useState<IExtendedBooking>();
    const [modalPieces, setModalPieces] = useState(false);
    const handleModalPieces = (booking: IExtendedBooking) => {
        setSelectedBooking(booking);
        setModalPieces(true);
    }

    const handlePrint = () => {
        const station = getStationDetails(user, stations);
        print(<GeneratePrint station={station!} booking={booking} />);
    }

    return (
        <Layout>
            <OuterContainer>
                <Card>
                    <h4>Booking List</h4>
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
                                <Label>
                                    Flight Departure:{' '}
                                    {flightSelected &&
                                        formatDatetime(
                                            selectedFlight.t_estimated_departure.toString()
                                        )}
                                </Label>
                                <Label>AWBs Booked: {booking.length}</Label>
                                <Label>Weight: {bookedWeight}</Label>
                            </BookingInfoContainer>
                            <ExportPrintContainer className={!flightSelected ? 'custom-disabled' : ''}>
                                <ActionIcon 
                                    type={'csv'}
                                    onClick={() => exportToCsv()}
                                />
                                <ActionIcon 
                                    type={'print'}
                                    onClick={() => handlePrint()}
                                />
                            </ExportPrintContainer>
                            <ReactTable
                                data={booking}
                                mapping={[
                                    {
                                        name: 'MAWB',
                                        value: 's_mawb',
                                        s_mawb: true
                                    },
                                    {
                                        name: 'Pieces',
                                        value: 'i_pieces',
                                        number: true
                                    },
                                    {
                                        name: 'Weight',
                                        value: 'f_weight',
                                        number: true,
                                        decimal: true
                                    },
                                    {
                                        name: 'Volume',
                                        value: 'f_volume',
                                    },
                                    {
                                        name: 'Specials',
                                        value: 's_shc',
                                    },
                                    {
                                        name: 'Carrier Agent',
                                        value: 's_carrier_agent'
                                    },
                                    {
                                        name: 'Accepted Time',
                                        value: 'acceptedTime',
                                        datetime: true,
                                        utc: true
                                    }
                                ]}
                                index
                                numRows={10}
                                reactTableRef={bookingTableRef}
                                enableClick
                                handleClick={handleModalPieces}
                            />
                        </BookingContainer>
                    </MainContainer>
                </Card>
            </OuterContainer>
            <ModalPieces 
                modal={modalPieces}
                setModal={setModalPieces}
                selectedBooking={selectedBooking}
            />
        </Layout>
    );
}

const OuterContainer = styled.div`
    margin: 0 auto;
    max-width: 1400px;
`;

const MainContainer = styled.div`
    --gap: 10px;
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
`;

const FlightsContainer = styled.div`
    flex: 1;
`;

const BookingContainer = styled.div`
    flex: 3;
    min-width: 553px;
`;

const BookingInfoContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ExportPrintContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: var(--gap);
    margin-bottom: var(--gap);
`;
