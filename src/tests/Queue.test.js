import React from 'react';
import userEvent from '@testing-library/user-event';
import { findByTestId, findByText, fireEvent, getByRole, render, screen, waitFor, waitForElementToBeRemoved } from '../test-utils/index';

// MSAL
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

import Queue from '../views/counter/Queue';

jest.mock('@azure/msal-react');

describe('Queue', () => {

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

    test('it should render view-queue', async () => {
        render(<Queue/>);

        const queue = await screen.findByTestId('view-queue');
        expect(queue).toBeInTheDocument();

    });

    // test('taking ownership of a mixed company', async () => {
    //     render(<Queue />);

    //     const assignedStatus = screen.getByTestId('assigned-status');
    //     expect(assignedStatus.textContent).toBe('There are no customers waiting.')
        
    //     const selectAllButton = await screen.findByRole('button', { name: 'ALL' });
    //     expect(selectAllButton).toHaveClass('btn-success');

    //     const companyCards = await screen.findAllByTestId('company-cards');
    //     expect(companyCards.length).toBeGreaterThan(0);

    //     const notAssignedText = 'You are not currently assigned a customer. Please select a customer from the queue selection.'
    //     expect(assignedStatus.textContent).toBe(notAssignedText);

    //     const companyName = companyCards[0].querySelector('[data-testid="company-name"]').textContent;
        
    //     userEvent.click(companyCards[0]);

    //     const modalViewCompany = screen.getByTestId('modal-company');
    //     expect(modalViewCompany).toBeInTheDocument();

    //     const modalCompanyName = screen.getByTestId('modal-company-name').textContent;
    //     expect(modalCompanyName).toContain(companyName);

    //     const modalCompanyStatus = screen.getByTestId('modal-company-status').textContent;

    //     if (modalCompanyStatus.includes('WAITING')) {
    //         const btnTakeOwnership = screen.getByRole('button', { name: /take ownership/i });
    //         expect(btnTakeOwnership).toBeInTheDocument();

    //         userEvent.click(btnTakeOwnership);

    //         await waitForElementToBeRemoved(() => {
    //             return (screen.queryByTestId('modal-company') && screen.queryByText(notAssignedText));
    //         });

    //         // my assignment card
    //         const myAssignmentDetails = await screen.findByTestId('div-assignment-details');
    //         expect(myAssignmentDetails).toBeInTheDocument();

    //         userEvent.click(myAssignmentDetails);
    //         const modalViewCompanyProcessing = await screen.findByTestId('modal-company');
    //         expect(modalViewCompanyProcessing).toBeInTheDocument();
    //         expect(modalViewCompanyProcessing.textContent).toContain(companyName);

    //         // Test failing
    //         // const modalCompanyStatusProcessing = await (await screen.findByTestId('modal-company-status')).textContent;
    //         // expect(modalCompanyStatusProcessing).toBe(`Status: Being Processed by BYRON@CHOICE.AERO`);

    //         const myAssignmentCompanyName = await (await screen.findByTestId('my-assignment-company-name')).textContent;
    //         expect(myAssignmentCompanyName).toContain(companyName);

    //         const btnLeftEarly = await screen.findByTestId('btn-left-early');
    //         expect(btnLeftEarly).toBeInTheDocument();
    //         fireEvent.click(btnLeftEarly);

    //         await waitForElementToBeRemoved(() => {
    //             return (screen.queryByTestId('modal-company') && screen.queryByText(notAssignedText));
    //         });


    //     }
    // });

});

// describe('Queue Tutorial', () => {
    
//     beforeEach(() => {
//         useIsAuthenticated.mockReturnValue(true);

//         useMsal.mockReturnValue({
//             instance: {
//                 acquireTokenSilent: jest.fn()
//             },
//             accounts: [{
//                 username: "Byron@choice.aero"
//             }]
//         });
//     });
    
//     test.only('it should generate two test items for the user to take ownership of: IMPORT/EXPORT types', async () => {
//         render(<Queue />);
//         const btnTutorial = screen.getByRole('button', { name: 'Tutorial' });
//         userEvent.click(btnTutorial);
        
//         const companyCards = await screen.findAllByTestId('company-cards');

//         let count = 0;

//         companyCards.map(c => {
//             const name = c.querySelector('[data-testid="company-name"]').textContent;
//             if (name.contains('TEST CHOICE')) {
//                 count++;
//             }
//         });
        
//         expect(count).toBeGreaterThan(0);

//     });
// });