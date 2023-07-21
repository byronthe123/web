import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';
import ReactTable from '../../components/custom/ReactTable';

export default ({
    modal,
    setModal,
    wikis,
    handleSelectWiki
}) => {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader>Search for Wiki</ModalHeader>
            <ModalBody>
                <ReactTable 
                    data={wikis}
                    mapping={[
                        {
                            name: 'Title',
                            value: 's_title'
                        },
                        {
                            name: 'Category',
                            value: 's_category'
                        },
                        {
                            name: 'Tags',
                            value: 's_tags'
                        }
                    ]}
                    numRows={10}
                    enableClick={true}
                    handleClick={(item) => handleSelectWiki(item)}
                />
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}