import React, { useState, useEffect } from 'react';
import { Wizard, Steps, Step } from 'react-albus';

import Layout from '../../custom/Layout';
import TopNavigation from '../../../components/wizard-hooks/TopNavigation';
import { IStep, IWizardProps, PushStep } from '../../../globals/interfaces';
import useData from './useData';
import { useAppContext } from '../../../context';
import CreateUpdateMawb from './CreateUpdateMawb';
import AddPieces from './AddPieces';
import BookOnFlight from './BookOnFlight';
import Confirmation from './Confirmation';

export default function Booking() {
    const { user } = useAppContext();
    const [s_mawb, set_s_mawb] = useState('');
    const {
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
    } = useData(s_mawb, user);

    const topNavClick = (stepItem: IStep, push: PushStep) => {
        if (stepItem.id === 'mawb') {
            push(stepItem.id);
        } else {
            bookingMawb && bookingMawb.id && push(stepItem.id);
        }
    };

    console.log('Booking rerender');

    return (
        <Layout>
            <Wizard
                render={({
                    step,
                    steps,
                    next,
                    push,
                    previous,
                }: IWizardProps) => (
                    <div>
                        <div className="wizard wizard-default mt-1">
                            <TopNavigation
                                className="justify-content-center mb-4"
                                disableNav={false}
                                topNavClick={topNavClick}
                            />
                        </div>
                        <Steps>
                            <Step id={'mawb'} name={'Create/Edit MAWB'}>
                                <CreateUpdateMawb
                                    bookingMawb={bookingMawb}
                                    setBookingMawb={setBookingMawb}
                                    user={user}
                                    shcs={shcs}
                                    set_s_mawb={set_s_mawb}
                                    createUpdateBookingMawb={
                                        createUpdateBookingMawb
                                    }
                                    next={next}
                                />
                            </Step>
                            <Step id={'pieces'} name={'Add Pieces'}>
                                <AddPieces
                                    user={user}
                                    bookingMawb={bookingMawb}
                                    bookingMawbPieces={bookingMawbPieces}
                                    shcs={shcs}
                                    createUpdateBookingMawbPieces={createUpdateBookingMawbPieces}
                                    deleteBookMawbPieces={deleteBookMawbPieces}
                                />
                            </Step>
                            <Step id={'bookOnFlight'} name={'Book on Flight'}>
                                <BookOnFlight 
                                    user={user}
                                    bookingMawb={bookingMawb}
                                    bookings={bookings}
                                    shcs={shcs}
                                    createUpdateBooking={createUpdateBooking}
                                    deleteBooking={deleteBooking}
                                />
                            </Step>
                            <Step id={'confirmation'} name={'Confirmation'}>
                                <Confirmation 
                                    bookingMawb={bookingMawb}
                                    removeBookingMawb={removeBookingMawb}
                                    push={push}
                                />
                            </Step>
                        </Steps>
                    </div>
                )}
            />
        </Layout>
    );
}
