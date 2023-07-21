import { rest } from 'msw';
import { queueData, ownershipData } from './queueData';
const baseApiUrl = process.env.REACT_APP_BASE_API_URL;

export const queueHandlers = [
    rest.post(`${baseApiUrl}/queue`, (req, res, ctx) => {
        return res(
            ctx.json(queueData)
        );
    }),
    rest.put(`${baseApiUrl}/takeOwnership`, (req, res, ctx) => {
        return res(
            ctx.json(ownershipData)
        );
    }),
]