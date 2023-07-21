import React, { Component, Fragment, useState, useEffect, useRef  } from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import ReactTooltip from 'react-tooltip';
import { updateLocalValue } from '../../utils';

import {Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col, Table, Card, CardBody, CardTitle, CardText} from 'reactstrap';

import AppLayout from '../../components/AppLayout';


const AcceptTransfers = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, createSuccessNotification, eightyWindow, width
}) => {

    const email = user && user.s_email;
    // const now = moment().local().format('MM/DD/YYYY hh:mm A');

    const [t_departure, set_t_departure] = useState(moment().format('YYYY-MM-DD'));
    const [uniqueTransferTrucks, setUniqueTransferTrucks] = useState([]);
    const [transferData, setTransferData] = useState([]);
    const [selectedTruckGuid, setSelectedTruckGuid] = useState('');
    const [selectedTrucks, setSelectedTrucks] = useState(null);
    const [dropDown, setDropDownOpen] = useState(false);
    const [refreshIndex, setRefreshIndex] = useState(0);

    const toggleDropDownButton = () => setDropDownOpen(!dropDown);

    const selectUniqueTransferTrucks = () => {
  
        const data = {
          t_departure,
          s_unit: user.s_unit
        }
  
        axios.post(`${baseApiUrl}/selectUniqueTransferTrucks`, {
            data
        }, {
          headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setTransferData(response.data);
        }).catch(error => {
            alert(error);
        });
    }

    useEffect(() => {
        if (user && user.s_unit && moment(t_departure).isValid()) {
            selectUniqueTransferTrucks();
        }
    }, [t_departure, user]);

    useEffect(() => {
  
        const groupedData = [];
    
        for (let i = 0; i < transferData.length; i++) {
            const exists = groupedData.filter(d => d.s_truck_guid === transferData[i].s_truck_guid);
            if (exists.length === 0) {
                groupedData.push({
                    s_truck_id: transferData[i].s_truck_id,
                    s_truck_guid: transferData[i].s_truck_guid
                });
            }
        }
  
        setUniqueTransferTrucks(groupedData);
        // setSelectedTrucks([]);
        // setSelectedTruckGuid(null);
    
    }, [transferData]);

    const markAll = (s_status) => {

        const now = moment().local().format('MM/DD/YYYY hh:mm A');

        const data = {
            s_status,
            t_accepted_on: s_status === 'ACCEPTED' ? now : null,
            s_accepted_on: s_status === 'ACCEPTED' ? 'EOS' : null,
            s_accepted_by: s_status === 'ACCEPTED' ? email : null,
            t_modified: now,
            s_modified_by: email,
            s_truck_guid: selectedTruckGuid,
            t_departure,
            s_unit: user && user.s_unit
        }
    
        axios.post(`${baseApiUrl}/markAllImportTransfers`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            console.log(response.data);
            setTransferData(response.data);
            createSuccessNotification(`Items ${s_status}`);
            setRefreshIndex(refreshIndex + 1);
        }).catch(error => {

        });
    }

    const mark = (s_status, s_mawb_guid) => {

        const now = moment().local().format('MM/DD/YYYY hh:mm A');

        const data = {
            s_status,
            t_accepted_on: s_status === 'ACCEPTED' ? now : null,
            s_accepted_on: s_status === 'ACCEPTED' ? 'EOS' : null,
            s_accepted_by: s_status === 'ACCEPTED' ? email : null,
            t_modified: now,
            s_modified_by: email,
            s_mawb_guid,
            t_departure,
            s_unit: user && user.s_unit
        }
    
        axios.post(`${baseApiUrl}/markImportTransfer`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            const copy = Object.assign([], transferData);
            const updateIndex = copy.findIndex(t => t.s_mawb_guid === s_mawb_guid);
            copy[updateIndex] = response.data[0];
            setTransferData(copy);

            createSuccessNotification(`Item ${s_status}`);
            setRefreshIndex(refreshIndex + 1);
        }).catch(error => {

        });
    }
  
    useEffect(() => {
      const trucks = transferData.filter(t => t.s_truck_guid === selectedTruckGuid);
      console.log(transferData);
      console.log(trucks);
      setSelectedTrucks(trucks);
    }, [selectedTruckGuid, refreshIndex]);

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 pt-3 pb-0'>
                        <h1>Accept Transfers</h1>
                    </Row>
                    <Row className='px-1 py-0'>
                        <Col md={3}>
                            <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                                <CardBody className='custom-card-transparent py-3 px-5'>
                                    <Row>
                                        <h4 className='pr-3'>Filter by Date:</h4>
                                        <input type='date' value={t_departure} onChange={(e) => set_t_departure(e.target.value)} />
                                    </Row>
                                    <Row>
                                        <h4>Results</h4>
                                    </Row>
                                    <Row>
                                    {
                                        moment(t_departure).isValid && uniqueTransferTrucks.length === 0 ?  
                                        <h5>No Results Found</h5> :
                                        <Table className={'table-row-hover'}>
                                            <thead></thead>
                                            <tbody>
                                                {                                        
                                                    uniqueTransferTrucks.map((t, i) => 
                                                        <tr onClick={() => setSelectedTruckGuid(t.s_truck_guid)} key={i} className={`${selectedTruckGuid === t.s_truck_guid ? 'table-row-selected' : ''}`}>
                                                            <td>{t.s_truck_id}</td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </Table>
                                    }
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md={9}>
                            {
                                selectedTrucks !== null && selectedTrucks.length > 0 &&  
                                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                                    <CardBody className='custom-card-transparent py-3 px-5'>
                                        <Row className='my-2'>
                                            <h4>Truck Transfer {selectedTrucks[0].s_truck_id} Details</h4>
                                        </Row>
                                        <Row className='my-2'>
                                            <h5>Truck number {selectedTrucks[0].s_truck_id} to {selectedTrucks[0].s_to} from {selectedTrucks[0].s_from} departing on {moment(selectedTrucks[0].t_departure).format('MM/DD/YYYY HH:mm:ss')} and estimated arrival on {moment(selectedTrucks[0].t_estimated_arrival).format('MM/DD/YYYY HH:mm:ss')}.</h5>
                                        </Row>
                                        <Row className='my-2'>
                                            <h5>Entered on {moment(selectedTrucks[0].t_created).format('MM/DD/YYYY HH:mm:ss')}</h5>
                                        </Row>
                                        <Table striped>
                                            <thead>
                                                <tr>
                                                    <th>Company</th>
                                                    <th>AWB</th>
                                                    <th>Arriving Flight</th>
                                                    <th>Arrival Date</th>
                                                    <th>Pieces</th>
                                                    <th>Weight</th>
                                                    <th>Destination</th>
                                                    <th>Status</th>
                                                    <th>
                                                        <ButtonDropdown isOpen={dropDown} toggle={toggleDropDownButton}>
                                                            <DropdownToggle caret color='info'>
                                                                Action for All
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                <DropdownItem onClick={() => markAll('ACCEPTED')}>Accept for All</DropdownItem>
                                                                <DropdownItem onClick={() => markAll('REJECTED')}>Reject for All</DropdownItem>
                                                                <DropdownItem onClick={() => markAll('DELETED')}>Delete for All</DropdownItem>
                                                                <DropdownItem onClick={() => markAll('NOT RECEIVED')}>Not Received for All</DropdownItem>
                                                            </DropdownMenu>
                                                        </ButtonDropdown>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody value={refreshIndex}>
                                                {
                                                    selectedTrucks.map((t, i) => 
                                                        <tr key={i}>
                                                            <th>{t.s_company}</th>
                                                            <th>{t.s_mawb}</th>
                                                            <th>{t.s_mawb_arrival_flight}</th>
                                                            <th>{moment(t.t_departure).format('MM/DD/YYYY')}</th>
                                                            <th>{t.i_mawb_pieces}</th>
                                                            <th>{t.f_mawb_weight_kg}</th>
                                                            <th>{t.s_mawb_destination}</th>
                                                            <th>{t.s_status}</th>
                                                            <th className='py-0' style={{fontSize: '30px'}}>
                                                                <ReactTooltip />
                                                                <i data-tip={'Accept'} className="far fa-check-circle mr-2" onClick={() => mark('ACCEPTED', t.s_mawb_guid)}></i>
                                                                <i data-tip={'Reject'} className="far fa-times-circle mr-2" onClick={() => mark('REJECTED', t.s_mawb_guid)}></i>
                                                                <i data-tip={'Delete'} className="far fa-trash-alt mr-2" onClick={() => mark('DELETED', t.s_mawb_guid)}></i>
                                                                <i data-tip={'Not Received'} className="far fa-minus-square" onClick={() => mark('NOT RECEIVED', t.s_mawb_guid)}></i>
                                                            </th>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </Table>
                                    </CardBody>
                                </Card>
                            }
                        </Col>
                    </Row>
                </div>
            </div>

            

        </AppLayout>
    );
}

export default withRouter(AcceptTransfers);