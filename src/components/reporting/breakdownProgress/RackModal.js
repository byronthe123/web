import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';
import { formatMawb } from '../../../utils';

import ReactTable from '../../custom/ReactTable';

export default ({
    modal,
    setModal,
    rackData,
    selectedAwb,
    s_flight_id,
    handleSearchAwb
}) => {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'} scrollable>
            <ModalHeader>
                <i className="far fa-arrow-left mr-2" onClick={toggle} />
                Rack Data for <span className='hyperlink' onClick={() => handleSearchAwb(null, selectedAwb)}>{formatMawb(selectedAwb)}</span> ({s_flight_id})
            </ModalHeader>
            <ModalBody>
                <ReactTable 
                    data={rackData}
                    mapping={[{
                        name: 'Status',
                        value: 's_status'
                    }, {
                        name: 'HAWB',
                        value: 's_hawb'
                    }, {
                        name: 'Location',
                        value: 's_location'
                    }, {
                        name: 'Pieces',
                        value: 'i_pieces',
                        number: true
                    }, {
                        name: 'Platform',
                        value: 's_platform'
                    },{
                        name: 'Modified by',
                        value: 's_modified_by',
                        email: true
                    }, {
                        name: 'Modified',
                        value: 't_modified',
                        shortDate: true,
                        utc: true
                    }, ]}
                    numRows={10}
                />
            </ModalBody>
        </Modal>
    );
}