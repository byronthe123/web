import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label, Row, Col } from 'reactstrap';
import moment from 'moment';
import { Formik, Field } from 'formik';
import FormikSwitch from '../../custom/FormikSwitch';
import _ from 'lodash';
import { formatEmail, formatMawb } from '../../../utils';
import { AddNotesType, IExtendedFFM, IExtendedULD } from './interfaces';
import { IMap, IFWB, SearchAwb, IFHL } from '../../../globals/interfaces';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    type: AddNotesType;
    s_flight_id: string;
    selectedUld: IExtendedULD | undefined;
    selectedAwb: IExtendedFFM | undefined;
    addBreakdownNotes: (values: IMap<any>) => Promise<void>;
    fwbData: IFWB | undefined;
    selectedHawbRecord: IFHL | undefined;
    setSelectedHouseSerial: (state: string) => void;
    handleSearchAwb: SearchAwb;
}

export default function ModalAddNotes ({
    modal,
    setModal,
    type,
    s_flight_id,
    selectedUld,
    selectedAwb,
    addBreakdownNotes,
    fwbData,
    selectedHawbRecord,
    setSelectedHouseSerial,
    handleSearchAwb
}: Props) {


    const [key, setKey] = useState(0);

    const toggle = () => setModal(!modal);

    const [initialValues, setInitialValues] = useState({});

    useEffect(() => {
        const resolveInitialValues = () => {
            const awbKeys = ['s_notes', 'b_customs_hold', 'b_usda_hold', 'b_hold', 'b_breakdown_hawb', 's_special_handling_code'];
            const uldKeys = ['s_notes', 's_shc', 'b_offloaded'];
    
            const keys = type === 'uld' ? uldKeys : awbKeys;
    
            const values: IMap<any> = {};
    
            for (let i = 0; i < keys.length; i++) {
                const currentKey = keys[i];
                // @ts-ignore
                values[currentKey] = type === 'uld' ? (selectedUld || {})[currentKey] : (selectedAwb || {})[currentKey];
            }
    
            return values;
        }
        
        const initialValues = resolveInitialValues();
        setInitialValues(initialValues);
        setKey(prev => prev + 1);
    }, [modal, selectedAwb, selectedUld, type]);

    if (type === 'uld' && selectedUld) {
        return (
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                key={key}
                onSubmit={() => null}
            >
                {({ values, setFieldValue }) =>
                    <Modal isOpen={modal} toggle={toggle} size={'lg'}>
                        <ModalHeader>ULD {selectedUld.s_uld} in Flight {s_flight_id}</ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col md={12}>
                                    <h4>ULD Details</h4>
                                    <Table striped>
                                        <thead></thead>
                                        <tbody>
                                            <tr>
                                                <th>Pieces</th>
                                                <th>{selectedUld.i_pieces_total}</th>
                                            </tr>
                                            <tr>
                                                <th>Weight</th>
                                                <th>{selectedUld.f_weight}</th>
                                            </tr>
                                            <tr>
                                                <th>Origin</th>
                                                <th>{selectedUld.s_origin}</th>
                                            </tr>
                                            <tr>
                                                <th>Port of Loading</th>
                                                <th>{selectedUld.s_pol}</th>
                                            </tr>
                                            <tr>
                                                <th>Port of Unloading</th>
                                                <th>{selectedUld.s_pou}</th>
                                            </tr>
                                            <tr>
                                                <th>Destination</th>
                                                <th>{selectedUld.s_destination}</th>
                                            </tr>
                                            <tr>
                                                <th colSpan={2}>
                                                    <FormikSwitch 
                                                        label={'Offloaded'}
                                                        name={'b_offloaded'}
                                                        values={values}
                                                        setFieldValue={setFieldValue}
                                                    />
                                                </th>
                                            </tr>
                                            <tr>
                                                <th>Special Handling Codes</th>
                                                <th>
                                                    <Field name={'s_shc'} className={'form-control'} type='text' />
                                                </th>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <FormGroup>
                                        <Label>Notes for Breakdown</Label>
                                        <Field name={'s_notes'} className={'form-control'} component={'textarea'} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Row style={{ width: '100%' }}>
                                <Col md={12}>
                                    <div className={'float-left'}>
                                        <h4>Last modified by: {formatEmail(selectedUld.s_modified_by)} at {moment(selectedUld.t_modified).format('MM/DD/YYYY HH:mm:ss')}</h4>
                                    </div>
                                    <div className={'float-right'}>
                                        <Button color="primary mr-2" onClick={() => addBreakdownNotes(values)}>
                                            Save
                                        </Button>
                                        <Button color="secondary" onClick={toggle}>Cancel</Button>
                                    </div>
                                </Col>
                            </Row>
                        </ModalFooter>
                    </Modal>
            }
            </Formik>
        );
    } else if (selectedAwb && selectedUld) {
        return (
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                key={key}
                onSubmit={() => null}
            >
                {({ values, setFieldValue }) =>
                    <Modal isOpen={modal} toggle={toggle} style={{ width: '1500px', maxWidth: '100%' }}>
                    <ModalHeader>AWB <span className='hyperlink' onClick={() => handleSearchAwb(null, selectedAwb.s_mawb)}>{formatMawb(selectedAwb.s_mawb)}</span> in ULD {selectedUld.s_uld} in Flight {s_flight_id}</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md={4}>
                                <h4>AWB Details</h4>
                                <Table striped>
                                    <thead></thead>
                                    <tbody>
                                        <tr>
                                            <th>FWB Pieces</th>
                                            <th>{_.get(fwbData, 'i_total_pieces', '')}</th>
                                        </tr>
                                        <tr>
                                            <th>In this ULD</th>
                                            <th>{selectedAwb.i_actual_piece_count}</th>
                                        </tr>
                                        <tr>
                                            <th>In this Flight</th>
                                            <th>{selectedAwb.i_pieces_total}</th>
                                        </tr>
                                        <tr>
                                            <th>Origin</th>
                                            <th>{selectedAwb.s_origin}</th>
                                        </tr>
                                        <tr>
                                            <th>Port of Loading</th>
                                            <th>{selectedAwb.s_pol}</th>
                                        </tr>
                                        <tr>
                                            <th>Port of Unloading</th>
                                            <th>{selectedAwb.s_pou}</th>
                                        </tr>
                                        <tr>
                                            <th>Destination</th>
                                            <th>{selectedAwb.s_destination}</th>
                                        </tr>
                                        <tr>
                                            <th>SHC</th>
                                            <th>
                                                <Field name={'s_special_handling_code'} className={'form-control'} type='text' />
                                            </th>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col md={4}>
                                <Table>
                                    <thead></thead>
                                    <tbody>
                                        <tr>
                                            <th>Consignee</th>
                                            <th>{fwbData && fwbData.s_consignee_name1}</th>
                                        </tr>
                                        <tr>
                                            <th>Commodity</th>
                                            <th>{selectedAwb.s_commodity}</th>
                                        </tr>
                                        <tr>
                                            <th>Agent</th>
                                            <th>{fwbData && fwbData.s_agent_name}</th>
                                        </tr>
                                        <tr>
                                            <th>Select HAWB - {_.get(selectedAwb, 'hawbs', []).length}</th>
                                            <th>
                                                <select onChange={(e: any) => setSelectedHouseSerial(e.target.value)} className={'form-control'}>
                                                    {
                                                        _.get(selectedAwb, 'hawbs', []).map((h, i) =>
                                                            <option 
                                                                key={i}
                                                                value={h.s_hawb}
                                                            >
                                                                {h.s_hawb}
                                                            </option>
                                                        )
                                                    }
                                                </select>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th>FHL Date</th>
                                            <th>{ selectedHawbRecord && moment(selectedHawbRecord.t_created).format('MM/DD/YYY HH:mm') }</th>
                                        </tr>
                                        <tr>
                                            <th>Nature of Goods</th>
                                            <th>{selectedHawbRecord && selectedHawbRecord.s_nature_of_goods}</th>
                                        </tr>
                                        <tr>
                                            <th>Pieces</th>
                                            <th>{selectedHawbRecord && selectedHawbRecord.i_pieces}</th>
                                        </tr>
                                    </tbody>
                                </Table>
                                <FormGroup>
                                    <FormikSwitch 
                                        label={'Breakdown by House'}
                                        name={'b_breakdown_hawb'}
                                        values={values}
                                        setFieldValue={setFieldValue}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <h4>Holds</h4>
                                <FormGroup>
                                    <FormikSwitch 
                                        label={'Customs Hold'}
                                        name={'b_customs_hold'}
                                        values={values}
                                        setFieldValue={setFieldValue}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormikSwitch 
                                        label={'USDA Hold'}
                                        name={'b_usda_hold'}
                                        values={values}
                                        setFieldValue={setFieldValue}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormikSwitch 
                                        label={'CHOICE Hold'}
                                        name={'b_hold'}
                                        values={values}
                                        setFieldValue={setFieldValue}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Notes</Label>
                                    <Field component='textarea' name={'s_notes'} className={'form-control'} style={{ height: '200px' }} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Row style={{ width: '100%' }}>
                            <Col md={12}>
                                <div className={'float-left'}>
                                    <h4>Last modified by: {formatEmail(selectedAwb.s_modified_by)} at {moment(selectedAwb.t_modified).format('MM/DD/YYYY HH:mm:ss')}</h4>
                                </div>
                                <div className={'float-right'}>
                                    <Button color="primary mr-2" onClick={() => addBreakdownNotes(values)}>
                                        Save
                                    </Button>
                                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                                </div>
                            </Col>
                        </Row>
                    </ModalFooter>
                </Modal>
            }
            </Formik>
        );
    } else {
        return null;
    }
}