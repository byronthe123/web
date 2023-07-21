import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card, CardBody } from 'reactstrap';
import ReactTable from '../custom/ReactTable';
import ModalManageLevel from './ModalManageLevel';
import moment from 'moment';
import { api } from '../../utils';

export default ({
    user,
    accessLevels,
    setAccessLevels,
    accessTabs,
    asyncHandler,
    baseApiUrl,
    headerAuthCode,
    createSuccessNotification,
    addLocalValue,
    deleteLocalValue,
    updateLocalValue
}) => {

    const [modalCreateLevelOpen, setModalCreateLevelOpen] = useState(false);
    const [i_access_level, set_i_access_level] = useState('');
    const [selectedTabs, setSelectedTabs] = useState([]);
    const [s_name, set_s_name] = useState('');
    const [newLevel, setNewLevel] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState({});

    // useEffect(() => {
    //     if (accessLevels.length > 0) {

    //     }
    // }, [accessLevels]);

    const resolveNextLevelValues = () => {
        const sorted = accessLevels.sort((a, b) => b.i_access_level - a.i_access_level);
        const previousLevel = sorted[0];
        set_i_access_level(previousLevel.i_access_level + 1);
        const previousLevelTabs = [];

        for (let i = 0; i < previousLevel.AccessMappings.length; i++) {
            previousLevelTabs.push(previousLevel.AccessMappings[i].i_tab_id);  
        }
        setSelectedTabs(previousLevelTabs);
    }

    const addTab = (i_tab_id) => {
        let copy = Object.assign([], selectedTabs);
        if (copy.includes(i_tab_id)) {
            copy = copy.filter(c => c !== i_tab_id);
        } else {
            copy.push(i_tab_id);
        }
        setSelectedTabs(copy);
    }

    const createAccessLevel = asyncHandler(async() => {
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        const { s_email } = user && user;
        const endpoint = newLevel ? 'createAccessLevel' : 'updateAccessLevel';

        const data = {
            i_access_level,
            s_name,
            selectedTabs,
            s_created_by: s_email,
            t_created: now,
            s_modified_by: s_email,
            t_modified: now 
        }

        if (!newLevel) {
            data.id = selectedLevel.id;
        }

        const response = await api('post', endpoint, { data });

        if (response.status === 200) {
            createSuccessNotification(newLevel ? 'Created' : 'Updated');
            setModalCreateLevelOpen(false);
            if (newLevel) {
                addLocalValue(accessLevels, setAccessLevels, response.data);
            } else {
                updateLocalValue(accessLevels, setAccessLevels, selectedLevel.id, response.data);
            }
        }
    });

    const handleCreateLevel = () => {
        setNewLevel(true);
        setModalCreateLevelOpen(true);
        resolveNextLevelValues();
        set_s_name('');
        setSelectedTabs([]);
    }

    const handleUpateLevel = (accessLevel) => {
        setNewLevel(false);
        setSelectedLevel(accessLevel);
        setModalCreateLevelOpen(true);
        set_i_access_level(accessLevel.i_access_level);
        set_s_name(accessLevel.s_name);

        const tabs = [];
        for (let i = 0; i < accessLevel.AccessMappings.length; i++) {
            tabs.push(accessLevel.AccessMappings[i].i_tab_id);  
        }
        setSelectedTabs(tabs);
    }

    const deleteAccessLevel = asyncHandler(async() => {
        const response = await api('delete', `deleteAccessLevel/${selectedLevel.i_access_level}`);

        if (response.status === 200) {
            createSuccessNotification('Deleted');
            deleteLocalValue(accessLevels, setAccessLevels, selectedLevel.id);
            setSelectedLevel({});
            setModalCreateLevelOpen(false);
        }   
    });

    return (
        <Row>
            <Col md={6}>
                <Card>
                    <CardBody className='custom-opacity-card'>
                        <Row>
                            <Col md={12} className='mb-2'>
                                <h4 className='float-left'>Access Levels</h4>
                                <i 
                                    className="fas fa-plus-circle float-right hover-pointer text-primary text-large"
                                    onClick={() => handleCreateLevel()}
                                    data-tip={'Create New'}
                                ></i>
                            </Col>
                        </Row>
                        <ReactTable 
                            data={accessLevels}
                            numRows={10}
                            enableClick={true}
                            handleClick={handleUpateLevel}
                            mapping={[
                                {
                                    name: 'Level',
                                    value: 'i_access_level',
                                    smallWidth: true
                                },
                                {
                                    name: 'Name',
                                    value: 's_name'
                                },
                                {
                                    name: 'Created by',
                                    value: 's_created_by',
                                    s_email: true
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
                                    s_email: true
                                },
                                {
                                    name: 'Modified',
                                    value: 't_modified',
                                    datetime: true,
                                    utc: true
                                },
                            ]}
                        />
                    </CardBody>
                </Card>
            </Col>
            <Col md={6}>
                <Card>
                    <CardBody className='custom-opacity-card'>
                        <h4>Tabs</h4>
                        <ReactTable 
                            data={accessTabs}
                            numRows={10}
                            mapping={[
                                {
                                    name: 'ID',
                                    value: 'id',
                                    smallWidth: true
                                }, 
                                {
                                    name: 'Tab Name',
                                    value: 's_tab_name'
                                }
                            ]}
                        />
                    </CardBody>
                </Card>
            </Col>
            <ModalManageLevel 
                modal={modalCreateLevelOpen}
                setModal={setModalCreateLevelOpen}
                accessTabs={accessTabs}
                s_name={s_name}
                set_s_name={set_s_name}
                i_access_level={i_access_level}
                set_s_name={set_s_name}
                createAccessLevel={createAccessLevel}
                selectedTabs={selectedTabs}
                addTab={addTab}
                newLevel={newLevel}
                deleteAccessLevel={deleteAccessLevel}
            />
        </Row>
    );
}
