import _ from 'lodash';
import { useState, useEffect } from 'react';
import { ISpecialHandlingCode, IUser } from '../../../globals/interfaces';
import { api, validateAwb, notify } from '../../../utils';
import {
    IBookingMawb,
    IBookingMawbPiece,
    IBooking,
    CreateUpdateBookingMawb,
    CreateUpdateBookingMawbPieces,
    DeleteBookMawbPieces,
    CreateUpdateBooking,
    DeleteBooking,
} from './interfaces';

export default function useData(s_mawb: string, user: IUser) {
    const [bookingMawb, setBookingMawb] = useState<IBookingMawb>();
    const [bookingMawbPieces, setBookingMawbPieces] = useState<
        Array<IBookingMawbPiece>
    >([]);
    const [bookings, setBookings] = useState<Array<IBooking>>([]);
    const [shcs, setShcs] = useState<Array<ISpecialHandlingCode>>([]);

    useEffect(() => {
        const selectSpecialHandlingCodes = async () => {
            const res = await api('get', '/specialHandlingCodes');
            if (res.status === 200) {
                setShcs(res.data);
            }
        }
        selectSpecialHandlingCodes();
    }, [])

    useEffect(() => {
        const selectBookingMawbAndPieces = async () => {
            const res = await api('get', `/booking/mawb-pieces/${s_mawb}?s_airline_codes=${user.s_airline_codes.join(',')}`);
            if (res.status === 200) {
                const { bookingMawb, bookingMawbPieces, bookings } = res.data;
                console.log(res.data);
                if (bookingMawb.id) {
                    setBookingMawb(bookingMawb);
                }
                setBookingMawbPieces(bookingMawbPieces);
                setBookings(bookings);
            }
        };
        if (validateAwb(s_mawb)) {
            selectBookingMawbAndPieces();
        }
    }, [s_mawb]);

    const createUpdateBookingMawb: CreateUpdateBookingMawb = async (
        data: IBookingMawb,
        update: boolean
    ): Promise<boolean> => {
        if (update) {
            const res = await api('put', `/booking/mawb/${data.id}`, data);
            if (res.status === 204) {
                setBookingMawb(data);
                return true;
            }
            return false;
        } else {
            const res = await api('post', '/booking/mawb', data);
            if (res.status === 200) {
                setBookingMawb(res.data);
                return true;
            }
            return false;
        }
    };
    
    const removeBookingMawb = () => setBookingMawb(undefined);

    const createUpdateBookingMawbPieces: CreateUpdateBookingMawbPieces = async (
        data: IBookingMawbPiece,
        update: boolean
    ): Promise<boolean> => {
        if (update) {
            const res = await api(
                'put',
                `/booking/mawb-pieces/${data.id}`,
                data
            );
            if (res.status === 204) {
                setBookingMawbPieces((prevState) => {
                    const copy = _.cloneDeep(prevState);
                    for (let i = 0; i < copy.length; i++) {
                        if (copy[i].id === data.id) {
                            copy[i] = data;
                            break;
                        }
                    }
                    return copy;
                });
                notify(`Pieces updated`);
                return true;
            }
            return false;
        } else {
            const res = await api('post', '/booking/mawb-pieces', data);
            if (res.status === 200) {
                setBookingMawbPieces((prevState) => {
                    const copy = _.cloneDeep(prevState);
                    copy.push(res.data);
                    return copy;
                });
                notify(`Pieces added`);
                return true;
            }
            return false;
        }
    };

    const deleteBookMawbPieces: DeleteBookMawbPieces = async (id: number) => {
        const res = await api('delete', `/booking/mawb-pieces/${id}`);
        if (res.status === 204) {
            setBookingMawbPieces((prevState) => {
                const filtered = prevState.filter(
                    (mawbPiece) => mawbPiece.id !== id
                );
                return filtered;
            });
            notify('Pieces Deleted'); 
            return true;
        }
        return false;
    };

    const createUpdateBooking: CreateUpdateBooking = async (
        data: IBooking,
        update: boolean
    ): Promise<boolean> => {
        if (update) {
            const res = await api('put', `/booking/${data.id}`, data);
            if (res.status === 204) {
                setBookings((prevState) => {
                    const bookings = _.cloneDeep(prevState);
                    for (let i = 0; i < bookings.length; i++) {
                        if (bookings[i].id === data.id) {
                            bookings[i] = data;
                            break;
                        }
                    }
                    return bookings;
                });
                notify(`Booking updated`);
            }
            return res.status === 204;
        } else {
            const res = await api('post', '/booking', data);
            if (res.status === 200) {
                setBookings((prevState) => {
                    const bookings = _.cloneDeep(prevState);
                    bookings.push(res.data);
                    return bookings;
                });
                notify(`Booking created`);
            }
            return res.status === 200;
        }
    };

    const deleteBooking: DeleteBooking = async (
        id: number
    ): Promise<boolean> => {
        const res = await api('delete', `/booking/${id}`);
        if (res.status === 204) {
            setBookings((prevState) => {
                const filtered = prevState.filter(
                    (booking) => booking.id !== id
                );
                return filtered;
            });
            notify(`Booking Deleted`);
        }
        return res.status === 204;
    };

    return {
        bookingMawb,
        setBookingMawb,
        bookingMawbPieces,
        bookings,
        shcs,
        createUpdateBookingMawb,
        createUpdateBookingMawbPieces,
        deleteBookMawbPieces,
        createUpdateBooking,
        deleteBooking,
        removeBookingMawb
    };
}
