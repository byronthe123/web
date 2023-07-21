import _ from 'lodash';
import React, { useMemo } from 'react';
import { Input } from 'reactstrap';
import { Modal, ModalBody, Row, Col, Button } from 'reactstrap';
import { IRack } from '../../../globals/interfaces';
import { IAwbRackDataMap, IDockAwb, PrevNextAwbType, DockNextAwbStatusTypes } from './interfaces';

interface Props {
    modal: boolean;
    toggle: () => void;
    selectedAwb: IDockAwb;
    rackDataMap: IAwbRackDataMap;
    selectedLocation: IRack;
    setSelectedLocation: (location: IRack) => void;
    setModalSplit: (state: boolean) => void;
    deliverRackPieces: (id: number, b_delivered: boolean) => Promise<void>;
    dockNextAwb: (s_status: DockNextAwbStatusTypes) => Promise<void>;
    prevNextAwb: (type: PrevNextAwbType) => void
}

export default function ModalLocations({
    modal,
    toggle,
    selectedAwb,
    rackDataMap,
    selectedLocation,
    setSelectedLocation,
    setModalSplit,
    deliverRackPieces,
    dockNextAwb,
    prevNextAwb
}: Props) {

    const sortedLocations = useMemo(() => {
        const rackData = _.get(rackDataMap[selectedAwb.s_mawb], 'rackData', []);
        console.log(rackData);
        return rackData.sort(
            (a, b) => Number(a.b_delivered) - Number(b.b_delivered)
        );
    }, [selectedAwb, rackDataMap]);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalBody className={'py-2'}>
                <Row>
                    <Col md={12}>
                        <i
                            className="fa-solid fa-left mr-2 d-inline text-success"
                            onClick={toggle}
                            style={{ fontSize: '40px' }}
                        ></i>
                        <h2 className={'d-inline'}>
                            Pcs: {_.get(rackDataMap[selectedAwb.s_mawb], 'rackPieces', '')}
                        </h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={8} className={'text-center'}>
                        <h6>Locations</h6>
                        <Row style={{ height: '450px', overflowY: 'scroll' }}>
                            <Col md={12} className={`${selectedAwb.s_status === 'DOCK PROCESSED' && 'custom-disabled'}`}>
                                {sortedLocations.map((item, i) => (
                                    <Row
                                        style={{
                                            borderRadius: '0.75rem',
                                            backgroundColor: '#cccccc',
                                            border:
                                                selectedLocation.id === item.id
                                                    ? '2px solid red'
                                                    : '',
                                        }}
                                        className={'mb-2'}
                                        onClick={() =>
                                            setSelectedLocation(item)
                                        }
                                        key={i}
                                    >
                                        <Col md={4}>
                                            <h1 className="mt-3 font-weight-bold">
                                                {item.s_location}
                                            </h1>
                                        </Col>
                                        <Col md={6}>
                                            <h4 className="mt-2">
                                                Pieces: {item.i_pieces}
                                            </h4>
                                            <h6>ULD: {item.s_flight_uld}</h6>
                                        </Col>
                                        <Col md={2}>
                                            <Input
                                                type={'checkbox'}
                                                checked={item.b_delivered}
                                                style={{
                                                    transform: 'scale(3)',
                                                }}
                                                className="mt-4"
                                                onClick={() =>
                                                    deliverRackPieces(
                                                        item.id,
                                                        !item.b_delivered
                                                    )
                                                }
                                            />
                                        </Col>
                                    </Row>
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4}>
                        <button
                            className={
                                'extra-large-button-text btn btn-grey full-width mb-2 py-4'
                            }
                        >
                            Damaged Goods
                        </button>
                        <button
                            className={
                                'extra-large-button-text btn btn-grey full-width mb-2 py-4'
                            }
                            // onClick={() => setSelectedLocation()}
                        >
                            Short
                        </button>
                        <button
                            className={`extra-large-button-text btn btn-grey full-width mb-2 py-4 ${
                                (!selectedLocation.s_location ||
                                    Number(selectedLocation.i_pieces) < 2) &&
                                'custom-disabled'
                            }`}
                            onClick={() => setModalSplit(true)}
                        >
                            Split
                        </button>
                        {selectedAwb.s_status === 'DOCK PROCESSED' ? (
                            <button
                                className={
                                    'extra-large-button-text btn btn-warning full-width mb-2 py-4'
                                }
                                onClick={() => dockNextAwb('DOCKING')}
                            >
                                Open AWB
                            </button>
                        ) : (
                            <button
                                className={
                                    'extra-large-button-text btn btn-green full-width mb-2 py-4'
                                }
                                onClick={() => dockNextAwb('DOCK PROCESSED')}
                            >
                                Close AWB
                            </button>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className={'text-center'}>
                        <i 
                            className="fa-solid fa-circle-arrow-left d-inline awb-arrows mr-3"
                            onClick={() => prevNextAwb('PREV')}
                        ></i>
                        <i 
                            className="fa-solid fa-circle-arrow-right d-inline awb-arrows"
                            onClick={() => prevNextAwb('NEXT')}
                        ></i>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    );
}
