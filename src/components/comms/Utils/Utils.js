import {
    isCommunicationUserIdentifier,
    isPhoneNumberIdentifier,
    isMicrosoftTeamsUserIdentifier,
    isUnknownIdentifier
} from '@azure/communication-common';
import { api } from '../../../utils';

export const utils = {
    getAppServiceUrl: () => {
        return window.location.origin;
    },
    provisionNewUser: async (userId) => {
        // let response = await fetch('/tokens/provisionUser', {
        //     method: 'POST',
        //     body: { userId },
        //     headers: {
        //         'Accept': 'application/json, text/plain, */*',
        //         'Content-Type': 'application/json'
        //     },
        // });

        const response = await api('get', 'comms/test');

        if (response.status === 200) {
            // console.log(response.data);
            return response.data;
        }

        throw new Error('Invalid token response');
    },
    getIdentifierText: (identifier) => {
        if (isCommunicationUserIdentifier(identifier)) {
            return identifier.communicationUserId;
        } else if (isPhoneNumberIdentifier(identifier)) {
            return identifier.phoneNumber;
        } else if (isMicrosoftTeamsUserIdentifier(identifier)) {
            return identifier.microsoftTeamsUserId;
        } else if (isUnknownIdentifier(identifier) && identifier.id === '8:echo123'){
            return 'Echo Bot';
        } else {
            return 'Unknown Identifier';
        }
    }
}
