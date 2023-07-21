import styled from 'styled-components';
import { Input, Label } from 'reactstrap';

import ReactTable from '../../custom/ReactTable';
import { IFlightSchedule } from '../../../globals/interfaces';

interface Props {
    flightDate: string;
    setFlightDate: React.Dispatch<React.SetStateAction<string>>;
    flights: Array<IFlightSchedule>;
    setSelectedFlight: React.Dispatch<React.SetStateAction<IFlightSchedule>>;
}

export default function SelectFlights ({
    flightDate,
    setFlightDate,
    flights,
    setSelectedFlight
}: Props) {
    return (
        <div>
            <FlightDateContainer>
                <Label>Flight Date</Label>
                <CustomDateInput
                    type={'date'}
                    value={flightDate}
                    onChange={(e: any) =>
                        setFlightDate(e.target.value)
                    }
                />
            </FlightDateContainer>
            <ReactTable 
                data={flights}
                mapping={[{
                    name: 'Airline',
                    value: 's_airline_code'
                }, {
                    name: 'Flight',
                    value: 's_flight_number'
                }, {
                    name: 'Destination',
                    value: 's_destination_airport'
                }]}
                index
                numRows={10}
                enableClick
                handleClick={setSelectedFlight}
            />
        </div>
    );
}

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
