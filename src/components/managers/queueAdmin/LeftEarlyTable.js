import React from 'react';
import LeftEarlyCard from './LeftEarlyCard';

import ReactTable from '../../custom/ReactTable';

const LeftEarlyTable = ({leftEarlyItems, setCompanyToRestore, width}) => {
    return(
        <div>
            <ReactTable 
                data={leftEarlyItems}
                mapping={[{
                    name: 'MAWB',
                    value: 's_mawb',
                    s_mawb: true
                }, {
                    name: 'TYPE',
                    value: 's_type'
                }, {
                    name: 'Company Name',
                    value: 's_trucking_company'
                }, {
                    name: 'Trucking Driver',
                    value: 's_trucking_driver'
                }, {
                    name: 'Status',
                    value: 's_status'
                }, {
                    name: 'Modified by',
                    value: 's_modified_by',
                    email: true
                }, {
                    name: 'Modified date',
                    value: 't_modified',
                    datetime: true,
                    utc: true
                }]}
                index
                enableClick
                handleClick={(item) => setCompanyToRestore(item)}
            />
        </div>
    );
}

export default LeftEarlyTable;