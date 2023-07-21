import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import ReactTable from '../../custom/ReactTable';

export default ({
    externalCompanies,
    handleAddCompany,
    handleEditCompany
}) => {
    return (
        <>
            <Row>
                <Col md={12}>
                    <Button onClick={() => handleAddCompany()}>Add New Company</Button>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col md={12}>
                    <ReactTable 
                        data={externalCompanies}
                        mapping={[
                            {
                                name: 'Company Name',
                                value: 's_company'
                            },
                            {
                                name: 'Created',
                                value: 't_created',
                                datetime: true
                            },
                            {
                                name: 'Created by',
                                value: 's_created_by',
                            },
                            {
                                name: 'Modified',
                                value: 't_modified',
                                datetime: true
                            },
                            {
                                name: 'Modified by',
                                value: 's_modified_by',
                            },
                            {
                                name: 'Notes',
                                value: 's_notes',
                            }
                        ]}
                        index={true}
                        customPagination={true}
                        numRows={10}
                        handleClick={handleEditCompany}
                        enableClick={true}
                    />
                </Col>
            </Row>
        </>
    );
}