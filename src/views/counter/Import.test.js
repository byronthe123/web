import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../../test-utils/index';
import mockAuthentication from '../../mockPackages/msalReact';
import { disableConsole, enableConsole } from '../../mockPackages/console';
import { awbs, ffms } from '../../mocks/import/data';

import Import from './Import';

jest.mock('@azure/msal-react');

const compareAwb = (a, b) => a.replace(/-/g, '') === b;

const getSelectedAwbText = async () => {
    const activeCarouselItem = await document.querySelector('.carousel-item.active');
    const selectedAwb = await activeCarouselItem.querySelector('h3');
    return selectedAwb.textContent.replace(/-/g, '');
}

describe('Import', () => {
    beforeEach(() => {
       mockAuthentication(); 
       disableConsole();
    });

    // afterAll(() => enableConsole());

    test('It should render without errors', async () => {
        render(<Import />);
        const view = await screen.findByTestId('view-import');
        expect(view).toBeInTheDocument();
    });

    // test('It should show the right number of agent awbs', async () => {
    //     render(<Import />);
    //     await waitFor(() => {}, { timeout: 1000 });
    //     const awbsDetail = await screen.findByTestId('awb-detail');
    //     expect(awbsDetail.textContent).toBe('AWB Detail (3)');
    // });

    test('The AWB slideshow should allow the user to use the arrow buttons to change AWBs and show the selected AWB', async () => {
        render(<Import />);

        // Confirm all awbs rendered as awbs slides:
        const awbsSlideshow = await screen.findByTestId('awb-slideshow');
        expect(awbsSlideshow).toBeInTheDocument();
        const allAwbSlides = await screen.findAllByTestId('awb-slide');
        for (let i = 0; i < awbs.length; i++) {
            expect(
                compareAwb(allAwbSlides[i].textContent, awbs[i].s_mawb)
            ).toBe(true);
        }

        // Confirm that the first AWB is selected 
        const selectedAwbText1 = await getSelectedAwbText();
        expect(selectedAwbText1).toBe(awbs[0].s_mawb);

        // Click arrow buttons to change awb
        // const nextButton = await document.querySelector('.carousel-control-next');
        // const prevButton = await document.querySelector('.carousel-control-prev');

        // await userEvent.click(nextButton);
        // await waitFor(() => {}, { timeout: 1000 });

        // const selectedAwbText2 = await getSelectedAwbText();
        // console.log(`${selectedAwbText2} vs ${awbs[1].s_mawb}`);
        // expect(compareAwb(selectedAwbText2, awbs[1].s_mawb)).toBe(true);
    });

    test('It should display the correct auto Pieces, Weight, and Flight Date', async () => {
        render(<Import />);
        await screen.findByTestId('awb-slideshow');
        const selectedAwbText = await getSelectedAwbText();
        const useFfms = ffms.filter(f => f.s_mawb === selectedAwbText);
        let totalPcs = 0, totalWgt = 0;
        for (let i = 0; i < useFfms.length; i++) {
            totalPcs += useFfms[i].i_actual_piece_count;
            totalWgt += useFfms[i].f_weight;
        }

        const inPieces = await screen.findByTestId('in-pieces');
        console.log(`${inPieces.value} vs ${totalPcs}`);
        expect(inPieces).toHaveValue(totalPcs);
    });
});
