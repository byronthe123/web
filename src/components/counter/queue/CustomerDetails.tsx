import React, { useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import ModalViewDriverPhoto from '../ModalViewDriverPhoto';
import { ICompany } from './interfaces';

interface Props {
    myAssignmentCompany: ICompany,
    viewMyAssignmentCompany: (company: ICompany) => void 
}

export default function CustomerDetails ({
    myAssignmentCompany,
    viewMyAssignmentCompany
}: Props) {

    const [modalDriverPhoto, setModalDriverPhoto] = useState(false);

    return (
        <Card style={{borderRadius: '0.75rem'}} onClick={() => viewMyAssignmentCompany(myAssignmentCompany)} className='card-hover hover-pointer'>
            <CardBody className='custom-card-opacity py-3'>
                <Row>
                    <Col>
                        <img src={`${myAssignmentCompany.s_driver_photo_link || 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms='}`} style={{ maxWidth: '200px', height: 'auto' }} />
                    </Col>
                    <Col>
                        <h4>Customer Details:</h4>
                        <h6 data-testid={'my-assignment-company-name'}>{myAssignmentCompany.s_trucking_company}</h6>
                        <h6>{myAssignmentCompany.s_trucking_driver}</h6>
                        <h6>{myAssignmentCompany.s_trucking_email}</h6>
                        <h6>{myAssignmentCompany.s_trucking_cell || 'No Cellphone Entered'} - SMS {myAssignmentCompany.b_trucking_sms ? 'Enabled' : 'Disabled'}</h6>
                    </Col>
                </Row>
            </CardBody>
            <ModalViewDriverPhoto 
                modal={modalDriverPhoto}
                setModal={setModalDriverPhoto}
                myAssignmentCompany={myAssignmentCompany}
            />
        </Card>
    );
}