import { MenuAppType, IMenuApp } from "../../globals/interfaces";

export type HandleCreateUpdate = (     
    indexNum: number,
    type: MenuAppType,
    selectedItem?: IMenuApp
) => void;

export type CreateUpdate = (data: IMenuApp, update: boolean) => Promise<void>;

export type Delete = (id: number, type: MenuAppType) => Promise<void>;