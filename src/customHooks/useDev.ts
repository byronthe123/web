import { IMap, IUser } from "../globals/interfaces";

export default function useDev (user: IUser): boolean {
    const dev: IMap<boolean> = {
        'byron@choice.aero': true,
        'mozart@choice.aero': true,
        'frank@choice.aero': true
    }
    if (user && user.s_email) {
        return dev[user.s_email.toLowerCase()] === true;
    }
    return false;
}