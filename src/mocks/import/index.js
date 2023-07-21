import { rest } from "msw";
import { basename } from "path";
import { awbs, ffms } from './data';
const { REACT_APP_BASE_API_URL } = process.env;

export const importHandlers = [
    rest.post(`${REACT_APP_BASE_API_URL}/agentAwbs`, (req, res, ctx) => {
        return res(
            ctx.json(awbs)
        );
    }),
    rest.post(`${REACT_APP_BASE_API_URL}/additionalImportData`, (req, res, ctx) => {
        const { s_mawb } = req.body.data;
        const ffmInfo = ffms.filter(f => f.s_mawb === s_mawb);

        const data = {
            paymentsInfo: [{
                s_payment_method: 'TEST',
                s_payment_type: 'TEST',
                b_override_approved: 0,
                f_amount: 100,
                s_awb: '00043670596',
                s_hawb: null
            }, {
                s_payment_method: 'TEST',
                s_payment_type: 'TEST',
                b_override_approved: 0,
                f_amount: 150,
                s_awb: '00043670596',
                s_hawb: null
            }, {
                s_payment_method: 'TEST',
                s_payment_type: 'TEST',
                b_override_approved: 0,
                f_amount: 25,
                s_awb: '00043670596',
                s_hawb: 'HAWB'
            }],
            ffmInfo,
            fhlInfo: [],
            fwbData: [],
            locationInfo: [],
            iscData: [],
            clearanceData: []
        }  

        return res(
            ctx.json(data)
        );
    }),
]