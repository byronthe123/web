import { IMap } from "../globals/interfaces";

const restrictedEmails: IMap<boolean> = {
    'BYRON@CHOICE.AERO': true,
    'MOZART@CHOICE.AERO': true,
    'FRANK@CHOICE.AERO': true
}
export default function useRestrictedAccess (s_email: string) {
    return restrictedEmails[s_email];
}