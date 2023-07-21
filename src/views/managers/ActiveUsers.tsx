import React, { useState, useContext, useEffect, useMemo } from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Row, Col, Table} from 'reactstrap';

import { socket } from '../../context/socket';
import ModalNotification from '../../components/managers/activeUsers/ModalNotification';
import { useAppContext } from '../../context';
import ReactTable from '../../components/custom/ReactTable';
import { IActiveUser } from '../../globals/interfaces';
import Layout from '../../components/custom/Layout';

const ActiveUsers = () => {

    const { socket: appSocket } = useAppContext();
    const { activeUsers } = appSocket;
    const activeUsersArray: Array<IActiveUser> = useMemo(() => {
        return Object.keys(activeUsers).map((key) => activeUsers[key]);
    }, [activeUsers]);
    const [modalNotification, setModalNotification] = useState(false);

    const handleCreateNotification = (message: string, update: boolean) => {
        socket.emit('notification', message, update);
        setModalNotification(false);
    }

    return (
        <Layout>
            <h1 className={'mr-2'}>Active Users: {appSocket.activeUsers.length}</h1>
            <Button onClick={() => setModalNotification(true)}>Create Notification</Button>
            <ReactTable 
                data={activeUsersArray}
                mapping={[{
                    name: 'Name',
                    value: 'displayName'
                }, {
                    name: 'Email',
                    value: 's_email'
                }, {
                    name: 'Unit',
                    value: 's_unit'
                }, {
                    name: 'Page',
                    value: 'path'
                }, {
                    name: 'Status',
                    value: 'status'
                }]}
                index
                numRows={15}
            />

            <ModalNotification 
                modal={modalNotification}
                setModal={setModalNotification}
                handleCreateNotification={handleCreateNotification}
            />
        </Layout>
    );
}

export default withRouter(ActiveUsers);