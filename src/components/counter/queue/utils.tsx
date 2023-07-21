import { IActiveUser } from "../../../globals/interfaces";

export const renderActiveQueueUser = (user: IActiveUser, s_unit: string) => {
    return user.online && user.s_unit === s_unit && user.path.includes('/EOS/Operations/Counter');
}
