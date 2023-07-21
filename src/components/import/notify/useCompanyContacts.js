import { useMemo } from "react";

export default function useCompanyContacts (selectedCompany, emailData, phoneData) {

    const selectedCompanyEmails = useMemo(() => {
        if (selectedCompany) {
            const emails = [];
            emailData.map(e => e.s_guid === selectedCompany.s_guid && emails.push(e.s_email));
            console.log(emails);
            return emails;
        }
    }, [selectedCompany, emailData]);

    const selectedCompanyPhones = useMemo(() => {
        if (selectedCompany) {
            const phones = [];
            phoneData.map(p => p.s_guid === selectedCompany.s_guid && phones.push(p.s_phone));
            return phones;
        }
    }, [selectedCompany, phoneData]);

    return {
        selectedCompanyEmails,
        selectedCompanyPhones
    }

}