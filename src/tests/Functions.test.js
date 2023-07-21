import { api } from '../utils';

describe('api function()', () => {
    test('it should return a valid response from a POST request', async () => {
        const res = await api('post', 'userData', { s_email: 'byron@choice.aero' });
        expect(res.status).toBe(200);
        expect(res).toHaveProperty('data');
    });
});