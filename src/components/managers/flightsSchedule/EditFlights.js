import React, { useEffect, useState } from 'react';
import { ButtonGroup, Button, Card, CardBody, Row, Col  } from "reactstrap";
import ReactTable from '../../custom/ReactTable';

import { api, asyncHandler } from '../../../utils';

const EditFlights = ({
    createSuccessNotification,
    handleEdit,
    handleCreateNewItem,
    manager,
    filterTypes,
    displayData,
    setDisplayData,
    selectedFilterId,
    filterDate,
    setFilterDate,
    selectedDateFilterId,
    selectedStatusFilterId,
    selectedTypeFilterId,
    selectedAirlineCodeFilter, 
    setSelectedAirlineCodeFilter,
    airlineCodes
}) => {

    const [selectedFlights, setSelectedFlights] = useState({});
    const [key, setKey] = useState(0);
    const tableMapping = [
        {
            value: 'id',
            name: 'ID',
            exclude: true
        },
        {
            value: 's_unit',
            name: 'Unit'
        },
        {
            value: 's_status',
            name: 'Status'
        },
        {
            value: 's_flight_type',
            name: 'Flight Type'
        },
        {
            value: 's_airline_name',
            name: 'Name',
            exclude: true
        },
        {
            value: 's_airline_code',
            name: 'Code',
            smallWidth: true
        },
        {
            value: 's_flight_number',
            name: 'FLT Number',
            mediumWidth: true
        },
        {
            value: 's_aircraft',
            name: 'Aircraft',
            mediumWidth: true
        }, 
        {
            value: 's_aircraft_type',
            name: 'Type',
            smallWidth: true
        },
        {
            value: 's_origin_airport',
            name: 'Origin',
            smallWidth: true
        },
        {
            value: 's_destination_airport',
            name: 'Dest.',
            smallWidth: true
        },
        {
            value: 't_estimated_departure',
            name: 'EST Dept.',
            datetime: true,
            utc: true
        },
        {
            value: 't_estimated_arrival',
            name: 'EST Arrival',
            datetime: true,
            utc: true
        },
        {
            value: 't_actual_departure',
            name: 'Actual Dept.',
            datetime: true,
            utc: true
        },
        {
            value: 't_actual_arrival',
            name: 'Actual Arrival',
            datetime: true,
            utc: true
        },
        {
            value: 't_cut_off_time',
            name: 'Cut-off datetime',
            datetime: true,
            exclude: true
        },
        {
            value: 't_uws_time',
            name: 'UWS datetime',
            datetime: true,
            exclude: true
        },
        {
            value: 't_sla_breakdown',
            name: 'SLA Breakdown',
            datetime: true,
            exclude: true
        },
        {
            value: 's_notes',
            name: 'Notes',
            mediumWidth: true
        },
        {
            name: 'Select',
            selectable: true,
            value: 'fad fa-check-circle text-success',
            valueOther: 'fad fa-check-circle',
            icon: true,
            function: item => handleSelectFlight(item),
            showCondition: item => selectedFlights[item.id] === true
        },
        {
            name: 'Edit',
            value: 'fas fa-edit',
            icon: true,
            function: item => handleEdit(item)
        }
    ]

    const resolveTableMapping = (tableMapping) => {
        if (manager) {
            return tableMapping;
        }
        const nonManagerExclude = ['s_aircraft_type', 't_cut_off_time', 't_uws_time', 't_sla_breakdown'];
        const nonManagerMapping = tableMapping.filter(m => nonManagerExclude.indexOf(m.value) === -1)
        return nonManagerMapping;
    }

    const handleSelectFlight = (flight) => {
        setSelectedFlights(prevState => {
            const copy = Object.assign({}, prevState);

            if (copy[flight.id] === undefined) {
                copy[flight.id] = true;
            } else {
                delete copy[flight.id];
            }

            return copy;
        });
    }

    const deleteMultipleFlightSchedules = asyncHandler(async() => {
        let ids = '';
        for (let key in selectedFlights) {
            ids += `${key},`
        }
        ids = ids.substr(0, ids.length - 1);
        await api('put', 'deleteMultipleFlightSchedules', { ids });

        const updated = displayData.filter(d => selectedFlights[d.id] === undefined);
        setDisplayData(updated);
        setSelectedFlights({});
        setKey(key + 1);
        createSuccessNotification('Flights Deleted');
    });    

    return (
        <Row>

            <Col md={12} className='mb-3'>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row>
                            <Col md={12}>
                                <h4>Filter</h4>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={12}>
                                <h6>By Date</h6>
                                <ButtonGroup style={{display: 'inline-block'}}>
                                    {
                                        filterTypes.map((t, i) => t.type === 'date' && 
                                            <Button active={t.id === selectedDateFilterId} key={i} onClick={() => t.function(true)}>{t.name}</Button>
                                        )
                                    }
                                </ButtonGroup>
                                {
                                    selectedDateFilterId >= 6 &&  selectedDateFilterId <= 7 &&
                                    <input className='ml-3' style={{display: 'inline-block'}} type='date' value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                                }
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={12}>
                                <h6>By Type</h6>
                                <ButtonGroup style={{display: 'inline-block'}}>
                                    {
                                        filterTypes.map((t, i) => t.type === 'type' && 
                                            <Button active={t.id === selectedTypeFilterId} key={i} onClick={() => t.function()}>{t.name}</Button>
                                        )
                                    }
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <h6>By Status</h6>
                                <ButtonGroup style={{display: 'inline-block'}}>
                                    {
                                        filterTypes.map((t, i) => t.type === 'status' && 
                                            <Button active={t.id === selectedStatusFilterId} key={i} onClick={() => t.function()}>{t.name}</Button>
                                        )
                                    }
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} className='mt-2'>
                                <h6 style={{display: 'inline-block'}} className='mr-2'>By Airline Codes</h6>
                                <select style={{display: 'inline-block'}} value={selectedAirlineCodeFilter} onChange={(e) => setSelectedAirlineCodeFilter(e.target.value)}>
                                    {
                                        airlineCodes.map((c, i) => 
                                            <option key={i} value={c}>{c}</option>
                                        )
                                    }
                                </select>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>

            <Col md={12}>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-2' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        {
                            manager && 
                            <Row>
                                <Col md={12}>
                                    <Button className='ml-2 mb-2 float-left' onClick={() => handleCreateNewItem()}>New</Button>
                                    <Button 
                                        className={'float-right'} 
                                        color={'danger'} 
                                        onClick={() => deleteMultipleFlightSchedules()}
                                        disabled={Object.keys(selectedFlights).length < 1}
                                    >
                                        Delete
                                    </Button>
                                </Col>
                            </Row> 
                        }
                        <ReactTable 
                            data={displayData}
                            mapping={resolveTableMapping(tableMapping)}
                            index={true}
                            // enableClick={true}
                            // handleClick={(item) => handleSelectFlight(item)}
                            customPagination={true}
                            selectedIds={selectedFlights}
                        />
                    </CardBody>
                </Card>
            </Col>

        </Row>
    );
}

export default EditFlights;