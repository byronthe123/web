import React from 'react';

import {Row, Col, Card, CardBody} from 'reactstrap';
import { formatDatetime } from '../../../utils';

const resolveFirstName = (name) => {
    return name && name.split(' ')[0];
}

const ItemCard = ({
    awb,
    getPhotos
}) => {

    return (
        awb && 
        <Card className='card-hover' style={{borderRadius: '0.75rem'}}>
            <CardBody className='custom-card-transparent py-3 px-4' style={{backgroundColor: '#9ecd7e'}}>
                <Row>
                    <div className='col-10 py-3'>
                        <h6 style={{fontWeight: 'bolder'}} className='mb-1'>{awb.awb_uld}</h6>
                        <p className='awb-time mb-0'>Created by {resolveFirstName(awb.full_name)} at {formatDatetime(awb.time_submitted)}</p>
                    </div>
                    <div className='col-2 py-3'>
                        <i style={{fontSize: '26px'}} className="far fa-eye" onClick={() => getPhotos(awb.collection_id)}></i>
                    </div>
                </Row>
            </CardBody>
        </Card>
    );
}

export default ItemCard;