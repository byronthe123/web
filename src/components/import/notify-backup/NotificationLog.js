import React from 'react';

import moment from 'moment';
import Loader from 'react-loader-spinner';
import 'react-virtualized/styles.css';
import { Column, Table } from 'react-virtualized'

const NotificationLog = ({
    toggleView,
    notificationLogs,
    filteredLogs,
    filterNotificationLogsBy,
    handleInput,
    setSelectedNotificationRecord,
    selectedNotificationRecord,
    handleSearch
}) => {

    return (
        <div>
            <div className='row mb-2'>
                <div className='col-12'>
                    {
                        notificationLogs && notificationLogs.length > 0 && 
                        <h5>
                            Displaying {notificationLogs.length} records from {moment(notificationLogs[notificationLogs.length - 1].t_created).format('MM/DD/YYYY HH:mm:ss')} to {moment(notificationLogs[0].t_created).format('MM/DD/YYYY HH:mm:ss')} 
                        </h5>
                    }
                </div>
            </div>
            <div className='row mb-2'>
                <div className='col-1 pr-0'>
                    AWB Search
                </div>
                <div className='col-2 pl-0'>
                    <input style={{width: '100%'}} id={'filterNotificationLogsBy'} value={filterNotificationLogsBy} onChange={(e) => handleSearch(e)} />
                </div>
            </div>
            {
                notificationLogs && notificationLogs.length > 0 ?
                <Table
                    width={1600}
                    height={610}
                    headerHeight={40}
                    rowHeight={40}
                    rowCount={filterNotificationLogsBy.length > 0 ? filteredLogs && filteredLogs.length : notificationLogs && notificationLogs.length}
                    rowGetter={({ index }) => filterNotificationLogsBy.length > 0 ? filteredLogs && filteredLogs[index] : notificationLogs && notificationLogs[index]}
                    rowClassName={({ index, rowData }) => rowData && rowData.id.toString() === selectedNotificationRecord && selectedNotificationRecord.id.toString() ? 'table-row-selected' : index < 0 ? 'head-row' : index % 2 === 0 ? '' : 'odd-row'}
                    onRowClick={({rowData}) => setSelectedNotificationRecord(rowData.id)}
                >
                    <Column
                        label="#"
                        cellRenderer={({rowIndex}) => rowIndex+1}
                        dataKey="index"
                        width={60}
                        //index % 2 === 0 ? styles.evenRow : styles.oddRow
                    />
                    <Column
                        label='Created'
                        cellDataGetter={({rowData}) => moment(rowData.t_created).format('MM/DD/YYYY HH:mm:ss')}
                        width={180}
                    />
                    <Column
                        width={140}
                        label='Created By'
                        cellDataGetter={({rowData}) => rowData.s_created_by.toUpperCase().replace('@CHOICE.AERO', '')}
                    />
                    <Column
                        width={140}
                        label='MAWB'
                        dataKey='s_mawb'
                    />
                    <Column
                        width={160}
                        label='Airline'
                        dataKey='s_airline'
                    />
                    <Column
                        width={200}
                        label='Flight ID'
                        dataKey='s_flight_id'
                    />
                    <Column
                        width={100}
                        label='Type'
                        dataKey='s_notification_type'
                    />
                    <Column
                        width={200}
                        label='Emails To'
                        dataKey='s_emails_to'
                    />
                    <Column
                        width={155}
                        label='Number called'
                        dataKey='s_number_called'
                    />
                    <Column
                        width={100}
                        label='Caller'
                        dataKey='s_caller'
                    />
                    <Column
                        width={80}
                        label='Notes'
                        dataKey='s_notes'
                    />
                </Table>
                 :
                <div className='d-flex justify-content-center align-items-center' style={{marginTop: '200px'}}>
                    <Loader type="ThreeDots" color="lightblue" className='loader-search' />
                </div>
            }

        </div>
    );
}

export default NotificationLog;