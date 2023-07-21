import React, {useEffect, useState} from 'react';
import {Table, Row, Col, Button, Card, CardBody} from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import VirtualTable from '../../components/custom/VirtualTable';

import AppLayout from '../../components/AppLayout';
import ModalUpdateAwb from '../../components/managers/updateExportAwbs/ModalUpdateAwb';
import mapping from '../../components/managers/updateExportAwbs/tableMapping';

const UpdateExportAwbs = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, createSuccessNotification, eightyWindow, width
}) => {

    const [s_mawb, set_s_mawb] = useState('');
    const [exportAwbs, setExportAwbs] = useState([]);
    const [selectedAwb, setSelectedAwb] = useState(null);
    const [i_pieces, set_i_pieces] = useState(null);
    const [i_weight, set_i_weight] = useState(null);
    const [s_destination, set_s_destination] = useState(null);
    const [t_depart_date, set_t_depart_date] = useState('');
    const [s_transport_type, set_s_transport_type] = useState('');
    const [s_flight_number, set_s_flight_number] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    
    const selectAwb = (awb) => {
        setSelectedAwb(awb);
        const { i_pieces, i_weight, s_destination, t_depart_date, s_transport_type, s_flight_number } = awb;
        set_i_pieces(i_pieces);
        set_i_weight(i_weight);
        set_s_destination(s_destination);
        set_t_depart_date(moment(t_depart_date).format('YYYY-MM-DD'));
        set_s_transport_type(s_transport_type);
        set_s_flight_number(s_flight_number);
        setModalOpen(true);
    }

    const searchAwb = () => {
        
        const data = {
            s_mawb: s_mawb.replace(/-/g, ''),
            s_unit: user.s_unit
        }

        baseApiUrl && headerAuthCode && 
        axios.post(`${baseApiUrl}/searchExportAwbs`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            console.log(response);
            setExportAwbs(response.data);
        }).catch(error => {

        });
    }

    const formatMawb = (mawb) => {
        return mawb.substr(0, 13).replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }

    useEffect(() => {
        set_s_mawb(formatMawb(s_mawb));
    }, [s_mawb]);

    const enableSearch = () => {
        return s_mawb.length >= 4;
    }

    const enableSubmit = () => {
        const checkArray = [i_pieces, i_weight, s_destination];

        for (let i = 0; i < checkArray.length; i++) {
            if (!checkArray[i] || checkArray[i].length < 1) {
                return false;
            }
        }

        return true;
    }

    const submit = () => {
        updateAwb();
    }

    const updateAwb = () => {
        
        const data = {
            i_pieces,
            i_weight,
            s_destination,
            t_depart_date,
            s_transport_type,
            s_flight_number,
            i_id: selectedAwb.i_id,
            s_modified_by: user.s_email,
            t_modified: moment().local().format('MM/DD/YYYY HH:mm:ss')
        }

        baseApiUrl && headerAuthCode && 
        axios.post(`${baseApiUrl}/updateExportAwb`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            console.log(response);
            setExportAwbs(response.data);
            setModalOpen(false);
            createSuccessNotification('AWB Updated');
        }).catch(error => {

        });
    }

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 pt-2 pb-0 mb-0'>
                        <h1 className='pb-0 mb-0'>Update Export AWBs</h1>
                    </Row>
                    <Row className='px-3 py-3'>
                        <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                            <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                                <Row>
                                    <Col md='12' lg='12'>
                                        <h4 style={{display: 'inline'}}>AWB Search: </h4>
                                        <input type='text' value={s_mawb} onChange={(e) => set_s_mawb(e.target.value)} className='mr-2' style={{width: '25%', display: 'inline'}} />
                                        <Button disabled={!enableSearch()} style={{display: 'inline'}} onClick={() => searchAwb()}>Search</Button>
                                    </Col>
                                </Row>
                                <VirtualTable 
                                    data={exportAwbs}
                                    mapping={mapping}
                                    enableClick={true}
                                    selectAwb={selectAwb}
                                    handleClick={(item) => selectAwb(item)}
                                    numRows={10}
                                />
                            </CardBody>
                        </Card>
                    </Row>
                </div>
            </div>

            <ModalUpdateAwb 
                open={modalOpen}
                handleModal={setModalOpen}
                selectedAwb={selectedAwb}
                i_pieces={i_pieces}
                set_i_pieces={set_i_pieces}
                i_weight={i_weight}
                set_i_weight={set_i_weight}
                s_destination={s_destination}
                set_s_destination={set_s_destination}
                t_depart_date={t_depart_date}
                set_t_depart_date={set_t_depart_date}
                s_transport_type={s_transport_type}
                set_s_transport_type={set_s_transport_type}
                s_flight_number={s_flight_number}
                set_s_flight_number={set_s_flight_number}                
                enableSubmit={enableSubmit}
                submit={submit}
            />

        </AppLayout>

    );
}

export default UpdateExportAwbs;