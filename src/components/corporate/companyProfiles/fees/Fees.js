import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card, CardBody, Table } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';

import ReactTable from '../../../custom/ReactTable';
import ModalSla from './ModalSla';
import ModalIscStorage from './ModalIscStorage';

export default ({
    user,
    baseApiUrl,
    headerAuthCode,
    activeFirstTab,
    createSuccessNotification
}) => {

    const [dataQueried, setDataQueried] = useState(false);
    const [stations, setStations] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [iscData, setIscData] = useState([]);
    const [storageData, setStorageData] = useState([]);
    const [slaData, setSlaData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [createNew, setCreateNew] = useState(false);
    const [modalSla, setModalSla] = useState(false);
    const [s_unit, set_s_unit] = useState('');
    const [s_airline_code, set_s_airline_code] = useState('');
    const [updateSlaItem, setUpdateSlaItem] = useState(null);
    const [f_isc, set_f_isc] = useState('');
    const [f_kg, set_f_kg] = useState('');
    const [f_min, set_f_min] = useState('');
    const [modalIscStorage, setModalIscStorage] = useState();

    const getFeeData = async () => {
        const response = await axios.get(`${baseApiUrl}/getFeeData`, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        if (response.status === 200) {
            const { iscData, storageData, slaData, stations, stationCustomers } = response.data
            setIscData(iscData);
            setStorageData(storageData);
            setSlaData(slaData);
            setStations(stations);
            setCustomers(stationCustomers);
            setDataQueried(true);
        } else {
            alert(`Error getting data`);
        }
    }

    useEffect(() => {
        if (activeFirstTab === '2' && !dataQueried) {
            getFeeData();
        }
    }, [activeFirstTab]);

    const handleSelectItem = (item) => {
        setSelectedItem(item);
    }

    const resolveStorageCost = (s_unit, selectedItem) => {
        const item = storageData.find(d => d.s_unit === s_unit && d.s_airline_code === selectedItem.s_airline_code);
        if (item) {
            return item;
        }
        return {};
    }

    const resolveSla = (s_unit, selectedItem) => {
        console.log(s_unit);
        console.log(selectedItem);
        const item = slaData.find(d => d.s_unit === s_unit && d.s_airline_code === selectedItem.s_airline_code);
        console.log(item);
        if (item) {
            return item;
        }
        return {};
    }

    const formatCost = (cost) => {
        const toFormat = cost && cost !== null && cost > 0 ? parseFloat(cost) : 0;
        return `$${toFormat.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    }

    const cardsMapping = [
        {
            s_unit: 'CEWR1',
            isc: 'f_cewr1'
        },
        {
            s_unit: 'CIAD1',
            isc: 'f_ciad1'
        },
        {
            s_unit: 'CBOS1',
            isc: 'f_cbos1'
        }, 
        {
            s_unit: 'CJFK1',
            isc: 'f_cjfk1'
        }
    ];

    const resolveStationMapping = (card, selectedItem) => {
        const { s_unit } = card;
        const iscId = selectedItem.id;
        const stationId = stations.find(s => s.s_unit === s_unit).id;

        const found = customers.find(c => c.i_station_id === stationId && c.i_isc_id === iscId);

        if (found) {
            return true;
        }

        return false;
    }

    const handleSla = (s_unit, selectedItem) => {
        const slaItem = resolveSla(s_unit, selectedItem);
        if (!slaItem.id) {
            setCreateNew(true);
            set_s_unit(s_unit);
            set_s_airline_code(selectedItem.s_airline_code);
        } else {
            setCreateNew(false);
            setUpdateSlaItem(slaItem);
        }
        setModalSla(true);
    }

    const addUpdateSla = (values) => {
        const { email } = user;
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        let url;
        let notification;

        if (createNew) {
            values.t_created = now;
            values.s_created_by = email;
            url = 'addSla';
            notification = 'Record Added';
        } else {
            values.id = updateSlaItem.id;
            url = 'updateSla';
            notification = 'Record Updated';
        }        

        values.t_modified = now;
        values.s_modified_by = email;

        const data = values;
        
        axios.post(`${baseApiUrl}/${url}`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setSlaData(response.data);
            setModalSla(false);
            createSuccessNotification(notification);
            reset();
        }).catch(error => {
            
        }); 
    }

    const resolveIsc = (s_unit, iscItem) => {
        switch (s_unit) {
            case 'CEWR1':
                return iscItem.f_cewr1;
            case 'CIAD1':
                return iscItem.f_ciad1;
            case 'CBOS1':
                return iscItem.f_cbos1;
            case 'CJFK1':
                return iscItem.f_cjfk1;
        }
    }

    const handleIscStorage = (s_unit, selectedItem) => {
        const iscItem = iscData.find(d => d.s_airline_code === selectedItem.s_airline_code);

        set_s_unit(s_unit);
        set_s_airline_code(selectedItem.s_airline_code);
        set_f_kg(resolveStorageCost(s_unit, selectedItem).f_kg);
        set_f_min(resolveStorageCost(s_unit, selectedItem).f_min);
        set_f_isc(resolveIsc(s_unit, iscItem));

        setModalIscStorage(true);
    }

    const createUpdateIscAndMinStorage = async () => {
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        const email = user && user.s_email;

        const data = {
            s_unit,
            s_airline_code,
            s_created_by: email,
            t_created: now,
            s_modified_by: email,
            t_modified: now,
            f_isc,
            f_kg,
            f_min
        }

        const response = await axios.post(`${baseApiUrl}/createUpdateIscAndMinStorage`, {
            data
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        if (response.status === 200) {
            const { iscData, storageData } = response.data;
            setIscData(iscData);
            setStorageData(storageData);
            createSuccessNotification('Isc and Storage Charges Updated');
            setModalIscStorage(false);
            reset();
        } else {
            alert('Error updating charges');
        }
    }

    const reset = () => {
        set_s_airline_code('');
        set_s_unit('');
        set_f_kg('');
        set_f_min('');
        set_f_isc('');
    }

    return (
        <Row>
            <Col md={12}>
                <Row>
                    <Col md={4}>
                        <Card>
                            <CardBody className='custom-card-transparent'>
                                <Row>
                                    <h4>Select Airline</h4>
                                    <Col md={12}>
                                        <ReactTable 
                                            data={iscData}
                                            customPagination={true}
                                            mapping={[
                                                {
                                                    name: 'Prefix',
                                                    value: 's_airline_prefix',
                                                    smallWidth: true
                                                },
                                                {
                                                    name: 'Code',
                                                    value: 's_airline_code',
                                                    smallWidth: true
                                                },
                                                {
                                                    name: 'Name',
                                                    value: 's_airline_name'
                                                }
                                            ]}
                                            handleClick={handleSelectItem}
                                            enableClick={true}
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={8}>
                        <Row className='mb-2'>
                            <Col md={12}>
                                <Card>
                                    <CardBody className='custom-card-transparent'>
                                        <Row>
                                            <h4>
                                                {
                                                    selectedItem ? 
                                                    `${selectedItem.s_airline_name} - ${selectedItem.s_airline_code} - ${selectedItem.s_airline_prefix}` :
                                                    `Airline`
                                                }
                                            </h4>
                                        </Row>
                                        {
                                            selectedItem && 
                                            <Row>
                                                {
                                                    cardsMapping.map((m, i) => resolveStationMapping(m, selectedItem) && 
                                                        <Col md={6} key={i} className='mb-3'>
                                                            <Card>
                                                                <CardBody>
                                                                    <h2>{m.s_unit}</h2>
                                                                    <div>
                                                                        <h4 style={{float: 'left'}}>Fees</h4>
                                                                        <i style={{float: 'right'}} className='fas fa-edit' onClick={() => handleIscStorage(m.s_unit, selectedItem)} />
                                                                    </div>
                                                                    <Table>
                                                                        <thead></thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>ISC</td>
                                                                                <td>{formatCost(selectedItem[m.isc])}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Storage per KG</td>
                                                                                <td>{formatCost(resolveStorageCost(m.s_unit, selectedItem).f_kg)}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Min Storage</td>
                                                                                <td>{formatCost(resolveStorageCost(m.s_unit, selectedItem).f_min)}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </Table>

                                                                    <div>
                                                                        <h4 style={{float: 'left'}}>SLA</h4>
                                                                        <i style={{float: 'right'}} className='fas fa-edit' onClick={() => handleSla(m.s_unit, selectedItem)} />
                                                                    </div>
                                                                    <Table>
                                                                        <thead></thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>Aircraft</td>
                                                                                <td>{resolveSla(m.s_unit, selectedItem).s_aircraft}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Cut Off</td>
                                                                                <td>{resolveSla(m.s_unit, selectedItem).i_cut_off_time}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>UWS Time</td>
                                                                                <td>{resolveSla(m.s_unit, selectedItem).i_uws_time}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Breakdown</td>
                                                                                <td>{resolveSla(m.s_unit, selectedItem).i_sla_breakdown}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </Table>
                                                                </CardBody> 
                                                            </Card>
                                                        </Col>
                                                    )
                                                }
                                            </Row>
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>

            <ModalSla 
                open={modalSla}
                handleModal={() => setModalSla(!modalSla)}
                createNew={createNew}
                updateSlaItem={updateSlaItem}
                s_unit={s_unit}
                s_airline_code={s_airline_code}
                slaData={slaData}
                addUpdateSla={addUpdateSla}
            />

            <ModalIscStorage 
                open={modalIscStorage}
                handleModal={() => setModalIscStorage(!modalIscStorage)}
                s_unit={s_unit}
                s_airline_code={s_airline_code}
                f_isc={f_isc}
                set_f_isc={set_f_isc}
                f_kg={f_kg}
                set_f_kg={set_f_kg}
                f_min={f_min}
                set_f_min={set_f_min}
                createUpdateIscAndMinStorage={createUpdateIscAndMinStorage}
            />
        </Row>
    );
}