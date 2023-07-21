import React from 'react';
import moment from 'moment';

const ReportsRow = ({report, selectReport, selectedReportId}) => {
    return (
        <tr onClick={() => selectReport(report.i_id)}>
            {console.log(selectedReportId === report.i_id)}
            {console.log(`${selectedReportId} === ${report.i_id}`)}
            <th><i className={selectedReportId === report.i_id ? "fas fa-circle" : "far fa-circle"}></i></th>
            <th scope="row">{report.i_id}</th>
            <th>{report.s_created_by}</th>
            <th>{moment(report.t_created).format('MM/DD/YYYY hh:mm A')}</th>
            <th>{report.s_modified_by}</th>
            <th>{moment(report.t_modified).format('MM/DD/YYYY hh:mm A')}</th>
            <th>{report.s_incident_reference}</th>
            <th>{moment(report.t_incident).format('MM/DD/YYYY')}</th>
            <th>{report.s_station}</th>
            <th>{report.s_investigation_conducted_by}</th>
            <th>{report.s_investigation_approved_by}</th>
        </tr>
    );
}

export default ReportsRow;