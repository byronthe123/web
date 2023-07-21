import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import {
    Button,
    Row,
    Col,
    Card,
    CardBody,
    Input,
    FormGroup,
    Label,
} from 'reactstrap';

import AppLayout from '../../../components/AppLayout';
import { asyncHandler } from '../../../utils';
import VirtualTable from '../../../components/custom/VirtualTable';
import apiClient from '../../../apiClient';
import ActionIcon from '../../../components/custom/ActionIcon';
import ModalCreateOverrideCode from './ModalCreateOverrideCode';
import Layout from '../../../components/custom/Layout';

const OverrideCodes = ({
    user,
    baseApiUrl,
    headerAuthCode,
    createSuccessNotification,
    eightyWindow,
    width,
}) => {
    const [data, setData] = useState([]);
    const [s_override, set_s_override] = useState('');
    const [s_reason, set_s_reason] = useState('');
    const [modalCreateCode, setModalCreateCode] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await apiClient.get('/overrideCodes');
                setData(res.data);
            } catch (err) {
                alert(err);
            }
        };
        getData();
    }, []);

    useEffect(() => {
        if (s_reason.length > 0) {
            set_s_override('');
        }
    }, [s_reason]);

    const createOverride = asyncHandler(async () => {
        const code = uuidv4().substr(0, 3).toUpperCase();
        const codeData = {
            s_override: code,
            s_reason,
            t_created: moment().local().format('MM/DD/YYYY HH:mm:ss'),
            s_creator: user.s_email,
        }

        await axios.post(
            `${baseApiUrl}/createOverrideCode`,
            {
                data: codeData,
            },
            {
                headers: {
                    Authorization: `Bearer ${headerAuthCode}`,
                },
            }
        );

        set_s_reason('');
        set_s_override(code);
        setData(prev => [codeData, ...prev]);
        createSuccessNotification('Override code created');
    });

    const handleCreateCode = () => {
        setModalCreateCode(true);
        set_s_override('');
        set_s_reason('');
    }

    return (
        <Layout>
            <div>
                <ActionIcon
                    type={'add'}
                    onClick={() => handleCreateCode()}
                />
                <VirtualTable
                    data={data}
                    mapping={[
                        {
                            name: 'Created',
                            value: 't_created',
                            datetime: true,
                            utc: true,
                        },
                        {
                            name: 'Created by',
                            value: 's_creator',
                            email: true,
                        },
                        {
                            name: 'Override',
                            value: 's_override',
                        },
                        {
                            name: 'Used',
                            value: 'b_used',
                            boolean: true,
                        },
                        {
                            name: 'Reason',
                            value: 's_reason',
                        },
                    ]}
                    numRows={10}
                />
            </div>
            <ModalCreateOverrideCode
                modal={modalCreateCode}
                setModal={setModalCreateCode}
                s_reason={s_reason}
                set_s_reason={set_s_reason}
                s_override={s_override}
                createOverride={createOverride}
            />
        </Layout>
    );
};

export default withRouter(OverrideCodes);
