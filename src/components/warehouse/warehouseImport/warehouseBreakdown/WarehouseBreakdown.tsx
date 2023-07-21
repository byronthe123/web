import React, { useState, useEffect, useMemo  } from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import { Row, Col, Card, CardBody  } from "reactstrap";
import ReactTable from '../../../custom/ReactTable';
import locateTableMapping from './locateTableMapping';
import ModalLocate from './ModalLocate';
import { api, asyncHandler } from '../../../../utils';
import { IUser, CreateSuccessNotification, IULD, IUnitRack } from '../../../../globals/interfaces';
import { ISelectedHawb, IULDFFM, IULDFlight } from './interfaces';
import { defaultUld } from '../../../../globals/defaults';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    user: IUser;
    s_pou: string;
    createSuccessNotification: CreateSuccessNotification;
    setLoading: (state: boolean) => void;
    breakpoint: boolean;
}

const WarehouseBreakdown = ({
    user, s_pou, createSuccessNotification, setLoading, breakpoint
}: Props) => {

    const [flights, setFlights] = useState<Array<IULDFlight>>([]);
    const [ulds, setUlds] = useState<Array<IULD>>([]);
    const [s_flight_id, set_s_flight_id] = useState('');
    const [d_arrival_date, set_d_arrival_date] = useState(moment().format('YYYY-MM-DD'));
    const [selectedUld, setSelectedUld] = useState<IULD>(defaultUld);
    const [uldFfms, setUldFfms] = useState<Array<IULDFFM>>([]);
    const destinationUldFfms = useMemo(() => {
        return uldFfms.filter(u => u.s_destination === s_pou);
    }, [uldFfms, s_pou]);
    const transferUldFfms = useMemo(() => {
        return uldFfms.filter(u => u.s_destination !== s_pou);
    }, [uldFfms, s_pou]);
    const [modalLocateOpen, setModalLocateOpen] = useState(false);
    const [selectedUldFfm, setSelectedUldFfm] = useState<IULDFFM>();
    const [selectedHawb, setSelectedHawb] = useState<ISelectedHawb>({
        s_hawb: '',
        i_pieces: 0
    });

    //locate:
    const [unitRack, setUnitRack] = useState<IUnitRack>({
        _id: '',
        unit: '',
        createdBy: '',
        modifiedBy: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        schema: {},
        specialLocations: {}
    });

    useEffect(() => {
        const getUnitRack = async () => {
            const res = await api('get', `getUnitRack/${user.s_unit}`);
            if (res.status === 200) {
                const { data } = res;
                if (!data) {
                    alert('No Rack Schema defined for this unit. Please create on in CorpStation profiles.');
                } else {
                    setUnitRack(res.data);
                }
            } 
        }
        getUnitRack();
    }, [user.s_unit]);

    const [selectedTower, setSelectedTower] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [locationAvailable, setLocationAvailable] = useState(false);
    const [enableSpecialLocation, setEnableSpecialLocation] = useState(false);
    const [specialLocationSelected, setSpecialLocationSelected] = useState('');
    const [b_comat, set_b_comat] = useState(false);
    const [s_notes, set_s_notes] = useState('');

    const handleModalLocateOpen = (ffm: IULDFFM) => {
        setSelectedUldFfm(ffm);
        setEnableSpecialLocation(false);
        setModalLocateOpen(true);
    }

    const reset = () => {
        setSelectedTower('');
        setSelectedLevel('');
        setSelectedPosition('');
        setLocationAvailable(false);
        setSpecialLocationSelected('');
        setSelectedHawb({ s_hawb: '', i_pieces: 0 });
        setModalLocateOpen(false);
        set_b_comat(false);
        set_s_notes('');
    }

    useEffect(() => {
        if (user.i_access_level >= 3) {
            const findExisting = locateTableMapping.find(l => l.value === 'Locate');
            if (!findExisting) {
                locateTableMapping.push({
                    name: '',
                    value: 'Locate',
                    button: true,
                    function: (item: IULDFFM) => handleModalLocateOpen(item)
                });
            }
        }
    }, [user.i_access_level]);

    const resetUldFms = () => {
        setUldFfms([]);
        setSelectedUld(defaultUld);
    }

    useEffect(() => {
        const selectUldAcceptanceFlights = asyncHandler(async() => {
            setLoading(true);
    
            const body = {
                d_arrival_date,
                s_pou
            }
    
            const response = await api('post', 'selectUldAcceptanceFlights', body);
    
            setFlights(response.data);
            resetUldFms();
            if (response.data.length > 0) {
                set_s_flight_id(response.data[0].s_flight_id);
            }
            setLoading(false);
        });
    
        if (moment(d_arrival_date).isValid() && user.s_unit) {
            selectUldAcceptanceFlights();
        }
    }, [d_arrival_date, user.s_unit, s_pou]);

    useEffect(() => {
        const selectBreakDownUlds = asyncHandler(async() => {
            setLoading(true);

            const body = {
                s_flight_id,
                s_pou
            }

            const response = await api('post', 'selectBreakDownUlds', body);

            setUlds(response.data);
            resetUldFms();
            setLoading(false);
        });

        if (s_flight_id && s_flight_id !== '') {
            selectBreakDownUlds();
        }
    }, [s_flight_id]);

    const selectUldFfms = asyncHandler(async() => {
        setLoading(true);

        const { s_uld } = selectedUld;

        const body = {
            s_flight_id,
            s_uld
        }

        const res = await api('post', 'selectFfmByUld', body);

        setUldFfms(res.data);
        setLoading(false);
    });

    useEffect(() => {
        if (selectedUld) {
            selectUldFfms();
        }
    }, [selectedUld]);

    const completeLocation = useMemo(() => {
        return `${selectedTower}${selectedLevel}${selectedPosition}`;
    }, [selectedTower, selectedLevel, selectedPosition]);

    const validLocationSelected = useMemo(() => {
        const normal = !enableSpecialLocation && selectedTower.length > 0 && selectedLevel.length > 0 && selectedPosition.length > 0;
        const special = enableSpecialLocation && specialLocationSelected.length > 0
        return normal || special;
    }, [enableSpecialLocation, selectedLevel.length, selectedPosition.length, selectedTower.length, specialLocationSelected.length]);

    useEffect(() => {
        const checkRackLocationAvailable = async () => {
            const s_location = enableSpecialLocation ? specialLocationSelected : completeLocation;
            const res = await api('post', 'checkRackLocationAvailable', {
                s_location
            });
            setLocationAvailable(res.data);
        }
        if (validLocationSelected) {
            checkRackLocationAvailable();
        }
    }, [completeLocation, enableSpecialLocation, specialLocationSelected, validLocationSelected]);

    useEffect(() => {
        if (enableSpecialLocation) {
            setSelectedTower('');
            setSelectedLevel('');
            setSelectedPosition('');
        } else {
            setSpecialLocationSelected('');
        }
    }, [completeLocation, specialLocationSelected, enableSpecialLocation]);

    const locateInRack = async () => {
        if (selectedUldFfm) {
            const fullyLocated = (selectedHawb.i_pieces + (selectedUldFfm?.locatedCount || 0)) >= (selectedUldFfm?.uldSum || 0);
            console.log(selectedHawb);
            const data = {
                locate: {
                    t_created: moment().local().format('MM/DD/YYYY hh:mm A'),
                    s_created_by: user.s_email,
                    t_modified: moment().local().format('MM/DD/YYYY hh:mm A'),
                    s_modified_by: user.s_email,
                    s_status: 'LOCATED',
                    s_unit: user && user.s_unit,
                    s_location: enableSpecialLocation ? specialLocationSelected : completeLocation,
                    s_tower: selectedTower,
                    s_level: selectedLevel,
                    s_position: selectedPosition,
                    b_delivered : false,
                    s_mawb: selectedUldFfm.s_mawb,
                    s_hawb: selectedHawb.s_hawb,
                    i_pieces: selectedHawb.i_pieces,
                    s_airline_code: selectedUldFfm.s_airline_code,
                    i_airline_prefix: selectedUldFfm.s_mawb.substring(0, 3),
                    s_notes,
                    s_guid: uuidv4(),
                    s_flightnumber: selectedUldFfm.s_flight_serial,
                    s_flight_uld: selectedUld.s_uld,
                    s_flight_id: s_flight_id,
                    d_flight: d_arrival_date,
                    s_platform: 'EOS',
                    s_destination: selectedUldFfm.s_destination,
                    b_comat
                },
                update: {
                    id: selectedUldFfm.id,
                    t_modified: moment().local().format('MM/DD/YYYY hh:mm A'),
                    s_modified_by: user.s_email,
                    s_status: fullyLocated ? 'LOCATED' : 'PARTIAL LOCATED'
                }
            }

            setLoading(true);
            const res = await api('post', 'locateInRack', { data });
            setLoading(false);
            if (res.status === 200) {
                createSuccessNotification('AWB Located');
                reset();
                selectUldFfms();
            }
        }
    }

    return (
        <Row>
            <div className={`mb-3 ${breakpoint ? 'col-12' : 'col-3'}`}>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row className='py-2'>
                            <h4>Make a Selection:</h4>
                        </Row>
                        <Row className='py-2'>
                            <h4>Date:</h4>
                            <input type='date' value={d_arrival_date} onChange={(e) => set_d_arrival_date(e.target.value)} className='ml-4' style={{display: 'inline'}} />
                        </Row>
                        <Row className='py-2'>
                            <h4>Flight:</h4>
                            <select className='ml-3' style={{display: 'inline'}} value={s_flight_id} onChange={(e) => set_s_flight_id(e.target.value)}>
                                {
                                    flights.map((f, i) => 
                                        <option key={i} value={f.s_flight_id}>{f.s_flight_number}</option>
                                    )
                                }
                            </select>
                        </Row>
                        <Row className='pt-2 pb-0'>
                            <Col md={12}>
                                <ReactTable 
                                    data={ulds}
                                    mapping={[
                                        {
                                            name: 'ULD',
                                            value: 's_uld'
                                        },
                                        {
                                            name: 'Open',
                                            value: 'b_opened',
                                            boolean: true
                                        }
                                    ]}
                                    enableClick={true}
                                    handleClick={(item) => setSelectedUld(item)}
                                    numRows={10}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>

            <div className={`${breakpoint ? 'col-12' : 'col-9'}`}>

                <Card className='custom-opacity-card mb-3' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row className='mb-0'>
                            <Col md={12}>
                                <h4>AWBs for ULD: {selectedUld.s_uld}</h4>
                                <ReactTable 
                                    data={destinationUldFfms}
                                    mapping={locateTableMapping}
                                    numRows={5}
                                />
                            </Col>               
                        </Row>                      
                    </CardBody>
                </Card>

                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row className='mb-0'>
                            <Col md={12}>
                                <h4><span style={{fontWeight: 'bolder'}}>Transfer</span> AWBs for ULD: {selectedUld !== null && selectedUld.s_uld}</h4>
                                <ReactTable 
                                    data={transferUldFfms}
                                    mapping={locateTableMapping}
                                    numRows={5}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>

            <ModalLocate 
                open={modalLocateOpen}
                handleModal={setModalLocateOpen}
                selectedUldFfm={selectedUldFfm}
                selectedHawb={selectedHawb}
                setSelectedHawb={setSelectedHawb}
                unitRack={unitRack}
                selectedTower={selectedTower}
                setSelectedTower={setSelectedTower}
                selectedLevel={selectedLevel}
                setSelectedLevel={setSelectedLevel}
                selectedPosition={selectedPosition}
                setSelectedPosition={setSelectedPosition}
                completeLocation={completeLocation}
                validLocationSelected={validLocationSelected}
                locationAvailable={locationAvailable}
                enableSpecialLocation={enableSpecialLocation}
                setEnableSpecialLocation={setEnableSpecialLocation}
                specialLocationSelected={specialLocationSelected}
                setSpecialLocationSelected={setSpecialLocationSelected}
                locateInRack={locateInRack}
                b_comat={b_comat}
                set_b_comat={set_b_comat}
                s_notes={s_notes}
                set_s_notes={set_s_notes}
            />
        </Row>
    );
}

export default withRouter(WarehouseBreakdown);