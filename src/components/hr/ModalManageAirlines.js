import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';
import ReactTable from '../../components/custom/ReactTable';

export default ({
    modal,
    setModal,
    airlines,
    selectedAirlines,
    addRemoveAirline,
    selectedEmployee
}) => {

    const toggle = () => setModal(!modal);

    const [key, setKey] = useState(0);

    useEffect(() => {
        setKey(key+1);
    }, [selectedAirlines]);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader>Manage Airlines for {selectedEmployee.s_first_name} {selectedEmployee.s_airline_codes && `(${selectedEmployee.s_airline_codes})` || ''}</ModalHeader>
            <ModalBody>
                <ReactTable 
                    data={airlines}
                    mapping={[
                        {
                            name: 'Prefix',
                            value: 's_airline_prefix',
                            smallWidth: true
                        },
                        {
                            name: 'Code',
                            value: 's_airline_code',
                            smallWidth: true
                        },
                        {
                            name: 'Name',
                            value: 's_airline_name'
                        },
                        {
                            name: '',
                            value: 'fas fa-plus',
                            icon: true,
                            showCondition: item => selectedAirlines[item.s_airline_code] === undefined,
                            function: item => addRemoveAirline(item.s_airline_code)
                        },
                        {
                            name: '',
                            value: 'fas fa-trash',
                            icon: true,
                            showCondition: item => selectedAirlines[item.s_airline_code] !== undefined,
                            function: item => addRemoveAirline(item.s_airline_code)
                        },
                    ]}
                    key={key}
                    customHeight={'500px'}
                />
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={toggle}>Submit</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}