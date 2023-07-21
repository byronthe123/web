import React, { useState, useEffect } from 'react';
import { api } from '../../../utils';
import ReactTable from '../../custom/ReactTable';
import Modal from './Modal';

export default function Emails ({ tabId }) {

    const [data, setData] = useState([]);
    const [modal, setModal] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState({});

    useEffect(() => {
        const getEmails = async () => {
            const res = await api('get', 'emails');
            setData(res.data.value);
            console.log(res.data.value);
        }
        if (tabId === -1) {
            getEmails();
        }
    }, [tabId]);

    const selectEmail = (email) => {
        setSelectedEmail(email);
        setModal(true);
    }

    return (
        <>
            <ReactTable 
                data={data}
                mapping={[
                    {
                        name: 'Date',
                        value: 'createdDateTime',
                        datetime: true
                    },
                    {
                        name: 'From',
                        value: '',
                        deepNested: true,
                        keys: ['sender', 'emailAddress', 'address'],
                        largeWidth: true
                    },
                    {
                        name: 'Subject',
                        value: 'subject',
                        smallWidth: true
                    },
                    {
                        name: 'Body',
                        value: 'bodyPreview'
                    }
                ]}
                enableClick
                handleClick={selectEmail}
            />
            <Modal 
                modal={modal}
                setModal={setModal}
                email={selectedEmail}
            />
        </>
    );
}