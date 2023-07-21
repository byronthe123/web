import React from "react";
import { CallClient, LocalVideoStream } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
    PrimaryButton,
    TextField,
    MessageBar,
    MessageBarType
} from 'office-ui-fabric-react'
import { Icon } from '@fluentui/react/lib/Icon';
import IncomingCallCard from './IncomingCallCard';
import CallCard from './CallCard'
import Login from './Login';
import { setLogLevel } from '@azure/logger';

export default class MakeCall extends React.Component {
    constructor(props) {
        super(props);
        this.callClient = null;
        this.callAgent = null;
        this.deviceManager = null;
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
            loggedIn: false,
            call: undefined,
            incomingCall: undefined,
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

    handleLogIn = async (userDetails) => {
        if (userDetails) {
            try {
                const tokenCredential = new AzureCommunicationTokenCredential(userDetails.token);
                setLogLevel('verbose');
                this.callClient = new CallClient();
                this.callAgent = await this.callClient.createCallAgent(tokenCredential, { displayName: userDetails.displayName });
                window.callAgent = this.callAgent;
                this.deviceManager = await this.callClient.getDeviceManager();
                await this.deviceManager.askDevicePermission({ audio: true });
                await this.deviceManager.askDevicePermission({ video: true });
                this.callAgent.on('callsUpdated', e => {
                    console.log(`callsUpdated, added=${e.added}, removed=${e.removed}`);

                    e.added.forEach(call => {
                        this.setState({ call: call })
                    });

                    e.removed.forEach(call => {
                        if (this.state.call && this.state.call === call) {
                            this.displayCallEndReason(this.state.call.callEndReason);
                        }
                    });
                });
                this.callAgent.on('incomingCall', args => {
                    const incomingCall = args.incomingCall;
                    if (this.state.call) {
                        incomingCall.reject();
                        return;
                    }

                    this.setState({incomingCall: incomingCall});

                    incomingCall.on('callEnded', args => {
                        this.displayCallEndReason(args.callEndReason);
                    });

                });

                this.setState({ loggedIn: true });
            } catch (e) {
                console.error(e);
            }
        }
    }

    displayCallEndReason = (callEndReason) => {
        if (callEndReason.code !== 0 || callEndReason.subCode !== 0) {
            this.setState({ callError: `Call end reason: code: ${callEndReason.code}, subcode: ${callEndReason.subCode}` });
        }

        this.setState({ call: null, incomingCall: null });
    }

    placeCall = async (withVideo) => {
        try {
            let identitiesToCall = [];
            const userIdsArray = this.destinationUserIds.value.split(',');
            const phoneIdsArray = this.destinationPhoneIds.value.split(',');

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

            phoneIdsArray.forEach((phoneNumberId, index) => {
                if (phoneNumberId) {
                    phoneNumberId = phoneNumberId.trim();
                    phoneNumberId = { phoneNumber: phoneNumberId };
                    if (!identitiesToCall.find(id => { return id === phoneNumberId })) {
                        identitiesToCall.push(phoneNumberId);
                    }
                }
            });

            const callOptions = await this.getCallOptions(withVideo);

            if (this.alternateCallerId.value !== '') {
                callOptions.alternateCallerId = { phoneNumber: this.alternateCallerId.value.trim() };
            }

            this.callAgent.startCall(identitiesToCall, callOptions);

        } catch (e) {
            console.error('Failed to place a call', e);
            this.setState({ callError: 'Failed to place a call: ' + e });
        }
    };

    joinGroup = async (withVideo) => {
        try {
            const callOptions = await this.getCallOptions(withVideo);
            this.callAgent.join({ groupId: this.destinationGroup.value }, callOptions);
        } catch (e) {
            console.error('Failed to join a call', e);
            this.setState({ callError: 'Failed to join a call: ' + e });
        }
    };

    joinTeamsMeeting = async (withVideo) => {
        try {
            const callOptions = await this.getCallOptions(withVideo);
            if(this.meetingLink.value && !this.messageId.value && !this.threadId.value && this.tenantId && this.organizerId) {
                this.callAgent.join({ meetingLink: this.meetingLink.value}, callOptions);

            } else if(!this.meetingLink.value && this.messageId.value && this.threadId.value && this.tenantId && this.organizerId) {
                this.callAgent.join({
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

    async getCallOptions(withVideo) {
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

        const cameras = await this.deviceManager.getCameras();
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
            const speakers = await this.deviceManager.getSpeakers();
            const speakerDevice = speakers[0];
            if (!speakerDevice || speakerDevice.id === 'speaker:') {
                throw new Error('No speaker devices found.');
            } else if (speakerDevice) {
                this.setState({
                    selectedSpeakerDeviceId: speakerDevice.id,
                    speakerDeviceOptions: speakers.map(speaker => { return { key: speaker.id, text: speaker.name } })
                });
                await this.deviceManager.selectSpeaker(speakerDevice);
            }
        } catch (e) {
            speakerWarning = e.message;
        }

        try {
            const microphones = await this.deviceManager.getMicrophones();
            const microphoneDevice = microphones[0];
            if (!microphoneDevice || microphoneDevice.id === 'microphone:') {
                throw new Error('No microphone devices found.');
            } else {
                this.setState({
                    selectedMicrophoneDeviceId: microphoneDevice.id,
                    microphoneDeviceOptions: microphones.map(microphone => { return { key: microphone.id, text: microphone.name } })
                });
                await this.deviceManager.selectMicrophone(microphoneDevice);
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
        const callSampleCode = ``;

        const streamingSampleCode = ``;

        const muteUnmuteSampleCode = ``;

        const holdUnholdSampleCode = ``;

        const deviceManagerSampleCode = ``;

        // TODO: Create section component. Couldnt use the ExampleCard compoenent from uifabric becuase its buggy,
        //       when toggling their show/hide code functionality, videos dissapear from DOM.

        return (
            <div>
                <Login onLoggedIn={this.handleLogIn} />
                <div className="card">
                    <div className="ms-Grid">
                        <div className="ms-Grid-row">
                            <h2 className="ms-Grid-col ms-lg6 ms-sm6 mb-4">Placing and receiving calls</h2>
                            <div className="ms-Grid-col ms-lg6 ms-sm6 text-right">
                                <PrimaryButton
                                    className="code-button"
                                    iconProps={{ iconName: 'TransferCall', style: { verticalAlign: 'middle', fontSize: 'large' } }}
                                    text={`${this.state.showCallSampleCode ? 'Hide' : 'Show'} code`}
                                    onClick={() => this.setState({ showCallSampleCode: !this.state.showCallSampleCode })}>
                                </PrimaryButton>
                            </div>
                        </div>
                        <div className="mb-2">Having provisioned an ACS Identity and initialized the SDK from the section above, you are now ready to place calls, join group calls, and receiving calls.</div>
                        {
                            this.state.showCallSampleCode &&
                            <pre>
                                <code style={{ color: '#b3b0ad' }}>
                                    {callSampleCode}
                                </code>
                            </pre>
                        }
                        {
                            this.state.callError &&
                            <MessageBar
                                messageBarType={MessageBarType.error}
                                isMultiline={false}
                                onDismiss={() => { this.setState({ callError: undefined }) }}
                                dismissButtonAriaLabel="Close">
                                <b>{this.state.callError}</b>
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
                            !this.state.incomingCall && !this.state.call &&
                            <div className="ms-Grid-row mt-3">
                                <div className="call-input-panel mb-5 ms-Grid-col ms-sm12 ms-lg12 ms-xl12 ms-xxl4">
                                    <h3 className="mb-1">Place a call</h3>
                                    <div>Enter an Identity to make a call to.</div>
                                    <div>You can specify multiple Identities to call by using "," separated values.</div>
                                    <div>If calling a Phone Identity, your Alternate Caller Id must be specified. </div>
                                    <TextField disabled={this.state.call || !this.state.loggedIn}
                                        label="Destination Identity or Identities"
                                        componentRef={(val) => this.destinationUserIds = val} />
                                    <div className="ms-Grid-row mb-3 mt-3">
                                        <div className="ms-Grid-col ms-lg6 ms-sm12">
                                            <TextField disabled={this.state.call || !this.state.loggedIn}
                                                label="Destination Phone Identity or Phone Identities"
                                                componentRef={(val) => this.destinationPhoneIds = val} />
                                        </div>
                                        <div className="ms-Grid-col ms-lg6 ms-sm12">
                                            <TextField disabled={this.state.call || !this.state.loggedIn}
                                                label="Alternate Caller Id (For calling phone numbers only)"
                                                componentRef={(val) => this.alternateCallerId = val} />
                                        </div>
                                    </div>
                                    <PrimaryButton className="primary-button"
                                        iconProps={{ iconName: 'Phone', style: { verticalAlign: 'middle', fontSize: 'large' } }}
                                        text="Place call"
                                        disabled={this.state.call || !this.state.loggedIn}
                                        onClick={() => this.placeCall(false)}>
                                    </PrimaryButton>
                                    <PrimaryButton className="primary-button"
                                        iconProps={{ iconName: 'Video', style: { verticalAlign: 'middle', fontSize: 'large' } }}
                                        text="Place call with video"
                                        disabled={this.state.call || !this.state.loggedIn}
                                        onClick={() => this.placeCall(true)}>
                                    </PrimaryButton>
                                </div>
                                <div className="call-input-panel mb-5 ms-Grid-col ms-sm12 ms-lg12 ms-xl12 ms-xxl4">
                                    <h3 className="mb-1">Join a group call</h3>
                                    <div>Group Id must be in GUID format.</div>
                                    <TextField className="mb-3"
                                        disabled={this.state.call || !this.state.loggedIn}
                                        label="Group Id"
                                        placeholder="29228d3e-040e-4656-a70e-890ab4e173e5"
                                        defaultValue="29228d3e-040e-4656-a70e-890ab4e173e5"
                                        componentRef={(val) => this.destinationGroup = val} />
                                    <PrimaryButton className="primary-button"
                                        iconProps={{ iconName: 'Group', style: { verticalAlign: 'middle', fontSize: 'large' } }}
                                        text="Join group call"
                                        disabled={this.state.call || !this.state.loggedIn}
                                        onClick={() => this.joinGroup(false)}>
                                    </PrimaryButton>
                                    <PrimaryButton className="primary-button"
                                        iconProps={{ iconName: 'Video', style: { verticalAlign: 'middle', fontSize: 'large' } }}
                                        text="Join group call with video"
                                        disabled={this.state.call || !this.state.loggedIn}
                                        onClick={() => this.joinGroup(true)}>
                                    </PrimaryButton>
                                </div>
                                <div className="call-input-panel mb-5 ms-Grid-col ms-sm12 ms-lg12 ms-xl12 ms-xxl4">
                                    <h3 className="mb-1">Join a Teams meeting</h3>
                                    <div>Enter meeting link</div>
                                    <TextField className="mb-3"
                                                disabled={this.state.call || !this.state.loggedIn}
                                                label="Meeting link"
                                                componentRef={(val) => this.meetingLink = val}/>
                                    <div> Or enter meeting coordinates (Thread Id, Message Id, Organizer Id, and Tenant Id)</div>
                                    <TextField disabled={this.state.call || !this.state.loggedIn}
                                                label="Thread Id"
                                                componentRef={(val) => this.threadId = val}/>
                                    <TextField disabled={this.state.call || !this.state.loggedIn}
                                                label="Message Id"
                                                componentRef={(val) => this.messageId = val}/>
                                    <TextField disabled={this.state.call || !this.state.loggedIn}
                                                label="Organizer Id"
                                                componentRef={(val) => this.organizerId = val}/>
                                    <TextField className="mb-3"
                                                disabled={this.state.call || !this.state.loggedIn}
                                                label="Tenant Id"
                                                componentRef={(val) => this.tenantId = val}/>
                                    <PrimaryButton className="primary-button"
                                                    iconProps={{iconName: 'Group', style: {verticalAlign: 'middle', fontSize: 'large'}}}
                                                    text="Join Teams meeting"
                                                    disabled={this.state.call || !this.state.loggedIn}
                                                    onClick={() => this.joinTeamsMeeting(false)}>
                                    </PrimaryButton>
                                    <PrimaryButton className="primary-button"
                                                    iconProps={{ iconName: 'Video', style: { verticalAlign: 'middle', fontSize: 'large' } }}
                                                    text="Join Teams meeting with video"
                                                    disabled={this.state.call || !this.state.loggedIn}
                                                    onClick={() => this.joinTeamsMeeting(true)}>
                                    </PrimaryButton>
                                </div>
                            </div>
                        }
                        {
                            this.state.call && <CallCard call={this.state.call}
                                deviceManager={this.deviceManager}
                                selectedCameraDeviceId={this.state.selectedCameraDeviceId}
                                cameraDeviceOptions={this.state.cameraDeviceOptions}
                                speakerDeviceOptions={this.state.speakerDeviceOptions}
                                microphoneDeviceOptions={this.state.microphoneDeviceOptions}
                                onShowCameraNotFoundWarning={(show) => { this.setState({ showCameraNotFoundWarning: show }) }}
                                onShowSpeakerNotFoundWarning={(show) => { this.setState({ showSpeakerNotFoundWarning: show }) }}
                                onShowMicrophoneNotFoundWarning={(show) => { this.setState({ showMicrophoneNotFoundWarning: show }) }} />
                        }
                        {
                            this.state.incomingCall && !this.state.call && (<IncomingCallCard
                                incomingCall={this.state.incomingCall}
                                acceptCallOptions={async () => await this.getCallOptions()}
                                acceptCallWithVideoOptions={async () => await this.getCallOptions(true)}
                                onReject={() => { this.setState({ incomingCall: undefined }) }} />)
                        }
                    </div>
                </div>
                <div className="card">
                    <div className="ms-Grid">
                        <div className="ms-Grid-row">
                            <h2 className="ms-Grid-col ms-lg6 ms-sm6 mb-4">Video, Screen sharing, and local video preview</h2>
                            <div className="ms-Grid-col ms-lg6 ms-sm6 text-right">
                                <PrimaryButton className="code-button"
                                    iconProps={{ iconName: 'Video', style: { verticalAlign: 'middle', fontSize: 'large' } }}
                                    text={`${this.state.showStreamingSampleCode ? 'Hide' : 'Show'} code`}
                                    onClick={() => this.setState({ showStreamingSampleCode: !this.state.showStreamingSampleCode })}>
                                </PrimaryButton>
                            </div>
                        </div>
                        {
                            this.state.showStreamingSampleCode &&
                            <pre>
                                <code style={{ color: '#b3b0ad' }}>
                                    {streamingSampleCode}
                                </code>
                            </pre>
                        }
                        <h3>
                            Video - try it out.
                        </h3>
                        <div>
                            From your current call, toggle your video on and off by clicking on the <Icon className="icon-text-xlarge" iconName="Video" /> icon.
                            When you start you start your video, remote participants can see your video by receiving a stream and rendering it in an HTML element.
                        </div>
                        <br></br>
                        <h3>
                            Screen sharing - try it out.
                        </h3>
                        <div>
                            From your current call, toggle your screen sharing on and off by clicking on the <Icon className="icon-text-xlarge" iconName="TVMonitor" /> icon.
                            When you start sharing your screen, remote participants can see your screen by receiving a stream and rendering it in an HTML element.
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="ms-Grid">
                        <div className="ms-Grid-row">
                            <h2 className="ms-Grid-col ms-lg6 ms-sm6 mb-4">Mute / Unmute</h2>
                            <div className="ms-Grid-col ms-lg6 ms-sm6 text-right">
                                <PrimaryButton
                                    className="code-button"
                                    iconProps={{ iconName: 'Microphone', style: { verticalAlign: 'middle', fontSize: 'large' } }}
                                    text={`${this.state.showMuteUnmuteSampleCode ? 'Hide' : 'Show'} code`}
                                    onClick={() => this.setState({ showMuteUnmuteSampleCode: !this.state.showMuteUnmuteSampleCode })}>
                                </PrimaryButton>
                            </div>
                        </div>
                        {
                            this.state.showMuteUnmuteSampleCode &&
                            <pre>
                                <code style={{ color: '#b3b0ad' }}>
                                    {muteUnmuteSampleCode}
                                </code>
                            </pre>
                        }
                        <h3>
                            Try it out.
                        </h3>
                        <div>
                            From your current call, toggle your microphone on and off by clicking on the <Icon className="icon-text-xlarge" iconName="Microphone" /> icon.
                            When you mute or unmute your microphone, remote participants can receive an event about wether your micrphone is muted or unmuted.
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="ms-Grid">
                        <div className="ms-Grid-row">
                            <h2 className="ms-Grid-col ms-lg6 ms-sm6 mb-4">Hold / Unhold</h2>
                            <div className="ms-Grid-col ms-lg6 ms-sm6 text-right">
                                <PrimaryButton
                                    className="code-button"
                                    iconProps={{ iconName: 'Play', style: { verticalAlign: 'middle', fontSize: 'large' } }}
                                    text={`${this.state.showHoldUnholdSampleCode ? 'Hide' : 'Show'} code`}
                                    onClick={() => this.setState({ showHoldUnholdSampleCode: !this.state.showHoldUnholdSampleCode })}>
                                </PrimaryButton>
                            </div>
                        </div>
                        {
                            this.state.showHoldUnholdSampleCode &&
                            <pre>
                                <code style={{ color: '#b3b0ad' }}>
                                    {holdUnholdSampleCode}
                                </code>
                            </pre>
                        }
                        <h3>
                            Try it out.
                        </h3>
                        <div>
                            From your current call, toggle hold call and unhold call on by clicking on the <Icon className="icon-text-xlarge" iconName="Play" /> icon.
                            When you hold or unhold the call, remote participants can receive other participant state changed events. Also, the call state changes.
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="ms-Grid">
                        <div className="ms-Grid-row">
                            <h2 className="ms-Grid-col ms-lg6 ms-sm6 mb-4">Device Manager</h2>
                            <div className="ms-Grid-col ms-lg6 ms-sm6 text-right">
                                <PrimaryButton
                                    className="code-button"
                                    iconProps={{ iconName: 'Settings', style: { verticalAlign: 'middle', fontSize: 'large' } }}
                                    text={`${this.state.showDeviceManagerSampleCode ? 'Hide' : 'Show'} code`}
                                    onClick={() => this.setState({ showDeviceManagerSampleCode: !this.state.showDeviceManagerSampleCode })}>
                                </PrimaryButton>
                            </div>
                        </div>
                        {
                            this.state.showDeviceManagerSampleCode &&
                            <pre>
                                <code style={{ color: '#b3b0ad' }}>
                                    {deviceManagerSampleCode}
                                </code>
                            </pre>
                        }
                        <h3>
                            Try it out.
                        </h3>
                        <div>
                            From your current call, click on the <Icon className="icon-text-xlarge" iconName="Settings" /> icon to open up the settings panel.
                            The DeviceManager is used to select the devices (camera, microphone, and speakers) to use across the call stack and to preview your camera.
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
