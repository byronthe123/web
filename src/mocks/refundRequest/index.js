import { rest } from 'msw';
import { refundRequests } from './data';

const baseApiUrl = process.env.REACT_APP_BASE_API_URL;

export const refundRequestHandlers = [
    rest.post(`${baseApiUrl}/getRefundRequests`, (req, res, ctx) => {
        return res(
            ctx.json(refundRequests)
        );
    }),
];