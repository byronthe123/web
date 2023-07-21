import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Row, Col, Button, Card, CardBody } from 'reactstrap';
import ReactTable from '../../../custom/ReactTable';

import airlineDetailsMapping from './airlineDetailsMapping';
import ModalAddCustomers from './ModalAddCustomers';
import ModalUpdateDetail from './ModalUpdateDetail';
import { updateLocalValue, addLocalValue, deleteLocalValue, notify } from '../../../../utils';
import useLoading from '../../../../customHooks/useLoading';

export default function StationCustomers ({
    user,
    baseApiUrl,
    headerAuthCode,
    airlines
}) {

    const { setLoading } = useLoading();
    const [stations, setStations] = useState([]);
    const [isc, setIsc] = useState([]);
    const [selectedStationCustomers, setSelectedStationCustomers] = useState([]);
    const [selectedStationCustomerAirlineIds, setSelectedCustomerStationAirlineIds] = useState([]);
    
    const [selectedStation, setSelectedStation] = useState(null);
    const [modalAddAirline, setModalAddAirline] = useState(false);
    const [existingCustomers, setExistingCustomers] = useState([]);

    // Update Detail
    const [modalUpdateDetail, setModalUpdateDetail] = useState(false);
    const [selectedAirlineDetail, setSelectedAirlineDetail] = useState({});

    // Add new Airline Customer
    const [airlinesQueryCompleted, setAirlinesQueryCompleted] = useState(false);

    const airlinesMapping = [
        {
            name: 'Add',
            value: 'fas fa-plus blue-hover',
            icon: true,
            function: (item) => {
                addStationCustomer(item.id);
            },
            showCondition: (item) => !isCustomer(item.id)
        },
        {
            name: 'Airline Prefix',
            value: 's_airline_prefix'
        },
        {
            name: 'Airline Name',
            value: 's_airline_name'
        },
        {
            name: 'Airline Code',
            value: 's_airline_code'
        },
        {
            name: 'Remove',
            value: 'fas fa-trash',
            icon: true,
            function: (item) => removeStationCustomer(item.id),
            showCondition: (item) => isCustomer(item.id)
        }
    ];

    useEffect(() => {
        const selectStations = async () => {
            try {
                const response = await axios.get(`${baseApiUrl}/selectStations`, {
                    headers: {
                        Authorization: `Bearer ${headerAuthCode}`
                    }
                });

                if (response.status === 200) {
                    setStations(response.data);
                }   
            } catch (err) {
                alert(err);
            }
        }
        if (user) {
            selectStations();
        }
    }, [user]);

    const resolveExistingCustomers = (customers) => {
        const existingCustomerIds = customers.map(c => c.AirlineDatum.id);
        return existingCustomerIds;
    }

    const handleAddAirlineCustomer = () => {
        setModalAddAirline(true);
        setExistingCustomers(resolveExistingCustomers(selectedStationCustomers));
    }

    const selectStationCustomerData = async (s_unit) => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseApiUrl}/selectStationCustomerData/${s_unit}`, {
                headers: {
                    Authorization: `Bearer ${headerAuthCode}`
                }
            });
            setLoading(false);
            if (response.status === 200) {
                const { data } = response;
                console.log(data);
                setSelectedStationCustomers(data);
            }
        } catch (err) {
            alert(err);
        }
    }

    const isCustomer = (id) => {
        const ids = selectedStationCustomers.map(d => parseInt(d.i_airline_id));
        return ids.indexOf(id) !== -1;
    }

    const handleSelectStation = (s_unit) => {
        setSelectedStation(s_unit);
        selectStationCustomerData(s_unit);
    }

    const addStationCustomer = async (i_airline_id) => {
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        const { s_email } = user && user;
        const data = {
            i_airline_id,
            s_unit: selectedStation,
            s_status: 'INACTIVE',
            s_created_by: s_email,
            t_created: now,
            s_modified_by: s_email,
            t_modified: now
        }

        try {
            const response = await axios.post(`${baseApiUrl}/addStationCustomer`, {
                data
            }, {
                headers: { 'Authorization': `Bearer ${headerAuthCode}` }
            });
    
            if (response.status === 200) {
                addLocalValue(selectedStationCustomers, setSelectedStationCustomers, response.data);
                notify('Customer Added');
                setModalAddAirline(false);
            }
        } catch (err) {
            alert(err);
        }
    }

    const removeStationCustomer = async (i_airline_id) => {
        const data = {
            i_airline_id,
            s_unit: selectedStation
        }

        try {
            const response = await axios.post(`${baseApiUrl}/removeStationCustomer`, {
                data
            }, {
                headers: { 'Authorization': `Bearer ${headerAuthCode}` }
            });

            if (response.status === 200) {
                const customer = selectedStationCustomers.find(c => c.i_airline_id === data.i_airline_id && c.s_unit === data.s_unit);
                deleteLocalValue(selectedStationCustomers, setSelectedStationCustomers, customer.id);
                notify('Customer Removed');
                setModalAddAirline(false);
            }
    
        } catch (err) {
            alert(err);
        }
    }

    const handleUpdateCustomer = (detail) => {
        setSelectedAirlineDetail(detail);
        setModalUpdateDetail(true);
    }

    const updateStationAirlineDetail = async (values) => {
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        const data = values;
        data.t_modified = now;
        data.s_modified_by = user.s_s_email;

        try {
            
            const response = await axios.put(`${baseApiUrl}/updateStationAirlineDetail`, {
                data
            }, {
                headers: {
                    Authorization: `Bearer ${headerAuthCode}`
                }
            });

            if (response.status === 200) {
                updateLocalValue(selectedStationCustomers, setSelectedStationCustomers, selectedAirlineDetail.id, data);
                setModalUpdateDetail(false);
            }
        } catch (err) {
            alert(err);
        }
    }

    return (
        <Row className='py-2 px-2'>
            <Col md={3}>
                <Card style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent'>
                        <h4>Select Station</h4>
                        <select className='form-control' value={selectedStation} onChange={(e) => handleSelectStation(e.target.value)}>
                            <option></option>
                            {
                                stations.map((s, i) => 
                                    <option key={i} value={s.s_unit}>{s.s_unit}</option>
                                )
                            }
                        </select>
                    </CardBody>
                </Card>
            </Col>
            <Col md={12} className='mt-2'>
                {
                    selectedStation && 
                    <Card style={{borderRadius: '0.75rem'}}>
                        <CardBody className='custom-card-transparent'>
                            <Row className='mb-2'>
                                <Col md={12}>
                                    <h4 style={{display: 'inline'}}>Customers for {selectedStation}</h4>
                                    <i 
                                        className="fas fa-plus-circle text-large text-primary hover-pointer ml-2 mt-2"
                                        onClick={() => handleAddAirlineCustomer()}
                                        data-tip={'Add Customers'}
                                    ></i>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <ReactTable 
                                        data={selectedStationCustomers}
                                        mapping={airlineDetailsMapping}
                                        numRows={10}
                                        index={true}
                                        enableClick={true}
                                        handleClick={handleUpdateCustomer}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                }
            </Col>
            
            <ModalAddCustomers 
                open={modalAddAirline}
                handleModal={setModalAddAirline}
                selectedStation={selectedStation}
                airlinesMapping={airlinesMapping}
                airlines={airlines}
                addStationCustomer={addStationCustomer}
                existingCustomers={existingCustomers}
            />

            <ModalUpdateDetail 
                modal={modalUpdateDetail}
                setModal={setModalUpdateDetail}
                user={user}
                selectedAirlineDetail={selectedAirlineDetail}
                setSelectedAirlineDetail={setSelectedAirlineDetail}
                setSelectedStationCustomers={setSelectedStationCustomers}
                updateStationAirlineDetail={updateStationAirlineDetail}
            />
            
        </Row>
    );
}   