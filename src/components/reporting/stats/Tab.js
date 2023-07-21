import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'reactstrap';
import ReactTable from '../../custom/ReactTable';
import tableMapping from './tableMapping';
import miscTableMapping from './miscTableMapping';

export default ({
    stats,
    type,
    handleCreateStat,
    handleViewStat
}) => {

    const [data, setData] = useState([]);

    useEffect(() => {
        let useData;
        if (type === 'VALIDATE') {
            useData = stats;
        } else {
            useData = stats.filter(s => s.s_type === type);
        }
        setData(useData);
    }, [stats, type]);

    return (
        <Row>
            <Col md={12}>
                <Button className='mb-2' onClick={() => handleCreateStat(type)}>New</Button>
                <ReactTable 
                    data={data}
                    mapping={type === 'MISC' ? miscTableMapping : tableMapping}
                    index={true}
                    enableClick={true}
                    handleClick={(item) => handleViewStat(item, type)}
                    numRows={10}
                />  
            </Col>
        </Row>
    );
}