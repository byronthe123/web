import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import ReactTable from '../../../custom/ReactTable';
import airlinesTableMapping from './airlinesTableMapping';
import ModalManageAirline from './ModalManageAirline';
import axios from 'axios';
import moment from 'moment';

import { notify } from '../../../../utils';

export default ({
    airlines,
    setAirlines,
    baseApiUrl,
    headerAuthCode,
    user,
    updateLocalValue,
    addLocalValue,
    asyncHandler,
    deleteLocalValue
}) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [newAirline, setNewAirline] = useState(false);
    const [selectedAirline, setSelectedAirline] = useState({});
    const [logoAttachment, setLogoAttachment] = useState({});
    const [sqLogoAttachment, setSqLogoAttachment] = useState({});
    const [uploadKey, setUploadKey] = useState(0);

    const handleCreateAirline = () => {
        setNewAirline(true);
        setModalOpen(true);
        setSelectedAirline({});
    }

    const handleUpdateAirline = (airline) => {
        setSelectedAirline(airline);
        setNewAirline(false);
        setModalOpen(true);
    }

    const handleCreateUpdateAirline = asyncHandler(async(values) => {
        const data = values;
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        const { s_email } = user && user;
        let endpoint;
        if (newAirline) {
            endpoint = 'createAirline';
            data.s_created_by = s_email;
            data.t_created = now;
        } else {
            endpoint = 'updateAirline';
            data.id = selectedAirline.id;
        }

        data.t_modified = now;
        data.s_modified_by = s_email;
        data.logoAttachment = logoAttachment;
        data.sqLogoAttachment = sqLogoAttachment;

        const response = await axios.post(`${baseApiUrl}/${endpoint}`, {
            data
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        if (response.status === 200) {
            console.log(response.data);
            const notification = newAirline ? 'Created' : 'Updated';
            notify(notification);
            setModalOpen(false);
            if (newAirline) {
                addLocalValue(airlines, setAirlines, response.data);
            } else {
                updateLocalValue(airlines, setAirlines, selectedAirline.id, response.data);
                const updated = airlines.find(a => a.id === selectedAirline.id);
                console.log(updated);
            }
            setLogoAttachment({});
            setSqLogoAttachment({});
        }   
    });

    const deleteAirline = asyncHandler(async (id) => {
        const response = await axios.delete(`${baseApiUrl}/deleteAirline/${id}`, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        if (response.status === 200) {
            deleteLocalValue(airlines, setAirlines, id);
            setModalOpen(false);
            setSelectedAirline({});
            notify('Deleted');
        }
    });

    return (
        <Row>
            <Col md={12}>
                <Row className='mb-2'>
                    <h4 className='d-inline mr-2'>Airlines</h4>
                    <Button onClick={() => handleCreateAirline()} className='d-inline'>New</Button>
                </Row>
                <ReactTable 
                    data={airlines}
                    mapping={airlinesTableMapping}
                    index={true}
                    enableClick={true}
                    handleClick={handleUpdateAirline}
                />
            </Col>
            <ModalManageAirline 
                modal={modalOpen}
                setModal={setModalOpen}
                newAirline={newAirline}
                selectedAirline={selectedAirline}
                handleCreateUpdateAirline={handleCreateUpdateAirline}
                deleteAirline={deleteAirline}
                setLogoAttachment={setLogoAttachment}
                setSqLogoAttachment={setSqLogoAttachment}
                uploadKey={uploadKey}
            />
        </Row>
    );
}

