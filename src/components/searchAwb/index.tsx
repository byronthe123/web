import React, { useState, useContext, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, Col, Row, Table } from 'reactstrap';
import { AppContext } from '../../context/index';
import _ from 'lodash';
import FHL from './FHL';
import FWB from './FWB';
import FFM from './FFM';
import FSN from './FSN';
import Payments from './Payments';
import Warehouse from './Warehouse';
import Notifications from './Notifications';
import WarehouseCheckIn from './WarehouseCheckIn';
import useBreakpoint from '../../customHooks/useBreakpoint';
import Import from './Import';
import Log from './Log';
import { IMenuItem } from './interfaces';
import useSelections from './useSelections';

import { IMap, IStep } from '../../globals/interfaces';
import { formatMawb } from '../../utils';
import FSU from './FSU';
import BackButton from '../custom/BackButton';
import VisualReporting from './VisualReporting';

type WizardProps = {
    step: IStep
}

export default function SearchAwb () {

    const { searchAwb, user } = useContext(AppContext);
    const {
        modalSearchAwb: modal, 
        setModalSearchAwb: setModal,
        searchAwbNum, 
        setSearchAwbNum,
        searchAwbDataMap,
        additionalSearchAwbData
    } = searchAwb;
    
    const { breakpoint } = useBreakpoint();
    const [map, setMap] = useState<IMap<IMenuItem>>({});
    const [step, setStep] = useState('');
    const [menu, setMenu] = useState<Array<IMenuItem>>([]);

    useEffect(() => {
        setMap(searchAwbDataMap);

        const array: Array<IMenuItem> = [];
        for (let key in searchAwbDataMap) {
            array.push(searchAwbDataMap[key]);
        }
        array.sort((a, b) => Number(b.hasData) - Number(a.hasData));
        setMenu(array);
        if (array.length > 0) {
            setStep(array[0].key);
        }
    }, [searchAwbDataMap]);

    const toggle = () => setModal(!modal);

    const topNavClick = (
        stepItem: { id: string }, 
        push: (id: string) => void
    ) => {
        push(stepItem.id)
    };

    const {
        ffmOptions,
        totalPcs,
        totalWgt,
        origin,
        dest,
        lastArrivalDate,
        lastFreeDate,
        storageStart,
        ffmOption,
        handleSetFfmOption
    } = useSelections(
        // @ts-ignore
        _.get(map, 'ffm.data', [])
    );

    return (
        <Modal isOpen={modal} toggle={toggle} style={{ maxWidth: '85%' , height: '80vh', maxHeight: '100%' }}>
            <ModalHeader>
                <Row>
                    <Col md={1}>
                        <BackButton onClick={() => toggle()} />
                    </Col>
                    <Col md={3}>
                        Master View: {formatMawb(searchAwbNum)}
                    </Col>
                    <Col md={1}>
                        Pieces: {_.get(map, 'fwb.data[0].i_total_pieces', null) || _.get(map, 'ffm.data[0].i_actual_piece_count', '')}
                    </Col>
                    <Col md={1}>
                        Weight: {_.get(map, 'fwb.data[0].f_weight', null) || _.get(map, 'ffm.data[0].f_weight', '')}
                    </Col>
                    <Col md={1}>
                        Origin: {_.get(map, 'fwb.data[0].s_origin', null) || _.get(map, 'ffm.data[0].s_origin', '')}
                    </Col>
                    <Col md={2}>
                        Destination: {_.get(map, 'fwb.data[0].s_destination', null) || _.get(map, 'ffm.data[0].s_destination', '')}
                    </Col>
                    <Col md={3}>
                        Goods: {_.get(map, 'fwb.data[0].s_goods_description', null) || _.get(map, 'ffm.data[0].s_commodity', '')}
                    </Col>
                </Row>
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col md={breakpoint ? 12: 2} style={{ height: 'calc(100vh - 300px)', overflowY: 'scroll' }}>
                        <Table>
                            <thead>

                            </thead>
                            <tbody>
                                {
                                    menu.map((m, i) => (
                                        <tr 
                                            onClick={() => setStep(m.key)} 
                                            className={`text-white ${step === m.key ? 'font-weight-bold bg-success' : (m.hasData || m.key === 'log') ? 'bg-secondary hover-pointer' : 'bg-grey custom-disabled'}`}
                                            key={i}
                                        >
                                            <td>{m.name}</td>
                                            <td style={{ border: '2px solid white' }}>{m.dataCount || m.data.length}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </Col>
                    <Col md={breakpoint ? 12: 10} style={{ height: 'calc(100vh - 300px)', overflowY: 'scroll' }}>
                        {
                            step === 'fwb' ? 
                                <FWB 
                                    data={map.fwb.data}
                                    toggle={toggle}
                                /> :
                            step === 'fhl' ?
                                <FHL 
                                    data={map.fhl.data}
                                    toggle={toggle}
                                /> : 
                            step === 'ffm' ?
                                <FFM 
                                    data={additionalSearchAwbData.allFfms}
                                    toggle={toggle}
                                /> :
                            step === 'payments' ?
                                <Payments 
                                    payments={map.payments.data}
                                    ffms={map.ffm.data}
                                    fhls={map.fhl.data}
                                    minCharges={additionalSearchAwbData.minCharges}
                                    totalWgt={totalWgt}
                                    s_mawb={searchAwbNum}
                                    user={user}
                                /> : 
                            step === 'locations' ? 
                                <Warehouse 
                                    data={map.locations.data}
                                    toggle={toggle}
                                /> :
                            step === 'fsn' ? 
                                <FSN
                                    data={map.fsn.data}
                                /> : 
                            step === 'notifications' ? 
                                <Notifications 
                                    data={map.notifications.data}
                                    toggle={toggle}
                                /> :
                            step === 'warehouse' ? 
                                <WarehouseCheckIn 
                                    data={map.warehouse.data}
                                /> :
                            step === 'import' ? 
                                <Import 
                                    data={map.import.data}
                                /> :
                            step === 'dlv' ?
                                <FSU 
                                    data={map.dlv.data}
                                /> :
                            step === 'log' ? 
                                <Log 
                                    data={map.log.data}
                                    user={user}
                                /> :
                            step === 'visualReporting' ?
                                <VisualReporting 
                                    data={map.visualReporting.data}
                                    user={user}
                                /> :
                            <h1>Work In Progress</h1>
                        }
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    );
}