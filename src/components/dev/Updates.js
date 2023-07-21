import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'reactstrap';
import moment from 'moment';
import ReactTable from '../../components/custom/ReactTable';
import updatesTableMapping from './updatesTableMapping';
import ModalManageUpdate from './ModalManageUpdate';
import { addLocalValue, api, asyncHandler } from '../../utils';

export default ({
    updateLocalValue,
    user,
    tabId
}) => {

    const [updates, setUpdates] = useState([]);
    const [modal, setModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [createUpdate, setCreateUpdate] = useState(false);

    useEffect(() => {
        const selectDevUpdates = asyncHandler(async () => {
            const res = await api('get', 'selectDevUpdates');
            setUpdates(res.data);
        });

        if (user && user.s_email && (tabId === '1')) {
            selectDevUpdates();
        }
    }, [user.s_email, tabId]);

    const handleUpdate = (item) => {
        if (!item) {
            setCreateUpdate(true);
        } else {
            setCreateUpdate(false);
        }
        setSelectedItem(item);
        setModal(true);
    }

    const updateDevUpdate = asyncHandler(async(values) => {
        const data = values;
        data.t_changed_date = moment().format('MM/DD/YYYY HH:mm');

        if (createUpdate) {
            const res = await api('post', 'createDevUpdate', { data });
            addLocalValue(updates, setUpdates, res.data, true);
        } else {
            data.id = selectedItem.id;
            const res = await api('put', 'updateDevUpdate', { data });
            updateLocalValue(updates, setUpdates, selectedItem.id, res.data);
        }

        setModal(false);
    });

    return (
        <Row>
            <Col md={12}>
                <Button onClick={() => handleUpdate(null)}>Create Update</Button>
                <ReactTable 
                    data={updates}
                    mapping={updatesTableMapping}
                    enableClick={true}
                    handleClick={(item) => handleUpdate(item)}
                />
            </Col>
            <ModalManageUpdate 
                modal={modal}
                setModal={setModal}
                item={selectedItem}
                createUpdate={createUpdate}
                updateDevUpdate={updateDevUpdate}
            />
        </Row>
    );  
};