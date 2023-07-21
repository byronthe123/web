import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitForElementToBeRemoved } from '../test-utils/index';

// MSAL
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

import { createMemoryHistory } from 'history';

import TopNav from '../components/TopNav';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';

jest.mock('@azure/msal-react');

const history = createMemoryHistory('/EOS/Operations/Import/Rack');

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

    test('TopNav should render without errors', async () => {
        render(<TopNav history={history} />);
        const topNav = await screen.findByTestId('component-top-nav');
        expect(topNav).toBeInTheDocument();
    });

    test('It should open up the drop down menu', async () => {
        render(<TopNav history={history} />);

        const dropDownToggle = await screen.findByTestId('top-nav-drop-down');
        expect(dropDownToggle).toBeInTheDocument();

        userEvent.click(dropDownToggle);

        const btnBombThreat = await screen.findByTestId('btn-bomb-threat');
        expect(btnBombThreat).toBeInTheDocument();

        userEvent.click(btnBombThreat);

        const modalBombThreat = await screen.findByTestId('modal-bomb-threat');
        expect(modalBombThreat).toBeInTheDocument();

        const closeButton = screen.getByRole('button', { name: 'Close' });
        expect(closeButton).toBeInTheDocument();

        userEvent.click(closeButton);
        await waitForElementToBeRemoved(() => screen.queryByTestId('modal-bomb-threat'));
    });

    // test('Bomb Threat Procedures', async () => {
    //     render(<Portal />);

    //     const bombThreatButton = await screen.findByRole('button', { name: 'Bomb Threat Procedure' });
    //     expect(bombThreatButton).toBeInTheDocument();

    //     userEvent.click(bombThreatButton);

    //     const bombTheatModal = await screen.queryByTestId('modal-bomb-threat');
    //     expect(bombTheatModal).toBeInTheDocument();

    // });

});