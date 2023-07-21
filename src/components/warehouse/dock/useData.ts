import { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import { AppContext } from '../../../context';
import { IMap, IRack } from '../../../globals/interfaces';
import { rackItem } from '../../../globals/defaults';
import {
    ICompany,
    IDockAwb,
    IDoors,
    LaunchModalReject,
    IAwbRackDataMap,
    PrevNextAwbType,
    DockNextAwbStatusTypes
} from './interfaces';
import { api } from '../../../utils';
import {
    getCompaniesMap,
    getAvailableDoors,
    validateAssignDockDoorData,
    validateRemoveDockDoorData,
} from './utils';
import { defaultCompany, defaultDockAwb } from './defaultValues';
import useLoading from '../../../customHooks/useLoading';
import {
    validateDeliverRackPieces,
    validateSplitLocation,
    validateRejectDockAwb,
    validateFinishDocking,
} from './validateData';

export default function useData() {
    const { user, socket } = useContext(AppContext);
    const { setLoading } = useLoading();
    const { activeUsers } = socket;
    const [step, setStep] = useState(1);
    const [companiesMap, setCompaniesMap] = useState<IMap<ICompany>>({});
    const [selectedCompany, setSelectedCompany] =
        useState<ICompany>(defaultCompany);
    const [modalCompanyDetails, setModalCompanyDetails] =
        useState<boolean>(false);
    const [selectedAwb, setSelectedAwb] = useState<IDockAwb>(defaultDockAwb);
    const [availableDoors, setAvailableDoors] = useState<IDoors>({});
    const [selectedDoor, setSelectedDoor] = useState('');
    const [selectedAgent, setSelectedAgent] = useState('');
    const [cancelDataQuery, setCancelDataQuery] = useState(false);
    const [firstId, setFirstId] = useState('');
    const [rackDataMap, setRackDataMap] = useState<IAwbRackDataMap>({});
    const [modalLocations, setModalLocations] = useState(false);
    // @ts-ignore
    const [selectedLocation, setSelectedLocation] = useState<IRack>(rackItem);
    const [modalSplit, setModalSplit] = useState(false);
    const [splitPieces, setSplitPieces] = useState(0);
    const [modalReject, setModalReject] = useState(false);
    const [s_dock_reject_reason, set_s_dock_reject_reason] = useState('');
    const [rejectType, setRejectType] = useState<'COMPANY' | 'AWB'>('AWB');
    const [modalChecklist, setModalChecklist] = useState(false);

    useEffect(() => {
        if (selectedCompany === undefined || selectedCompany === null) {
            alert('issue');
        }
    }, [selectedCompany]);

    const setData = (data: any) => {
        const { drivers, doors, busyDoors } = data;
        const companiesMap = getCompaniesMap(drivers);
        setCompaniesMap(companiesMap);
        setAvailableDoors(getAvailableDoors(busyDoors, doors));
        if (selectedCompany.s_transaction_id.length > 0) {
            const updatedCompany =
                companiesMap[selectedCompany.s_transaction_id];
            const useCompany = updatedCompany || defaultCompany;

            setSelectedCompany(useCompany);
            if (useCompany.awbs.length === 0) {
                setStep(1);
            }
        }

        for (let key in companiesMap) {
            if (companiesMap[key].s_status === 'DOCUMENTED') {
                setFirstId(companiesMap[key].s_transaction_id);
                break;
            }
        }
    };

    const dockQuery = async (): Promise<void> => {
        if (!cancelDataQuery) {
            const res = await api('post', 'dockDriversQuery', {
                s_unit: user.s_unit,
            });
            if (res.status === 200) {
                setData(res.data);
            }
        }
        setCancelDataQuery(false);
    };

    useEffect(() => {
        if (process.env.REACT_APP_ENV === 'test') {
            activeUsers['BYRON@CHOICE.AERO'] = {
                displayName: 'BYRON',
                s_email: 'BYRON@CHOICE.AERO',
                s_unit: 'CEWR1',
                path: '/EOS/Operations/Warehouse/Dock',
            }
        }

        if (user.s_unit) {
            dockQuery();

            const interval = setInterval(() => {
                dockQuery();
            }, 10000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [user.s_unit]);

    const dockRackQuery = async (company: ICompany) => {
        setLoading(true);
        const copy = _.cloneDeep(company);
        const { awbs } = copy;
        const awbsMap: IMap<{}> = {};

        for (let i = 0; i < awbs.length; i++) {
            awbsMap[awbs[i].s_mawb.replace(/-/g, '')] = {};
        }

        /* 
            Need to select all rackData for the current company's 
            transactionId or rackData with no s_delivered_transaction_id
        */

        const res = await api('post', 'dockRackQuery', {
            awbsMap,
            s_delivered_transaction_id: company.s_transaction_id,
        });

        setLoading(false);
        if (res.status === 200) {
            setRackDataMap(res.data);
        }

        return copy;
    };

    const handleSelectCompany = async (
        company: ICompany,
        viewCompanyDetails?: boolean,
        viewAwbs?: boolean
    ): Promise<void> => {
        await dockRackQuery(company);
        setSelectedCompany(company);
        if (viewCompanyDetails) {
            setModalCompanyDetails(true);
        }
        if (viewAwbs) {
            setStep(2);
        }
    };

    const assignDockDoor = async (
        selectedDoor: string,
        selectedAgent: string
    ) => {
        if (selectedDoor.length > 0 || selectedAgent.length > 0) {
            // @ts-ignore
            const companyDetails: IDockAwb = _.get(
                selectedCompany,
                'awbs[0]',
                {}
            );
            const s_guid =
                _.get(companyDetails, 's_dock_door_guid', null) || uuidv4();
            const now = dayjs().format('MM/DD/YYYY HH:mm');
            const useDoor =
                selectedCompany.s_dock_door ||
                (selectedDoor.length > 0 ? selectedDoor : null);
            const useAgent =
                selectedCompany.s_dock_ownership ||
                (selectedAgent.length > 0 ? selectedAgent : null);
            const useOwnershipTime =
                companyDetails.t_dock_ownership || (useAgent ? now : null);
            const useDoorTime =
                companyDetails.t_dock_door || (useDoor ? now : null);

            const body = {
                queue: {
                    s_transaction_id: companyDetails.s_transaction_id,
                    t_modified: now,
                    s_modified_by: user.s_email,
                    s_dock_ownership: useAgent,
                    t_dock_ownership: useOwnershipTime,
                    s_status: useAgent ? 'DOCKING' : 'DOCUMENTED',
                    s_dock_door: useDoor,
                    t_dock_door: useDoorTime,
                    s_dock_door_assigned: user.s_email,
                    s_dock_door_guid: companyDetails.s_dock_door_guid || s_guid,
                },
                dockDoor: {
                    s_created_by: user.s_email,
                    t_created: now,
                    s_modified_by: user.s_email,
                    t_modified: now,
                    s_status: 'DOCKING',
                    s_dock_door: useDoor,
                    s_unit: user.s_unit,
                    s_guid,
                    s_company: companyDetails.s_trucking_company,
                    s_driver: companyDetails.s_trucking_driver,
                    s_assignor: user.s_email,
                    s_assignee: useAgent,
                    t_assignor: now,
                    b_in_use: true,
                    i_priority: 1,
                },
                additional: {
                    previousStatus: selectedCompany.s_status,
                    s_unit: user.s_unit,
                },
            };

            const validData = await validateAssignDockDoorData(body);

            if (validData) {
                setCancelDataQuery(true);
                setLoading(true);
                const res = await api('post', 'assignDockDoor', body);
                setLoading(false);
                if (res.status === 200) {
                    setData(res.data);
                }
            }
        }
    };

    const removeDockDoorOrAgent = async (type: 'DOOR' | 'AGENT') => {
        // @ts-ignore
        const companyDetails: IDockAwb = _.get(selectedCompany, 'awbs[0]', {});

        const body = {
            s_dock_door_guid: companyDetails.s_dock_door_guid,
            t_modified: dayjs().format('MM/DD/YYYY HH:mm'),
            s_modified_by: user.s_email,
            s_queue_status: companyDetails.s_dock_ownership
                ? 'DOCKING'
                : 'DOCUMENTED',
            s_unit: user.s_unit,
            type,
        };

        const validData = await validateRemoveDockDoorData(body);

        if (validData) {
            setLoading(true);
            const res = await api('post', 'removeDockDoorOrAgent', body);
            setLoading(false);
            if (res.status === 200) {
                setCancelDataQuery(true);
                setData(res.data);
            }
        }
    };

    const splitLocation = async () => {
        const data = {
            i_remaining_pieces: Number(selectedLocation.i_pieces) - splitPieces,
            i_delivered_pieces: splitPieces,
            s_modified_by: user.s_email,
            t_modified: dayjs().format('MM/DD/YYYY HH:mm'),
            s_mawb: selectedAwb.s_mawb,
            id: selectedLocation.id,
            s_delivered_transaction_id: selectedCompany.s_transaction_id
        };

        const validData = await validateSplitLocation(data);
        if (validData) {
            const res = await api('post', 'splitLocation', data);
            if (res.status === 200) {
                // const rackDataMapCopy = _.cloneDeep(rackDataMap);
                // const { rackData } = rackDataMapCopy[selectedAwb.s_mawb];
                // const updateIndex = rackData.findIndex(item => item.id === selectedLocation.id);
                // rackData[updateIndex].i_pieces = String(data.i_remaining_pieces);
                // if (_.get(res.data, 'length', 0) > 0) {
                //     rackData.push(res.data[0]);
                //     setRackDataMap(rackDataMapCopy);
                //     setModalSplit(false);
                // }

                if (_.get(res.data, 'length', 0) > 0) {
                    setRackDataMap(prev => {
                        const rackDataMapCopy = _.cloneDeep(prev);
                        const { rackData } = rackDataMapCopy[selectedAwb.s_mawb];
                        const updateIndex = rackData.findIndex(item => item.id === selectedLocation.id);
                        rackData[updateIndex].i_pieces = data.i_remaining_pieces;
                        rackData.push(res.data[0]);
                        return rackDataMapCopy;
                    });
                    setModalSplit(false);
                }
            }
        }
    };


    const deliverRackPieces = async (id: number, b_delivered: boolean) => {
        const now = dayjs().format('MM/DD/YYYY HH:mm');
        const data = {
            id,
            t_modified: now,
            s_modified_by: user.s_email,
            s_platform: 'EOS/Operations/Warehouse/Dock/deliverRackPieces',
            s_status: b_delivered ? 'DELIVERED' : 'LOCATED',
            t_delivered: now,
            s_delivered_by: user.s_email,
            b_delivered,
            s_delivered_agent: user.s_email,
            s_delivered_transaction_id: b_delivered ? selectedCompany.s_transaction_id : null,
        };

        const validData = await validateDeliverRackPieces(data);

        if (validData) {
            const res = await api('post', 'deliverRackPieces', data);
            if (res.status === 200) {
                setRackDataMap((prev) => {
                    const rackDataMapCopy = _.cloneDeep(prev);
                    const { rackData } = rackDataMapCopy[selectedAwb.s_mawb];
    
                    for (let i = 0; i < rackData.length; i++) {
                        if (rackData[i].id === id) {
                            rackData[i].b_delivered = b_delivered;
                        }
                    }
                    return rackDataMapCopy;
                });
                // const rackDataMapCopy = _.cloneDeep(rackDataMap);
                // const { rackData } = rackDataMapCopy[selectedAwb.s_mawb];

                // for (let i = 0; i < rackData.length; i++) {
                //     if (rackData[i].id === id) {
                //         rackData[i].b_delivered = b_delivered;
                //     }
                // }

                // setRackDataMap(rackDataMapCopy);
            }
        }
    };

    const launchModalReject: LaunchModalReject = (
        rejectType: 'COMPANY' | 'AWB'
    ) => {
        setModalReject(true);
        setRejectType(rejectType);
    };

    const rejectDockAwb = async () => {
        const { s_transaction_id } = selectedCompany;
        const { s_mawb_id } = selectedAwb;
        const data = {
            s_transaction_id,
            s_mawb_id,
            s_modified_by: user.s_email,
            t_modified: dayjs().format('MM/DD/YYYY HH:mm'),
            s_status: 'REJECTED',
            s_dock_reject_reason,
            s_unit: user.s_unit,
            rejectType,
        };

        const validData = await validateRejectDockAwb(data);

        if (validData) {
            const res = await api('post', 'rejectDockAwb', data);

            if (res.status === 200) {
                setCancelDataQuery(true);
                setData(res.data);
                setModalReject(false);
                setModalCompanyDetails(false);
            }
        }
    };

    const dockNextAwb = async (s_status: DockNextAwbStatusTypes) => {
        interface IRequestBody {
            t_modified: string;
            s_modified_by: string;
            s_status: DockNextAwbStatusTypes;
            s_mawb_id: string;
        }

        const body: IRequestBody = {
            t_modified: dayjs().format('MM/DD/YYYY HH:mm'),
            s_modified_by: user.s_email,
            s_status,
            s_mawb_id: selectedAwb.s_mawb_id,
        };

        const res = await api('post', 'dockNextAwb', body);
        if (res.status === 200) {
            setSelectedCompany((prev) => {
                const copy = _.cloneDeep(prev);
                const index = copy.awbs.findIndex(
                    (awb) => awb.s_mawb_id === selectedAwb.s_mawb_id
                );
                copy.awbs[index].s_status = body.s_status;
                return copy;
            });

            setSelectedAwb((prev) => {
                const selectedAwbCopy = _.cloneDeep(prev);
                selectedAwbCopy.s_status = body.s_status;
                return selectedAwbCopy;
            });

            // const copy = _.cloneDeep(selectedCompany);
            // const index = copy.awbs.findIndex(
            //     (awb) => awb.s_mawb_id === selectedAwb.s_mawb_id
            // );
            // copy.awbs[index].s_status = body.s_status;
            // setSelectedCompany(copy);

            // const selectedAwbCopy = _.cloneDeep(selectedAwb);
            // selectedAwbCopy.s_status = body.s_status;
            // setSelectedAwb(selectedAwbCopy);
        }
    };

    const prevNextAwb = (type: PrevNextAwbType) => {
        const index = selectedCompany.awbs.findIndex(awb => awb.s_mawb_id === selectedAwb.s_mawb_id);
        const delta = type === 'PREV' ? -1 : 1;
        let goToIndex = index + delta;
        console.log(`current index = ${index}, goToIndexInitial = ${goToIndex}`);

        if (goToIndex < 0) {
            goToIndex = selectedCompany.awbs.length - 1;
        } else if (goToIndex === selectedCompany.awbs.length) {
            goToIndex = 0;
        }

        console.log(`goToIndexInitialModified = ${goToIndex}`);

        const nextAwb = _.cloneDeep(selectedCompany.awbs[goToIndex]);
        setSelectedAwb(nextAwb);
    }

    const finishDocking = async (base64: string) => {
        interface IAwb {
            s_mawb_id: string;
            s_type: string;
            i_pcs_delivered: number;
        }

        // @ts-ignore
        const companyDetails: IDockAwb = _.get(selectedCompany, 'awbs[0]', {});

        const companyAwbs = selectedCompany.awbs || [];

        const awbs: Array<IAwb> = [];

        for (let i = 0; i < companyAwbs.length; i++) {
            const { s_mawb, s_mawb_id, s_type } = companyAwbs[i];

            const totalPieces = (rackDataMap[s_mawb] ? rackDataMap[s_mawb].rackData : []).reduce(
                (total: number, current: IRack) => {
                    return (total += current.b_delivered
                        ? Number(current.i_pieces)
                        : 0);
                },
                0
            );

            const obj: IAwb = {
                s_mawb_id,
                s_type,
                i_pcs_delivered: totalPieces || 0,
            };

            awbs.push(obj);
        }

        const data = {
            file: {
                type: 'image/png',
                base64,
            },
            s_transaction_id: selectedCompany.s_transaction_id,
            s_modified_by: user.s_email,
            t_modified: dayjs().format('MM/DD/YYYY HH:mm'),
            s_unit: user.s_unit,
            s_dock_door_guid: companyDetails.s_dock_door_guid,
            awbs,
        };

        const validData = await validateFinishDocking(data);

        if (validData) {
            const res = await api('post', 'finishDocking', data);
            if (res.status === 200) {
                setData(res.data);
                setModalChecklist(false);
                setStep(1);
            }
        }
    };

    return {
        user,
        step,
        setStep,
        companiesMap,
        selectedCompany,
        modalCompanyDetails,
        setModalCompanyDetails,
        handleSelectCompany,
        selectedAwb,
        setSelectedAwb,
        rackDataMap,
        prevNextAwb,
        availableDoors,
        activeUsers,
        selectedDoor,
        setSelectedDoor,
        selectedAgent,
        setSelectedAgent,
        assignDockDoor,
        removeDockDoorOrAgent,
        firstId,
        modalLocations,
        setModalLocations,
        modalSplit,
        setModalSplit,
        selectedLocation,
        setSelectedLocation,
        splitPieces,
        setSplitPieces,
        splitLocation,
        deliverRackPieces,
        modalReject,
        setModalReject,
        s_dock_reject_reason,
        set_s_dock_reject_reason,
        launchModalReject,
        rejectDockAwb,
        rejectType,
        modalChecklist,
        setModalChecklist,
        dockNextAwb,
        finishDocking,
    };
}
