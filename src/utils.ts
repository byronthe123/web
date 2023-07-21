import axios from 'axios';
import moment from 'moment';
import jsFileDownload from 'js-file-download';
import _ from 'lodash';
import { ICorpStation, IMap, IUser } from './globals/interfaces';
import { renderToString } from 'react-dom/server';
import dayjs from 'dayjs';
import { socket } from './context/socket';
import { toast } from 'react-toastify';

const baseApiUrl = process.env.REACT_APP_BASE_API_URL;
const headerAuthCode = process.env.REACT_APP_HEADER_AUTH_CODE;
const REACT_APP_ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL;
const REACT_APP_ENDPOINT_AUTH_CODE = `_*xP-Q97MTB5sb_CvK^wwzaX8yz^H5&fu6^%Ae_J2PC@aXc6SADH8Gf2m3vJAc^G*s@T9pqZ8$EmZXb6`;

const preventUpperCase = (key: string) => {
    const dontUppercase = [
        's_transaction_id',
        's_mawb_id',
        's_guid',
        's_company_guid',
        's_dock_door_guid',
        's_warehouse_productivity_guid',
        's_user_id',
        'sm_driver_photo',
        's_driver_photo_link',
        's_file_name',
        's_wiki',
    ];
    return (
        dontUppercase.includes(key) ||
        key.includes('guid') ||
        key.includes('url') ||
        key.includes('logo') ||
        key.includes('s_wiki')
    );
};

export const addLocalValue = (
    data: Array<any>,
    setData: React.Dispatch<React.SetStateAction<Array<any>>>,
    value: any,
    prepend?: boolean
) => {
    const copy = _.cloneDeep(data);
    if (prepend) {
        copy.unshift(value);
    } else {
        copy.push(value);
    }
    setData(copy);
};

export const addLocalValues = (
    data: Array<any>,
    setData: (dataSet: Array<any>) => void,
    values: Array<any>
) => {
    const copy = _.cloneDeep(data);
    values.map((v) => copy.push(v));
    setData(copy);
};

export const prependLocalValue = (
    data: Array<any>,
    setData: (dataSet: Array<any>) => void,
    value: any
) => {
    const copy = _.cloneDeep(data);
    copy.unshift(value);
    setData(copy);
};

export const updateLocalValue = (
    dataSet: Array<any>,
    setDataSet: (dataSet: Array<any>) => void,
    id: string | number,
    updateValuesOjb: any,
    alternativeId?: string
) => {
    const useId = alternativeId ? alternativeId : 'id';

    const copy = _.cloneDeep(dataSet);
    const updateIndex = copy.findIndex((item) => item[useId] === id);
    for (let key in updateValuesOjb) {
        let value = updateValuesOjb[key];
        if (value) {
            if (typeof value !== 'boolean' && typeof value !== 'object') {
                if (value.length > 0) {
                    if (!preventUpperCase(key)) {
                        value = value.toUpperCase();
                    }
                }
            }
        }
        copy[updateIndex][key] = value;
    }
    setDataSet(copy);
};

export const deleteLocalValue = (
    dataSet: Array<any>,
    setDataSet: (dataSet: Array<any>) => void,
    id: number | string,
    customId?: string
) => {
    const newSet = dataSet.filter((d) => d[customId || 'id'] !== id);
    const copy = _.cloneDeep(newSet);
    setDataSet(copy);
};

export const asyncHandler = (cb: any) => {
    return async (...args: any) => {
        try {
            return await cb(...args);
        } catch (err: any) {
            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                alert(
                    `${err.response.status} Error: ${err.response.data.message}`
                );
            }
            if (_.get(err, 'response.data.error', null)) {
                alert(err.response.data.error);
            } else {
                alert(err);
            }
            return {};
        }
    };
};

export const formatCost = (cost: number | string, reverse = false) => {
    const negative = parseFloat(String(cost)) < 0;
    const toFormat =
        cost && !isNaN(parseFloat(String(cost))) ? parseFloat(String(cost)) : 0;
    const formatted = Math.abs(toFormat)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,');

    if (reverse) {
        return negative ? `$${formatted}` : `($${formatted})`;
    } else {
        return negative ? `($${formatted})` : `$${formatted}`;
    }
};

export const formatMawb = (mawb: string) => {
    return (
        mawb &&
        mawb
            .replace('-', '')
            .substr(0, 13)
            .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
    );
};

export const mawbFormatter = (mawb: string) => {
    return mawb.substr(0, 13).replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};

export const validateAwb = (awb: string) => {
    if (_.get(awb, 'length', 0) >= 11) {
        const normalized = awb.replace(/-/g, '');
        const serial = Number(normalized.substring(3, 10));
        const checkDigit = serial % 7;
        return checkDigit === Number(normalized[normalized.length - 1]);
    } else {
        return false;
    }
};

export const isChoiceEmail = (email: string) => {
    const domain = email && email.split('@')[1];
    return (domain && domain.toUpperCase()) === 'CHOICE.AERO';
};

export const formatEmail = (email: string) => {
    if (email) {
        const parts = email.split('@');
        if (parts.length > 0) {
            return parts[0];
        } else {
            return '';
        }
    } else {
        return '';
    }
};

export const validateEmail = (email: string) => {
    const match = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return match.test(String(email).toLowerCase());
}

export const formatPercent = (float: number, decimal = false) => {
    const percent = float * 100;
    if (decimal && percent < 100) {
        return `${percent.toFixed(1)}%`;
    }
    return `${percent.toFixed(0)}%`;
};

export const getNum = (num: any) => {
    const parsed = parseFloat(num);
    if (!isNaN(parsed)) {
        return Number(parsed.toFixed(2));
    }
    return 0;
};

export const getUsername = (email: string) => {
    if (email && email.length > 0) {
        const array = email.split('@');
        return array[0] || '';
    }
    return '';
};

export const unhandledApi = async (
    method: string,
    endpoint: string,
    data: any,
    readonly?: boolean,
    user?: IUser
) => {
    const config = {
        headers: {
            Authorization: `Bearer ${headerAuthCode}`,
            user: localStorage.getItem('eosUser'),
        },
    };

    if (readonly && (user && user.b_airline)) {
        if (method === 'get') {
            // @ts-ignore
            return await axios[method](`${baseApiUrl}/${endpoint}`, config);
        } else {
            alert('You do not have permission to perform this action.');
            return {
                status: 403,
            };
        }
    } else {
        if (['get', 'delete'].includes(method)) {
            // @ts-ignore
            return await axios[method](`${baseApiUrl}/${endpoint}`, config);
        } else {
            // @ts-ignore
            return await axios[method](
                `${baseApiUrl}/${endpoint}`,
                data,
                config
            );
        }
    }
};

export const api = asyncHandler(
    async (
        method: string,
        endpoint: string,
        data: any,
        readonly: boolean,
        user: IUser
    ) => {
        let addSlash = '';
        if (endpoint[0] !== '/') {
            addSlash = '/';
        }
        const headers = {
            Authorization: `Bearer ${headerAuthCode}`,
            user: localStorage.getItem('eosUser'),
        }
        const config = {
            headers
        }

        const apiUrl = `${baseApiUrl}${addSlash}${endpoint}`;

        if (readonly && user.b_airline) {
            if (method === 'get') {
                // @ts-ignore
                return await axios[method](apiUrl, config);
            } else {
                alert('You do not have permission to perform this action.');
                return {
                    status: 403,
                };
            }
        } else {
            if (method === 'delete') {
                // @ts-ignore
                return await axios.delete(apiUrl, {
                    headers,
                    data: data
                });;
            }
            if (method === 'get') {
                // @ts-ignore
                return await axios[method](apiUrl, config);
            } else {
                // @ts-ignore
                return await axios[method](
                    apiUrl,
                    data,
                    config
                );
            }
        }
    }
);

export const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const fileDownload = (data: any, name: string) => {
    const Json2csvParser = require('json2csv').Parser;
    const jsonData = JSON.parse(JSON.stringify(data));
    const parser = new Json2csvParser({ excelStrings: true, withBOM: true });
    const csv = parser.parse(jsonData);
    jsFileDownload(csv, name);
};

export const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const validateSchema = async (dataSchema: any, data: any) => {
    let validData = false;

    try {
        await dataSchema.validate(data);
        validData = true;
    } catch (err) {
        alert(err);
    }

    return validData;
};

export const objectSorter = (
    property: string,
    sortOrder: Array<any>,
    array: Array<any>
) => {
    const ordering: IMap<any> = {};
    for (let i = 0; i < sortOrder.length; i++) {
        ordering[sortOrder[i]] = i;
    }
    return array.sort((a, b) => ordering[a[property]] - ordering[b[property]]);
};

const getTimeDiff = (start: string) => {
    // console.log(`Start time: ${start}`);

    if (!moment(start, moment.ISO_8601).isValid()) {
        throw new Error(`Invalid date string: ${start}`);
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = moment().tz(timezone);
    const startMoment = moment.utc(start).tz(timezone, true);

    // console.log(`Time now in local timezone: ${now}`);
    // console.log(`Start time in local timezone: ${startMoment}`);

    const diff = moment.duration(now.diff(startMoment));
    return diff;
}

export const timeSince = (start: string) => {
    const diff = getTimeDiff(start);
    let days = parseInt(String(diff.asDays())); //84
    let hours = parseInt(String(diff.asHours())); //2039 hours, but it gives total hours in given miliseconds which is not expacted.
    hours = hours - days * 24; // 23 hours
    let minutes = parseInt(String(diff.asMinutes())); //122360 minutes,but it gives total minutes in given miliseconds which is not expacted.
    minutes = minutes - (days * 24 * 60 + hours * 60);
    const stringMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${stringMinutes}`;
};

export const getMinutes = (start: string) => {
    const diff = getTimeDiff(start);
    const minutes = diff.asMinutes();
    // console.log(`Minutes difference is: ${minutes}`);

    return minutes;
}

export interface IUnitMap {
    color: string;
    array: Array<string>;
}

export const getUnitsMap = (units: Array<string> = []) => {
    const map: IMap<IUnitMap> = {};
    units.sort((a, b) => a.localeCompare(b));
    for (let i = 0; i < units.length; i++) {
        const start = units[i][0];
        if (map[start] === undefined) {
            const saturation = 43 + (i * 5);
            map[start] = {
                color: `hsl(139deg 52% ${saturation}%)`,
                array: [],
            };
        }
        map[start].array.push(units[i]);
    }
    return map;
};

interface IGetStorageDatesReturn {
    d_storage_first_free: string;
    d_storage_second_free: string;
    d_storage_start: string;
}

export const getStorageDates = async (
    d_arrival_date: string,
    s_airline_code: string,
    s_pou: string,
    s_airline_prefix: string,
    s_unit?: string
): Promise<IGetStorageDatesReturn> => {
    const res = await axios.post(
        `${REACT_APP_ENDPOINT_URL}/storageDates`,
        {
            d_arrival_date,
            s_airline_code,
            s_pou,
            s_airline_prefix,
            s_unit
        },
        {
            headers: {
                Authorization: `Bearer ${REACT_APP_ENDPOINT_AUTH_CODE}`,
            },
        }
    );
    return res.data;
};

export const print = (element: React.ReactNode) => {
    const sheet = renderToString(element);
    
    const myWindow = window.open("", "MsgWindow", "width=1920,height=1080");
    //@ts-ignore
    myWindow.document.body.innerHTML = null;
    //@ts-ignore
    myWindow.document.write(sheet);
}

export const formatDatetime = (datetime: string | Date, date?: boolean) => {
    if (!datetime) return '';

    if (typeof datetime !== 'string') {
        datetime = String(datetime);
    }

    if (datetime && dayjs(datetime).isValid()) {
        if (date) return dayjs.utc(datetime).format('MM/DD/YYYY');
        return dayjs.utc(datetime).format('MM/DD/YYYY HH:mm');
    }
    
    return '';
};

export const getDate = () => dayjs().local().format('MM/DD/YYYY HH:mm');
export const getTsDate = () => {
    const now = new Date();
    const date = new Date(+now - now.getTimezoneOffset()*60*1000);
    return date;
};

export const createdUpdatedInfo = (item: any, noPrefix=false) => {
    if (item) {
        let createdBy, createdAt, modifiedBy, modifiedAt;
        if (noPrefix) {
            createdBy = item.createdBy;
            createdAt = item.createdAt;
            modifiedBy = item.modifiedBy;
            modifiedAt = item.modifiedAt;
        } else {
            const { s_created_by, t_created, s_modified_by, t_modified } = item;
            createdBy = s_created_by;
            createdAt = t_created;
            modifiedBy = s_modified_by;
            modifiedAt = t_modified;
        }

        let base = '';
        if (createdBy && createdAt) {
            base += `Created by ${formatEmail(createdBy)} at ${formatDatetime(createdAt)}`;
        }
        if (modifiedBy && modifiedAt) {
            base += ` and modified by ${formatEmail(modifiedBy)} at ${formatDatetime(modifiedAt)}.`;
        }

        return base;   
    }
}

export const validateUrl = (checkUrl: string) => {
    const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;;
    const url = new RegExp(urlRegex);
    return checkUrl.length < 2083 && url.test(checkUrl);
}

export const countHoliday = async (d_arrival_date: string) => {
    if (!dayjs(d_arrival_date).isValid()) {
        return false;
    }

    try {
        const res = await axios.post(
            `${process.env.REACT_APP_ENDPOINT_URL}/countHoliday`,
            {
                d_arrival_date,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_ENDPOINT_AUTH_CODE}`,
                },
            }
        );

        return res.data;
    } catch (err) {
        return false;
    }
}

export const rackUpdate = (s_mawb: string, s_unit: string) => {
    socket.emit('rackUpdate', { s_mawb, s_unit });
}

export const getStationDetails = (user: IUser, stations: Array<ICorpStation>) => {
    return stations.find(s => s.s_unit === user.s_unit);
}

export const notify = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'success') => {
    toast[type](message);
}

export const checkPayment = (s_payment_method: string) => {
    return !['CHARGE', 'OVERRIDE'].includes(s_payment_method);
}

export function omit<T, K extends keyof any>(obj: T, key: K): Omit<T, K> {
    const { [key]: _, ...rest } = obj as any;
    return rest;
}