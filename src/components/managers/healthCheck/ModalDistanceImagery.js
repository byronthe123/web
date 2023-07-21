import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import axios from 'axios';

export default ({
    modal,
    setModal,
    selectedItem
}) => {

    const toggle = () => setModal(!modal);
    const [imagery, setImagery] = useState('');

    const getImagery = async (s_location) => {
        try {
            const centerPoint = '40.705548, -74.163944';
            const zoom = 9;
            const response = await axios.get(`http://dev.virtualearth.net/REST/V1/Imagery/Map/Road/${centerPoint}/${zoom}?mapSize=400,500&dc=cv,FF009900,2;${centerPoint}_${s_location}&fmt=jpeg&key=AtiTennasQNfwg8EEwaVQi0T5pAZKfh2d9PXE0CkITWkY-vITGZTpnnO6D8ZT9TC`,  {
                responseType: 'arraybuffer'
            });

            const photo = new Buffer(response.data, 'binary').toString('base64');
            setImagery(photo);
        } catch (err) {
            alert(err);
        }
    }

    useEffect(() => {
        if (selectedItem.s_location) {
            getImagery(selectedItem.s_location);
        }
    }, [selectedItem]);

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader>Location Imagery</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md={12} className='text-center'>
                            <img src={`data:image/png;base64,${imagery}`} />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>Exit</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}