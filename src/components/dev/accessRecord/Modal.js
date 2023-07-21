import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BingMapsReact from "bingmaps-react";

export default ({
    modal,
    setModal,
    pushPins
}) => {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader>Map</ModalHeader>
            <ModalBody>
            <div>
                <BingMapsReact
                    bingMapsKey="AmxMQfGEZaIT3yz4ygVGg6SkfqCBzYbc7eoHQEkgRa_wfdkiop-LpyQGMBAkHvAw"
                    height="600px"
                    mapOptions={{
                        navigationBarMode: "square",
                    }}
                    width="600px"
                    viewOptions={{
                        center: { latitude: 40.746432, longitude: -73.891427 },
                        mapTypeId: "color",
                    }}
                    pushPins={pushPins}
                    // pushPins={[{
                    //     center: {
                    //         latitude:40.698,
                    //         longitude: -73.7623, 
                    //     },
                    //     options: {
                    //       title: "1",
                    //     },
                    // }, {
                    //     center: {
                    //         latitude: 43.2138,
                    //         longitude: -77.4575, 
                    //     },
                    //     options: {
                    //       title: "2",
                    //     },
                    // }, {
                    //     center: {
                    //         latitude: 40.6586,
                    //         longitude: -73.6026, 
                    //     },
                    //     options: {
                    //       title: "3",
                    //     },
                    // }]}
                />
            </div>

            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Exit</Button>
            </ModalFooter>
        </Modal>
    );
}