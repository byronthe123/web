import {renderHook} from '@testing-library/react-hooks';
import usePiecesWeight from './usePiecesWeight';

const ffms = [{
    i_actual_piece_count: 5,
    f_weight: 2.5,
    selected: true
}, {
    i_actual_piece_count: 10,
    f_weight: 4.5,
    selected: true
}, {
    i_actual_piece_count: 10,
    f_weight: 4.5,
    selected: false
}];

const fhls = [{
    s_hawb: 'HOUSE123',
    i_pieces: 50,
    f_weight: 75
}, {
    s_hawb: 'HOUSEABC',
    i_pieces: 25,
    f_weight: 40
}];

describe('usePiecesWeight()', () => {
    test('it should calculate auto auto pieces, weight for ffms correctly, when not manula mode', () => {
        const {result} = renderHook(() => usePiecesWeight(ffms, fhls, false, ''));
        const { autoPieces, autoWeight } = result.current;

        let comparePieces = 0, compareWeight = 0;

        for (let i = 0; i < ffms.length; i++) {
            if (ffms[i].selected) {
                const { i_actual_piece_count, f_weight } = ffms[i];
                comparePieces += i_actual_piece_count;
                compareWeight += f_weight;
            }
        }

        expect(Number(comparePieces)).toBe(Number(autoPieces));
        expect(Number(compareWeight)).toBe(Number(autoWeight));
    });

    test('it should calculate the pieces, weight from FHL in manual mode based s_hawb', () => {
        const s_hawb = 'HOUSE123';
        const {result} = renderHook(() => usePiecesWeight(ffms, fhls, true, 'HOUSE123'));
        const { pieces, weight } = result.current;

        const foundFhl = fhls.find(f => f.s_hawb === s_hawb);
        const { i_pieces, f_weight } = foundFhl;
        expect(pieces).toBe(i_pieces);
        expect(weight).toBe(f_weight);
    });
});