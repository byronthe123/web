import React, { Fragment, useState, useEffect } from 'react';
import { Row, Col, Button, Table } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import { notify } from '../../../../utils';

import mapping from './stationsMapping';
import ReactTable from '../../../custom/ReactTable';
import ModalEditStations from './ModalEditStations';

const Stations = ({ baseApiUrl, headerAuthCode, user, activeTabId, tabId }) => {
    const [corpStationsData, setCorpStationsData] = useState([]);
    const [doors, setDoors] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalEditStation, setModalEditStation] = useState(false);
    const [modalTypeNew, setModalTypeNew] = useState(false);
    const [s_dock_door, set_s_dock_door] = useState('');

    useEffect(() => {
        const selectCorpStationData = () => {
            user &&
                axios
                    .get(`${baseApiUrl}/selectCorpStationData`, {
                        headers: { Authorization: `Bearer ${headerAuthCode}` },
                    })
                    .then((response) => {
                        console.log(response.data);
                        setCorpStationsData(response.data.stations);
                        setDoors(response.data.doors);
                    })
                    .catch((error) => {});
        };
        console.log(activeTabId, tabId);
        if (activeTabId === tabId) {
            selectCorpStationData();
        }
    }, [activeTabId, tabId]);

    const handleStationSelect = (item) => {
        console.log(item);
        setSelectedItem(item);
        setModalEditStation(true);
        setModalTypeNew(false);
    };

    const updateStationsInfo = (values) => {
        const data = values;
        data.t_modified = moment().local().format('MM/DD/YYYY HH:mm:ss');
        data.s_modified_by = user.s_email;
        data.id = selectedItem.id;

        axios
            .post(
                `${baseApiUrl}/updateStationsInfo`,
                {
                    data,
                },
                {
                    headers: { Authorization: `Bearer ${headerAuthCode}` },
                }
            )
            .then((response) => {
                setCorpStationsData(response.data);
                setModalEditStation(false);
                notify('Station Info Updated');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleCreateNewStation = () => {
        setModalTypeNew(true);
        setModalEditStation(true);
        setSelectedItem(null);
    };

    const createCorpStation = (values) => {
        const data = values;
        data.t_created = moment().local().format('MM/DD/YYYY HH:mm:ss');
        data.s_created_by = user.s_email;
        data.t_modified = moment().local().format('MM/DD/YYYY HH:mm:ss');
        data.s_modified_by = user.s_email;

        axios
            .post(
                `${baseApiUrl}/createCorpStation`,
                {
                    data,
                },
                {
                    headers: { Authorization: `Bearer ${headerAuthCode}` },
                }
            )
            .then((response) => {
                setCorpStationsData(response.data);
                setModalEditStation(false);
                notify('Station Added');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const deleteCorpStation = (id) => {
        const data = {
            id,
        };

        axios
            .post(
                `${baseApiUrl}/deleteCorpStation`,
                {
                    data,
                },
                {
                    headers: { Authorization: `Bearer ${headerAuthCode}` },
                }
            )
            .then((response) => {
                setCorpStationsData(response.data);
                setModalEditStation(false);
                notify('Station Deleted');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const addCorpDockDoor = async () => {
        const { s_unit } = selectedItem;
        const data = {
            s_dock_door,
            s_unit,
        };

        const response = await axios.post(
            `${baseApiUrl}/addCorpDockDoor`,
            {
                data,
            },
            {
                headers: { Authorization: `Bearer ${headerAuthCode}` },
            }
        );

        setDoors(response.data);
        set_s_dock_door('');
        notify('Door Added');
    };

    const removeCorpDockDoor = async (e, id) => {
        e.preventDefault();

        const data = {
            id,
        };

        const response = await axios.post(
            `${baseApiUrl}/removeCorpDockDoor`,
            {
                data,
            },
            {
                headers: { Authorization: `Bearer ${headerAuthCode}` },
            }
        );

        setDoors(response.data);
        notify('Door Removed');
    };

    return (
        <Fragment>
            <Row className="px-3 mb-2">
                <h4 style={{ display: 'inline' }}>Station Profiles</h4>
                <i
                    class="fas fa-plus-circle text-large hover-pointer text-primary ml-3"
                    onClick={() => handleCreateNewStation()}
                    data-tip={'Add Station'}
                ></i>
            </Row>
            <Row>
                <Col md={12}>
                    <ReactTable
                        data={corpStationsData}
                        mapping={mapping}
                        numRows={10}
                        handleClick={handleStationSelect}
                        index={true}
                    />
                </Col>
            </Row>
            <ModalEditStations
                open={modalEditStation}
                handleModal={setModalEditStation}
                item={selectedItem}
                updateStationsInfo={updateStationsInfo}
                createCorpStation={createCorpStation}
                modalTypeNew={modalTypeNew}
                deleteCorpStation={deleteCorpStation}
                doors={doors}
                s_dock_door={s_dock_door}
                set_s_dock_door={set_s_dock_door}
                addCorpDockDoor={addCorpDockDoor}
                removeCorpDockDoor={removeCorpDockDoor}
            />
        </Fragment>
    );
};

export default Stations;
