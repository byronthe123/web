import React, { useContext } from 'react';
import { AppContext } from '../../context/index';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';
import MakeCall from './MakeCall';
import { api, asyncHandler } from '../../utils';
import { ChatFeed, Message } from 'react-chat-ui';

export default () => {

    const { user, comms, socket } = useContext(AppContext);
    const { 
        callClient,
        chatClient,
        callAgent,
        deviceManager,
        loggedIn,
        call,
        incomingCall,
        modalComms, 
        setModalComms, 
        data,
        handleCallEnd,
        initializeChatThread 
    } = comms;

    const toggle = () => setModalComms(!modalComms);

    return (
        <Modal isOpen={modalComms} toggle={toggle} style={{ width: '1200px', maxWidth: '100%' }}>
            <ModalHeader>EOS Comms</ModalHeader>
            <ModalBody>
                <MakeCall 
                    callClient={callClient}
                    chatClient={chatClient}
                    callAgent={callAgent}
                    deviceManager={deviceManager}
                    loggedIn={loggedIn}
                    call={call}
                    incomingCall={incomingCall}
                    handleCallEnd={handleCallEnd}
                    user={user}
                    data={data}
                    api={api}
                    asyncHandler={asyncHandler}
                    socket={socket}
                    initializeChatThread={initializeChatThread}
                />
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Exit</Button>
            </ModalFooter>
        </Modal>
    );
}