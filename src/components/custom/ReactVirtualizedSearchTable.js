import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

import moment from 'moment';
import Loader from 'react-loader-spinner';
import 'react-virtualized/styles.css';
import { Column, Table, List, CellMeasurer, CellMeasurerCache, AutoSizer } from 'react-virtualized'
import VirtualTable from './VirtualTable';
import {Row, Col} from 'reactstrap';

const ReactVirtualizedSearchTable = ({
    toggleView,
    data,
    filterField,
    handleInput,
    searchLabel,
    displayFields,
    tableWidth,
    tableHeight,
    customClickHandler
}) => {

    const [filterBy, setFilterBy] = useState('');  
    const [filteredData, setFilteredData] = useState([]);  
    const [selectedRecord, setSelectRecord] = useState(null);

    useEffect(() => {
        const filtered = data.filter(d => d[filterField].toUpperCase().includes(filterBy.toUpperCase()));
        console.log(filtered);
        setFilteredData(filtered);
    }, [filterBy]);

    return (
        <div>
            <Row className='row mb-2'>
                <div className='col-12'>
                    {
                        data && data.length > 0 && 
                        <h5>
                            Displaying {data.length} records from {moment(data[data.length - 1].t_created).format('MM/DD/YYYY HH:mm:ss')} to {moment(data[0].t_created).format('MM/DD/YYYY HH:mm:ss')} 
                        </h5>
                    }
                </div>
            </Row>
            <Row className='row mb-2 pl-3'>
                <div style={{display: 'inline'}}>
                    {searchLabel}
                </div>
                <div className='pl-3'>
                    <input value={filterBy} style={{width: '250px'}} onChange={(e) => setFilterBy(e.target.value)} />
                </div>
            </Row>
            <Row>
                <Col md={12}>
                {
                    filterBy.length > 0 && filteredData.length > 0 ? 
                    <VirtualTable 
                        data={filteredData}
                        displayFields={displayFields}
                        selectedRecord={selectedRecord}
                        setSelectRecord={setSelectRecord}
                        tableWidth={tableWidth}
                        tableHeight={tableHeight}
                        customClickHandler={customClickHandler}
                    /> :
                    filterBy.length > 0 && filteredData.length === 0 ?
                    <h4>No Results Found</h4> :
                    filterBy.length === 0 ?
                    <VirtualTable 
                        data={data}
                        displayFields={displayFields}
                        selectedRecord={selectedRecord}
                        setSelectRecord={setSelectRecord}
                        tableWidth={tableWidth}
                        tableHeight={tableHeight}
                        customClickHandler={customClickHandler}
                    /> :
                    <div className='d-flex justify-content-center align-items-center' style={{marginTop: '200px'}}>
                        <Loader type="ThreeDots" color="lightblue" className='loader-search' />
                    </div>
                }
                </Col>
            </Row>
        </div>
    );
}

export default ReactVirtualizedSearchTable;