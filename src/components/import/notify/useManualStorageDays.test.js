import {renderHook} from '@testing-library/react-hooks';
import useManualStorageDays from './useManualStorageDays';
import moment from 'moment';

test('useManualStorageDays', () => {
    const d_last_free_day = '2021-10-31';

    const { result }  = renderHook(() => useManualStorageDays(d_last_free_day)); 

    const diff = moment(moment().format('MM/DD/YYYY'))
        .diff(moment(d_last_free_day), 'days');

    expect(result.current).toBe(diff);
});