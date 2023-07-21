import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Label, Input, FormGroup } from 'reactstrap';
import { CallClient, CallAgent, VideoStreamRenderer, LocalVideoStream } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { asyncHandler, api } from '../../utils';
import { v4 as createGUID } from 'uuid';
import MakeCall from './comms/MakeCall';

export default function Comms ({
    user
}) {

    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const getToken = asyncHandler(async() => {
            const res = await api('get', 'comms/test');
            setToken(res.data);
        });
        if (user.s_unit) {
            // getToken();
        }
    }, [user.s_unit]);

    const handleCall = async () => {
        const callClient = new CallClient(); 
        const userTokenCredential = token;
        try {
            const tokenCredential = new AzureCommunicationTokenCredential(userTokenCredential);
            const callAgent = await callClient.createCallAgent(tokenCredential);

            const call = callAgent.startCall(
                [{ id: userId }],
                {}
            );
        } catch(error) {
            window.alert("Please submit a valid token!");
        }
    }

    // const handleCall = async () => {
    //     const callClient = new CallClient();
    //     const tokenCredential = new AzureCommunicationTokenCredential(token);
    //     const callAgent = await callClient.createCallAgent(tokenCredential, { displayName: 'Byron' });
        
    //     let deviceManager;
    //     // Receive an incoming call
    //     // To handle incoming calls you need to listen to the `incomingCall` event of `callAgent`. Once there is an incoming call, you need to enumerate local cameras and construct 
    //     // a `LocalVideoStream` instance to send a video stream to the other participant. You also need to subscribe to `remoteParticipants` to handle remote video streams. You can 
    //     // accept or reject the call through the `incomingCall` instance. 
    //     callAgent.on('incomingCall', async e => {
    //         const videoDevices = await deviceManager.getCameras();
    //         const videoDeviceInfo = videoDevices[0];
    //         const localVideoStream = new LocalVideoStream(videoDeviceInfo);
    //         localVideoView();
    
    //         const addedCall = await e.incomingCall.accept({videoOptions: {localVideoStreams:[localVideoStream]}});
    //         call = addedCall;
    
    //         subscribeToRemoteParticipantInCall(addedCall);  
    //     });
        
    //     // Subscribe to call updates
    //     // You need to subscribe to the event when the remote participant ends the call to dispose of video renderers and toggle button states. 
    //     callAgent.on('callsUpdated', e => {
    //         e.removed.forEach(removedCall => {
    //             // dispose of video renders
    //             rendererLocal.dispose();
    //             rendererRemote.dispose();

    //         })
    //     })
    
    //     deviceManager = await callClient.getDeviceManager();
    //     callButton.disabled = false;
    // }

    const [groupId, setGroupId] = useState('');
    const [screenWidth, setScreenWidth] = useState(0);
    const [localVideoStream, setLocalVideoStream] = useState(undefined);

    const getGroupIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('groupId');
    };
    
    const getGroupId = () => {
        if (groupId) return groupId;
        const uriGid = getGroupIdFromUrl();
        const gid = uriGid == null || uriGid === '' ? createGUID() : uriGid;
        setGroupId(gid);
        return gid;
    }; 


    return (
        // <Row>
        //     <Col md={12}>
        //         <FormGroup>
        //             <Label>ID</Label>
        //             <Input type={'text'} value={userId} onChange={(e) => setUserId(e.target.value)} />
        //         </FormGroup>
        //         <Button onClick={() => handleCall()}>Call</Button>
        //         {/* <GroupCall 
        //             endCallHandler={() => {}}
        //             groupId={getGroupId()}
        //             screenWidth={screenWidth}
        //             localVideoStream={localVideoStream}
        //             setLocalVideoStream={setLocalVideoStream}
        //         /> */}
        //     </Col>
        // </Row>
        <MakeCall />
    );
}