import { useState, useEffect } from 'react';
import { ISelectOption, INotification } from '../../globals/interfaces';
import dayjs from 'dayjs';

export default function useNotifySelection (
    notificationData: Array<INotification>
) {
    const [notifyOptions, setNotifyOptions] = useState<Array<ISelectOption>>([]);
    const [selectedNotifyOption, setSelectedNotifyOption] = useState<ISelectOption>({
        label: '',
        value: ''
    });
    const [selectedNotification, setSelectedNotification] = useState<INotification>();

    useEffect(() => {
        if (notificationData.length > 0) {
            const options: Array<ISelectOption> = [];
            for (let i = 0; i < notificationData.length; i++) {
                const { id, s_created_by, t_created, s_flight_id, s_emails_to, s_emails_to_cc, s_email_message } = notificationData[i];
                const option = {
                    label: `${s_flight_id}, ${dayjs(t_created).format('MM/DD/YYYY HH:mm')}`,
                    value: id
                }
                options.push(option);
            }
            setNotifyOptions(options);
            setSelectedNotifyOption(options[0]);
            setSelectedNotification(notificationData[0]);
        }
    }, [notificationData]);

    return  {
        notifyOptions,
        selectedNotifyOption, 
        setSelectedNotifyOption,
        selectedNotification
    }
}