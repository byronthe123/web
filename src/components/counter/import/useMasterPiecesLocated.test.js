import useMasterPiecesLocated from "./useMasterPiecesLocated";
import { renderHook } from "@testing-library/react-hooks";
import { FacepileBase } from "office-ui-fabric-react";

test(`
    it should return true if the number of selected FFMs total pieces
    is equal to the number of pieces for locations by master
`, () => {

    const ffms = [{
        d_arrival_date: '10/01/2021',
        d_storage_second_free: '10/03/2021',
        d_storage_start: '10/04/2021',
        i_actual_piece_count: 5,
        selected: true
    }, {
        d_arrival_date: '10/03/2021',
        d_storage_second_free: '10/05/2021',
        d_storage_start: '10/06/2021',
        i_actual_piece_count: 5,
        selected: true
    }, {
        d_arrival_date: '10/03/2021',
        d_storage_second_free: '10/05/2021',
        d_storage_start: '10/06/2021',
        i_actual_piece_count: 5,
        selected: false
    }];

    const locations = [{
        i_pieces: 5,
        s_hawb: null,
        selected: false,
        b_comat: false
    }, {
        i_pieces: 5,
        s_hawb: '',
        selected: false,
        b_comat: false
    }, {
        i_pieces: 5,
        s_hawb: 'test',
        selected: false,
        b_comat: false
    }]

    const { result } = renderHook(() => useMasterPiecesLocated(ffms, locations));

    expect(result.current).toBe(true);
});

test(`
    it should return false if the number of selected FFMs total pieces
    is NOT equal to the number of pieces for locations by master
`, () => {

    const ffms = [{
        d_arrival_date: '10/01/2021',
        d_storage_second_free: '10/03/2021',
        d_storage_start: '10/04/2021',
        i_actual_piece_count: 5,
        selected: true
    }, {
        d_arrival_date: '10/03/2021',
        d_storage_second_free: '10/05/2021',
        d_storage_start: '10/06/2021',
        i_actual_piece_count: 5,
        selected: true
    }, {
        d_arrival_date: '10/03/2021',
        d_storage_second_free: '10/05/2021',
        d_storage_start: '10/06/2021',
        i_actual_piece_count: 5,
        selected: true
    }];

    const locations = [{
        i_pieces: 5,
        s_hawb: null,
        selected: false,
        b_comat: false
    }, {
        i_pieces: 5,
        s_hawb: '',
        selected: false,
        b_comat: false
    }, {
        i_pieces: 5,
        s_hawb: 'test',
        selected: false,
        b_comat: false
    }]

    const { result } = renderHook(() => useMasterPiecesLocated(ffms, locations));

    expect(result.current).toBe(false);
});