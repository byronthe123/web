import { rest } from 'msw';
const baseApiUrl = process.env.REACT_APP_BASE_API_URL;

export const handlers = [
    rest.post(`${baseApiUrl}/userData`, (req, res, ctx) => {
        let userData;
        if (req.body.testRegUser) {
            userData = {
                user: {
                    s_unit: 'CJFK1',
                    s_department: '',
                    accessTabs: ["PORTAL", "OPERATIONS", "LEADS", "MANAGERS", "CORPORATE", "TRAINING", "HR", "DEV"],
                    i_access_level: 8,
                    s_email: "TEST@CHOICE.AEERO",
                    displayName: "NORMAL USER",
                    b_internal: true,
                    connectedToBackend: true,
                    s_airline_codes: []
                },
                units: ["CEWR1", "CBOS1", "CIAD1", "CJFK1", "CJFK2"],
                updates: [],
                readingSigns: []
            }
        } else {
            userData = {
                user: {
                    s_unit: 'CJFK1',
                    s_department: '',
                    accessTabs: ["PORTAL", "OPERATIONS", "LEADS", "MANAGERS", "CORPORATE", "TRAINING", "HR", "DEV"],
                    i_access_level: 8,
                    s_email: "BYRON@CHOICE.AERO",
                    displayName: "BYRON INJEELI",
                    b_internal: true,
                    connectedToBackend: true,
                    s_airline_codes: []
                },
                units: ["CEWR1", "CBOS1", "CIAD1", "CJFK1", "CJFK2"],
                updates: [],
                readingSigns: []
            }
        }

        return res(
            ctx.json(userData)
        );

    }),
]