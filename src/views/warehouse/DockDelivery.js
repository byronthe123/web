import React, { useState, useEffect, useRef  } from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import { asyncHandler } from '../../utils';
import { ButtonGroup, Button, Row, Col, Input } from 'reactstrap';
import { Wizard, Steps, Step } from 'react-albus';
import { useWindowWidth } from '@react-hook/window-size';
import SignatureCanvas from 'react-signature-canvas';
import { v4 as uuidv4 } from 'uuid';

import AppLayout from '../../components/AppLayout';
import AwbCard from '../../components/warehouse/dockDelivery/AwbCard';
import CompanyCard from '../../components/warehouse/dockDelivery/CompanyCard';
import LocationCard from '../../components/warehouse/dockDelivery/LocationCard';
import CompanySubHeader from '../../components/warehouse/dockDelivery/CompanySubHeader';
import ModalTakeOwnership from '../../components/warehouse/dockDelivery/ModalTakeOwnership';

const DeliveryProcess = ({
    user, baseApiUrl, headerAuthCode, step, steps, next, previous, push
}) => {

    const { s_email, s_unit } = user && user;
    const width = useWindowWidth();

    // Dock Data and companies:

    const [dockCompanies, setDockCompanies] = useState([]);
    const [haveAssignment, setHaveAssignment] = useState(false);

    const dockDeliveryQuery = asyncHandler(async() => {
        const res = await axios.post(`${baseApiUrl}/dockDeliveryQuery`, {
            data: {
                s_unit
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        setDockCompanies(resolveDockCompanies(res.data));
    });

    useEffect(() => {
        if (s_unit) {
            dockDeliveryQuery();

            let interval = setInterval(() => {
                dockDeliveryQuery();
            }, 10000);

            return () => {
                clearInterval(interval);
            }
        }
    }, [s_unit]);

    const resolveDockCompanies = (dockData) => {
        const companies = [];
        let haveAssignment = false;
        for (let i = 0; i < dockData.length; i++) {
            const current = dockData[i];
            const { s_trucking_company, s_transaction_id, s_trucking_driver, s_dock_ownership, t_counter_end, s_mawb, s_mawb_id, s_dock_door, s_dock_door_guid, s_state, s_type } = current;

            const existingIndex = companies.findIndex(c => c.s_transaction_id === current.s_transaction_id);

            if (existingIndex !== -1) {
                companies[existingIndex].awbs.push({
                    s_mawb,
                    s_mawb_id,
                    s_type
                });
            } else {
                companies.push({
                    s_trucking_company, 
                    s_transaction_id,
                    s_trucking_driver, 
                    s_dock_ownership,
                    t_counter_end,
                    s_dock_door,
                    s_dock_door_guid,
                    s_state,
                    s_type,
                    awbs: [{
                        s_mawb,
                        s_mawb_id,
                        s_type
                    }]
                });
            }

            if (s_dock_ownership && s_dock_ownership.toLowerCase() === user.s_email.toLowerCase()) {
                haveAssignment = true;
            }
        }
        setHaveAssignment(haveAssignment);
        return companies;
    }

    // Selected Company
    const [modalTakeOwnership, setModalTakeOwnership] = useState(false);
    const [viewCompany, setViewCompany] = useState({});
    const [selectedCompany, setSelectedCompany] = useState({});
    const [t_dock_ownership, set_t_dock_ownership] = useState('');

    const handleViewCompany = (company) => {
        setViewCompany(company);
        setModalTakeOwnership(true);
    }

    const takeDockDeliveryOwnership = asyncHandler(async(company, s_dock_door) => {
        const res = await axios.post(`${baseApiUrl}/takeDockDeliveryOwnership`, {
            data: {
                s_transaction_id: company.s_transaction_id,
                s_dock_ownership: s_email,
                s_unit,
                t_dock_ownership: moment().local().format('MM/DD/YYYY HH:mm:ss'),
                s_dock_door,
                s_company: company.s_trucking_company,
                s_driver: company.s_trucking_driver,
                s_guid: uuidv4(),
                s_type: selectedType
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        set_t_dock_ownership(moment().local().format('MM/DD/YYYY HH:mm:ss'));
        const resolvedCompanies = resolveDockCompanies(res.data);

        const updatedSelectedCompany = resolvedCompanies.find(c => c.s_transaction_id === company.s_transaction_id);
        setSelectedCompany(updatedSelectedCompany);
        setDockCompanies(resolvedCompanies);
        setModalTakeOwnership(false);
        next();
    });

    const selectCompany = (company) => {
        setSelectedCompany(company);
        takeDockDeliveryOwnership(company);
        setModalTakeOwnership(false);
        next();
    }

    // Selected Awb
    const [selectedAwb, setSelectedAwb] = useState({});
    const [piecesLocations, setPiecesLocations] = useState([]);

    const awbLocationsQuery = asyncHandler(async(awb) => {
        const res = await axios.post(`${baseApiUrl}/awbLocationsQuery`, {
            data: {
                s_mawb: awb.s_mawb, 
                s_unit
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        console.log(res.data);

        setPiecesLocations(res.data);
    });

    const selectAwb = (awb) => {
        setSelectedAwb(awb);
        awbLocationsQuery(awb);
        next();
    }

    // Selected Location:

    const [selectedLocation, setSelectedLocation] = useState({});

    const selectLocation = (location) => {
        setSelectedLocation(location);
        setPcsToDeliver(location.i_pieces);
        next();
    }


    const signatureRef = useRef();

    const updateDeliveredAwb = asyncHandler(async() => {
        const res = await axios.post(`${baseApiUrl}/updateDeliveredAwb`, {
            data: {
                s_mawb_id: selectedAwb.s_mawb_id,
                s_transaction_id: selectedCompany.s_transaction_id,
                s_status: 'DELIVERED',
                s_modified_by: s_email,
                t_modified: moment().local().format('MM/DD/YYYY HH:mm:ss'),
                t_dock_ownership: selectedAwb.t_dock_ownership || moment().local().format('MM/DD/YYYY HH:mm:ss'),
                b_delivered: true,
                s_mawb: selectedAwb.s_mawb,
                s_unit,
                signatureDataUri: signatureRef.current.toDataURL(),
                s_type: selectedType
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        }); 

        setDockCompanies(resolveDockCompanies(res.data));
        push('Customers');
    });

    const [pcsToDeliver, setPcsToDeliver] = useState(0);
    const disableDeliver = pcsToDeliver < 1 || pcsToDeliver > selectedLocation.i_pieces;

    const deliverDock = asyncHandler(async() => {
        const res = await axios.post(`${baseApiUrl}/deliverDock`, {
            data: {
                id: selectedLocation.id,
                t_modified: moment().local().format('MM/DD/YYYY HH:mm:ss'),
                s_modified_by: s_email,
                s_unit,
                i_pieces: pcsToDeliver,
                b_split: selectedLocation.i_pieces !== pcsToDeliver,
                s_mawb: selectedAwb.s_mawb
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        }); 

        push('PiecesLocation');
        setPiecesLocations(res.data);
    });

    const goToAwbs = (company) => {
        setSelectedCompany(company);
        push('AWBs');
        setModalTakeOwnership(false);
    }

    const removeDockDoorMobile = asyncHandler(async(company) => {
        const res = await axios.post(`${baseApiUrl}/removeDockDoorMobile`, {
            data: {
                t_modified: moment().local().format('MM/DD/YYYY HH:mm:ss'),
                s_modified_by: user.s_email,
                s_dock_door_guid: company.s_dock_door_guid,
                s_unit: s_unit
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        const resolvedCompanies = resolveDockCompanies(res.data);
        const updatedSelectedCompany = resolvedCompanies.find(c => c.s_transaction_id === company.s_transaction_id);
        setSelectedCompany(updatedSelectedCompany);
        setDockCompanies(resolvedCompanies);
        setModalTakeOwnership(false);

    });

    const removeDockOwnership = asyncHandler(async(company) => {
        const res = await axios.post(`${baseApiUrl}/removeDockOwnership`, {
            data: {
                t_modified: moment().local().format('MM/DD/YYYY HH:mm:ss'),
                s_modified_by: user.s_email,
                s_transaction_id: company.s_transaction_id,
                s_dock_door_guid: company.s_dock_door_guid,
                s_unit: s_unit
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        const resolvedCompanies = resolveDockCompanies(res.data);
        setSelectedCompany({});
        setDockCompanies(resolvedCompanies);
        setModalTakeOwnership(false);

    });

    const releaseDockDriver = asyncHandler(async(company) => {
        const res = await axios.post(`${baseApiUrl}/releaseDockDriver`, {
            data: {
                t_modified: moment().local().format('MM/DD/YYYY HH:mm:ss'),
                s_modified_by: user.s_email,
                s_transaction_id: company.s_transaction_id,
                s_dock_door_guid: company.s_dock_door_guid,
                s_unit: s_unit
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        const resolvedCompanies = resolveDockCompanies(res.data);
        setSelectedCompany({});
        setDockCompanies(resolvedCompanies);
        setModalTakeOwnership(false);

    });

    const leftEarlyDock = asyncHandler(async(company) => {
        const res = await axios.post(`${baseApiUrl}/leftEarlyDock`, {
            data: {
                t_modified: moment().local().format('MM/DD/YYYY HH:mm:ss'),
                s_modified_by: user.s_email,
                s_transaction_id: company.s_transaction_id,
                s_unit: s_unit
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        const resolvedCompanies = resolveDockCompanies(res.data);
        setSelectedCompany({});
        setDockCompanies(resolvedCompanies);
        setModalTakeOwnership(false);

    });

    // Helpers:

    const types = ['IMPORT', 'EXPORT', 'MIXED'];
    const [selectedType, setSelectedType]  = useState(types[0]);

    useEffect(() => {

    }, []);

    const resolveDriverCoName = () => {
        if (selectedCompany) {
            const { s_trucking_driver, s_trucking_company } = selectedCompany;
            const output = `${s_trucking_driver} with ${s_trucking_company}`;
            if (output.length > 30 && width < 500) {
                return `${output.substr(0, 27)}...`;
            }
            return output;
        }
    }

    return (
        <Row className={'mobile'}>
            <Col md={12}>
                <div className="example-steps fluid">
                    <Row>
                        <Col md={12} className={'mb-1'}>
                            <h1 onClick={() => push('Customers')} className={'d-inline'}>Dock Delivery</h1>
                        </Col>
                    </Row>

                    <Steps>
                        <Step id={'Customers'}>
                            <h4>Current Customers</h4>
                            <Row>
                                <Col md={12} className={'text-center mb-2'}>
                                {
                                    <ButtonGroup>
                                        {
                                            types.map((type, i) => (
                                                <Button key={i} color={'info'} active={type === selectedType} onClick={() => setSelectedType(type)}>{type}</Button>
                                            ))
                                        }
                                    </ButtonGroup>
                                }
                                </Col>
                            </Row>
                            <Row>
                            {
                                selectedType === 'MIXED' ?
                                    dockCompanies.map((c, i) => c.s_state === 'MIXED' && (
                                        <CompanyCard 
                                            company={c}
                                            key={i}
                                            handleViewCompany={handleViewCompany}
                                            user={user}
                                        />
                                    )) :
                                    dockCompanies.map((c, i) => (c.s_type === selectedType || c.s_state === 'MIXED') && (
                                        <CompanyCard 
                                            company={c}
                                            key={i}
                                            handleViewCompany={handleViewCompany}
                                            user={user}
                                        />
                                    ))
                            }
                            </Row>
                        </Step>
                        <Step id={'AWBs'}>
                            <CompanySubHeader 
                                previous={previous}
                                resolveDriverCoName={resolveDriverCoName}
                            />
                            <Row>
                                {
                                    selectedType === 'MIXED' ? 
                                        selectedCompany && selectedCompany.awbs && selectedCompany.awbs.map((a, i) => (
                                            <AwbCard 
                                                awb={a}
                                                key={i}
                                                selectAwb={selectAwb}
                                            />
                                        )) :
                                        selectedCompany && selectedCompany.awbs && selectedCompany.awbs.map((a, i) => a.s_type === selectedType && (
                                            <AwbCard 
                                                awb={a}
                                                key={i}
                                                selectAwb={selectAwb}
                                            />
                                        ))
                                }
                            </Row>
                        </Step>
                        <Step id={'PiecesLocation'}>
                            <CompanySubHeader 
                                previous={previous}
                                resolveDriverCoName={resolveDriverCoName}
                            />                            
                            <Row>
                                <Col md={12}>
                                    <h4>AWB: {selectedAwb.s_mawb}</h4>
                                </Col>
                            </Row>
                            <Row className={'text-center'}>
                                <Col xs={6}>
                                    <h6>Location</h6>
                                </Col>
                                <Col xs={6}>
                                    <h6>Pieces</h6>
                                </Col>
                            </Row>
                            {
                                piecesLocations.map((l, i) => (
                                    <LocationCard 
                                        location={l}
                                        key={i}
                                        selectLocation={selectLocation}
                                    />
                                ))
                            }
                            <Row>
                                <Col md={12}>                                    
                                    <Row className={'mt-2'}>
                                        <Col className={'mx-auto btn btn-secondary'} xs={12} onClick={() => push('SignAndClose')}>
                                            <h1>Ready to Sign</h1>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Step>
                        <Step id={'Deliver'}>
                            <CompanySubHeader 
                                previous={previous}
                                resolveDriverCoName={resolveDriverCoName}
                            />
                            <Row>
                                <Col xs={12}>
                                    <h4>{selectedAwb.s_mawb}</h4>
                                    <h4>Location: {selectedLocation.s_location || 'No Location'}</h4>
                                    <h4>Pieces: {selectedLocation.i_pieces || 'No pieces'}</h4>
                                </Col>
                                <Col xs={12}>
                                    <h4>Custom Number of Pieces</h4>
                                    <Input type={'number'} value={pcsToDeliver} min={2} max={selectedLocation.i_pieces} onChange={(e) => setPcsToDeliver(e.target.value)} />
                                </Col>
                                <Col 
                                    md={12} 
                                    className={`btn text-center mx-3 mt-2 ${disableDeliver && 'disabled'}`} 
                                    style={{ backgroundColor: '#61B996' }}
                                    onClick={() => !disableDeliver && deliverDock()}
                                >
                                    <h1>DELIVER</h1>
                                </Col>
                            </Row>
                        </Step>
                        <Step id={'SignAndClose'}>
                            <Row>
                                <Col md={12}>
                                    <Row>
                                        <Col md={12}>
                                            <h6 className={'float-left'}>Driver Signature:</h6>
                                            <Button 
                                                onClick={() => signatureRef.current.clear()}
                                                className={'float-right py-1'}
                                            >
                                                Clear
                                            </Button>
                                        </Col>
                                    </Row>
                                    <div style={{ width: '100%', height: '400px', border: '2px solid black' }}>
                                        <SignatureCanvas 
                                            penColor='black'
                                            canvasProps={{className: 'sigCanvas'}} 
                                            ref={signatureRef}
                                        />
                                    </div>
                                    <Row className={'mt-2'}>
                                        <Col className={'mx-auto btn btn-success'} xs={12} onClick={() => updateDeliveredAwb()}>
                                            <h1>Confirm</h1>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Step>
                    </Steps>
                </div>
            </Col>

            <ModalTakeOwnership 
                modal={modalTakeOwnership}
                setModal={setModalTakeOwnership}
                viewCompany={viewCompany}
                selectCompany={selectCompany}
                user={user}
                next={next}
                baseApiUrl={baseApiUrl}
                headerAuthCode={headerAuthCode}
                takeDockDeliveryOwnership={takeDockDeliveryOwnership}
                goToAwbs={goToAwbs}
                removeDockDoorMobile={removeDockDoorMobile}
                removeDockOwnership={removeDockOwnership}
                releaseDockDriver={releaseDockDriver}
                selectedType={selectedType}
                haveAssignment={haveAssignment}
                leftEarlyDock={leftEarlyDock}
            />
        </Row>
    );
}

const DockDelivery = ({
    user, authButtonMethod, baseApiUrl, headerAuthCode, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, createSuccessNotification, eightyWindow, width
}) => {

    return (
        <AppLayout user={user} authButtonMethod={authButtonMethod} baseApiUrl={baseApiUrl} headerAuthCode={headerAuthCode} launchModalChangeLocation={launchModalChangeLocation} handleDisplaySubmenu={handleDisplaySubmenu}>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row>
                        <Col md={12}>
                            <Wizard 
                                render={({ step, steps, next, previous, push }) => (
                                    <DeliveryProcess 
                                        user={user}
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        step={step}
                                        steps={steps}
                                        next={next}
                                        previous={previous}
                                        push={push}
                                    />
                                )}
                            ></Wizard>
                        </Col>
                    </Row>
                </div>
            </div>
        </AppLayout>
    );
}

export default withRouter(DockDelivery);