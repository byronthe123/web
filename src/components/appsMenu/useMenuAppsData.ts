import { useState } from "react";
import _ from 'lodash';

import { useAppContext } from "../../context";
import useDev from "../../customHooks/useDev";
import { api, notify } from "../../utils";
import { IMenuApps, IMenuApp, MenuAppType, IUser } from "../../globals/interfaces";
import { HandleCreateUpdate, CreateUpdate, Delete } from "./interfaces";

export interface MenuAppsData {
    user: IUser;
    appDataLoaded: boolean;
    menuApps: IMenuApps;
    isDev: boolean;
    handleCreateUpdate: HandleCreateUpdate;
    modalManageMenu: boolean;
    setModalManageMenu: React.Dispatch<React.SetStateAction<boolean>>;
    indexNum: number;
    selectedType: MenuAppType;
    selectedItem: IMenuApp | undefined;
    createUpdateMenuItem: CreateUpdate,
    deleteMenuItem: Delete
}

export default function useMenuAppsData (): MenuAppsData {
    const {
        user,
        appData: {         
            appDataLoaded,
            menuApps: importMenuApps,
            setMenuApps: importSetMenuApps 
        },
    } = useAppContext();
    const menuApps: IMenuApps = importMenuApps;
    const setMenuApps: React.Dispatch<React.SetStateAction<IMenuApps>> =
        importSetMenuApps;
    const isDev = useDev(user);
    const [selectedItem, setSelectedItem] = useState<IMenuApp>();
    const [selectedType, setSelectedType] = useState<MenuAppType>('USER');
    const [indexNum, setIndexNum] = useState<number>(0);
    const [modalManageMenu, setModalManageMenu] = useState(false);

    const handleCreateUpdate: HandleCreateUpdate = (
        indexNum: number,
        type: MenuAppType,
        selectedItem?: IMenuApp
    ) => {
        if (selectedItem) {
            setSelectedItem(selectedItem);
        } else {
            setSelectedItem(undefined);
        }
        setSelectedType(type);
        setIndexNum(indexNum);
        setModalManageMenu(true);
    };

    const createUpdateMenuItem: CreateUpdate = async (data: IMenuApp, update: boolean) => {
        const method = update ? 'put' : 'post';
        const res = await api(method, 'menuApp', data);
        if ([200, 204].includes(res.status)) {
            setMenuApps((prev: IMenuApps) => {
                const copy = _.cloneDeep(prev);
                const updateApps =
                    data.type === 'SYSTEM' ? copy.system : copy.user;
                if (update) {
                    const updateIndex = updateApps.findIndex(
                        (app) => app.id === data.id
                    );
                    updateApps[updateIndex] = res.data;
                } else {
                    updateApps.push(res.data);
                }
                return copy;
            });
            setModalManageMenu(false);
            notify('Success');
        }
    };

    const deleteMenuItem: Delete = async (id: number, type: MenuAppType) => {
        const res = await api('delete', `menuApp/${id}`);
        if (res.status === 204) {
            setMenuApps((prev: IMenuApps) => {
                const copy = _.cloneDeep(prev);
                // @ts-ignore
                const updateApps: Array<IMenuApp> = copy[type.toLowerCase()];
                const filtered = updateApps.filter(app => app.id !== id);
                // @ts-ignore
                copy[type.toLowerCase()] = filtered;
                return copy;
            });
            setModalManageMenu(false);
            notify('Success');
        }
    };

    return {
        user,
        appDataLoaded,
        menuApps, 
        isDev,
        handleCreateUpdate,
        modalManageMenu,
        setModalManageMenu,
        indexNum,
        selectedType,
        selectedItem,
        createUpdateMenuItem,
        deleteMenuItem
    }
}