import React from 'react';
import { Card, CardBody } from 'reactstrap'; 

interface Props {
    classnames?: string
}

export default function CustomCard (props: any) {

    return (
        <Card className={`custom-opacity-card mb-3 bg-light-grey ${props.classnames}`} style={{ borderRadius: '0.75rem' }}>
            <CardBody className='custom-card-transparent py-3 px-2' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                {
                    props.children
                }
            </CardBody>
        </Card>
    );
}