import ReactTable from '../../custom/ReactTable';
import { IBooking } from './interfaces';

interface Props {
    bookings: Array<IBooking>;
    allowUpdate: boolean;
    handleCreateUpdateBooking?: (booking: IBooking | undefined) => void;
}

export default function BookingTable ({
    bookings,
    allowUpdate,
    handleCreateUpdateBooking
}: Props) {
    return (
        <ReactTable 
            data={bookings}
            mapping={[{
                name: 'Flight',
                value: 's_flight_id',
                customWidth: 120
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
            }, {
                name: '',
                value: allowUpdate ? 'fas fa-edit' : '',
                icon: true,
                function: (item: IBooking) => handleCreateUpdateBooking && handleCreateUpdateBooking(item)
            }]}
            numRows={5}
            index
        />
    );
}