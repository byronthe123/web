import React, {Fragment, useState, useEffect, useRef} from 'react';
import {withRouter} from 'react-router-dom';
import { Table, Button, Card, CardBody, Row, Col  } from "reactstrap";
import moment from 'moment';

import ModalReportDamage from './ModalReportDamage';
import ModalNotListed from './ModalNotListed';
import {CircularProgressbar} from "react-circular-progressbar";
import ReactTable from '../../../custom/ReactTable';
import { IFile, IULD, IUser } from '../../../../globals/interfaces';
import { api, notify } from '../../../../utils';
import { IAcceptULDFlight } from './interfaces';

interface Props {
    user: IUser;
    s_pou: string;
    breakpoint: boolean;
}

const AcceptUld = ({
    user, 
    s_pou,
    breakpoint
}: Props) => {

    const [flights, setFlights] = useState<Array<IAcceptULDFlight>>([]);
    const [firstAccepted, setFirstAccepted] = useState('none');
    const [lastAccepted, setLastAccepted] = useState('none');
    const [ulds, setUlds] = useState<Array<IULD>>([]);
    const [acceptedUldsCount, setAcceptedUldsCount] = useState(0);
    const [s_flight_id, set_s_flight_id] = useState('');
    const [d_arrival_date, set_d_arrival_date] = useState(moment().format('YYYY-MM-DD'));
    const [selectedFlight, setSelectedFlight] = useState<IULD>();
    const [uldPercentageAccepted, setUldPercentageAccepted] = useState(0);

    //Damage Report
    const [comments, setComments] = useState('');
    const [fileInputKey, setFileInputKey] = useState(0);
    const [files, setFiles] = useState<Array<IFile>>([]);
    const [modalReportDamageOpen, setModalReportDamageOpen] = useState(false);
    const [awb_uld, set_awb_uld] = useState('');

    //Modal Not Listed
    const [modalNotListedOpen, setModalNotListedOpen] = useState(false);
    const [s_uld, set_s_uld] = useState('');
    const [s_notes, set_s_notes] = useState('');

    const acceptRemoveUld = async (id: number, accept: boolean) => {

        const s_status = accept ? 'RECEIVED' : 'MESSAGED';
        const b_accepted = accept ? true : false;
        const s_modified_by = user.s_email;
        const s_user_accepted_uld = accept ? user.s_email : null;
        const t_modified = moment().local().format('MM/DD/YYYY hh:mm A');
        const t_user_accepted_uld = accept ? moment().local().format('MM/DD/YYYY hh:mm A') : null;

        const res = await api('post', 'acceptRemoveUld', {
            id,
            s_flight_id,
            s_status,
            s_modified_by,
            t_modified,
            s_user_accepted_uld,
            t_user_accepted_uld,
            b_accepted,
            s_pou
        });
        setUlds(res.data);
    }

    const handleReportDamage = (s_uld: string) => {
        set_awb_uld(s_uld);
        setModalReportDamageOpen(true);
    }

    const submitDamageReport = async () => {
        const res = await api('post', 'submitVisualReport', {
            user: {
                email: user && user.s_email,
                displayName: user && user.displayName
            },
            awb_uld,
            comments, 
            files
        });

        setModalReportDamageOpen(false);
        notify('Submitting your report - you will receive a confirmation email.');
    }

    const enableSubmitUld = () => {
        return ;
    }

    const resolveUldNumber = (s_uld: string) => {
        const remainingString = s_uld.substr(3);
        const size = remainingString.length - 2;
        return s_uld.substr(3, size);
    } 

    const resetFields = () => {
        set_s_notes('');
        set_s_uld('');
    }

    const submitUld = async () => {
        if (selectedFlight) {
            const now = moment().local().format('MM/DD/YYYY hh:mm A');

            const data = {
                s_flight_id,
                s_airline_code: selectedFlight.s_airline_code,
                s_flight_number: selectedFlight.s_flight_number,
                s_flight_serial: selectedFlight.s_flight_serial,
                d_arrival_date,
                s_origin: selectedFlight.s_pol,
                s_destination: s_pou,
                s_uld,
                s_uld_type: s_uld.toUpperCase() !== 'BULK' ? s_uld.substr(0, 3) : s_uld,
                s_uld_number: s_uld.toUpperCase() !== 'BULK' ? resolveUldNumber(s_uld) : s_uld,
                s_uld_code: s_uld.toUpperCase() !== 'BULK' ? s_uld.substr(s_uld.length - 2, 2) : s_uld,
                t_created: now,
                s_created_by: user.s_email,
                s_modified_by: user.s_email,
                t_modified: now,
                s_notes,
                s_pol: selectedFlight.s_pol,
                s_pou
            }
            
            const res = await api('post', 'submitUld', { data });
            setUlds(res.data);
            notify('ULD Created');
            resetFields();
            setModalNotListedOpen(false);
        }
    }

    useEffect(() => {
        const selectUldAcceptanceFlights = async () => {
            const res = await api('post', 'selectUldAcceptanceFlights', {
                d_arrival_date,
                s_pou
            })
            setFlights(res.data);
        }
        if (moment(d_arrival_date).isValid()) {
            selectUldAcceptanceFlights();
        }
    }, [d_arrival_date, s_pou]);

    useEffect(() => {
        const selectFlightUlds = async () => {
            const res = await api('post', 'selectFlightUlds', {
                s_flight_id,
                s_pou
            })
            setUlds(res.data);
        }
        if (s_flight_id && s_flight_id !== '') {
            selectFlightUlds();
        }
    }, [s_flight_id, s_pou]);

    useEffect(() => {
        if (ulds.length > 0) {
            const flights = ulds.filter(u => u.s_flight_id === s_flight_id);
            if (flights.length > 0) {
                setSelectedFlight(flights[0]);
            }

            const acceptedUlds = ulds.filter(u => u.b_accepted);
            setAcceptedUldsCount(acceptedUlds.length);
            setUldPercentageAccepted(Math.round((acceptedUlds.length * 1.0 / ulds.length * 1.0) * 100));
        }
    }, [s_flight_id, ulds]);

    useEffect(() => {
        const resolveAcceptedDates = () => {
            const acceptedUlds = ulds.filter(u => u.b_accepted);

            if (acceptedUlds.length > 0) {
                const sortByUldDate = (a: IULD, b: IULD) => +moment(a.t_user_accepted_uld) - +moment(b.t_user_accepted_uld);
                const orderedUlds = acceptedUlds.sort(sortByUldDate);

                const dates = {
                    first: moment(orderedUlds[0].t_user_accepted_uld).format('MM/DD/YYYY HH:mm:ss'),
                    last: moment(orderedUlds[orderedUlds.length - 1].t_user_accepted_uld).format('MM/DD/YYYY HH:mm:ss')
                }
                
                setFirstAccepted(dates.first);
                setLastAccepted(dates.last);
            } else {
                setFirstAccepted('none');
                setLastAccepted('none');
            }
        }
        resolveAcceptedDates();
    }, [ulds]);


    const getFiles = (files: Array<IFile>) => setFiles(files);

    return (
        <Row>
            <Col md='12' lg='12'>
                <Row>
                    <div className={`mb-3 ${breakpoint ? 'col-12' : 'col-3'}`}>
                        <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                            <CardBody className='custom-card-transparent py-3' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                                <Row>
                                    <h4 className='pr-3'>Select Date: </h4>
                                    <input type='date' value={d_arrival_date} onChange={(e) => set_d_arrival_date(e.target.value)} style={{display: 'inline'}} />
                                </Row>
                                <Row className='mt-4'>
                                    <ReactTable 
                                        data={flights}
                                        mapping={[
                                            {
                                                name: '',
                                                value: 's_logo',
                                                image: true,
                                                imageWidth: '120px'
                                            },
                                            {
                                                name: 'Flight',
                                                value: 's_flight_number',
                                                customWidth: 110
                                            }
                                        ]}
                                        index={true}
                                        enableClick={true}
                                        handleClick={(item) => set_s_flight_id(item.s_flight_id)}
                                        numRows={10}
                                    />
                                </Row>
                            </CardBody>
                        </Card>
                    </div>

                    <div className={`mb-3 ${breakpoint ? 'col-12' : 'col-3'}`} style={{display: `${flights.length > 0 ? 'block' : 'none'}`}}>
                        <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                            <CardBody className='custom-card-transparent py-3' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                                <Row>
                                    <Col md='12' lg='12'>
                                        <h4 className='pr-3'style={{float:'left'}}>Messaged</h4>
                                        <Button style={{float:'right'}} disabled={!selectedFlight || selectedFlight === null} onClick={() => setModalNotListedOpen(true)}>ULD Not Listed</Button>
                                    </Col>
                                </Row>
                                <Row className='mt-4 mb-0'>
                                    <Col md={12}>
                                        <ReactTable 
                                            data={ulds.filter(u => !u.b_accepted)}
                                            mapping={[
                                                {
                                                    name: 'ULD',
                                                    value: 's_uld'
                                                },
                                                {
                                                    name: 'DEST',
                                                    value: 's_destination',
                                                    customWidth: 70                                                },
                                                {
                                                    name: '',
                                                    value: 'Accept',
                                                    button: true,
                                                    function: (item: IULD) => acceptRemoveUld(item.id, true),
                                                    customWidth: 120
                                                }
                                            ]}
                                            numRows={10}
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </div>

                    <div className={`${breakpoint ? 'col-12' : 'col-6'}`} style={{display: `${flights.length > 0 ? 'block' : 'none'}`}}>
                        <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                            <CardBody className='custom-card-transparent py-3' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                                <Row>
                                    <Col md='12' lg='12'>
                                        <h4 className='pr-3' style={{float: 'left'}}>Accepted: {acceptedUldsCount} / {ulds.length}</h4>
                                        <div className="progress-bar-circle" style={{float: 'right'}}>
                                            <CircularProgressbar
                                                strokeWidth={4}
                                                value={uldPercentageAccepted}
                                                text={`${uldPercentageAccepted}%`}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <h4 className='ml-2' style={{display: 'inline'}}>First: {firstAccepted} and Last: {lastAccepted}</h4>
                                </Row>
                                <Row className='mt-4 mb-0'>
                                    <Col md={12}>
                                        <ReactTable 
                                            data={ulds.filter(u => u.b_accepted)}
                                            mapping={[
                                                {
                                                    name: 'ULD',
                                                    value: 's_uld'
                                                },
                                                {
                                                    name: 'Accepted By',
                                                    value: 'sc_username_accepted_uld'
                                                },
                                                {
                                                    name: 'Accepted On',
                                                    value: 't_user_accepted_uld',
                                                    datetime: true,
                                                    utc: true
                                                },
                                                {
                                                    name: '',
                                                    value: 'Remove',
                                                    button: true,
                                                    function: (item: IULD) => acceptRemoveUld(item.id, false)
                                                },
                                                {
                                                    name: '',
                                                    value: 'Report Damage',
                                                    button: true,
                                                    color: 'danger',
                                                    function: (item: IULD) => handleReportDamage(item.s_uld)
                                                }
                                            ]}
                                            numRows={10}
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </div>
                    
                    <ModalReportDamage 
                        open={modalReportDamageOpen}
                        handleModal={setModalReportDamageOpen}
                        comments={comments}
                        setComments={setComments}
                        getFiles={getFiles}
                        fileInputKey={fileInputKey}
                        awb_uld={awb_uld}
                        submitDamageReport={submitDamageReport}
                    />

                    <ModalNotListed 
                        open={modalNotListedOpen}
                        handleModal={setModalNotListedOpen}
                        s_pou={s_pou}
                        s_flight_id={s_flight_id}
                        d_arrival_date={d_arrival_date}
                        selectedFlight={selectedFlight}
                        s_uld={s_uld}
                        set_s_uld={set_s_uld}
                        s_notes={s_notes}
                        set_s_notes={set_s_notes}
                        submitUld={submitUld}
                    />

                </Row>
            </Col>
        </Row>
    );
}

export default withRouter(AcceptUld);