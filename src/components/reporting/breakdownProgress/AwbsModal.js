import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import FlightAwbs from './FlightAwbs';

export default ({
    modal,
    setModal,
    user,
    stationInfo,
    selectedFlight,
    s_flight_id,
    d_arrival_date,
    handleViewRackData,
    emailBreakdownReport
}) => {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} style={{ maxWidth: '100%', width: '910px' }}>
            <ModalHeader>
                <i className="far fa-arrow-left mr-2" onClick={toggle} />
                Breakdown by AWB for Flight {s_flight_id}
            </ModalHeader>
            <ModalBody>
                <FlightAwbs 
                    d_arrival_date={d_arrival_date}
                    selectedFlight={selectedFlight}
                    s_flight_id={s_flight_id}
                    handleViewRackData={handleViewRackData}
                    user={user}
                    stationInfo={stationInfo}
                    emailBreakdownReport={emailBreakdownReport}
                />
            </ModalBody>
        </Modal>
    );
}