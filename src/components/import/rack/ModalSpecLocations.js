import React from 'react';
import { Modal, ModalBody, Row, Col } from 'reactstrap';

export default ({
    modal,
    setModal,
    selectedLocation,
    selectedItems,
    handleAddUpdate
}) => {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'} scrollable={true}>
            {/* <ModalHeader>Locations at {selectedLocation}</ModalHeader> */}
            <ModalBody>
                <Row style={{ maxHeight: '80vh', overFlowY: 'scroll' }}>
                    {
                        selectedItems.map((item, i) => (
                            <Col 
                                md={2} 
                                key={i} 
                                className={'pr-1 mb-2 bg-primary hover-pointer'} 
                                style={{ border: '3px solid #dee2e6' }}
                                onClick={() => handleAddUpdate(false, item)}
                            >
                                { item.s_mawb }
                            </Col>
                        ))
                    }
                </Row>
            </ModalBody>
        </Modal>
    );
}