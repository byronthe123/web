import _ from "lodash";
import ReactTable from "../../custom/ReactTable";
import styled from "styled-components";
import Card from "../../custom/Card";
import { InfoTable } from "../../custom/InfoTable";
import { IBookingMawb } from "./interfaces";
import useBooking from "./useBooking";
import { Button } from "reactstrap";
import { PushStep } from "../../../globals/interfaces";

interface Props {
    bookingMawb: IBookingMawb | undefined;
    removeBookingMawb: () => void;
    push: PushStep;
}

export default function Confirmation ({
    bookingMawb,
    removeBookingMawb,
    push
}: Props) {

    const bookings = useBooking(_.get(bookingMawb, 's_mawb', ''));

    const startNewBooking = () => {
        removeBookingMawb();
        push('mawb');
    }

    if (!bookingMawb) {
        return null;
    }

    return (
        <Container>
            <Card>
                <DetailsContainer>
                    <MainDetails>
                        <Subtitle>Main Details</Subtitle>
                        <InfoTable customWidth={400}>
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td>MAWB</td>
                                    <td>{bookingMawb.s_mawb}</td>
                                </tr>
                                <tr>
                                    <td>Origin</td>
                                    <td>{bookingMawb.s_origin}</td>
                                </tr>
                                <tr>
                                    <td>Destination</td>
                                    <td>{bookingMawb.s_destination}</td>
                                </tr>
                                <tr>
                                    <td>Nature of Goods</td>
                                    <td>{bookingMawb.s_nature_of_goods}</td>
                                </tr>
                                <tr>
                                    <td>Special Handling Codes</td>
                                    <td>{bookingMawb.s_shc}</td>
                                </tr>
                            </tbody>
                        </InfoTable>
                    </MainDetails>
                    <div>
                        <Subtitle>Unit Details</Subtitle>
                        <InfoTable>
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td>Total Pieces</td>
                                    <td>{bookingMawb.i_pieces}</td>
                                </tr>
                                <tr>
                                    <td>Total Weight</td>
                                    <td>{bookingMawb.f_weight}</td>
                                </tr>
                            </tbody>
                        </InfoTable>
                    </div>
                </DetailsContainer>
                <div>
                    <Subtitle>Notes</Subtitle>
                    {bookingMawb.s_shipment_remarks}
                </div>
                <div className={'mt-2'}>
                    <Subtitle>Booking</Subtitle>
                    <ReactTable 
                        data={bookings}
                        mapping={[{
                            name: 'Flight',
                            value: 's_flight_id',
                            customWidth: 175
                        }, {
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
                        }]}
                        numRows={5}
                        index
                    />
                </div>
                <RestartBtnContainer>
                    <Button onClick={startNewBooking}>New Booking</Button>
                </RestartBtnContainer>
            </Card>
        </Container>
    );
}

const Container = styled.div`
    max-width: 900px;
    margin: 0 auto;
`;

const DetailsContainer = styled.div`
    display: flex;
`;

const MainDetails = styled.div`
    flex: 3;
`;

const Subtitle = styled.h6`
    font-weight: bold;
`;

const RestartBtnContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 5px;
`;