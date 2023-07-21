import { useState, useEffect } from "react";
import { api } from "../../../utils";

export default function useCompanyData (s_unit) {
    const [companyData, setCompanyData] = useState([]);
    const [emailData, setEmailData] = useState([]);
    const [phoneData, setPhoneData] = useState([]);
    const [blacklist, setBlacklist] = useState({});

    useEffect(() => {
        if (s_unit) {
            const getProfileData = async () => {
                const response = await api('post', 'notificationDataQuery', { s_unit })

                if (response.status === 200) {
                    const { companyData, emailData, phoneData, blacklistEmails } = response.data;
                    setCompanyData(companyData);
                    setEmailData(emailData);
                    setPhoneData(phoneData);
                    
                    const map = {};
                    for (let i = 0; i < blacklistEmails.length; i++) {
                        const { s_email, s_reason } = blacklistEmails[i];
                        map[s_email.toUpperCase()] = s_reason;
                    }
                    setBlacklist(map);
                }
            }
            getProfileData();
        }
    }, [s_unit]);

    return {
        companyData,
        setCompanyData,
        emailData,
        setEmailData,
        phoneData,
        setPhoneData,
        blacklist
    }
}