import React from "react";
import { utils } from './Utils/Utils';
import { Persona, PersonaSize } from 'office-ui-fabric-react';
import { Row, Col } from 'reactstrap';

export default class RemoteParticipantCard extends React.Component {
    constructor(props) {
        super(props);
        this.call = props.call;
        this.remoteParticipant = props.remoteParticipant;
        this.id = utils.getIdentifierText(this.remoteParticipant.identifier);

        this.state = {
            isSpeaking: this.remoteParticipant.isSpeaking,
            state: this.remoteParticipant.state,
            isMuted: this.remoteParticipant.isMuted,
            displayName: this.remoteParticipant.displayName?.trim()
        };
    }

    async componentWillMount() {
        this.remoteParticipant.on('isMutedChanged', () => {
            this.setState({ isMuted: this.remoteParticipant.isMuted })
        });

        this.remoteParticipant.on('stateChanged', () => {
            this.setState({ state: this.remoteParticipant.state })
        });

        this.remoteParticipant.on('isSpeakingChanged', () => {
            this.setState({ isSpeaking: this.remoteParticipant.isSpeaking });
        })

        this.remoteParticipant.on('displayNameChanged', () => {
            this.setState({ displayName: this.remoteParticipant.displayName?.trim() });
        })
    }

    handleRemoveParticipant(e, identifier) {
        e.preventDefault();
        this.call.removeParticipant(identifier).catch((e) => console.error(e))
    }

    render() {
        return (
            <Col md={4}>
                <Row>
                    <Col md={12} className={'text-center'}>
                        <Persona className={this.state.isSpeaking ? `speaking-border-for-initials` : ``}
                            size={PersonaSize.size40}
                            text={ this.state.displayName ? this.state.displayName : utils.getIdentifierText(this.remoteParticipant.identifier) }
                            secondaryText={this.state.state}
                            styles={{ primaryText: {color: 'black'}, secondaryText: {color: 'grey'} }}
                        />
                    </Col>
                </Row>
                {/* <Row>
                    <Col md={12} className={'text-center'}>
                    {
                        this.state.isMuted &&
                        <i className="fal fa-microphone-slash medium-icon"></i>
                    }
                    {
                        !this.state.isMuted &&
                        <i className="fal fa-microphone medium-icon"></i>
                    }
                    </Col>
                </Row> */}
            </Col>
        )
    }
}

{/* <div className="text-right">
<a href="#" onClick={e => this.handleRemoveParticipant(e, this.remoteParticipant.identifier)} className="participant-remove float-right ml-3">Remove participant</a>
</div> */}



