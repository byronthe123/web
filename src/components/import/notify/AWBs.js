import React, { useMemo, useState } from 'react';
import { Row, Col, Input, Button } from 'reactstrap';
import VirtualTable from '../../custom/VirtualTable';
import Switch from 'rc-switch';

export default ({
    selectedFlight,
    lastFreeDate,
    setLastFreeDate,
    goDate,
    setGoDate,
    handleSelectAwb,
    launchModalProcessedExempt,
    multipleMode,
    setMultipleMode,
    selectedMap,
    manageSelectedMap,
    refresh,
    onClickNext
}) => {

    const mapping = [
        {
            name: 'Selected',
            value: 'fas fa-check',
            icon: true,
            showCondition: (item) => multipleMode && selectedMap[item.s_mawb]
        },
        {
            name: 'Notified',
            value: 'notification_id',
            boolean: true,
            customWidth: 75
        },
        {
            name: 'Delivered',
            value: 'processedCount',
            customWidth: 75
        },
        {
            name: 'AWB',
            value: 's_mawb',
            s_mawb: true
        },
        {
            name: 'PCs',
            value: 'i_actual_piece_count',
            customWidth: 75
        }, 
        {
            name: 'WGT',
            value: 'f_weight',
            decimal: true,
            customWidth: 75
        },
        {
            name: 'Commodity',
            value: 's_commodity'
        },
        {
            id: 'Consignee',
            name: 'Consignee',
            value: 's_consignee_name1'
        },
        {
            id: 'Destination',
            name: 'Destination',
            value: 's_destination',
            customWidth: 75
        },
        {
            name: 'Actions',
            value: 'fas fa-edit text-success',
            icon: true,
            function: (item) => launchModalProcessedExempt(item),
            customWidth: 75
        }
    ];

    const handleSelect = (awb) => {
        handleSelectAwb(awb);
        if (multipleMode) {
            manageSelectedMap(awb);
        }
    }

    const awbs = useMemo(() => {
        return selectedFlight.uniqueFlightAwbs.sort((a, b) => (a.s_consignee_name1 || '').localeCompare(b.s_consignee_name1 || ''));
    }, [selectedFlight.uniqueFlightAwbs]);

    const numRows = Math.max(selectedFlight.uniqueFlightAwbs.length, 10);

    return (
        <Row>
            <Col md={12}>
                <Row>
                    <Col md={12}>
                        <h4>Notification for Flight {selectedFlight.s_flight_id}</h4>
                    </Col>
                </Row>
                <Row className='mt-1'>
                    <Col md={12}>
                        <div className='d-inline mr-4'>
                            <h4 className='d-inline mr-2'>Last free day this flight:</h4>
                            <Input className='d-inline' type='date' value={lastFreeDate} onChange={(e) => setLastFreeDate(e.target.value)} style={{ width: '200px', fontSize: '16px' }} />
                        </div>
                        <div className='d-inline'>
                            <h4 className='d-inline mr-2'>GO Date is: </h4>
                            <Input className='d-inline' type='date' value={goDate} onChange={(e) => setGoDate(e.target.value)} style={{ width: '200px', fontSize: '16px' }} />
                        </div>
                        <h4 className={'d-inline ml-3'}>
                            Select type ({ multipleMode ? 'Multiple' : 'Single' })  <Switch checked={multipleMode} onClick={() => setMultipleMode(mode => !mode)} /> then select AWB(s) to continue
                        </h4>
                        {
                            multipleMode && 
                            <h4 className={'d-inline ml-3'}>
                                AWBs: {Object.keys(selectedMap).length}/40
                            </h4>
                        }
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col md={12}>
                        <VirtualTable 
                            data={awbs}
                            mapping={mapping}
                            index={true}
                            customPagination={false}
                            locked={true}
                            enableClick={true}
                            handleClick={handleSelect}
                            key={refresh}
                            wizardNext={true}
                            onClickNext={onClickNext}
                            customHeight={'calc(100vh - 425px)'}
                            noPagination={true}
                            numRows={numRows}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}