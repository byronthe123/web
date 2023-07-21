import React from 'react';
import userEvent from '@testing-library/user-event';
import { findByTestId, findByText, getByRole, render, screen, wait, waitFor, waitForElementToBeRemoved } from '../test-utils/index';

// MSAL
import mockAuthentication from '../mockPackages/msalReact';
import { disableConsole, enableConsole } from '../mockPackages/console';

import RefundRequests from '../views/managers/RefundRequests';

import utils from './utils';

// Mock in place:
jest.mock('./utils', () => {
    return {
        getWinner: jest.fn((a, b) => true)
    }
});

// Mock a shared mock file in __mocks__
//jest.mock('../utils');

test('mock a util 1', () => {
    const result = utils.getWinner(1, 2);
    expect(result).toBe(true);
});

const reverse = (string) => {
    let reversed = '';
    for (let i = string.length - 1; i > -1; i--) {
        reversed += string[i];
    }
    return reversed;
}

jest.mock('@azure/msal-react');

describe('Refund Request', () => {

    beforeEach(() => {
        mockAuthentication();
        disableConsole();
    });

    afterAll(() => enableConsole());

    test('It should render without errors', async () => {
        render(<RefundRequests />);

        const view = await screen.findByTestId('view-refund-request');
        expect(view).toBeInTheDocument();
    });

    test('It should have the OPEN button selected and switch to whichever button is clicked', async () => {
        render(<RefundRequests />);

        const tabManage = await screen.findByTestId('tab-manage');
        userEvent.click(tabManage);

        const openButton = await screen.findByRole('button', { name: 'OPEN' });
        expect(openButton).toHaveClass('btn-success');

        const closedButton = await screen.findByRole('button', { name: 'CLOSED' });
        expect(closedButton).toHaveClass('btn-outline-dark');

        userEvent.click(closedButton);
        expect(closedButton).toHaveClass('btn-success');
        expect(openButton).toHaveClass('btn-outline-dark');
        expect(openButton).not.toHaveClass('btn-success');
    });

    const getApproveDenyButtons = async () => {
        const manageTab = await screen.findByTestId('tab-manage');
        userEvent.click(manageTab);

        const preapprovedButton = await screen.findByRole('button', { name: 'PREAPPROVED' });
        userEvent.click(preapprovedButton);

        await waitFor(() => {}, { timeout: 2000 });

        const tds = await document.querySelectorAll('.rt-td');
        expect(tds[0].textContent.length).toBeGreaterThanOrEqual(11);

        userEvent.click(tds[0]);

        const modalManage = await screen.findByTestId('modal-manage-refund');
        expect(modalManage).toBeInTheDocument();

        const approveButton = await screen.queryByRole('button', { name: 'Approve' });
        const denyButton = await screen.queryByRole('button', { name: 'Deny' });

        return [approveButton, denyButton];
    }

    test('It should render the Approve button in Pre-approve if the user email is in finalApprovers list', async () => {

        render(<RefundRequests />);

        const [approveButton, denyButton] = await getApproveDenyButtons();

        expect(approveButton).toBeInTheDocument();
        expect(denyButton).toBeInTheDocument();

    });

    test('It should NOT render the Approve button in Pre-approve if the user email is NOT in finalApprovers list', async () => {

        const providerProps = {
            testRegUser: true
        }

        render(<RefundRequests />, providerProps);

        const [approveButton, denyButton] = await getApproveDenyButtons();

        expect(approveButton).not.toBeInTheDocument();
        expect(denyButton).not.toBeInTheDocument();

    });

    const typeNotes = async () => {
        const notes = 'These are my notes';
        const inputNotes = await screen.findByTestId('in-notes');
        expect(inputNotes.textContent.length).toBe(0);
        await userEvent.type(inputNotes, notes);
        const inputNotes2 = await screen.findByTestId('in-notes');
        expect(inputNotes2).toHaveValue(reverse(notes));
    }

    const typeAmount = async (amount) => {
        const inputAmount = await screen.findByTestId('in-amount');
        userEvent.clear(inputAmount);
        userEvent.type(inputAmount, amount);
        const updatedInput = await screen.findByTestId('in-amount');
        expect(updatedInput).toHaveValue(Number(amount));
    }

    const getRequestedAmount = async () => {
        const requestedAmountText = await (await screen.findByTestId('text-requested-amount')).textContent;
        const requestedAmount = parseFloat(requestedAmountText.replace('$', ''));
        expect(requestedAmount).toBeGreaterThan(0);
        return requestedAmount;
    }

    test('Approve and Deny buttons should be disabled until approve amount and notes are entered', async () => {
        render(<RefundRequests />);

        const [approveButton, denyButton] = await getApproveDenyButtons();

        expect(approveButton).toBeDisabled();
        expect(denyButton).toBeDisabled();

        await typeNotes();

        const approveButton2 = await screen.queryByRole('button', { name: 'Approve' });
        expect(approveButton2).toBeDisabled();
        const denyButton2 = await screen.queryByRole('button', { name: 'Deny' });
        expect(denyButton2).toBeEnabled();

        const requestedAmount = await getRequestedAmount();

        // Set inputAmount to a value greater than the requested amount:
        const increasedAmount = (requestedAmount + 100).toString();
        await typeAmount(increasedAmount);
        expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled();

        // Set inputAmount to 0:
        await typeAmount('0');
        expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled();

        // Set inputAmount to requested amount:
        await typeAmount(requestedAmount.toString());
        expect(screen.getByRole('button', { name: 'Approve' })).toBeEnabled();
    });

    test('It should remove the row from the table once the Request has been updated', async () => {
        render(<RefundRequests />);

        const [approveButton, denyButton] = await getApproveDenyButtons();
        const requestedAmount = await getRequestedAmount();

        const tds = await document.querySelectorAll('.rt-td');
        const awbValue = tds[0].textContent;

        await typeNotes();
        await typeAmount(requestedAmount.toString());

        userEvent.click(approveButton);

        await waitFor(() => {}, { timeout: 2000 });

        const tds2 = await document.querySelectorAll('.rt-td');
        expect(tds2[0].textContent).not.toBe(awbValue);

    });

    const selectByTestId = async (id) => {
        console.log(id);
        const element = await screen.findByTestId(id);
        return element;
    }

    it(`Should render these fields in the pop-up: MAWB, Amount, R-Record, Submitted by, Payment for, Airport, Created Date, Status, Preapproved by, Amount Preapproved, Reason, Notes`, async () => {
        render(<RefundRequests />);

        await getApproveDenyButtons();

        const fields = ['mawb', 'requested-amount', 's-record', 'submitted-by', 'payment-for', 'airport', 'created-date', 'status', 'preapproved-by', 'amount-preapproved', 'reason', 'notes'];

        const promises = [];
        const elements = [];

        for (let i = 0; i < fields.length; i++) {
            promises.push(
                screen.findByTestId(`text-${fields[i]}`).then(element => {
                    elements.push(element);
                })
            );
        }

        await Promise.all(promises);

        for (let i = 0; i < elements.length; i++) {
            expect(elements[i].textContent.length).toBeGreaterThan(0);
        }
    });
});
