import React from 'react';
import userEvent from '@testing-library/user-event';
import { findByTestId, findByText, getByRole, render, screen, waitFor, waitForElementToBeRemoved } from '../../test-utils/index';

// MSAL
import mockAuthentication from '../../mockPackages/msalReact';
import { disableConsole, enableConsole } from '../../mockPackages/console';

import Dock from './Dock';

jest.mock('@azure/msal-react');

describe('Dock', () => {
    beforeEach(() => {
        mockAuthentication();
        disableConsole();   
    });

    // afterAll(() => enableConsole());

    test('it should render without errors', async () => {
        render(<Dock />);

        const view = await screen.findByTestId('view-dock');
        expect(view).toBeInTheDocument();
    });

    test('it should render company cards', async () => {
        render(<Dock />);

        // const dockCompanies = await screen.findAllByTestId('card-dock-co');
        // expect(dockCompanies.length).toBe(2);

        const myCompanies = await screen.findAllByTestId('card-my-assignment-co');
        expect(myCompanies.length).toBe(1);
    });
});