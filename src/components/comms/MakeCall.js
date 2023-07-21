import React from "react";
import { LocalVideoStream } from '@azure/communication-calling';
import {
    PrimaryButton,
    TextField,
    MessageBar,
    MessageBarType
} from 'office-ui-fabric-react'
import { Row, Col, Table, Button } from 'reactstrap';
import IncomingCallCard from './IncomingCallCard';
import CallCard from './CallCard'


export default class MakeCall extends React.Component {
    constructor(props) {
        super(props);
        this.destinationUserIds = null;
        this.destinationPhoneIds = null;
        this.destinationGroup = null;
        this.meetingLink = null;
        this.threadId = null;
        this.messageId = null;
        this.organizerId = null;
        this.tenantId = null;
        this.callError = null;

        this.state = {
            id: undefined,
            showCallSampleCode: false,
            showMuteUnmuteSampleCode: false,
            showHoldUnholdCallSampleCode: false,
            selectedCameraDeviceId: null,
            selectedSpeakerDeviceId: null,
            selectedMicrophoneDeviceId: null,
            deviceManagerWarning: null,
            callError: null
        };
    }

    displayCallEndReason = (callEndReason) => {
        if (callEndReason.code !== 0 || callEndReason.subCode !== 0) {
            this.setState({ callError: `Call end reason: code: ${callEndReason.code}, subcode: ${callEndReason.subCode}` });
        }

        this.setState({ call: null, incomingCall: null });
    }

    placeCall = async (destinationUserIds, withVideo) => {
        try {
            let identitiesToCall = [];
            const userIdsArray = destinationUserIds.split(',');
            // const phoneIdsArray = destinationPhoneIds.value.split(',');

            userIdsArray.forEach((userId, index) => {
                if (userId) {
                    userId = userId.trim();
                    if (userId === '8:echo123') {
                        userId = { id: userId };
                    } else {
                        userId = { communicationUserId: userId };
                    }
                    if (!identitiesToCall.find(id => { return id === userId })) {
                        identitiesToCall.push(userId);
                    }
                }
            });

            // phoneIdsArray.forEach((phoneNumberId, index) => {
            //     if (phoneNumberId) {
            //         phoneNumberId = phoneNumberId.trim();
            //         phoneNumberId = { phoneNumber: phoneNumberId };
            //         if (!identitiesToCall.find(id => { return id === phoneNumberId })) {
            //             identitiesToCall.push(phoneNumberId);
            //         }
            //     }
            // });

            const callOptions = await this.getCallOptions(withVideo);

            if (this.alternateCallerId.value !== '') {
                callOptions.alternateCallerId = { phoneNumber: this.alternateCallerId.value.trim() };
            }

            this.props.callAgent.startCall(identitiesToCall, callOptions);

        } catch (e) {
            console.error('Failed to place a call', e);
            this.setState({ callError: 'Failed to place a call: ' + e });
        }
    };

    joinGroup = async (withVideo) => {
        try {
            const callOptions = await this.getCallOptions(withVideo);
            this.props.callAgent.join({ groupId: this.destinationGroup.value }, callOptions);
        } catch (e) {
            console.error('Failed to join a call', e);
            this.setState({ callError: 'Failed to join a call: ' + e });
        }
    };

    joinTeamsMeeting = async (withVideo) => {
        try {
            const callOptions = await this.getCallOptions(withVideo);
            if(this.meetingLink.value && !this.messageId.value && !this.threadId.value && this.tenantId && this.organizerId) {
                this.props.callAgent.join({ meetingLink: this.meetingLink.value}, callOptions);

            } else if(!this.meetingLink.value && this.messageId.value && this.threadId.value && this.tenantId && this.organizerId) {
                this.props.callAgent.join({
                                messageId: this.messageId.value,
                                threadId: this.threadId.value,
                                tenantId: this.tenantId.value,
                                organizerId: this.organizerId.value
                            }, callOptions);
            } else {
                throw new Error('Please enter Teams meeting link or Teams meeting coordinate');
            }
        } catch (e) {
            console.error('Failed to join teams meeting:', e);
            this.setState({ callError: 'Failed to join teams meeting: ' + e });
        }
    }

    handlePlaceCall = async (userId, withVideo) => {
        this.destinationUserIds = userId;
        await this.placeCall(userId, withVideo);
    }

    async getCallOptions(withVideo) {
        console.log(this.props);
        let callOptions = {
            videoOptions: {
                localVideoStreams: undefined
            },
            audioOptions: {
                muted: false
            }
        };

        let cameraWarning = undefined;
        let speakerWarning = undefined;
        let microphoneWarning = undefined;

        const cameras = await this.props.deviceManager.getCameras();
        const cameraDevice = cameras[0];
        if (cameraDevice && cameraDevice?.id !== 'camera:') {
            this.setState({
                selectedCameraDeviceId: cameraDevice?.id,
                cameraDeviceOptions: cameras.map(camera => { return { key: camera.id, text: camera.name } })
            });
        }
        if (withVideo) {
            try {
                if (!cameraDevice || cameraDevice?.id === 'camera:') {
                    throw new Error('No camera devices found.');
                } else if (cameraDevice) {
                    callOptions.videoOptions = { localVideoStreams: [new LocalVideoStream(cameraDevice)] };
                }
            } catch (e) {
                cameraWarning = e.message;
            }
        }

        try {
            const speakers = await this.props.deviceManager.getSpeakers();
            const speakerDevice = speakers[0];
            if (!speakerDevice || speakerDevice.id === 'speaker:') {
                throw new Error('No speaker devices found.');
            } else if (speakerDevice) {
                this.setState({
                    selectedSpeakerDeviceId: speakerDevice.id,
                    speakerDeviceOptions: speakers.map(speaker => { return { key: speaker.id, text: speaker.name } })
                });
                await this.props.deviceManager.selectSpeaker(speakerDevice);
            }
        } catch (e) {
            speakerWarning = e.message;
        }

        try {
            const microphones = await this.props.deviceManager.getMicrophones();
            const microphoneDevice = microphones[0];
            if (!microphoneDevice || microphoneDevice.id === 'microphone:') {
                throw new Error('No microphone devices found.');
            } else {
                this.setState({
                    selectedMicrophoneDeviceId: microphoneDevice.id,
                    microphoneDeviceOptions: microphones.map(microphone => { return { key: microphone.id, text: microphone.name } })
                });
                await this.props.deviceManager.selectMicrophone(microphoneDevice);
            }
        } catch (e) {
            microphoneWarning = e.message;
        }

        if (cameraWarning || speakerWarning || microphoneWarning) {
            this.setState({
                deviceManagerWarning:
                    `${cameraWarning ? cameraWarning + ' ' : ''}
                    ${speakerWarning ? speakerWarning + ' ' : ''}
                    ${microphoneWarning ? microphoneWarning + ' ' : ''}`
            });
        }

        return callOptions;
    }

    render() {
        return (
            <div>
                {/* <Login onLoggedIn={this.handleLogIn} /> */}
                <div className="card">
                    <div className="ms-Grid">
                        {
                            this.props.callError &&
                            <MessageBar
                                messageBarType={MessageBarType.error}
                                isMultiline={false}
                                onDismiss={() => { this.setState({ callError: undefined }) }}
                                dismissButtonAriaLabel="Close">
                                <b>{this.props.callError}</b>
                            </MessageBar>
                        }
                        {
                            this.state.deviceManagerWarning &&
                            <MessageBar
                                messageBarType={MessageBarType.warning}
                                isMultiline={false}
                                onDismiss={() => { this.setState({ deviceManagerWarning: undefined }) }}
                                dismissButtonAriaLabel="Close">
                                <b>{this.state.deviceManagerWarning}</b>
                            </MessageBar>
                        }
                        {
                            !this.props.incomingCall && !this.props.call &&
                            <Row>
                                {
                                    <Col md={12}>
                                        <Table striped style={{ maxHeight: '300px' }}>
                                            <thead>
                                                <tr>
                                                    <th>Name:</th>
                                                    <th>Email:</th>
                                                    <th>Station</th>
                                                    <th>Call</th>
                                                    <th>Chat</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.props.socket.activeUsers.map((u, i) => u.s_email !== this.props.user.s_email &&
                                                        <tr key={i}>
                                                            <td>{u.displayName}</td>
                                                            <td>{u.s_email}</td>
                                                            <td>{u.s_unit}</td>
                                                            <td>
                                                                <Button onClick={() => this.handlePlaceCall(u.commsId, false)} color={'primary'} className={'mr-1'}>Voice</Button>
                                                                <Button onClick={() => this.handlePlaceCall(u.commsId, true)} color={'secondary'}>Video</Button>
                                                            </td>
                                                            <td>
                                                                {
                                                                    u.busy ? 
                                                                        <Button color={'danger'}>Busy</Button> : 
                                                                        <Button onClick={() => this.props.initializeChatThread(u)} color={'warning'}>Chat</Button>
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </Table>
                                    </Col>
                                }
                                <Col md={12}>
                                    <h3 className="mb-1">Place a call</h3>
                                    <TextField disabled={this.props.call || !this.props.loggedIn}
                                        label="Destination Identity or Identities"
                                        componentRef={(val) => this.destinationUserIds = val} />
                                    <div className="ms-Grid-row mb-3 mt-3">
                                        <div className="ms-Grid-col ms-lg6 ms-sm12">
                                            <TextField disabled={this.props.call || !this.props.loggedIn}
                                                label="Destination Phone Identity or Phone Identities"
                                                componentRef={(val) => this.destinationPhoneIds = val} />
                                        </div>
                                        <div className="ms-Grid-col ms-lg6 ms-sm12">
                                            <TextField disabled={this.props.call || !this.props.loggedIn}
                                                label="Alternate Caller Id (For calling phone numbers only)"
                                                componentRef={(val) => this.alternateCallerId = val} />
                                        </div>
                                    </div>
                                    <PrimaryButton className="primary-button"
                                        iconProps={{ iconName: 'Phone', style: { verticalAlign: 'middle', fontSize: 'large' } }}
                                        text="Place call"
                                        disabled={this.props.call || !this.props.loggedIn}
                                        onClick={() => this.placeCall(false)}>
                                    </PrimaryButton>
                                    <PrimaryButton className="primary-button"
                                        iconProps={{ iconName: 'Video', style: { verticalAlign: 'middle', fontSize: 'large' } }}
                                        text="Place call with video"
                                        disabled={this.props.call || !this.props.loggedIn}
                                        onClick={() => this.placeCall(true)}>
                                    </PrimaryButton>
                                </Col>
                                <div className="call-input-panel mb-5 ms-Grid-col ms-sm12 ms-lg12 ms-xl12 ms-xxl4">
                                    <h3 className="mb-1">Join a group call</h3>
                                    <div>Group Id must be in GUID format.</div>
                                    <TextField className="mb-3"
                                        disabled={this.props.call || !this.props.loggedIn}
                                        label="Group Id"
                                        placeholder="29228d3e-040e-4656-a70e-890ab4e173e5"
                                        defaultValue="29228d3e-040e-4656-a70e-890ab4e173e5"
                                        componentRef={(val) => this.destinationGroup = val} />
                                    <PrimaryButton className="primary-button"
                                        iconProps={{ iconName: 'Group', style: { verticalAlign: 'middle', fontSize: 'large' } }}
                                        text="Join group call"
                                        disabled={this.props.call || !this.props.loggedIn}
                                        onClick={() => this.joinGroup(false)}>
                                    </PrimaryButton>
                                    <PrimaryButton className="primary-button"
                                        iconProps={{ iconName: 'Video', style: { verticalAlign: 'middle', fontSize: 'large' } }}
                                        text="Join group call with video"
                                        disabled={this.props.call || !this.props.loggedIn}
                                        onClick={() => this.joinGroup(true)}>
                                    </PrimaryButton>
                                </div>

                                {/* <div className="call-input-panel mb-5 ms-Grid-col ms-sm12 ms-lg12 ms-xl12 ms-xxl4">
                                    <h3 className="mb-1">Join a Teams meeting</h3>
                                    <div>Enter meeting link</div>
                                    <TextField className="mb-3"
                                                disabled={this.props.call || !this.props.loggedIn}
                                                label="Meeting link"
                                                componentRef={(val) => this.meetingLink = val}/>
                                    <div> Or enter meeting coordinates (Thread Id, Message Id, Organizer Id, and Tenant Id)</div>
                                    <TextField disabled={this.props.call || !this.props.loggedIn}
                                                label="Thread Id"
                                                componentRef={(val) => this.threadId = val}/>
                                    <TextField disabled={this.props.call || !this.props.loggedIn}
                                                label="Message Id"
                                                componentRef={(val) => this.messageId = val}/>
                                    <TextField disabled={this.props.call || !this.props.loggedIn}
                                                label="Organizer Id"
                                                componentRef={(val) => this.organizerId = val}/>
                                    <TextField className="mb-3"
                                                disabled={this.props.call || !this.props.loggedIn}
                                                label="Tenant Id"
                                                componentRef={(val) => this.tenantId = val}/>
                                    <PrimaryButton className="primary-button"
                                                    iconProps={{iconName: 'Group', style: {verticalAlign: 'middle', fontSize: 'large'}}}
                                                    text="Join Teams meeting"
                                                    disabled={this.props.call || !this.props.loggedIn}
                                                    onClick={() => this.joinTeamsMeeting(false)}>
                                    </PrimaryButton>
                                    <PrimaryButton className="primary-button"
                                                    iconProps={{ iconName: 'Video', style: { verticalAlign: 'middle', fontSize: 'large' } }}
                                                    text="Join Teams meeting with video"
                                                    disabled={this.props.call || !this.props.loggedIn}
                                                    onClick={() => this.joinTeamsMeeting(true)}>
                                    </PrimaryButton>
                                </div> */}

                            </Row>
                        }
                        {
                            this.props.call && <CallCard call={this.props.call}
                                deviceManager={this.props.deviceManager}
                                selectedCameraDeviceId={this.state.selectedCameraDeviceId}
                                cameraDeviceOptions={this.state.cameraDeviceOptions}
                                speakerDeviceOptions={this.state.speakerDeviceOptions}
                                microphoneDeviceOptions={this.state.microphoneDeviceOptions}
                                onShowCameraNotFoundWarning={(show) => { this.setState({ showCameraNotFoundWarning: show }) }}
                                onShowSpeakerNotFoundWarning={(show) => { this.setState({ showSpeakerNotFoundWarning: show }) }}
                                onShowMicrophoneNotFoundWarning={(show) => { this.setState({ showMicrophoneNotFoundWarning: show }) }} 
                                handleCallEnd={this.props.handleCallEnd}
                            />
                        }
                        {
                            this.props.incomingCall && !this.props.call && (<IncomingCallCard
                                incomingCall={this.props.incomingCall}
                                acceptCallOptions={async () => await this.getCallOptions()}
                                acceptCallWithVideoOptions={async () => await this.getCallOptions(true)}
                                onReject={() => { this.setState({ incomingCall: undefined }) }} />)
                        }
                    </div>
                </div>

                {/* Removed code from Video, Screen sharing  */}

            </div>
        );
    }
}
