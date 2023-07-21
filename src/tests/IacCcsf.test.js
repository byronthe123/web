import React from 'react';
import userEvent from '@testing-library/user-event';
import { findByTestId, findByText, fireEvent, getByRole, render, screen, wait, waitFor, waitForElementToBeRemoved } from '../test-utils/index';

// MSAL
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

import Main from '../views/dev/Main';

jest.mock('@azure/msal-react');

describe('Update IAC/CCSF', () => {

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

    it('It should render the page without errors', async () => {

        const providerProps = {
            user: {
                s_email: 'byron@choice.aero',
                i_access_level: 8
            }
        }

        render(<Main />, {providerProps});

        const buttonGroup = await screen.findByTestId('btn-group-options');
        expect(buttonGroup).toBeInTheDocument();

        const iacButton = await screen.findByTestId('btn-IAC');
        expect(iacButton).toHaveClass('active');

        const ccsfButton = await screen.findByTestId('btn-CCSF');
        userEvent.click(ccsfButton);
        expect(ccsfButton).toHaveClass('active');

        const fileUpload = await screen.findByTestId('file-upload');
        expect(fileUpload).toBeInTheDocument();

        const submitButton = await screen.findByRole('button', { name: 'Submit' });
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
    });

});