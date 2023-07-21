import React, { useMemo } from 'react';

import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Input,
    Label,
    Row,
    Col,
    Table
  } from "reactstrap";
import classNames from 'classnames';
import { IULDFFM, ISelectedHawb } from './interfaces';
import { IUnitRack } from '../../../../globals/interfaces';
import _ from 'lodash';

const Option = ({ value, key }: { value: string, key: number }) => {
    return (
        <option 
            value={value}
            key={`${key}-${value}`}
        >
            {value}
        </option>
    );
}

interface Props {
    open: boolean;
    handleModal: (state: boolean) => void;
    selectedUldFfm: IULDFFM | undefined;
    selectedHawb: ISelectedHawb;
    setSelectedHawb: (selection: ISelectedHawb) => void;
    unitRack: IUnitRack;
    selectedTower: string;
    setSelectedTower: (value: string) => void;
    selectedLevel: string;
    setSelectedLevel: (value: string) => void;
    selectedPosition: string;
    setSelectedPosition: (value: string) => void;
    validLocationSelected: boolean;
    completeLocation: string;
    locationAvailable: boolean;
    enableSpecialLocation: boolean;
    setEnableSpecialLocation: (value: boolean) => void;
    specialLocationSelected: string;
    setSpecialLocationSelected: (value: string) => void;
    locateInRack: () => Promise<void>,
    b_comat: boolean;
    set_b_comat: (value: boolean) => void;
    s_notes: string;
    set_s_notes: (value: string) => void;
}

const ModalLocate = ({
    open, 
    handleModal,
    selectedUldFfm,
    selectedHawb,
    setSelectedHawb,
    unitRack,
    selectedTower,
    setSelectedTower,
    selectedLevel,
    setSelectedLevel,
    selectedPosition,
    setSelectedPosition,
    completeLocation,
    validLocationSelected,
    locationAvailable,
    enableSpecialLocation,
    setEnableSpecialLocation,
    specialLocationSelected,
    setSpecialLocationSelected,
    locateInRack,
    b_comat,
    set_b_comat,
    s_notes,
    set_s_notes
}: Props) => {

    const { schema, specialLocations } = unitRack;

    const enableLocate = useMemo(() => {
        const validUldFfm = selectedUldFfm && selectedUldFfm.s_mawb !== '';
        return validUldFfm && validLocationSelected;
    }, [selectedUldFfm, validLocationSelected]);

    const levelsMap = useMemo(() => {
        return schema[selectedTower] || {};
    }, [schema, selectedTower]);

    const positionsMap = useMemo(() => {
        return levelsMap[selectedLevel] || {};
    }, [levelsMap, selectedLevel]);

    const handleSelectHawb = (stringifiedValue: string) => {
        const json = JSON.parse(stringifiedValue);
        const hawb = {
            s_hawb: json.s_hawb,
            i_pieces: json.i_pieces
        }
        setSelectedHawb(hawb);
    }

    const setHousePieces = (i_pieces: number) => {
        const copy = _.cloneDeep(selectedHawb);
        copy.i_pieces = i_pieces;
        setSelectedHawb(copy);
    }

    if (selectedUldFfm) {
        return (
            <Modal isOpen={open} toggle={() => handleModal(!open)} size={'lg'}>
                <ModalHeader>
                    <Row>
                        <Col md={12}>
                            <div className={'float-left text-left'}>
                                <h4>Flight: {selectedUldFfm.s_flight_id}</h4>
                                <h4>ULD: {selectedUldFfm.s_uld}</h4>
                            </div>
                            <div className={'float-right text-right'}>
                                <h4>AWB: {selectedUldFfm.s_mawb}</h4>
                                <h4>Dest: {selectedUldFfm.s_destination}</h4>
                            </div>
                        </Col>
                    </Row>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md={5}>
                            <h6>Already Located</h6>
                            <Row className='pt-4' style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th>Locations - {selectedUldFfm.locations.length}</th>
                                            <th>Pieces - {selectedUldFfm.locatedCount}</th>
                                            <th>House</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            selectedUldFfm.locations.map((d, i) =>
                                                <tr key={i}>
                                                    <td>{d.s_location}</td>
                                                    <td>{d.i_pieces}</td>
                                                    <td>{d.s_hawb}</td>
                                                </tr> 
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </Row>
                        </Col>
                        <Col md={7} className={'pl-5'}>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>House - {Object.keys(selectedUldFfm.fhlsMap).length}</Label>
                                        <Input type={'select'} onChange={(e: any) => handleSelectHawb(e.target.value)}>
                                            <option value={0}></option>
                                            {
                                                Object.keys(selectedUldFfm.fhlsMap).map((fhl, i) => (
                                                    <option 
                                                        key={`${i}-${fhl}`}
                                                        value={JSON.stringify({ s_hawb: fhl, i_pieces: selectedUldFfm.fhlsMap[fhl] })}
                                                    >
                                                        {fhl} - {selectedUldFfm.fhlsMap[fhl]} Pcs
                                                    </option>
                                                ))
                                            }
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Pieces:</Label>
                                        <Input type='number' value={selectedHawb.i_pieces} onChange={(e: any) => setHousePieces(Number(e.target.value))} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className={classNames({ 'customDisabled': enableSpecialLocation })}>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Tower:</Label>
                                        <Input type={'select'} value={selectedTower} onChange={(e: any) => setSelectedTower(e.target.value)}>
                                            <option value={''}></option>
                                            {
                                                Object.keys(schema).map((tower, i) => (
                                                    <Option value={tower} key={i} />
                                                ))
                                            }
                                        </Input>                        
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Level:</Label>
                                        <Input type={'select'} value={selectedLevel} onChange={(e: any) => setSelectedLevel(e.target.value)}>
                                            <option value={''}></option>
                                            {
                                                Object.keys(levelsMap).map((level, i) => (
                                                    <Option value={level} key={i} />
                                                ))
                                            }
                                        </Input>                        
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Location:</Label>
                                        <Input type={'select'} value={selectedPosition} onChange={(e: any) => setSelectedPosition(e.target.value)}>
                                            <option value={''}></option>
                                            {
                                                Object.keys(positionsMap).map((position, i) => (
                                                    <Option value={position} key={i} />
                                                ))
                                            }
                                        </Input>                        
                                    </FormGroup>
                                </Col> 
                            </Row>
                            <Row className={'mb-2'}>
                                <Col md={6}>
                                    <Input type='checkbox' onChange={(e: any) => setEnableSpecialLocation(e.target.checked)} className='mx-2' style={{position: 'relative', top: '3px'}} />
                                    <Label>Special Location</Label>
                                </Col>
                                <Col md={6} className={classNames({ 'customDisabled': !enableSpecialLocation })}>
                                    <Input type={'select'} value={specialLocationSelected} onChange={(e: any) => setSpecialLocationSelected(e.target.value)}>
                                        <option value={''}></option>
                                        {
                                            Object.keys(specialLocations).map((specialLocation, i) => (
                                                <Option value={specialLocation} key={i} />
                                            ))
                                        }
                                    </Input>
                                </Col>
                            </Row>
                            <Row className={'mb-3'}>
                                <Col md={6}>
                                    <Label>Comat</Label>
                                </Col>
                                <Col md={6}>
                                    <Input type={'select'} value={b_comat} onChange={(e: any) => set_b_comat(JSON.parse(e.target.value))}>
                                        <option value={'false'}>No</option>
                                        <option value={'true'}>Yes</option>
                                    </Input>
                                </Col>
                            </Row>
                            <Row className={'mb-3'}>
                                <Col md={6}>
                                    <Label>Location {enableSpecialLocation ? specialLocationSelected : completeLocation}</Label>
                                </Col>
                                {
                                    enableLocate && 
                                    <Col md={6} className={`${locationAvailable ? 'bg-success' : 'bg-danger'}`}>
                                        <Label className='text-center py-3 text-white' style={{fontWeight: 'bold', height: '52px'}}>
                                            {locationAvailable ? 'Open' : 'Occupied'}
                                        </Label>
                                    </Col>
                                }
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Notes</Label>
                                        <Input type={'textarea'} value={s_notes} onChange={(e: any) => set_s_notes(e.target.value)} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <i 
                        className={classNames("far fa-save text-primary hover-pointer text-large", { customDisabled: !enableLocate })} 
                        onClick={() => locateInRack()}
                        data-tip={'Save'}
                    ></i>
                </ModalFooter>
            </Modal>  
        );  
    } else {
        return null;
    }
}

export default ModalLocate;