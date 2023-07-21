import React, { Fragment, useState, useEffect } from 'react';
import { Row, Col, Button, Table } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';

// import DataTablePagination from "../../components/DatatablePagination";
import DataTablePagination from "../../../DatatablePagination";
//import ReactTable from "react-table";
import ReactTable from '../../../custom/ReactTable';

import { iscMapping } from './iscMapping';
import ModalIsc from './ModalIsc';

const ISC = ({
    baseApiUrl,
    headerAuthCode,
    user,
    eightyWindow,
    createSuccessNotification                         
}) => {

    const [iscData, setIscData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [createNew, setCreateNew] = useState(false);
    const [modalIsc, setModalIsc] = useState(false);

    const selectIscData = () => {
        user && 
        axios.get(`${baseApiUrl}/selectIscData`, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setIscData(response.data);
        }).catch(error => {
            
        }); 
    }

    useEffect(() => {
        selectIscData();
    }, []);

    const handleAddIsc = () => {
        setCreateNew(true);
        setModalIsc(true);
    }

    const selectItem = (item) => {
        setSelectedItem(item);
        setCreateNew(false);
        setModalIsc(true);
    }

    const addUpdateIsc = (values) => {

        const { email } = user;
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        let url;
        let notification;

        if (createNew) {
            values.t_created = now;
            values.s_created_by = email;
            url = 'addIsc';
            notification = 'Record Added';
        } else {
            values.id = selectedItem.id;
            url = 'updateIsc';
            notification = 'Record Updated';
        }        

        values.t_modified = now;
        values.s_modified_by = email;

        const data = values;
        
        axios.post(`${baseApiUrl}/${url}`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setIscData(response.data);
            setModalIsc(false);
            createSuccessNotification(notification);
        }).catch(error => {
            
        }); 
    }

    const deleteIsc = (id) => {
        axios.post(`${baseApiUrl}/deleteIsc`, {
            id
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setIscData(response.data);
            setModalIsc(false);
            createSuccessNotification(`Record Deleted`);
        });
    }

    const formatCost = (cost) => {
        const toFormat = cost && cost !== null && cost > 0 ? parseFloat(cost) : 0;
        return `${toFormat.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    }
    
    const dataTableColumns = [];

    for (let i = 0; i < iscMapping.length; i++) {
        const current = iscMapping[i];
        dataTableColumns.push({
            id: `id${i}`,
            Header: current.name,
            accessor: (d) => current.datetime ? 
                                moment(d[current.value]).format('MM/DD/YYYY HH:mm:ss') : 
                            current.money ? 
                                `$${formatCost(d[current.value])}` : 
                            current.email ? 
                                `${d[current.value].replace('@choice.aero', '')}` :
                            d[current.value],
            style: { textAlign: `${current.money ? 'right' : 'left'}` }
        });
    }

    const filterCaseInsensitive = (filter, row) => {
        const id = filter.pivotId || filter.id;
        if (row[id] !== null && typeof row[id] === 'string') {
            return (
                row[id] !== undefined ?
                    String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase()) : true
            )
        }
        else {
            return (
                String(row[filter.id]) === filter.value
            )
        }
    }

    const onRowClick = (state, rowInfo, column, instance) => {
        return {
            onClick: e => {
                selectItem(rowInfo.original);
                console.log('A Td Element was clicked!')
                console.log('it produced this event:', e)
                console.log('It was in this column:', column)
                console.log('It was in this row:', rowInfo) //rowInfo.original
                console.log('It was in this table instance:', instance)
            }
        }
    }

    return (
        <Fragment>
            <Row className='px-3 pb-2'>
                <h4>Station Profiles</h4>
                <Button className='ml-4' onClick={() => handleAddIsc()}>New</Button>
            </Row>
            <Row>
                <Col md={11} className='mx-auto'>
                    {/* <ReactTable
                        data={iscData}
                        columns={dataTableColumns}
                        defaultPageSize={30}
                        filterable={true}
                        showPageJump={true}
                        PaginationComponent={DataTablePagination}
                        showPageSizeOptions={true}
                        defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
                        getTrProps={onRowClick}
                        className="-striped -highlight"
                    /> */}
                    <ReactTable 
                        data={iscData}
                        mapping={iscMapping}
                        handleClick={selectItem}
                    />
                </Col>
            </Row>
            <ModalIsc 
                open={modalIsc}
                handleModal={setModalIsc}
                item={selectedItem}
                createNew={createNew}
                selectedItem={selectedItem}
                iscMapping={iscMapping}
                iscData={iscData}
                addUpdateIsc={addUpdateIsc}
                deleteIsc={deleteIsc}
            />
        </Fragment>
    );      
}

export default ISC;