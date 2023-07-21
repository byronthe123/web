import React, { useState, useEffect, useMemo } from 'react';
import { Formik, Field } from 'formik';
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row, 
    Col,
    Input,
    Table,
    Label,
    Button
  } from "reactstrap";
import FormikSwitch from '../../custom/FormikSwitch';
import moment from 'moment';
import valuesMapping from './valuesMapping';
import classnames from 'classnames';
import _ from 'lodash';
import Select from 'react-select';
import { getUsername, validateAwb } from '../../../utils';
import apiClient from '../../../apiClient';

export default function ModalFormikWrapper ({
    modal,
    setModal,
    schema,
    specialLocations,
    user,
    newLocation,
    rackItem,
    rackItems,
    updateRackLocation,
    locateInRack,
    updateRackStatus,
    locationsMap,
    handleSearchAwb
}) {

    const [key, setKey] = useState(0);
    const [values, setValues] = useState({});

    const resolveValues = (mapping, newLocation, rackItem) => {
        const values = {};

        for (let i = 0; i < mapping.length; i++) {
            const key = mapping[i];
            if (newLocation) {

                if (key === 'specialLocation') {
                    values['enableSpecialLocation'] = false;
                } else {
                    values[key] = '';
                }

            } else {
                let value = (rackItem && rackItem[key]) || '';

                if (key === 'd_flight') {
                    value = moment.utc(value).format('YYYY-MM-DD');
                } else if (key === 's_location') {
                    if (rackItem && specialLocations[rackItem.s_location] !== undefined) {
                        value = rackItem.s_location;
                        values['enableSpecialLocation'] = true;
                    } else {
                        values['enableSpecialLocation'] = false;
                    }  
                }

                values[key] = value;
            }
        }

        values.s_notes = '';
        return values;
    }

    useEffect(() => {
        const values = resolveValues(valuesMapping, newLocation, rackItem);
        setValues(values);
        setKey(key + 1);
    }, [modal]);

    return (
        <Formik
            initialValues={values}
            enableReinitialize={true}
            key={key}
        >
            {({ values, setFieldValue }) => (
                <ModalEditData 
                    modal={modal}
                    setModal={setModal}
                    schema={schema}
                    user={user}
                    specialLocations={specialLocations}
                    newLocation={newLocation}
                    rackItem={rackItem}
                    rackItems={rackItems}
                    updateRackLocation={updateRackLocation}
                    locateInRack={locateInRack}
                    updateRackStatus={updateRackStatus}
                    values={values}
                    setFieldValue={setFieldValue}
                    locationsMap={locationsMap}
                    handleSearchAwb={handleSearchAwb}
                />
            )}
        </Formik>
    );
}

const ModalEditData = ({
    modal,
    setModal,
    user,
    schema,
    specialLocations,
    newLocation,
    rackItem,
    rackItems,
    updateRackLocation,
    locateInRack,
    updateRackStatus,
    values,
    setFieldValue,
    locationsMap,
    handleSearchAwb
}) => {

    const towers = useMemo(() => {
        const _towers = [' '];
        for (let key in schema) {
            _towers.push(key);
        }
        return _towers;
    }, [schema]);

    const [init, setInit] = useState(0);

    useEffect(() => {
        if (init < 2) {
            setInit(init => init + 1);
        }
    }, [values.s_tower]);

    useEffect(() => {
        if (init > 1) {
            setFieldValue('s_level', '');
        }
    }, [values.s_tower, init]);

    useEffect(() => {
        if (init > 1) {
            setFieldValue('s_position', '');
        }
    }, [values.s_level, init]);

    const handleSave = (values) => {
        if (newLocation) {
            locateInRack(values);
        } else {
            updateRackLocation(values);
        }
    }

    const uniqueLocation = useMemo(() => {
        const checkLocation = `${values.s_tower}${values.s_level}${values.s_position}`;
        const existingLocated = _.get(locationsMap[checkLocation], 'numLocated', 0) > 0;
        
        if (!newLocation) {
            if (_.get(rackItem, 's_location', '') !== checkLocation && existingLocated) {
                return false;
            } else {
                return true;
            }
        } else {
            if (existingLocated) {
                return false;
            } else {
                return true;
            }
        }

    }, [locationsMap, values.s_tower, values.s_level, values.s_position]);

    const enableSave = (values) => {
        const { s_mawb, d_flight, s_airline_code, i_pieces, s_tower, s_level, s_position, s_location, enableSpecialLocation, s_destination } = values;

        const validInfo = (
            (s_mawb && s_mawb.length >= 11) && 
            (d_flight && moment(d_flight).isValid()) &&
            (s_airline_code && s_airline_code.length > 0) && 
            (i_pieces && (parseInt(i_pieces) > 0)) &&
            s_destination && s_destination.length > 0 && 
            uniqueLocation
        );

        const validPosition = (s_tower && s_tower.length > 0) && (s_level && s_level.length > 0) && (s_position && !isNaN(s_position));
        const validSpecialLocation = enableSpecialLocation && s_location.length > 0;

        return( (validInfo && validPosition) || (validInfo && validSpecialLocation) );
    }

    useEffect(() => {
        if (values.enableSpecialLocation) {
            setFieldValue('s_tower', '');
            setFieldValue('s_level', '');
            setFieldValue('s_position', '');
        } else {
            setFieldValue('s_location', '')
        }
    }, [values.enableSpecialLocation]);

    const resolveClass = (key) => {
        let baseClass = 'form-control';
        if (key === 's_mawb') {
            baseClass += (values[key] && values[key].length >= 11) ? '' : ' bg-warning';
        } else if (key === 'i_pieces' || key === 's_position') {
            baseClass += (values[key] && values[key] >= 1) ? '' : ' bg-warning';
        } else {
            baseClass += (values[key] && values[key].length > 0) ? '' : ' bg-warning';
        }
        return baseClass;
    }

    const resolveHolds = useMemo(() => {
        let holds = '';

        const map = {
            'b_hold': 'Choice',
            'b_usda_hold': 'USDA',
            'b_customs_hold': 'Customs'
        }

        for (let key in map) {
            if (values[key]) {
                holds += `${map[key]}, `
            }
        }

        holds = holds.substring(0, holds.length - 2);

        if (holds.length > 0) {
            return `This shipment has holds: ${holds}`;
        } else {
            return '';
        }
    }, [values]);

    const resolveDetails = useMemo(() => {
        const map = {
            'b_comat': 'Comat',
            'b_general_order': 'General Order'
        }

        let details = '';
        for (let key in map) {
            if (values[key]) {
                details += `${map[key]}, `;
            }
        }

        if (details.length > 0) {
            return `This shipment is ${details.substring(0, details.length - 2)}`;
        } else {
            return '';
        }
    }, [values]);

    const [fhls, setFhls] = useState([{ label: '', value: '' }]);

    useEffect(() => {
        const getFhls = async () => {
            const res = await apiClient.get(`/fhlsForRack/${values.s_mawb.replace(/-/g, '')}`);
            if (res.status === 200) {
                const selectOptions = [{ label: '', value: '' }];
                for (const { s_hawb } of res.data) {
                    selectOptions.push({
                        label: s_hawb,
                        value: s_hawb
                    });
                }
                setFhls(selectOptions);
            }
        }
        if (validateAwb(values.s_mawb)) {
            getFhls();
        }
    }, [values.s_mawb]);

    return (
        <Modal isOpen={modal} toggle={() => setModal(!modal)} style={{ maxWidth: '100%', width: '900px' }}>
            <ModalHeader>
                <Row>
                    <Col md={12}>
                        <Row>
                            <Col md={12}>
                                <div className={'float-left'}>
                                    { newLocation ? 'Add' : 'Update' } Rack Location {_.get(rackItem, 's_location', '')}
                                    {
                                        !uniqueLocation && 
                                        <span className={'bg-warning text-danger ml-3'}>Location already in use</span>
                                    }
                                </div>
                                {
                                    user.i_access_level >= 4 && 
                                    <div className='float-right'>
                                        <Button color='warning'>Manager Access</Button>
                                    </div>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <span className={'bg-warning text-danger mr-3'}>{resolveHolds}</span>
                                <span>{resolveDetails}</span>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col md={4}>
                        <Table>
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td className='hyperlink' onClick={() => handleSearchAwb(null, values.s_mawb)}>AWB</td>
                                    <td>
                                        <Field name={'s_mawb'} className={resolveClass('s_mawb')} type={'text'} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>House</td>
                                    <td>
                                        <Select 
                                            options={fhls}
                                            onChange={(option) => setFieldValue('s_hawb', option.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Airline Code</td>
                                    <td>
                                        <Field name={'s_airline_code'} className={resolveClass('s_airline_code')} type={'text'} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Flight Number</td>
                                    <td>
                                        <Field name={'s_flightnumber'} className={resolveClass('s_flightnumber')} type={'text'} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Flight Date</td>
                                    <td>
                                        <Field name={'d_flight'} className={resolveClass('d_flight')} type={'date'} />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col md={4}>
                        <Table>
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td>Pieces</td>
                                    <td>
                                        <Field name={'i_pieces'} className={resolveClass('i_pieces')} type={'number'} />
                                    </td>
                                </tr>
                                <tr className={classnames({ 'customDisabled': values.enableSpecialLocation })}>
                                    <td>Tower:</td>
                                    <td>
                                        <Input type={'select'} value={values.s_tower} className={resolveClass('s_tower')} onChange={(e) => setFieldValue('s_tower', e.target.value)}> 
                                        {
                                            towers.map((t, i) =>
                                                <option key={i} value={t}>{t}</option>
                                            )
                                        }
                                        </Input>
                                    </td>
                                </tr>
                                <tr className={classnames({ 'customDisabled': values.enableSpecialLocation })}>
                                    <td>Level:</td>
                                    <td>
                                        <Input type={'select'} value={values.s_level} className={resolveClass('s_level')} onChange={(e) => setFieldValue('s_level', e.target.value)}>
                                            <option value={''}></option>
                                            {
                                                Object.keys(_.get(schema, `[${values.s_tower}]`, {})).map((level, i) =>
                                                    <option key={i} value={level}>{level}</option>
                                                )
                                            }
                                        </Input>
                                    </td>
                                </tr>
                                <tr className={classnames({ 'customDisabled': values.enableSpecialLocation })}>
                                    <td>Position:</td>
                                    <td>
                                        <Input type={'select'} value={values.s_position} className={resolveClass('s_position')} onChange={(e) => setFieldValue('s_position', e.target.value)}>
                                            <option value={''}></option>
                                            {
                                                Object.keys(_.get(schema, `[${values.s_tower}][${values.s_level}]`, {})).sort((a, b) => Number(a) - Number(b)).map((p, i) =>
                                                    <option key={i} value={p}>{p}</option>
                                                )
                                            }
                                        </Input>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Special Location
                                        <Input type={'checkbox'} checked={values.enableSpecialLocation} value={values.enableSpecialLocation} onClick={() => setFieldValue('enableSpecialLocation', !values.enableSpecialLocation)} className={'ml-2'} />
                                    </td>
                                    <td className={classnames({ 'customDisabled': !values.enableSpecialLocation })}>
                                        <Input type={'select'} value={values.s_location} onChange={(e) => setFieldValue('s_location', e.target.value)}>
                                            <option></option>
                                            {
                                                Object.keys(specialLocations).map((key, i) =>
                                                    <option key={i}>{key}</option>
                                                )
                                            }
                                        </Input>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col md={4}>
                        <Table>
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td>Destination</td>
                                    <td>
                                        <Field name={'s_destination'} className={resolveClass('s_destination')} type={'text'} />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        {
                            user.i_access_level >= 3 && 
                            <Table>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <FormikSwitch 
                                                label={'Comat'}
                                                name={'b_comat'}
                                                values={values}
                                                setFieldValue={setFieldValue}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <FormikSwitch 
                                                label={'Choice Hold'}
                                                name={'b_hold'}
                                                values={values}
                                                setFieldValue={setFieldValue}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <FormikSwitch 
                                                label={'USDA Hold'}
                                                name={'b_usda_hold'}
                                                values={values}
                                                setFieldValue={setFieldValue}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <FormikSwitch 
                                                label={'Customs Hold'}
                                                name={'b_customs_hold'}
                                                values={values}
                                                setFieldValue={setFieldValue}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <FormikSwitch 
                                                label={'General Order'}
                                                name={'b_general_order'}
                                                values={values}
                                                setFieldValue={setFieldValue}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Table>
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td>ULD</td>
                                    <td>
                                        <Field name={'s_flight_uld'} className={'form-control'} type={'text'} />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col md={8}>
                        <Table>
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td>Special Handling Codes</td>
                                    <td>
                                        <Field type="text" name={'s_shc1'} className="form-control mr-2" style={{maxWidth: '57px', float: 'left'}} maxLength="3" />
                                        <Field type="text" name={'s_shc2'} className="form-control mr-2" style={{maxWidth: '57px', float: 'left'}} maxLength="3" />
                                        <Field type="text" name={'s_shc3'} className="form-control mr-2" style={{maxWidth: '57px', float: 'left'}} maxLength="3" />
                                        <Field type="text" name={'s_shc4'} className="form-control mr-2" style={{maxWidth: '57px', float: 'left'}} maxLength="3" />
                                        <Field type="text" name={'s_shc5'} className="form-control mr-2" style={{maxWidth: '57px', float: 'left'}} maxLength="3" />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                {
                    !newLocation && rackItem && 
                        <Row className={'mt-2'}>
                            <Col md={6}>
                                <Label>Created by {getUsername(rackItem.s_created_by)} at {moment.utc(rackItem.t_created).format('MM/DD/YYYY HH:mm:ss')}</Label>
                            </Col>  
                            <Col md={6}>
                                <Label>Modified by {getUsername(rackItem.s_modified_by)} at {moment.utc(rackItem.t_modified).format('MM/DD/YYYY HH:mm:ss')}</Label>
                            </Col>
                        </Row>
                }
            </ModalBody>
            <ModalFooter style={{ width: '100%'}}>
                <Row style={{ width: '100%'}}>
                    <Col md={6} className={'text-left'}>
                        {
                            (!newLocation && user.i_access_level > 2) &&
                            <i 
                                className={classnames("far fa-trash-alt text-danger hover-pointer text-large")} 
                                onClick={() => updateRackStatus('DELETED')}
                                data-tip={'Delete'}
                            ></i>
                        }
                    </Col>
                    <Col md={6} className={'text-right'}>
                        <i 
                            className={classnames("far fa-save text-primary hover-pointer text-large", { customDisabled: !enableSave(values) })} 
                            onClick={() => handleSave(values)}
                            data-tip={'Save'}
                            disabled={!enableSave(values)}
                        ></i>
                    </Col>
                </Row>
            </ModalFooter>
        </Modal>
    );
}
