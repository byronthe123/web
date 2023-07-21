import React, {Fragment} from 'react';
import { Table } from 'reactstrap';

import ReportsRow from './ReportsRow';

const ReportsTable = ({reports, selectReport, selectedReportId}) => {
    return(
        <Fragment>
            <Table hover striped>
                <thead>
                    <tr>
                        <th>Selected</th>
                        <th>#</th>
                        <th>Created by: </th>
                        <th>Created date: </th>
                        <th>Modified by:</th>
                        <th>Modified Date:</th>
                        <th>Incident reference: </th>
                        <th>Incident date date: </th>
                        <th>Station: </th>
                        <th>Investigated by: </th>
                        <th>Approved by: </th>
                    </tr>
                </thead>
                <tbody>
                    {reports && reports.map((r, i) => <ReportsRow report={r} key={i} selectReport={selectReport} selectedReportId={selectedReportId} id={r.i_id} onClick={(e) => selectReport(e)} /> )}
                </tbody>
                </Table>
        </Fragment>
    );
}

export default ReportsTable;