import React from 'react';
import moment from 'moment';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import { Row, Table, Col } from 'reactstrap';

const StatsTable = ({
    stats,
    filteredStats,
    displayFilteredStats,
    selectedStatId,
    selectStatId,
    getTableMapping,
    validate
}) => {

    const determineTableToRender = () => {
        const table = displayFilteredStats && displayFilteredStats ? filteredStats : stats;
        console.log(filteredStats);
        return table;
    }

    return (    
        <Row>
            <Col md='12' lg='12'>
                <Table className='mb-0' style={{tableLayout: 'fixed'}}>
                    <thead>
                        <tr className='bg-primary'>
                            {
                                getTableMapping && getTableMapping().names.map((n, i) => 
                                    <th key={i} className='px-2'>{n}</th>
                                )
                            }
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </Table>
                <div style={{height: '280px', overflowY: 'scroll'}}>
                    <Table className='table-row-hover' style={{tableLayout: 'fixed'}}>
                        <thead>

                        </thead>
                        <tbody>
                            {
                                stats && determineTableToRender().map((s, i) => 
                                    <tr onClick={() => selectStatId(s.i_id, validate)} key={i} className={`${selectedStatId === s.i_id ? 'table-row-selected': ''}`}>
                                        {
                                            getTableMapping && getTableMapping().values.map((v, i) => 
                                                <td key={i} className='px-2'>
                                                    {
                                                        v === 'd_flight' ? 
                                                        moment.utc(s[v]).format('MM/DD/YYYY') : 
                                                        v === 'b_validated' ? 
                                                        <i style={{fontSize: '20px'}} className={`pl-5 far ${s[v] ? 'fa-check-square text-success' : 'fa-square text-danger'}`}></i> : 
                                                        s[v]
                                                    }
                                                </td>
                                            )
                                        }
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </div>
            </Col>
        </Row>
    );
}

export default StatsTable;