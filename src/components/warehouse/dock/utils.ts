import moment from 'moment';
import dayjs from 'dayjs';
import * as yup from 'yup';

import { IMap } from "../../../globals/interfaces";
import { IDockAwb, ICompany, IDoors } from "./interfaces";
import { formatEmail } from "../../../utils";

const timeSince = (_start: string, _end: string) => {
    const start = moment(_start)
    const now = moment();
    const diff = moment.duration(moment(now).diff(moment(start)));
    const days = Number(diff.asDays()); //84
    
    let hours = Number(diff.asHours()); //2039 hours, but it gives total hours in given miliseconds which is not expacted.
    hours = hours - days * 24;  // 23 hours
    let minutes = Number(diff.asMinutes()); //122360 minutes,but it gives total minutes in given miliseconds which is not expacted.
    minutes = minutes - (days*24*60 + hours*60);
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
    const minusHours = moment().isDST() ? 4 : 5;
    hours = hours - minusHours;

    // return `${title} ${hours}:${minutesFormatted}`;
    return `${dayjs(dayjs(_start).diff(_end)).format('HH:mm')}`;
}

const resolveOverDue = (_start: string) => Number(dayjs(dayjs().diff(_start)).format('HH')) >= 1;

export const getCompaniesMap = (dockData: Array<IDockAwb>) => {
    const map: IMap<ICompany> = {};

    for (let i = 0; i < dockData.length; i++) {
        const current = dockData[i];
        const { 
            s_transaction_id, 
            s_trucking_company, 
            s_trucking_driver, 
            s_type, 
            s_state,
            t_created,
            t_counter_end,
            t_dock_ownership,
            s_dock_ownership,
            s_dock_door,
            s_status 
        } = current;

        let addImport = 0, addExport = 0;

        if (s_type === 'IMPORT') {
            addImport = 1;
        } else {
            addExport = 1;
        }

        if (map[s_transaction_id] === undefined) {
            map[s_transaction_id] = {
                s_transaction_id, 
                exportCount: addExport,
                importCount: addImport,
                s_trucking_company,
                s_trucking_driver,
                waitTime: timeSince(t_counter_end, new Date().toString()),
                processingTime: timeSince(t_dock_ownership, new Date().toString()),
                overDue: resolveOverDue(t_counter_end),
                s_dock_ownership,
                s_dock_door,
                s_status,
                s_state,
                awbs: [
                    current
                ]
            }
        } else {
            map[s_transaction_id].exportCount += addExport;
            map[s_transaction_id].importCount += addImport;
            map[s_transaction_id].awbs.push(current);
        }
    }

    return map;
}

export const getAvailableDoors = (
    busyDoors: Array<{s_dock_door: string, s_status: string}>,
    doors: Array<{s_dock_door: string, s_unit: string}>
) => {

    const multiServiceDoors: IMap<boolean> = {
        'RAMP': true,
        'BACKYARD': true
    }

    const busyDoorsMap: IMap<boolean> = {};

    for (let i = 0; i < busyDoors.length; i++) {
        const { s_dock_door } = busyDoors[i];
        if (busyDoorsMap[s_dock_door] === undefined) {
            busyDoorsMap[s_dock_door] = true;
        }
    }

    const _availableDoors: IDoors = {};
    for (let i = 0; i < doors.length; i++) {
        const current = doors[i].s_dock_door;
        if (!busyDoorsMap[current]) {
            const multiService = multiServiceDoors[current];
            _availableDoors[current] = {
                multiService
            }
        }
    }

    return _availableDoors;
}

export const validateAssignDockDoorData = async (data: IMap<any>) => {
    const dataSchema = yup.object().shape({
        queue: yup.object().shape({
            s_transaction_id: yup.string().required(),
            t_modified: yup.string().required(),
            s_modified_by:yup.string().required(),
            s_dock_ownership: yup.string().notRequired().nullable(),
            t_dock_ownership: yup.date().notRequired().nullable().when('s_dock_ownership', { is: true, then: yup.string().required() }),
            s_status: yup.string().required(),
            s_dock_door: yup.string().notRequired().nullable(),
            t_dock_door: yup.date().notRequired().nullable().when('s_dock_door', { is: true, then: yup.date().required() }),
            s_dock_door_assigned: yup.string().required(),
            s_dock_door_guid: yup.string().required()
        }), 
        dockDoor: yup.object().shape({
            s_created_by: yup.string().required(),
            t_created: yup.date().required(),
            s_modified_by: yup.string().required(),
            t_modified: yup.date().required(),
            s_status: yup.string().required(),
            s_dock_door: yup.string().notRequired().nullable(),
            s_unit: yup.string().required(),
            s_guid: yup.string().required(),
            s_company: yup.string().required(),
            s_driver: yup.string().required(),
            s_assignor: yup.string().required(),
            s_assignee: yup.string().notRequired().nullable(),
            t_assignor: yup.date().required(),
            b_in_use: yup.boolean().required(),
            i_priority: yup.number().required()
        }), 
        additional: yup.object().shape({
            previousStatus: yup.string().required(),
            s_unit: yup.string().required()
        })
    });

    
    let validData = false;

    try {
        await dataSchema.validate(data);
        validData = true;
    } catch (err) {
        alert(err);
    }

    return validData;
}

export const validateRemoveDockDoorData = async (data: IMap<any>) => {
    const dataSchema = yup.object().shape({
        t_modified: yup.date().required(),
        s_modified_by: yup.string().required(),
        s_dock_door_guid: yup.string().required(),
        s_queue_status: yup.string().required(),
        s_unit: yup.string().required(),
        type: yup.string().required()
    });

    let validData = false;

    try {
        await dataSchema.validate(data);
        validData = true;
    } catch (err) {
        alert(err);
    }

    return validData;
}