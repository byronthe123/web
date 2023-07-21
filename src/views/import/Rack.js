import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import "rc-switch/assets/index.css";
import { Nav, NavItem, TabContent, TabPane, Row, Col } from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import { asyncHandler, updateLocalValue, addLocalValue, deleteLocalValue, api, rackUpdate } from '../../utils';
import { v4 as uuidv4 } from 'uuid';

import AppLayout from '../../components/AppLayout';
import Search from '../../components/import/rack/Search.js';
import View from '../../components/import/rack/View.js';
import ModalEditData from '../../components/import/rack/ModalEditData';
import useRackData from '../../components/import/rack/useRackData';

const Rack = ({
    user, createSuccessNotification
}) => {

    const { searchAwb } = useContext(AppContext);
    const { handleSearchAwb } = searchAwb;
    const [activeFirstTab, setActiveFirstTab] = useState('1');
    const [newLocation, setNewLocation] = useState(false);
    const [selectedRackItem, setSelectedRackItem] = useState(null);
    const [modalEditOpen, setModalEditOpen] = useState(false);

    const toggleTab = (tab) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
        }   
    }

    const { 
        rackItems, 
        setRackItems, 
        schema, 
        specialLocations, 
        locationsMap
    } = useRackData(user.s_unit);

    const handleAddUpdate = (newLocation, rackItem={}) => {
        setNewLocation(newLocation);
        setSelectedRackItem(rackItem);
        setModalEditOpen(true);
    }

    const resolveLocation = (s_tower, s_level, s_position) => {
        // const position = parseInt(s_position) < 10 ? `0${s_position}` : s_position;
        return `${s_tower}${s_level}${s_position}`;
    }

    const resolveSpecialHandlingCodeString = (values) => {
        let s_special_hanlding_code = '';
        for (let i = 1; i <= 5; i++) {
            s_special_hanlding_code += `${values[`s_shc${i}`]}, `;
        }
        return s_special_hanlding_code.substring(0, s_special_hanlding_code.length - 2);
    }

    const updateRackLocation = async(values) => {    
        values.s_unit = user && user.s_unit; 
        values.s_location = values.enableSpecialLocation ? 
            values.s_location : resolveLocation(values.s_tower, values.s_level, values.s_position);
        values.s_special_hanlding_code = resolveSpecialHandlingCodeString(values);
        
        const now = moment().local().format('MM/DD/YYYY hh:mm A');
        values.t_modified = now;
        values.s_modified_by = user && user.s_email;
        values.s_location_type = values.enableSpecialLocation ? 'SPECIAL' : 'REGULAR';
        values.s_mawb = values.s_mawb.replace(/-/g, '');
        values.s_hawb = values.s_hawb.replace(/\s/g, '');

        const userName = user.s_email.toUpperCase().split('@')[0];
        const date = moment().format('MM/DD/YYYY');
        const formatNotes = values.s_notes && values.s_notes.length > 0 ? `[${userName}|${date} - ${values.s_notes}]. ` : '';
        values.s_notes = formatNotes;

        delete values.specialLocation;
        delete values.enableSpecialLocation;

        const response = await api('post', 'updateRackLocation', values);

        updateLocalValue(rackItems, setRackItems, selectedRackItem.id, response.data[0]);
        setModalEditOpen(false);
        createSuccessNotification('Location Updated');
        rackUpdate(values.s_mawb, user.s_unit);
        setSelectedRackItem({});
    }

    const updateRackStatus = asyncHandler(async(s_status) => {
        const { id, s_location, s_mawb, s_created_by, t_created, i_pieces } = selectedRackItem;

        const data = {
            id,
            s_location, 
            s_mawb,
            s_status,
            i_pieces: i_pieces || 0,
            t_modified: moment().local().format('MM/DD/YYYY HH:mm:ss'),
            s_modified_by: user.s_email,
            s_created_by,
            t_created,
            b_delivered: (s_status === 'DELIVERED'),
            s_unit: user.s_unit
        }
        if (data.b_delivered !== true) {
            data.b_delivered = false;
        }

        await api('post', 'updateRackStatus', { data });

        setModalEditOpen(false);
        deleteLocalValue(rackItems, setRackItems, id);
        createSuccessNotification('Location Deleted');
        rackUpdate(s_mawb, user.s_unit);
    });

    const locateInRack = asyncHandler(async(values) => {
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');

        values.t_created = now;
        values.t_modified = now;
        values.s_created_by = user.s_email;
        values.s_modified_by = user.s_email;
        values.s_unit = user && user.s_unit;
        values.s_location = values.enableSpecialLocation ? 
            values.s_location : resolveLocation(values.s_tower, values.s_level, values.s_position);
        values.b_delivered = false;
        values.i_airline_prefix = values.s_mawb.substr(0, 3);  
        values.s_priority = null;
        values.s_guid = uuidv4();
        values.s_flight_id = `${values.s_airline_code}${values.s_flightnumber}/${values.d_flight}`
        values.s_platform = 'EOS';
        values.s_status = 'LOCATED';
        values.s_special_hanlding_code = resolveSpecialHandlingCodeString(values);
        values.s_mawb = values.s_mawb.replace(/-/g, '');
        values.s_destination = user.s_unit.substring(1, 4);

        delete values.specialLocation;
        delete values.enableSpecialLocation;
        delete values.s_location_type;

        const data = {
            locate: values
        }

        const response = await api('post', 'locateInRack', { data });

        createSuccessNotification('AWB Located');
        rackUpdate(values.s_mawb, user.s_unit);
        setModalEditOpen(false);
        addLocalValue(rackItems, setRackItems, response.data);
    });

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='py-3'>
                        <Col md='12' lg='12'>
                            <Row>
                                <Col md={12}>
                                    <h1 className='pl-3 pb-0 mb-1 float-left'>Rack</h1>
                                    {
                                        user.i_access_level >= 5 && 
                                        <i 
                                            className="fas fa-plus-circle float-right text-large text-primary hover-pointer mr-3"
                                            data-tip={'Add Location'}
                                            onClick={() => handleAddUpdate(true)}
                                        ></i>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col md='12' className={'mx-2'}>
                                    <Nav tabs className="separator-tabs ml-0 mb-2">
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "1",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("1");
                                            }}
                                            >
                                            Search
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "2",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("2");
                                            }}
                                            >
                                            View
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </Col>
                            </Row>

                            <TabContent activeTab={activeFirstTab} className='mt-2'>
                                <TabPane tabId="1">
                                    <Search 
                                        rackItems={rackItems}    
                                        handleAddUpdate={handleAddUpdate}  
                                        createSuccessNotification={createSuccessNotification}                                                         
                                        locationsMap={locationsMap}
                                        user={user}
                                    />
                                </TabPane>
                                <TabPane tabId="2">
                                    <View 
                                        schema={schema}
                                        specialLocations={specialLocations}
                                        rackItems={rackItems}    
                                        handleAddUpdate={handleAddUpdate}                           
                                    />
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </div>
            </div>

            <ModalEditData 
                modal={modalEditOpen}
                setModal={setModalEditOpen}
                schema={schema}
                specialLocations={specialLocations}
                user={user}
                newLocation={newLocation}
                rackItem={selectedRackItem}
                rackItems={rackItems}
                locateInRack={locateInRack}
                updateRackLocation={updateRackLocation}
                updateRackStatus={updateRackStatus}
                locationsMap={locationsMap}
                handleSearchAwb={handleSearchAwb}
            />

        </AppLayout>
    );
}

export default withRouter(Rack);