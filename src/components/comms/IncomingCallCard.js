import React from "react";

export default class IncomingCallCard extends React.Component {
    constructor(props) {
        super(props);
        this.incomingCall = props.incomingCall;
        this.acceptCallOptions = props.acceptCallOptions;
        this.acceptCallWithVideoOptions = props.acceptCallWithVideoOptions;
    }

    async componentWillMount() {
        this.acceptCallOptions = { videoOptions: (await this.acceptCallOptions()).videoOptions };
        this.acceptCallWithVideoOptions = { videoOptions: (await this.acceptCallWithVideoOptions()).videoOptions };
    }

    render() {
        return (
            <div className="ms-Grid mt-2">
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg6">
                        <h2>Incoming Call...</h2>
                    </div>
                    <div className="ms-Grid-col ms-lg6 text-right">
                        {
                            this.call &&
                            <h2>Call Id: {this.state.callId}</h2>
                        }
                    </div>
                </div>
                <div className="custom-row">
                    <div className="ringing-loader mb-4"></div>
                </div>
                <div className="ms-Grid-row text-center">
                    <span className="incoming-call-button"
                        title={'Answer call with video off'}
                        onClick={() => this.incomingCall.accept(this.acceptCallOptions)}>
                        <i className="fal fa-phone medium-icon"></i>
                    </span>
                    <span className="incoming-call-button"
                        title={'Answer call with video on'}
                        onClick={() => this.incomingCall.accept(this.acceptCallWithVideoOptions)}>
                        <i className="fal fa-video medium-icon"></i>
                    </span>
                    <span className="incoming-call-button"
                        title={'Reject call'}
                        onClick={() => { this.incomingCall.reject(); this.props.onReject(); }}>
                        <i className="fal fa-phone-slash medium-icon"></i>
                    </span>
                </div>
            </div>
        );
    }
}