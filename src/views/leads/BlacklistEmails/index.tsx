import React, { useState, useEffect, useMemo  } from 'react';
import dayjs from 'dayjs';
import {withRouter} from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import { addLocalValue, api, deleteLocalValue, notify, updateLocalValue } from '../../../utils';
import AppLayout from '../../../components/AppLayout';
import { IBlacklistEmail, IMap } from './interfaces'
import ManageModal from './ManageModal';
import ReactTable from '../../../components/custom/ReactTable';
import _ from 'lodash';
import Layout from '../../../components/custom/Layout';
import { useAppContext } from '../../../context';

const BlacklistEmails = () => {

    const { user } = useAppContext();
    const [modal, setModal] = useState<boolean>(false);
    const [data, setData] = useState<Array<any>>([]);
    const [create, setCreate] = useState<boolean>(false);
    const [s_email, set_s_email] = useState<string>('');
    const [s_reason, set_s_reason] = useState<string>('');
    const [selectedItem, setSelectedItem] = useState<IBlacklistEmail>({
        id: 0,
        s_email: '',
        s_reason: '',
        s_created_by: '',
        t_created: '',
        s_modified_by: '',
        t_modified: ''
    });
    const [emailsMap, setEmailsMap] = useState<IMap>({});

    useEffect(() => {
        const selectBlacklistEmails = async (): Promise<void> => {
            const res = await api('get', 'selectBlacklistEmails');
            if (res.status === 200) {
                const { blacklist, emails } = res.data;
                setData(blacklist);
                const map: IMap = {};
                for (let i = 0; i < emails.length; i++) {
                    const { s_email, s_created_by, t_created } = emails[i];
                    map[s_email] = {
                        s_created_by, 
                        t_created
                    }
                }
                setEmailsMap(map);
            }
        }
        selectBlacklistEmails();
    }, []);

    const existingMap = useMemo(() => {
        const map: IMap = {};
        for (let i = 0; i < data.length; i++) {
            // @ts-ignore
            const s_email = (data[i].s_email || '').toUpperCase();
            map[s_email] = true;
        }
        return map;
    }, [data]);

    const addUpdate = (create: boolean, item?: IBlacklistEmail): void => {
        setCreate(create);
        if (create) {
            set_s_email('');
            set_s_reason('');
        }
        if (item) {
            setSelectedItem(item);
            set_s_email(item.s_email);
            set_s_reason(item.s_reason);
        }
        setModal(true);
    }

    const handleCreateUpdate = async (): Promise<void> => {
        const body: IMap = {
            s_email: s_email.replace(/['"]/g, '').toUpperCase(),
            s_reason,
            s_created_by: user.s_email,
            t_created: dayjs().format('MM/DD/YYYY HH:mm:ss'),
            s_modified_by: user.s_email,
            t_modified: dayjs().format('MM/DD/YYYY HH:mm:ss')
        };

        if (!create) {
            body.id = selectedItem.id;
            body.s_created_by = selectedItem.s_created_by;
            body.t_created = selectedItem.t_created;
        }

        for (let key in body) {
            if (_.get(body[key], 'length', 0) > 0) {
                body[key] = body[key].toUpperCase()
            }
        }

        const res = await api('post', create ? 'createBlacklistEmail' : 'updateBlacklistEmail', body);

        if (res.status === 200) {
            if (create) {
                addLocalValue(data, setData, res.data);
            } else {
                updateLocalValue(data, setData, selectedItem!.id, body);
            }
            setModal(false);
            notify('Success');
        }
    }

    const deleteBlacklistEmail = async (id: number): Promise<void> => {
        await api('delete', `deleteBlacklistEmail/${id}`);
        setModal(false);
        deleteLocalValue(data, setData, id);
        notify('Success');
    }

    const deleteFoundBlacklistEmail = async (s_email: string): Promise<void> => {
        const res = await api('post', 'deleteFoundBlacklistEmail', { s_email });
        if (res.status === 200) {
            const copy = _.cloneDeep(emailsMap);
            delete copy[s_email.toUpperCase()];
            setEmailsMap(copy);
            notify('Success');
        }
    }

    return (
        <Layout>
            <Row className='px-3 py-3'>
                <Col md={12}>
                    <h4 className={'float-left'}>Blacklist Emails</h4>
                    <i
                        className="fas fa-plus-circle float-right text-large text-primary hover-pointer mr-3"
                        data-tip={'Add Email'}
                        onClick={() => addUpdate(true)}
                    ></i>
                </Col>
                <Col md={12} className={'mt-2'}>
                    {/* @ts-ignore */}
                    <ReactTable
                        data={data}
                        mapping={[
                            {
                                name: 'Email',
                                value: 's_email',
                                customWidth: 200
                            },
                            {
                                name: 'Reason',
                                value: 's_reason',
                                customWidth: 800,
                            },
                            {
                                name: 'Created by',
                                value: 's_created_by',
                                email: true,
                                customWidth: 150
                            },
                            {
                                name: 'Created',
                                value: 't_created',
                                datetime: true,
                                utc: true
                            },
                            {
                                name: 'Modified by',
                                value: 's_modified_by',
                                email: true,
                                customWidth: 150,
                            },
                            {
                                name: 'Modified',
                                value: 't_modified',
                                datetime: true,
                                utc: true
                            }
                        ]}
                        enableClick={true}
                        handleClick={(item: IBlacklistEmail) => addUpdate(false, item)}
                        numRows={10}
                    />
                </Col>
            </Row>
            <ManageModal
                modal={modal}
                setModal={setModal}
                create={create}
                s_email={s_email}
                set_s_email={set_s_email}
                s_reason={s_reason}
                set_s_reason={set_s_reason}
                handleCreateUpdate={handleCreateUpdate}
                deleteBlacklistEmail={deleteBlacklistEmail}
                selectedItem={selectedItem}
                existingMap={existingMap}
                emailsMap={emailsMap}
                deleteFoundBlacklistEmail={deleteFoundBlacklistEmail}
            />
        </Layout>
    );
}

export default withRouter(BlacklistEmails);