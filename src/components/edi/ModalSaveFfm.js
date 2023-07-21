import React, { useState, useContext } from 'react';
import { AppContext, useAppContext } from '../../context';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Input, FormGroup, Label, Table } from 'reactstrap';
import axios from 'axios';
import ReactJson from 'react-json-view';
import { asyncHandler } from '../../utils';
import SaveButton from '../custom/SaveButton';
import _ from 'lodash';
import { setIn } from 'formik';
import moment from 'moment';

const REACT_APP_ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL;
const REACT_APP_ENDPOINT_AUTH_CODE = `_*xP-Q97MTB5sb_CvK^wwzaX8yz^H5&fu6^%Ae_J2PC@aXc6SADH8Gf2m3vJAc^G*s@T9pqZ8$EmZXb6`;

export default function ModalSaveFfm ({
    modal,
    setModal,
    setLoading,
    s_table
}) {

    const { user } = useAppContext();
    const toggle = () => setModal(!modal);

    const { createSuccessNotification } = useContext(AppContext);

    const [message, setMessage] = useState('');
    const [d_arrival_date, set_d_arrival_date] = useState('');

    const [ulds, setUlds] = useState([]);
    const [totalPieces, setTotalPieces] = useState('');
    const [totalWeight, setTotalWeight] = useState('');
    const [totalAwbs, setTotalAwbs] = useState(0);
    const [flightId, setFlightId] = useState('');
    const [preview, setPreview] = useState(false);
    const [data, setData] = useState({});
    const [duplicateUlds, setDuplicateUlds] = useState(false);
    const [duplicateUldValue, setDuplicateUldValue] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [actualArrivalDate, setActualArrivalDate] = useState('');
    const [invalidDate, setInvalidDate] = useState(false);

    const resolveUldAwbs = (ffm) => {
        class UldItem {
            constructor (s_uld='') {
                this.s_uld = s_uld;
                this.awbs = [];
                this.subTotalPieces = 0;
                this.subTotalWeight = 0;   
                this.duplicate = false;
            }
        }

        const checkAwb = (cargoItem) => {
            const consignments = _.get(cargoItem, 'consignments', []);
            for (let i = 0; i < consignments.length; i++) {
                if (consignments[i].airWaybillNumber) {
                    return true;
                }
            }
            return false;
        }

        const ulds = [];
        const bulkUlds = new UldItem('BULK');

        let totalPieces = 0, totalWeight = 0, totalAwbs = 0;
        const uldsMap = {};

        const pointOfUnloading = _.get(ffm, 'pointOfUnloading', []);
        for (let i = 0; i < pointOfUnloading.length; i++) {
            const currentPoint = pointOfUnloading[i];
            const currentCargo = _.get(currentPoint, 'loadedCargo', []);

            for (let j = 0; j < currentCargo.length; j++) {
                const cargoItem = currentCargo[j];
                if (checkAwb(cargoItem)) {

                    const uldItem = new UldItem();

                    const uld = _.get(cargoItem, 'uldInformation.uld', {});

                    if (uld.type && uld.serialNumber && uld.ownerCode) {
                        uldItem.s_uld = `${uld.type}${uld.serialNumber}${uld.ownerCode}`;
                    } else {
                        uldItem.s_uld = 'BULK';
                    }

                    if (uldsMap[uldItem.s_uld] === undefined) {
                        uldsMap[uldItem.s_uld] = 1;
                    } else {
                        uldsMap[uldItem.s_uld]++;
                        setDuplicateUlds(true);
                        setDuplicateUldValue(uldItem.s_uld);
                    }

                    const consignments = _.get(cargoItem, 'consignments', []);

                    for (let k = 0; k < consignments.length; k++) {
                        const currentConsignment = consignments[k];
                        const pieces = _.get(currentConsignment, 'quantity.numberOfPieces', 0);
                        const weight = _.get(currentConsignment, 'quantity.weight.amount', 0);

                        const awb = {
                            s_mawb: currentConsignment.airWaybillNumber,
                            pieces,
                            weight,
                            commodity: _.get(currentConsignment, 'manifestDescriptionOfGoods', null)
                        }

                        if (uldItem.s_uld === 'BULK') {
                            bulkUlds.awbs.push(awb);
                        } else {
                            uldItem.awbs.push(awb);
                        }

                        uldItem.subTotalPieces += pieces;
                        uldItem.subTotalWeight += weight;
                        totalPieces += pieces;
                        totalWeight += weight;
                        totalAwbs++;
                    }

                    if (uldItem.s_uld !== 'BULK') {
                        ulds.push(uldItem);
                    }
                }

            }
        }

        if (Object.keys(uldsMap).length > 0) {
            for (let i = 0; i < ulds.length; i++) {
                if (uldsMap[ulds[i].s_uld] > 1) {
                    ulds[i].duplicate = true;
                }
            }
        }

        if (bulkUlds.awbs.length > 0) {
            let subTotalPieces = 0, subTotalWeight = 0;
            const { awbs } = bulkUlds;
            for (let i = 0; i < awbs.length; i++) {
                subTotalPieces += awbs[i].pieces;
                subTotalWeight += awbs[i].weight;
            }
            bulkUlds.subTotalPieces = subTotalPieces;
            bulkUlds.subTotalWeight = subTotalWeight;
            ulds.push(bulkUlds);
        }

        setUlds(ulds);
        setTotalPieces(totalPieces);
        setTotalWeight(totalWeight);
        setTotalAwbs(totalAwbs);
        setPreview(true);
    }

    const champApi = async() => {
        try {
            setLoading(true);
            const res = await axios.post(`${REACT_APP_ENDPOINT_URL}/champApi`, {
                message,
                type: s_table
            }, {
                headers: {
                    Authorization: `Bearer ${REACT_APP_ENDPOINT_AUTH_CODE}`
                }
            });
            setLoading(false);
            if (res.status === 200) {
                if (s_table === 'ffm') {
                    const ffm = res.data;
                    const flightId = `${ffm.flightIdAndPointOfLoading.flightIdentification.flight}/${ffm.flightIdAndPointOfLoading.flightIdentification.scheduledDate}`;
                    setFlightId(flightId);
                    resolveUldAwbs(ffm);

                    const scheduledDate = _.get(ffm, 'flightIdAndPointOfLoading.flightIdentification.scheduledDate');
                    const actualArrivalDate = _.get(ffm, 'pointOfUnloading[0].dateOfArrival', null);

                    setScheduledDate(moment(scheduledDate).format('YYYY-MM-DD'));
                    setActualArrivalDate(moment(actualArrivalDate).format('YYYY-MM-DD'));
                    if (actualArrivalDate) {
                        setInvalidDate(moment(actualArrivalDate).isBefore(scheduledDate));
                    }
                } else {
                    setData(res.data);
                    setPreview(true);
                }
            }
        } catch (err) {
            setLoading(false);
            alert(`${_.get(err, 'response.status', '')}: ${_.get(err, 'response.data.message', '')}. Line Number: ${_.get(err, 'response.data.stack', '')}`);
        }

    }; 

    const saveFfm = asyncHandler(async() => {
        setLoading(true);
        const res = await axios.post(`${REACT_APP_ENDPOINT_URL}/${s_table}`, {
            message,
            override: {
                d_arrival_date
            },
            manual: true,
            email: user.s_email
        }, {
            headers: {
                Authorization: `Bearer ${REACT_APP_ENDPOINT_AUTH_CODE}`
            }
        });

        if (res.status === 200) {
            setMessage('');
            set_d_arrival_date('');
            createSuccessNotification('FFM Saved');
            setPreview(false);
        }   
        setLoading(false);
        setModal(false);
    });

    const handleClosePreview = () => {
        setScheduledDate('');
        setActualArrivalDate('');
        setPreview(false);
        setInvalidDate(false);
    }

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader className={'py-2'}>
                <div className={'float-left'}>Save {s_table.toUpperCase()}</div>
                {
                    duplicateUlds &&
                    <div className={'float-right bg-warning text-danger'}>
                        Duplicate ULDs: {duplicateUldValue}
                    </div> 
                }
                {
                    invalidDate && (
                        <div className={'float-right bg-warning text-danger'}>
                            Arrival Date ({actualArrivalDate}) cannot be before Scheduled Date ({scheduledDate}):
                        </div> 
                    )
                }
            </ModalHeader>
            <ModalBody style={{ height: '75vh' }} className={'pt-3 pb-0'}>
                {
                    !preview ? 
                        <Row style={{ height: '100%' }}>
                            <Col md='12' lg='12' style={{ height: '80%' }}>
                                <Label>Paste Message:</Label>
                                <Input 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    type={'textarea'} 
                                    style={{ height: '100%', overflowY: 'scroll' }} 
                                />
                            </Col>
                            {/* <Col md={12} className={'mt-2'}>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup className={'mb-0'}>
                                            <Label>Flight Date</Label>
                                            <Input type={'date'} value={d_arrival_date} onChange={(e) => set_d_arrival_date(e.target.value)} />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Col> */}
                        </Row> :
                            s_table === 'ffm' ? 
                            <Row>
                                <Col md={12}>
                                    <Row>
                                        <Col md={4}>
                                            <h6>Flight ID: {flightId}</h6>
                                        </Col>
                                        <Col md={3}>
                                            <h6>ULDs: {ulds.length}</h6>
                                        </Col>
                                        <Col md={3}>
                                            <h6>AWBs: {totalAwbs}</h6>
                                        </Col>
                                    </Row>
                                    <Row style={{ height: '65vh', overflowY: 'scroll' }}>
                                        <Col md={12}>
                                            <Table>
                                                <thead className={'bg-primary'}>
                                                    <tr>
                                                        <th>ULD</th>
                                                        <th>Pieces</th>
                                                        <th>Weight</th>
                                                        <th>Commodity</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        ulds.map((uld, i) => (
                                                            <>
                                                                <tr key={i} className={uld.duplicate ? 'table-warning' : 'table-success'}>
                                                                    <td>{uld.s_uld}</td>
                                                                    <td>{uld.subTotalPieces}</td>
                                                                    <td>{uld.subTotalWeight && uld.subTotalWeight.toFixed(2)}</td>
                                                                    <td></td>
                                                                </tr>
                                                                {
                                                                    uld.awbs.map((awb, j) => (
                                                                        <tr>
                                                                            <td className={'pl-5'}>{awb.s_mawb}</td>
                                                                            <td>{awb.pieces}</td>
                                                                            <td>{awb.weight}</td>
                                                                            <td>{awb.commodity}</td>
                                                                        </tr>
                                                                    ))
                                                                }
                                                            </>
                                                        ))
                                                    }
                                                    <tr className={'bg-primary font-weight-bold'}>
                                                        <td>Total</td>
                                                        <td>{totalPieces}</td>
                                                        <td>{totalWeight && totalWeight.toFixed(2)}</td>
                                                        <td></td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row> :
                            <Row style={{ height: '65vh', overflowY: 'scroll' }}>
                                <Col md={12}>
                                    <ReactJson src={data} displayDataTypes={false} />
                                </Col>
                            </Row>
                }
            </ModalBody>
            <ModalFooter className={'py-2'} style={{ width: '100%' }}>
                {
                    preview ?
                        <Row style={{ width: '100%' }}>
                            <Col md={12}>
                                <Button 
                                    onClick={() => handleClosePreview()} 
                                    className={'float-left'}
                                >
                                    Back
                                </Button>
                                <SaveButton 
                                    enableSave={message.length > 0 && !duplicateUlds && !invalidDate}
                                    handleSave={() => saveFfm()}
                                    className={'float-right'}
                                />
                            </Col>
                        </Row>
                        :
                        <Button 
                            disabled={message.length === 0}
                            onClick={() => champApi()}
                        >
                            Preview
                        </Button>
                }
            </ModalFooter>
        </Modal>
    );
}