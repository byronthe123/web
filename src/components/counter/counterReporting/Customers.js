import React, {Fragment, useState, useEffect, useRef} from 'react';
import { Form, FormGroup, Table, Button, Input, Card, CardBody, Breadcrumb, BreadcrumbItem, Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import moment from 'moment';
import axios from 'axios';
import { Formik, Field } from 'formik';
import CustomerCard from './CustomerCard';
import PulseLoader from 'react-spinners/PulseLoader';
import ReactTable from '../../custom/ReactTable';
import customerDataMapping from './customerDataMapping';
import { api } from '../../../utils';

import ModalAwbDetails from './ModalAwbDetails';
import VirtualTable from '../../custom/VirtualTable';

const Customers = ({
    baseApiUrl,
    headerAuthCode,
    user,
    handleSearchAwb
}) => {

    const [customerSearchDate, setCustomerSearchDate] = useState(moment().format('YYYY-MM-DD'));
    const [customerSearchAwb, setCustomerSearchAwb] = useState('');
    const [customerData, setCustomerData] = useState([]);
    const [selectedAwb, setSelectedAwb] = useState(null);
    const [modalAwbDetailsOpen, setModalAwbDetailsOpen] = useState(false);
    const [awbsArray, setAwbsArray] = useState([]);
    const [graphApiToken, setGraphApiToken] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDriverPhoto, setSelectDriverPhoto] = useState('');

    useEffect(() => {
        const customerSearchQuery = async () => {
            setSelectDriverPhoto(null);
            setIsLoading(true);
            const data = {
                s_unit: user && user.s_unit,
                t_modified: customerSearchDate,
                s_airline_code: user.s_airline_code
            };
    
            const response = await api('post', 'searchVqueueByUnitDate', { data });
    
            if (response.status === 200) {
                setIsLoading(false);
                setCustomerData(response.data);
                setGraphApiToken(response.data.apiToken);    
            }
    
        }
        if (user && user.s_unit && user.s_unit.length > 0) {
            if (moment(customerSearchDate).isValid()) {
                customerSearchQuery();
            }
        }
        setCustomerSearchAwb('');
    }, [user.s_unit, user.s_airline_code, customerSearchDate]);

    const customerSearchQueryByAwb = async () => {

        setCustomerSearchDate('');

        const data = {
            s_unit: user && user.s_unit,
            s_mawb: customerSearchAwb,
            s_airline_code: user.s_airline_code
        };

        const response = await api('post', 'searchVqueueByUnitAwb', { data });

        setCustomerData(response.data);
        setGraphApiToken(response.data.apiToken);
    }

    const getDriverPhoto = async (awb) => {
        try {
            const { id } = awb;
            const response = await axios.get(`${baseApiUrl}/getDriverPhoto/${id}`, {
                headers: {
                    Authorization: `Bearer ${headerAuthCode}`
                }
            }); 

            console.log(response.data);

            if (response.status === 200) {
                if (response.data.length > 0) {
                    setSelectDriverPhoto(response.data[0].sm_driver_photo);
                }
            }
        } catch (err) {
            alert('Error getting driver photo');
        }
    }

    const handleSelectAwb = (awb) => {
        const awbsArray = customerData.items.filter(i => i.s_transaction_id === awb.s_transaction_id);
        setSelectedAwb(awb);
        setAwbsArray(awbsArray);
        if (moment(moment(awb.t_created).format('MM/DD/YYYY')).isBefore('05/20/2021')) {
            getDriverPhoto(awb);
        }
        setModalAwbDetailsOpen(true);
    }

    const switchAwb = (awb) => {
        setSelectedAwb(awb);
    }

    const selectAwbByNumber = (awb) => {
        const selectedAwb = customerData && customerData.items && customerData.items.find(d => d.s_mawb === awb);
        setSelectedAwb(selectedAwb);
    }

    return (
        <Row>

            <Col md={12}>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row>
                            <Col md={12}>
                                <h4>Make a Selection:</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <div className={'float-left mr-3'}>
                                    <h4 className={'d-inline'}>By Date</h4>
                                    <Input className={'d-inline ml-3'} value={customerSearchDate} onChange={(e) => setCustomerSearchDate(e.target.value)} type='date' style={{display: 'inline', width: '200px'}} />
                                </div>
                                <div className={'float-left'}>
                                    <h4 className={'d-inline'}>By AWB</h4>
                                    <Input className={'d-inline ml-2'} value={customerSearchAwb} onChange={(e) => setCustomerSearchAwb(e.target.value)} type='text' style={{display: 'inline', width: '200px'}} />
                                    <Button className='d-inline ml-2' style={{display: 'inline'}} onClick={() => customerSearchQueryByAwb()} >Search</Button>
                                    <h4 className={'d-inline ml-4'}>Select record to see details.</h4>
                                </div>
                            </Col>
                        </Row>
                        <Row className={'mt-2'}>
                            {
                                isLoading ? 
                                <Col md={12} className='text-center' style={{ marginTop: '150px' }}>
                                    <PulseLoader 
                                        size={50}
                                        color={"#51C878"}
                                        loading={true}
                                    />
                                </Col> : 
                                <Col md={12}>
                                    <VirtualTable 
                                        data={customerData.items}
                                        mapping={customerDataMapping}
                                        index={true}
                                        enableClick={true}
                                        handleClick={handleSelectAwb}
                                    />
                                </Col>
                            }
                        </Row>
                    </CardBody>
                </Card>
            </Col>

            <ModalAwbDetails 
                open={modalAwbDetailsOpen}
                handleModal={() => setModalAwbDetailsOpen(!modalAwbDetailsOpen)}
                awb={selectedAwb}
                awbsArray={awbsArray}
                graphApiToken={graphApiToken}
                selectAwbByNumber={selectAwbByNumber}
                switchAwb={switchAwb}
                selectedDriverPhoto={selectedDriverPhoto}
                handleSearchAwb={handleSearchAwb}
            />

        </Row>
    );
}

export default Customers;