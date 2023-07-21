import React, { useState, useEffect, useRef, useMemo  } from 'react';
import { Label, Input } from 'reactstrap';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import fileDownload from 'js-file-download';
import _ from 'lodash';
import { Row, Col, Card, CardBody } from 'reactstrap';

import ReactTable from '../../custom/ReactTable';
import { notify } from '../../../utils';

const Search = ({
    rackItems,
    handleAddUpdate,
    locationsMap,
    user
}) => {

    const [earliestDate, setEarliestDate] = useState('');
    const [latestDate, setLatestDate] = useState('');
    const [filterDuplicates, setFilterDuplicates] = useState(false);
    const [duplicateItems, setDuplicateItems] = useState([]);
    const [filterTransfers, setFilterTransfers] = useState(false);

    useEffect(() => {
        if (rackItems.length > 0) {
            setEarliestDate(moment.utc(rackItems[0].t_modified).format('MM/DD/YYYY HH:mm:ss'));
            setLatestDate(moment.utc(rackItems[rackItems.length - 1].t_modified).format('MM/DD/YYYY HH:mm:ss'));    
        }
    }, [rackItems]);

    const filterDuplicateItems = (rackItems, locationsMap) => {
        const duplicates = [];
        for (let i = 0; i < rackItems.length; i++) {
            const { s_location } = rackItems[i];
            if (_.get(locationsMap[s_location], 'numLocated', 0) >= 2) {
                duplicates.push(rackItems[i]);
            }
        }
        return duplicates;
    }

    useEffect(() => {
        setDuplicateItems(filterDuplicateItems(rackItems, locationsMap));
    }, [rackItems, locationsMap]);

    const transfers = useMemo(() => {
        const transfers = [];
        for (const item of rackItems) {
            if (item.s_destination !== user.s_unit.substring(1, 4)) {
                transfers.push(item);
            }
        }
        return transfers;
    }, [rackItems, user.s_unit]);

    const mapping = [
        {
            name: 'Location',
            value: 's_location'
        },
        {
            name: 'MAWB',
            value: 's_mawb',
            s_mawb: true
        },
        {
            name: 'HAWB',
            value: 's_hawb'
        },
        {
            name: 'Pieces',
            value: 'i_pieces'
        },
        {
            name: 'Dest.',
            value: 's_destination'
        },
        {
            name: 'Comat',
            value: 'b_comat',
            boolean: true
        },
        {
            name: 'USDA',
            value: 'b_usda_hold',
            boolean: true,
            labelTrue: 'HOLD',
            labelFalse: 'CLEAR'
        },
        {
            name: 'Customs',
            value: 'b_customs_hold',
            boolean: true,
            labelTrue: 'HOLD',
            labelFalse: 'CLEAR'
        },
        {
            name: 'CHOICE',
            value: 'b_hold',
            boolean: true,
            labelTrue: 'HOLD',
            labelFalse: 'CLEAR'
        },
        {
            name: 'GO',
            value: 'b_general_order',
            boolean: true
        },
        {
            name: 'Last Modified',
            value: 's_modified_by',
            email: true
        },
        {
            name: 'Storage Length',
            value: 'ic_duration_created'
        }
    ];

    const reactTableRef = useRef();

    const downloadData = () => {
        const Json2csvParser = require('json2csv').Parser;
        const raw = reactTableRef.current.getResolvedState().sortedData;
        const map = {
            s_mawb: true,
            s_hawb: true,
            s_location: true,
            i_pieces: true,
            s_special_hanlding_code: true,
            s_flight_uld: true,
            s_flight_id: true,
            ic_duration_created: true,
            s_destination: true
        }
        if (raw.length > 0) {
            const data = raw.map(record => {
                const object = {};
                for (let key in map) {
                    const value = record._original[key]
                    object[key] = value;
                    if (key === 's_special_hanlding_code' && value !== null) {
                        const replaced = value.replace(/[,\s]/g, '');
                        if (replaced.length === 0) {
                            object[key] = '';
                        }
                    }
                }
                return object;
            });
            const jsonData = JSON.parse(JSON.stringify(data));
            const parser = new Json2csvParser({ excelStrings: true, withBOM: true });
            const csv = parser.parse(jsonData);
            fileDownload(csv, 'Rack Data.csv');
        } else {
            notify('No data to download', 'warn');
        }
    }
    
    return (
        <Row>
            <Col md='12' lg='12' className='px-4'>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-3' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row>
                            <Col md='12' lg='12'>
                                <div className={'float-left'}>
                                    <h4 className={'d-inline'}>Showing {rackItems.length} records from {earliestDate} to {latestDate}.</h4>
                                    <div className={'d-inline ml-4 pl-5'}>
                                        <Input 
                                            type={'checkbox'} 
                                            checked={filterDuplicates} 
                                            onClick={() => setFilterDuplicates(!filterDuplicates)} 
                                            className={'d-inline'}
                                        />
                                        <h4 className={'d-inline'}>Filter Duplicates</h4>
                                    </div>
                                    <div className={'d-inline ml-4 pl-5'}>
                                        <Input 
                                            type={'checkbox'} 
                                            checked={filterTransfers} 
                                            onClick={() => setFilterTransfers(prev => !prev)} 
                                            className={'d-inline'}
                                        />
                                        <h4 className={'d-inline'}>Transfers</h4>
                                    </div>
                                </div>
                                <i 
                                    class="fas fa-file-download float-right text-large text-primary hover-pointer"
                                    data-tip={'Download Data'}
                                    onClick={() => downloadData()}
                                ></i>
                            </Col>
                        </Row>
                        <Row className='mt-4 mb-0' style={{fontWeight: 'bold', fontSize: '20px'}}>
                            <Col md='12' lg='12'>
                                <ReactTable
                                    data={filterDuplicates ? duplicateItems : filterTransfers ? transfers : rackItems}
                                    mapping={mapping}
                                    index={true}
                                    numRows={20}
                                    customPagination={true}
                                    enableClick={true}
                                    handleClick={(item) => handleAddUpdate(false, item)}
                                    reactTableRef={reactTableRef}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}

export default withRouter(Search);