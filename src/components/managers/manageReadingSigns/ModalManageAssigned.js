import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
import moment from 'moment';

export default ({
    modal,
    setModal,
    readingSignRecord,
    selectedAssignment,
    unassignReadingSign
}) => {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader>Manage Assignment</ModalHeader>
            <ModalBody>
                <Table striped>
                    <thead>
                        <th>Title</th>
                        <th>Acknowledged</th>
                        <th>Acknowledged Date</th>
                    </thead>
                    <tbody>
                        <td>{readingSignRecord.title}</td>
                        <td>{selectedAssignment.acknowledged ? 'YES' : 'NO'}</td>
                        <td>{selectedAssignment.acknowledged ? moment.utc(selectedAssignment.updatedAt).format('MM/DD/YYYY HH:mm:ss'): ''}</td>
                    </tbody>
                </Table>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={() => unassignReadingSign()}>Unassign</Button>{' '}
                <Button color="secondary" onClick={toggle}>Exit</Button>
            </ModalFooter>
        </Modal>
    );
}