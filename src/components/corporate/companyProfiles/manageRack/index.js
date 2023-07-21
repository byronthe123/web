import React, { useEffect, useState } from 'react';
import {withRouter} from 'react-router-dom';
import { Row, Col, Button, ButtonGroup } from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';
import { api, formatEmail, notify } from '../../../../utils';

import useUnitRack from './useUnitRack';
import useUpdateValues from './useUpdateValues';
import TableLayoutter from './TableLayoutter';
import SpecialLocations from './SpecialLocations';
import Modal from './Modal';
import updateFunction from './updateFunction';

const ManageRack = ({
    user, 
    stations,
    activeFirstTab
}) => {

    const units = stations.map(s => s.s_unit);
    const [selectedUnit, setSelectedUnit] = useState(stations[0].s_unit);
    const unitRack = useUnitRack(selectedUnit, user.s_email, activeFirstTab);
    const [schema, setSchema] = useState({});
    const [specialLocations, setSpecialLocations] = useState({});

    useEffect(() => {
        if (unitRack && unitRack.schema) {
            const { schema, specialLocations={} } = unitRack;
            setSchema(schema);
            setSpecialLocations(specialLocations);
        }
    }, [unitRack]);

    const [modalOpen, setModalOpen] = useState(false);
    const { 
        value, 
        setValue,
        tower, 
        setTower,
        level,
        setLevel,
        location,
        setLocation,
        allowDuplicateLoc, 
        setAllowDuplicateLoc,
        action,
        type, 
        handleSetActionType,
        enableProcess
    } = useUpdateValues();

    const handleOperation = (action, type, tower='', level='', location='', allowDuplicates) => {
        setTower(tower);
        setLevel(level);
        setLocation(location);
        setAllowDuplicateLoc('');
        if (action === 'UPDATE') {
            if (type === 'LOCATION') {
                setValue(location);
                setAllowDuplicateLoc(allowDuplicates);
            } else if (type === 'SPECIAL') {
                setValue(location);
            }
        } else {
            setValue('');
        }
        handleSetActionType(action, type);
        setModalOpen(true);
    }

    const handleUpdate = async(override=null) => {
        const useAction = override || action;
        const useSchema = type === 'SPECIAL' ? specialLocations : schema;
        const { success, copy:updatedObj } = updateFunction(
            useSchema, useAction, type, value, tower, level, location, allowDuplicateLoc
        );

        if (success) {
            const data = {
                _id: unitRack._id,
                schema: updatedObj,
                modifiedBy: user.s_email
            }

            if (type === 'SPECIAL') {
                data.schema = schema;
                data.specialLocations = updatedObj;
            } else {
                data.schema = updatedObj;
                data.specialLocations = specialLocations;
            }
            
            const res = await api('put', 'updateUnitRack', { data });
            if (res.status === 200) {
                notify('Updated');
                const { schema, specialLocations } = res.data;
                setSchema(schema);
                setSpecialLocations(specialLocations);
                setModalOpen(false);
                setValue('');
            }
        } else {
            notify('Failed to update', 'warning');
        }

    }



    return (
        <>
            <Row className='px-3 py-1'>
                <Col md={12} className={'mb-1'}>
                    <ButtonGroup>
                        {
                            units.map((u, i) => (
                                <Button 
                                    key={i}
                                    onClick={() => setSelectedUnit(u)}
                                >
                                    {u}
                                </Button>
                            ))
                        }
                    </ButtonGroup>
                </Col>
                <Col md={12}>
                    <h4>
                        Manage Rack for {_.get(unitRack, 'unit', '')}
                        <span style={{ fontSize: '14px', marginLeft: '5px' }}>
                            (Last modified by {formatEmail(_.get(unitRack, 'modifiedBy', ''))} at {moment(_.get(unitRack, 'updatedAt', '')).format('MM/DD/YYYY HH:mm')})
                        </span>
                    </h4>
                </Col>
                <Col md={12}>
                    <Button
                        onClick={() => handleOperation('CREATE', 'TOWER')}
                    >
                        <i className="fas fa-plus-circle mr-2" />
                        Tower
                    </Button>
                </Col>
                <Col md={12} className={"mt-2"}>
                    {
                        Object.keys(schema).map((key, i) => (
                            <TableLayoutter 
                                tower={key}
                                levels={schema[key]}
                                handleOperation={handleOperation}
                                key={i}
                            />
                        ))
                    }
                </Col>
                <Col md={12} className={"mt-2"}>
                    <SpecialLocations 
                        specialLocations={specialLocations}
                        handleOperation={handleOperation}
                    />
                </Col>
            </Row>
            <Modal 
                modal={modalOpen}
                setModal={setModalOpen}
                value={value}
                setValue={setValue}
                allowDuplicateLoc={allowDuplicateLoc}
                setAllowDuplicateLoc={setAllowDuplicateLoc}
                action={action}
                type={type}
                tower={tower}
                level={level}
                handleUpdate={handleUpdate}
                enableProcess={enableProcess}
            />
        </>
    );
}

export default withRouter(ManageRack);
