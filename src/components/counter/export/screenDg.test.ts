import { renderHook } from '@testing-library/react-hooks';
import { ISpecialHandlingCode } from '../../../globals/interfaces';
import { screenDg } from './dgScreening';

// describe('screenDg', () => {
//   test('dg is true when b_dg in special handling code is true', () => {
//     // @ts-ignore
//     const shcs: ISpecialHandlingCode[] = [{
//       id: 1,
//       s_special_handling_code: 's_shc1',
//       b_dg: true,
//       // other properties...
//     }];
//     const shcsMap: Record<string, string | null> = {};

//     const { result } = renderHook(() => screenDg(shcs, shcsMap));

//     expect(result.current.dg).toBe(true);
//   });

//   test('dg is false when b_dg in special handling code is false', () => {
//     // @ts-ignore
//     const shcs: ISpecialHandlingCode[] = [{
//       id: 1,
//       s_special_handling_code: 's_shc1',
//       b_dg: false,
//       // other properties...
//     }];
//     const shcsMap: Record<string, string | null> = {};

//     const { result } = renderHook(() => screenDg(shcs, shcsMap));

//     expect(result.current.dg).toBe(false);
//   });

//   test('mustScreen is true when key in shcsMap matches screenedCodes', () => {
//     // @ts-ignore
//     const shcs: ISpecialHandlingCode[] = [{
//       id: 1,
//       s_special_handling_code: 's_shc1',
//       b_dg: false,
//       // other properties...
//     }];
//     const shcsMap: Record<string, string | null> = {
//       ELM: 'test',
//     };

//     const { result } = renderHook(() => screenDg(shcs, shcsMap));

//     expect(result.current.mustScreen).toBe(true);
//   });

//   test('mustScreen is false when dg is true and shcsMap does not contain a must-screen SHC', () => {
//     // @ts-ignore
//     const shcs: ISpecialHandlingCode[] = [{
//       id: 1,
//       s_special_handling_code: 's_shc1',
//       b_dg: true,
//       // other properties...
//     }];
//     const shcsMap: Record<string, string | null> = {
//       XXR: 'XXR',
//     };

//     const { result } = renderHook(() => screenDg(shcs, shcsMap));

//     expect(result.current.mustScreen).toBe(false);
//   });

//   test('mustScreen is true when dg is false and shcsMap does not match screenedCodes', () => {
//     // @ts-ignore
//     const shcs: ISpecialHandlingCode[] = [{
//       id: 1,
//       s_special_handling_code: 's_shc1',
//       b_dg: false,
//       // other properties...
//     }];
//     const shcsMap: Record<string, string | null> = {
//       NON_MATCHING_CODE: 'test',
//     };

//     const { result } = renderHook(() => screenDg(shcs, shcsMap));

//     expect(result.current.mustScreen).toBe(true);
//   });

//   test('mustScreen is true when dg is false and shcsMap is an empty object', () => {
//     // @ts-ignore
//     const shcs: ISpecialHandlingCode[] = [{
//       id: 1,
//       s_special_handling_code: 's_shc1',
//       b_dg: false,
//       // other properties...
//     }];
//     const shcsMap: Record<string, string | null> = {};

//     const { result } = renderHook(() => screenDg(shcs, shcsMap));

//     expect(result.current.mustScreen).toBe(true);
//   });

//   test('mustScreen is true when dg is false and shcsMap contains null values', () => {
//     // @ts-ignore
//     const shcs: ISpecialHandlingCode[] = [{
//       id: 1,
//       s_special_handling_code: 's_shc1',
//       b_dg: false,
//       // other properties...
//     }];
//     const shcsMap: Record<string, string | null> = {s_shc1: null, s_shc2: null, s_shc3: null, s_shc4: null, s_shc5: null};

//     const { result } = renderHook(() => screenDg(shcs, shcsMap));

//     expect(result.current.mustScreen).toBe(true);
//   });

//   test('mustScreen result for ELM, ELI, ICE, RRE, MAG', () => {
//     // @ts-ignore
//     const shcs: ISpecialHandlingCode[] = [{
//       id: 1,
//       s_special_handling_code: 's_shc1',
//       b_dg: false,
//       // other properties...
//     }];
//     const shcsMap: Record<string, string | null> = {s_shc1: 'ELM', s_shc2: 'ELI', s_shc3: 'ICE', s_shc4: 'RRE', s_shc5: 'MAG'};

//     const { result } = renderHook(() => screenDg(shcs, shcsMap));
//     console.log(`RESULT = ${result.current.mustScreen}`);

//     expect(result.current.mustScreen).toBe(true);
//   });

//   test('mustScreen result for ACT, AMD, BUP', () => {
//     // @ts-ignore
//     const shcs: ISpecialHandlingCode[] = [{
//       id: 1,
//       s_special_handling_code: 's_shc1',
//       b_dg: false,
//       // other properties...
//     }];
//     const shcsMap: Record<string, string | null> = {s_shc1: 'ACT', s_shc2: 'AMD', s_shc3: 'BUP', s_shc4: '', s_shc5: ''};

//     const { result } = renderHook(() => screenDg(shcs, shcsMap));

//     expect(result.current.mustScreen).toBe(false);
//   });

//   test('mustScreen result for RCL, RCM, RCX', () => {
//     // @ts-ignore
//     const shcs: ISpecialHandlingCode[] = [{
//       id: 1,
//       s_special_handling_code: 's_shc1',
//       b_dg: false,
//       // other properties...
//     }];
//     const shcsMap: Record<string, string | null> = {s_shc1: 'RCL', s_shc2: 'RCM', s_shc3: 'RCX', s_shc4: '', s_shc5: ''};

//     const { result } = renderHook(() => screenDg(shcs, shcsMap));

//     expect(result.current.mustScreen).toBe(false);
//   });
// });

// //{s_shc1: null, s_shc2: null, s_shc3: null, s_shc4: null, s_shc5: null}