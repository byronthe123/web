import {renderHook, act} from '@testing-library/react-hooks';
import useStorageDays from './useStorageDays';
import moment from 'moment';
import { disableConsole, enableConsole } from '../../../mockPackages/console';
import { waitFor } from '../../../test-utils/index';

disableConsole();
const countHoliday = () => false;

describe('useStorageDays', () => {
    test('it should calculate automatic results correctly', () => {
        const ffms = [{
            d_arrival_date: '10/01/2021',
            d_storage_second_free: '10/03/2021',
            d_storage_start: '10/04/2021',
            selected: true
        }, {
            d_arrival_date: '10/03/2021',
            d_storage_second_free: '10/05/2021',
            d_storage_start: '10/06/2021',
            selected: true
        }];
        const {result} = renderHook(() => useStorageDays(ffms, false, '', countHoliday));
        const {   
            autoStorageDays,
            storageDays,
            storageStartDate,
            lastArrivalDate,
            setLastArrivalDate,
            autoLastFreeDay,
            autoGoDate 
        } = result.current;

        ffms.sort((a, b) => moment(a.d_arrival_date) - moment(b.d_arrival_date));
        const latestFfm = ffms[ffms.length - 1];

        expect(storageStartDate).toBe(
            moment(latestFfm.d_storage_start).format('YYYY-MM-DD')
        );

        expect(autoLastFreeDay).toBe(
            moment(latestFfm.d_storage_second_free).format('YYYY-MM-DD')
        );

        expect(lastArrivalDate).toBe(
            moment(latestFfm.d_arrival_date).format('YYYY-MM-DD')
        );

        expect(autoGoDate).toBe(
            moment(
                moment(storageStartDate).add(14, 'days')
            ).format('YYYY-MM-DD')
        );

        const today = moment().format('YYYY-MM-DD');
        expect(autoStorageDays).toBe(
            moment(today).diff(
                moment(autoLastFreeDay),
                'days'
            )
        );
    });

    test('it should add an additional free day if d_arrival_date is 11/23/2021', () => {
        const ffms = [{
            d_arrival_date: '11/23/2021',
            d_storage_second_free: '11/25/2021',
            d_storage_start: '11/26/2021',
            selected: true
        }];

        const {result} = renderHook(() => useStorageDays(ffms, false, '', () => Promise.resolve(true)));
        const {   
            autoStorageDays,
            storageDays,
            storageStartDate,
            lastArrivalDate,
            setLastArrivalDate,
            autoLastFreeDay,
            autoGoDate 
        } = result.current;

        expect(moment(storageStartDate).isSame('2021-11-27')).toBe(true);
        expect(moment(autoLastFreeDay).isSame('2021-11-26')).toBe(true);
    });

    test('it should add an additional free day if d_arrival_date is 11/24/2021', () => {
        const ffms = [{
            d_arrival_date: '11/24/2021',
            d_storage_second_free: '11/26/2021',
            d_storage_start: '11/27/2021',
            selected: true
        }];

        const {result} = renderHook(() => useStorageDays(ffms, false, '', () => Promise.resolve(true)));
        const {   
            autoStorageDays,
            storageDays,
            storageStartDate,
            lastArrivalDate,
            setLastArrivalDate,
            autoLastFreeDay,
            autoGoDate 
        } = result.current;

        expect(moment(storageStartDate).isSame('2021-11-28')).toBe(true);
    });

    test('it should calculate the storage start date correctly for manualStorageDate', async () => {
        const ffms = [];

        const {result} = renderHook(() => useStorageDays(ffms, true, '', () => Promise.resolve(false)));
        const arrivalDate = '2021-11-27';
        act(() => result.current.setLastArrivalDate(arrivalDate));
        await waitFor(() => {}, { timeout: 2000 });

        const expectStorageStart = moment(arrivalDate).add(2, 'days');
        expect(moment(result.current.storageStartDate).isSame(expectStorageStart.format('MM/DD/YYYY'))).toBe(true);
    });

    test('it should calculate the storage start date correctly for manualStorageDate', async () => {
        const ffms = [];

        const {result} = renderHook(() => useStorageDays(ffms, true, '', () => Promise.resolve(true)));
        const lastArrivalDate = '2021-11-22';
        act(() => result.current.setLastArrivalDate(lastArrivalDate));
        await waitFor(() => {}, { timeout: 2000 });

        const expectStorageStart = moment(lastArrivalDate).add(3, 'days');
        expect(moment(result.current.storageStartDate).isSame(expectStorageStart.format('MM/DD/YYYY'))).toBe(true);
        expect(result.current.storageDays).toBe(
            moment().diff(expectStorageStart, 'days') + 1
        );
    });


    test('it should cacluate non-holiday storage normally', () => {
        const ffms = [{
            d_arrival_date: '11/22/2021',
            d_storage_second_free: '11/24/2021',
            d_storage_start: '11/25/2021',
            selected: true
        }];

        const {result} = renderHook(() => useStorageDays(ffms, false, '', () => false));
        const {   
            autoStorageDays,
            storageDays,
            storageStartDate,
            lastArrivalDate,
            setLastArrivalDate,
            autoLastFreeDay,
            autoGoDate 
        } = result.current;

        expect(moment(storageStartDate).isSame('2021-11-25')).toBe(true);
        expect(moment(autoLastFreeDay).isSame('2021-11-24')).toBe(true);
    });
});