import { renderHook, act } from '@testing-library/react-hooks';
import useFiles from './useFiles';
import { importTransferTypes, importTypes } from './fileTypes';

describe('useFiles', () => {
    it('should return the default file types when s_type is "IMPORT"', () => {
        const { result } = renderHook(() =>
            useFiles('some_transaction_id', 'IMPORT')
        );

        expect(result.current.fileTypes).toEqual(importTypes);
    });

    it('should return the import transfer file types when s_type is "TRANSFER-IMPORT"', () => {
        const { result, rerender } = renderHook(
            // @ts-ignore
            ({ s_type }) => useFiles('some_transaction_id', s_type),
            { initialProps: { s_type: 'IMPORT' } }
        );

        expect(result.current.fileTypes).toEqual(importTypes);

        act(() => {
            rerender({ s_type: 'TRANSFER-IMPORT' });
        });

        expect(result.current.fileTypes).toEqual(importTransferTypes);
    });
});
