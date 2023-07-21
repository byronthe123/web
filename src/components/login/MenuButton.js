import React from 'react';
import {Col, Row, Card} from 'reactstrap';

import CardContent from './CardContent';

const MenuButton = ({
    title,
    logoUrl,
    link,
    direct,
    size
}) => {
    return (
        <Col md={size} lg={size} className='pb-3'>
            {
                direct && direct ? 
                <Card onClick={() => link && link()} className="py-3 px-0 menu-button card transition " style={{borderRadius: '0.75rem', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}>
                    <CardContent 
                        title={title}
                        logoUrl={logoUrl}
                    />
                </Card> :
                <a href={`${link}`} target='blank'>
                    <Card className="py-3 px-0 card transition " style={{borderRadius: '0.75rem', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}>
                        <CardContent 
                            title={title}
                            logoUrl={logoUrl}
                        />
                    </Card>            
                </a> 
            }
        </Col>
    );
}

export default MenuButton;