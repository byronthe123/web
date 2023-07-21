import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitForElementToBeRemoved } from '../test-utils/index';

// MSAL
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

import Portal from '../views/portal/Portal';

jest.mock('@azure/msal-react');

describe('Portal', () => {

    beforeEach(() => {
        useIsAuthenticated.mockReturnValue(true);

        useMsal.mockReturnValue({
            instance: {
                acquireTokenSilent: jest.fn()
            },
            accounts: [{
                username: "Byron@choice.aero"
            }]
        });
    });

    test('Portal should render without errors', async () => {

        const providerProps = {
            user: {
                userName: 'BYRON INJEELI'
            },
        }

        render(<Portal />, {providerProps});

        const portal = await screen.findByTestId('view-portal');
        expect(portal).toBeInTheDocument();

        const displayName = await (await screen.findByTestId('text-display-name')).textContent;
        expect(displayName).toBe('Welcome BYRON INJEELI');
    });

});