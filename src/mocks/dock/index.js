import { rest } from 'msw';
import { dockQueryData } from './data';
const { REACT_APP_BASE_API_URL } = process.env;

export const dockHandlers = [
    rest.post(`${REACT_APP_BASE_API_URL}/dockDriversQuery`, (req, res, ctx) => {
        return res(
            ctx.json(dockQueryData)
        );
    })
]