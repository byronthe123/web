import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import ReactTable from '../../custom/ReactTable';

export default ({
    externalUsers,
    handleEditUser
}) => {
    return (
        <Row>
            <Col md={12}>
                <ReactTable 
                    data={externalUsers}
                    mapping={[
                        {
                            name: 'Email',
                            value: 's_email'
                        },
                        {
                            name: 'Company',
                            value: 's_company'
                        },
                        {
                            name: 'Created',
                            value: 't_created',
                            datetime: true
                        },
                        {
                            name: 'Approved',
                            value: 'b_approved',
                            boolean: true
                        },
                        {
                            name: 'Modified',
                            value: 't_modified',
                            datetime: true
                        },
                        {
                            name: 'Modified by',
                            value: 's_modified_by',
                        }
                    ]}
                    index={true}
                    customPagination={true}
                    numRows={15}
                    handleClick={handleEditUser}
                    enableClick={true}
                />
            </Col>
        </Row>
    );
}