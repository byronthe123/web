import React, { useState, useEffect, useContext  } from 'react';
import { AppContext } from '../../../context';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import { Wizard, Steps, Step } from 'react-albus';
import { Row, Col, Card, CardBody, Input, Label } from 'reactstrap';
import ReactTooltip from 'react-tooltip';
import _ from 'lodash';
import { renderToString } from 'react-dom/server';

import GraphCard from '../../../components/custom/GraphCard';
import { ThemeColors } from '../../helpers/ThemeColors';

import VirtualTable from '../../../components/custom/VirtualTable';
import Layout from '../../../components/custom/Layout';
import ActionIcon from '../../custom/ActionIcon';
import ModalAddNotes from './ModalAddNotes';
import ModalConfirmDelete from './ModalConfirmDelete';
import ModalBreakdownFlightMaster from './ModalBreakdownFlightMaster';
import TopNavigation from '../../../components/wizard-hooks/TopNavigation';
import GenerateBreakdownSheet from './GenerateBreakdownSheet';
import { IMap, IFWB, IStep, PushStep, GoToNextStep, IGraphDonutData, IFHL } from '../../../globals/interfaces';
import { 
    IExtendedFFM, 
    IAirline, 
    IExtendedULD, 
    DeleteLevel, 
    AddNotesType 
} from './interfaces';
import { notify } from '../../../utils';
import { Button } from 'reactstrap';
import ModalConfirmation from '../../custom/ModalConfirmation';
import { useSetRecoilState } from 'recoil';

const { asyncHandler, updateLocalValue, api } = require('../../../utils');

const colors = ThemeColors();

interface Props {
    manager: boolean;
}

const BreakdownInstructions = ({
    manager
}: Props) => {

    const { user, searchAwb, setLoading } = useContext(AppContext);
    const { handleSearchAwb } = searchAwb;

    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [d_arrival_date, set_d_arrival_date] = useState(moment().format('YYYY-MM-DD')); 
    const [ffmData, setFfmData] = useState<Array<IExtendedFFM>>([]);
    const [uniqueAirlines, setUniqueAirlines] = useState<Array<IAirline>>([]);
    const [ulds, setUlds] = useState<Array<IExtendedULD>>([]);
    const [s_flight_id, set_s_flight_id] = useState('');
    const [selectedUld, setSelectedUld] = useState<IExtendedULD>();
    const [selectedAwb, setSelectedAwb] = useState<IExtendedFFM>();
    const [acceptedUlds, setAcceptedUlds] = useState(0);
    const [modal, setModal] = useState(false);
    const [type, setType] = useState<AddNotesType>('uld');
    const [fwbData, setFwbData] = useState<IFWB>();
    const [selectedHawbRecord, setSelectedHawbRecord] = useState<IFHL>();
    const [selectedHouseSerial, setSelectedHouseSerial] = useState('');

    const [modalDelete, setModalDelete] = useState(false);
    const [deleteLevel, setDeleteLevel] = useState<DeleteLevel>('AWB');
    const [deleteFlight, setDeleteFlight] = useState('');
    const [deleteUld, setDeleteUld] = useState('');
    const [deleteId, setDeleteId] = useState('');
    const [deleteAwb, setDeleteAwb] = useState('');
    const [selectedFlight, setSelectedFlight] = useState<IAirline>();
    const [modalBreakdownFlightMaster, setModalBreakdownFlightMaster] = useState(false);

    const ffmQuery = asyncHandler(async() => {
        setLoading(true);
        const s_pou = user && user.s_destination;

        const res = await api('post', 'selectFfmByFlightArrivalDateAndPou', {
            d_arrival_date,
            s_pou,
            s_unit: user.s_unit
        }); 

        setLoading(false);
        setFfmData(res.data);
        setUniqueAirlines(resolveUniqueAirlines(res.data));
    });

    const resolveUniqueAirlines = (ffmData: Array<IExtendedFFM>) => {
        const airlines: IMap<IAirline> = {};
        for (let i = 0; i < ffmData.length; i++) {
            const current = ffmData[i];
            if (airlines[current.s_flight_id] === undefined) {
                airlines[current.s_flight_id] = {
                    s_flight_number: current.s_flight_number,
                    s_flight_id: current.s_flight_id,
                    s_logo: current.s_logo,
                    s_status: current.s_status,
                    s_modified_by: current.s_modified_by,
                    t_modified: current.t_modified
                }
            }
        }

        const airlinesArray = [];
        for (let key in airlines) {
            airlinesArray.push(airlines[key])
        }
        return airlinesArray;
    }

    useEffect(() => {
        if (user.s_destination) {
            ffmQuery();
            setUlds([]);
            setSelectedUld(undefined);
            setSelectedAwb(undefined);
            set_s_flight_id('');
        }
    }, [user.s_destination, d_arrival_date]);

    const selectUldsByFlight = asyncHandler(async() => {
        setLoading(true);
        const flightAwbs = ffmData.filter(ffm => ffm.s_flight_id === s_flight_id);
        const res = await api('post', 'selectUldsByFlight', {
            data: {
                s_flight_id: s_flight_id,
                s_pou: user && user.s_destination,
                flightAwbs
            }
        });
        setLoading(false);
        const { data } = res;
        console.log(data);

        setUlds(data);
        resolveGraphData(data);
    });

    const updateAwbs = (s_mawb: string, s_flight_id: string) => {
        setFfmData(prev => {
            const copy = _.cloneDeep(prev);
            for (const ffm of copy) {
                if (ffm.s_mawb === s_mawb && ffm.s_flight_id === s_flight_id) {
                    ffm.b_breakdown_hawb = true;
                }
            }
            return copy;
        });

        setUlds(prev => {
            const copy = _.cloneDeep(prev);
            for (const uld of copy) {
                if (uld.s_flight_id === s_flight_id) {
                    const awbsCopy = _.cloneDeep(uld.awbs);
                    for (const awb of awbsCopy) {
                        if (awb.s_mawb === s_mawb) {
                            awb.b_breakdown_hawb = true;
                        }
                    }
                    uld.awbs = awbsCopy;
                }
            }
            return copy;
        });

        setSelectedUld(prev => {
            if (!prev) return prev;
            if (prev.s_flight_id !== s_flight_id) return;

            const copy = _.cloneDeep(prev);
            const { awbs } = copy;
            for (const awb of awbs) {
                if (awb.s_mawb === s_mawb) {
                    awb.b_breakdown_hawb = true;
                }
            }
            return copy;
        });
    }

    useEffect(() => {
        if (s_flight_id && s_flight_id.length > 0) {
            selectUldsByFlight();
        }
    }, [s_flight_id]);

    const getBreakdownAdditionalData = asyncHandler(async(s_mawb: string) => {
        const res = await api('post', 'getBreakdownAdditionalData', {
            data: {
                s_mawb
            }
        });

        const { fwbData } = res.data;

        setFwbData(fwbData);
    });

    const handleAddUldNotes = (item: IExtendedULD) => {
        setSelectedUld(item);
        setType('uld');
        setModal(true);
    }


    const handleAddAwbNotes = (awb: IExtendedFFM) => {
        setSelectedAwb(awb);
        setType('awb');
        setModal(true);
        getBreakdownAdditionalData(awb.s_mawb);
    }

    const addBreakdownNotes = asyncHandler(async(values: IMap<any>) => {
        if (selectedUld) {
            const data = values;

            data.type = type;
    
            if (type === 'uld') {
                data.id = selectedUld.id;
            } else if (type === 'awb' && selectedAwb) {
                data.id = selectedAwb.id;
                data.s_mawb = selectedAwb.s_mawb;
                data.s_hawb = selectedHouseSerial;
            }
    
            data.t_modified = moment().local().format('MM/DD/YYYY HH:mm:ss');
            data.s_modified_by = user.s_email;

            const res = await api('post', 'addBreakdownNotes', {
                data
            });
            
            if (type === 'uld') {
                updateLocalValue(ulds, setUlds, selectedUld.id, res.data[0]);
            } else if (selectedAwb) {
                const updated = res.data[0];

                const uldsCopy = _.cloneDeep(ulds);
                uldsCopy.map((uld: IExtendedULD) => {
                    const { awbs } = uld;
                    for (let i = 0; i < awbs.length; i++) {
                        if (awbs[i].id === selectedAwb.id) {
                            updated.hasHawb = awbs[i].hasHawb;
                            updated.hawbs = awbs[i].hawbs;
                            const copy = { ...updated };
                            awbs[i] = copy;
                            const uldCopy = { ...uld };
                            setSelectedUld(uldCopy);
                            break;
                        }
                    }
                });
                
                setUlds(uldsCopy);
            }
    
            setModal(false);
            notify('Notes Saved');
        }
    });

    const breakdownUldsByHouse = async () => {
        setLoading(true);
        const res = await api('put', 'breakdownUldsByHouse', {
            s_flight_id,
            s_modified_by: user.s_email,
            t_modified: moment().local().format('MM/DD/YYYY HH:mm')
        });
        if (res.status === 204) {
            setFfmData((prev) =>
                prev.map((ffm) => {
                    if (ffm.s_flight_id === s_flight_id) {
                        const copy = _.cloneDeep(ffm);
                        copy.b_breakdown_hawb = true;
                        return copy;
                    } else {
                        return ffm;
                    }
                })
            );
            notify('Success');
        }
        setLoading(false);
    }

    const handleDelete = (level: DeleteLevel, flight: string, uld?: string, id?: string, s_mawb?: string) => {
        setDeleteLevel(level);
        setDeleteFlight(flight);
        setDeleteUld(uld || '');
        setDeleteId(id || '');
        setModalDelete(true);
        if (s_mawb) {
            setDeleteAwb(s_mawb);
        }
    }

    const confirmDelete = asyncHandler(async() => {
        let endpoint;
        const data = {
            s_flight_id: deleteFlight,
            s_modified_by: user.s_email,
            t_modified: moment().local().format('MM/DD/YYYY HH:mm:ss')
        };

        if (deleteLevel === 'FLIGHT') {
            endpoint = 'markFlightDeleted';
        } else if (deleteLevel === 'ULD') {
            endpoint = 'markUldDeleted';
            // @ts-ignore
            data.s_uld = deleteUld;
        } else {
            endpoint = 'markAwbDeleted';
            // @ts-ignore
            data.s_uld = deleteUld;
            // @ts-ignore
            data.s_mawb = deleteAwb;
        }

        console.log(data);

        await api('post', endpoint, data);

        setModalDelete(false);
        ffmQuery();

        if (deleteLevel === 'FLIGHT') {
            set_s_flight_id('');
            setUlds([]);
        } else if (deleteLevel === 'ULD') {
            selectUldsByFlight();
            setSelectedUld(undefined);
        } else {
            setSelectedUld(undefined);
        }

    });

    const handleSelectFlight = (flight: IAirline) => {
        setSelectedFlight(flight);
        set_s_flight_id(flight.s_flight_id);
    }

    useEffect(() => {
        const selectedHouse = _.get(selectedAwb, 'hawbs', []).find(h => h.s_hawb === selectedHouseSerial);
        setSelectedHawbRecord(selectedHouse || undefined);
    }, [selectedAwb, selectedHouseSerial]);

    useEffect(() => {
        const hawbs = _.get(selectedAwb, 'hawbs', []);
        setSelectedHawbRecord(hawbs.length > 0 ? hawbs[0] : undefined);
    }, [selectedAwb]);

    const topNavClick = (stepItem: IStep, push: PushStep, step: IStep) => {
        Number(stepItem.id) < Number(step.id) && push(stepItem.id);
    };
    
    const onClickNext = (
        goToNext: GoToNextStep, 
        steps: Array<IStep>, 
        step: IStep
    ) => {
        step.isDone = true;
        if (steps.length - 1 <= steps.indexOf(step)) {
            return;
        } else if (!resolveEnableNext(step)) {
            step.disabled = true;
            return;
        } else {
            step.disabled = false;
            goToNext();
        }
    };
    
    const resolveEnableNext = (step: any) => {
        // console.log(step);
        // if (step.id === '1') {
        //     console.log(s_flight_id);
        //     return _.get(s_flight_id, 'length', 0) > 0;
        // } else if (step.id === '2') {
        //     return selectedUld && selectedUld.id !== null && selectedUld.id !== undefined;
        // } else {
        //     return true;
        // }
        return true;
    }

    const [graphData, setGraphData] = useState<IGraphDonutData>();

    const resolveGraphData = (data: Array<IExtendedULD>) => {
        console.log(data);
        const numAccepted = data.reduce((total, current) => total += current.b_accepted ? 1 : 0, 0);
        
        const graphData: any = {
            labels: ['Accepted', 'Not Accepted'],
            datasets: [
                {
                    // @ts-ignore
                    label: 'Acceptance Status',
                    borderColor: [colors.themeColor1, 'grey'],
                    backgroundColor: [colors.themeColor1_10, 'white'],
                    borderWidth: 2,
                    data: [numAccepted, data.length - numAccepted],
                },
            ],
        };

        setAcceptedUlds(numAccepted);
        setGraphData(graphData);
    }

    const printBreakdownSheet = (singleUld: boolean) => {
        const sheet = renderToString(
            <GenerateBreakdownSheet 
                user={user}
                selectedFlight={selectedFlight}
                ulds={ulds}
                singleUld={singleUld}
                selectedUld={selectedUld}
            />
        );

        const myWindow = window.open("", "MsgWindow", "width=1920,height=1080");
        // myWindow.document.querySelector('html').remove();
        // @ts-ignore
        myWindow.document.body.innerHTML = null;
        // @ts-ignore
        myWindow.document.write(sheet);
    }

    return (
        <Layout>
            <Row className='py-3'>
                <Col md={12}>
                    <Row>
                        <Col md={12}>
                            <h1>
                                {
                                    manager ? 
                                        'Import Flight Manager' :
                                        'Breakdown Instructions'
                                }
                            </h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Card>
                                <CardBody className="wizard wizard-default">
                                    <Wizard>
                                        <TopNavigation
                                            className="justify-content-center"
                                            disableNav={false}
                                            topNavClick={topNavClick}
                                        />
                                        <Steps>
                                            <Step id="1" name={'Step 1'} desc={'Select Flight'}>
                                                <div className="wizard-basic-step">
                                                    <Row>
                                                        <Col md={3} className={'px-1'}>
                                                            <Card style={{ borderRadius: '0.75rem' }}>
                                                                <CardBody>
                                                                    <Row>
                                                                        <Col md={12}>
                                                                            <Label className='d-inline mr-2'>Select Date</Label>
                                                                            <Input type='date' value={d_arrival_date} onChange={(e: any) => set_d_arrival_date(e.target.value)} className='d-inline' style={{ width: '200px' }} />
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className='mt-2'>
                                                                        <Col md={12}>
                                                                            <VirtualTable 
                                                                                data={uniqueAirlines}
                                                                                mapping={[
                                                                                    {
                                                                                        name: 'Flight',
                                                                                        value: 's_logo',
                                                                                        image: true,
                                                                                        square: true
                                                                                    },
                                                                                    {
                                                                                        name: 'Airline',
                                                                                        value: 's_flight_number',
                                                                                        customWidth: 100
                                                                                    },
                                                                                    {         
                                                                                        name: '',
                                                                                        value: 'fas fa-trash',
                                                                                        icon: true,
                                                                                        showCondition: () => manager === true,
                                                                                        function: (item: IAirline) => handleDelete('FLIGHT', item.s_flight_id)
                                                                                    }
                                                                                ]}
                                                                                numRows={7}
                                                                                enableClick={true}
                                                                                handleClick={(item) => handleSelectFlight(item)}
                                                                                locked={true}
                                                                                wizardNext={true}
                                                                                onClickNext={onClickNext}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        {
                                                            (s_flight_id.length > 0 && graphData && graphData.datasets) &&
                                                                <Col md={9} className={'text-center'}>
                                                                    {
                                                                        (ulds && ulds.length > 0) ? 
                                                                            <GraphCard 
                                                                                type={'doughnut'}
                                                                                title={
                                                                                    <div>
                                                                                        <h4>ULDs for {s_flight_id}</h4>
                                                                                        <h4>{acceptedUlds} / {ulds.length} Accepted</h4>
                                                                                    </div>
                                                                                }
                                                                                graphData={graphData}
                                                                                height={'500px'}
                                                                            /> :
                                                                            <div>
                                                                                <h4>ULDs for {s_flight_id}</h4>
                                                                                <h4>{acceptedUlds} / {ulds.length} Accepted</h4>
                                                                            </div>
                                                                    }
                                                                </Col>
                                                        }
                                                    </Row>
                                                </div>
                                            </Step>
                                            <Step id="2" name={'Step 2'} desc={'Select ULD'}>
                                                <div className="wizard-basic-step">
                                                    {
                                                        s_flight_id.length > 0 && 
                                                            <Row>
                                                                <Col md={5} className={'px-1'}>
                                                                    <Card style={{ borderRadius: '0.75rem' }}>
                                                                        <CardBody>
                                                                            <Row>
                                                                                <Col md={12}>
                                                                                    <div className={'float-left'}>
                                                                                        <h4>ULDs in Flight { s_flight_id }</h4>
                                                                                    </div>
                                                                                    <ReactTooltip />
                                                                                    <div className={'float-right'}>
                                                                                        <i 
                                                                                            className={'fa-solid fa-arrow-down-big-small text-success hover pr-5'} 
                                                                                            data-tip={'Update entire flight to breakdown by hawb'}
                                                                                            onClick={() => setModalConfirmation(true)}
                                                                                            style={{ fontSize: '36px' }}
                                                                                        />
                                                                                        <i 
                                                                                            className={'fa-solid fa-memo-circle-info text-success hover pr-5'} 
                                                                                            data-tip={'Breakdown by MAWB'}
                                                                                            onClick={() => setModalBreakdownFlightMaster(true)}
                                                                                            style={{ fontSize: '36px' }}
                                                                                        />
                                                                                        <ActionIcon 
                                                                                            type={'print'}
                                                                                            onClick={() => printBreakdownSheet(false)}
                                                                                        />
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                            <VirtualTable 
                                                                                data={ulds}
                                                                                mapping={[
                                                                                    {
                                                                                        name: 'ULD',
                                                                                        value: 's_uld',
                                                                                        customWidth: 180
                                                                                    },
                                                                                    {
                                                                                        name: 'SHC',
                                                                                        value: 's_shc'
                                                                                    },
                                                                                    {
                                                                                        name: '',
                                                                                        value: 'fas fa-edit',
                                                                                        icon: true,
                                                                                        function: (item: IExtendedULD) => handleAddUldNotes(item)
                                                                                    },
                                                                                    {         
                                                                                        name: '',
                                                                                        value: 'fas fa-trash',
                                                                                        icon: true,
                                                                                        showCondition: () => manager === true,
                                                                                        function: (item: IExtendedULD) => handleDelete('ULD', item.s_flight_id, item.s_uld)
                                                                                    }
                                                                                ]}
                                                                                numRows={12}
                                                                                enableClick={true}
                                                                                handleClick={(item) => setSelectedUld(item)}
                                                                                locked={true}
                                                                                wizardNext={true}
                                                                                onClickNext={onClickNext}
                                                                            />
                                                                        </CardBody>
                                                                    </Card>
                                                                </Col>
                                                            </Row>
                                                    }                                      
                                                </div>
                                            </Step>
                                            <Step id="3" name={'Step 3'} desc={'Select AWB'}>
                                                <div className="wizard-basic-step">
                                                    <Row>
                                                    {
                                                        (selectedUld && selectedUld.id) && 
                                                            <Col md={12} className={'px-1'}>    
                                                                <Card style={{ borderRadius: '0.75rem' }}>
                                                                    <CardBody>
                                                                        <Row>
                                                                            <Col md={12}>
                                                                                <h4 className={'float-left'}>AWBs in {selectedUld.s_uld} in Flight {s_flight_id}</h4>    
                                                                                <i 
                                                                                    className={'fad fa-print text-success text-large float-right hover-pointer'}
                                                                                    onClick={() => printBreakdownSheet(true)}
                                                                                ></i>
                                                                            </Col>
                                                                        </Row>
                                                                        <VirtualTable 
                                                                            data={selectedUld.awbs}
                                                                            mapping={[
                                                                                {
                                                                                    name: 'AWB',
                                                                                    value: 's_mawb',
                                                                                    s_mawb: true
                                                                                },
                                                                                {
                                                                                    name: 'Dest',
                                                                                    value: 's_destination',
                                                                                    smallWidth: true
                                                                                },
                                                                                {
                                                                                    name: 'Status',
                                                                                    value: 's_status'
                                                                                },
                                                                                {
                                                                                    name: 'Type',
                                                                                    value: 's_pieces_type',
                                                                                    smallWidth: true
                                                                                },
                                                                                {
                                                                                    name: 'SHC',
                                                                                    value: 's_special_handling_code'
                                                                                },
                                                                                {
                                                                                    name: 'Has House',
                                                                                    value: 'hasHawb',
                                                                                    boolean: true
                                                                                },
                                                                                {
                                                                                    name: 'Breakdown by House',
                                                                                    value: 'b_breakdown_hawb',
                                                                                    boolean: true
                                                                                },
                                                                                {
                                                                                    name: '',
                                                                                    value: 'fas fa-edit',
                                                                                    icon: true,
                                                                                    function: (item: IExtendedFFM) => handleAddAwbNotes(item)
                                                                                },
                                                                                {         
                                                                                    name: '',
                                                                                    value: 'fas fa-trash',
                                                                                    icon: true,
                                                                                    showCondition: () => manager === true,
                                                                                    function: (item: IExtendedFFM) => handleDelete('AWB', item.s_flight_id, item.s_uld, String(item.id), item.s_mawb)
                                                                                }
                                                                            ]}
                                                                            numRows={12}
                                                                            locked={true}
                                                                            enableClick={true}
                                                                            handleClick={(item) => setSelectedAwb(item)}
                                                                        />
                                                                    </CardBody>
                                                                </Card>
                                                            </Col>
                                                    }
                                                    </Row>
                                                </div>
                                            </Step>
                                        </Steps>
                                    </Wizard>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </Col>
            </Row>

            <ModalAddNotes 
                modal={modal}
                setModal={setModal}
                type={type}
                s_flight_id={s_flight_id}
                selectedUld={selectedUld}
                selectedAwb={selectedAwb}
                addBreakdownNotes={addBreakdownNotes}
                fwbData={fwbData}
                selectedHawbRecord={selectedHawbRecord}
                setSelectedHouseSerial={setSelectedHouseSerial}
                handleSearchAwb={handleSearchAwb}
            />

            <ModalConfirmDelete 
                modal={modalDelete}
                setModal={setModalDelete}
                deleteLevel={deleteLevel}
                deleteFlight={deleteFlight}
                deleteUld={deleteUld}
                deleteId={deleteId}
                confirmDelete={confirmDelete}
                selectedFlight={selectedFlight}
                selectedUld={selectedUld}
                selectedAwb={selectedAwb}
            />

            <ModalBreakdownFlightMaster 
                modal={modalBreakdownFlightMaster}
                setModal={setModalBreakdownFlightMaster}
                ulds={ulds}
                s_flight_id={s_flight_id}
                user={user}
                updateAwbs={updateAwbs}
            />

            <ModalConfirmation 
                modal={modalConfirmation}
                setModal={setModalConfirmation}
                message={'Update entire flight to breakdown by HAWB?'}
                confirm={() => breakdownUldsByHouse()}
            />

        </Layout>
    );
}

export default withRouter(BreakdownInstructions);