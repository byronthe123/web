import React from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { findByTestId, findByText, getByRole, render, screen } from '../test-utils/index';
import history from '../history';

// MSAL
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

import App from '../App';
import Queue from '../views/counter/Queue';

jest.mock('@azure/msal-react');

describe('Render login page', () => {

    beforeEach(() => {
        useIsAuthenticated.mockReturnValue(false);

        useMsal.mockReturnValue({
            instance: {
                acquireTokenSilent: jest.fn()
            },
            accounts: []
        });
    });


    test.skip('it should render the login page', async () => {
        render(<App />)

        const login = await screen.findByTestId('div-login');
        expect(login).toBeInTheDocument();
    });
});

describe('If the user is authenticated', () => {
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

    test.skip('it should render view-portal', async () => {
        render(<App />);

        const portal = await screen.findByTestId('view-portal');
        expect(portal).toBeInTheDocument();
        //expect(history.location.pathname).toBe('/EOS/Portal/Profile');

    });
});
