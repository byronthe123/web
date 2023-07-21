import React from 'react';
import moment from 'moment';
import {Row, Col} from 'reactstrap';
import ReactTable from '../../custom/ReactTable';

const ExportTable = ({
    exportAwbs,
    selectAwb
}) => {
    return (
        <Row className='mt-3 mx-1'>
            <Col lg='12' md='12'>
                <Row>
                    <h4>Accepted AWBs:</h4>
                </Row>
                <Row>
                    <Col md={12}>
                        <ReactTable 
                            data={exportAwbs}
                            mapping={[
                                {
                                    name: 'AWB',
                                    value: 's_mawb',
                                    s_mawb: true
                                },
                                {
                                    name: 'HAWB',
                                    value: 's_hawb'
                                },
                                {
                                    name: 'Modified',
                                    value: 't_modified',
                                    datetime: true,
                                    utc: true
                                }
                            ]}
                            enableClick={true}
                            handleClick={(item) => selectAwb(item)}
                            numRows={10}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default ExportTable;