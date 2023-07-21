import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Input, Card, CardBody } from 'reactstrap';
import uuidv4 from 'uuid/v4';
import axios from 'axios';
import moment from 'moment';

export default ({
    user,
    baseApiUrl,
    headerAuthCode,
    createSuccessNotification
}) => {

    const [s_reason, set_s_reason] = useState('');
    const [s_override, set_s_override] = useState('');
    const [validated, setValidated] = useState(false);

    const generateCode = () => {
        const guid = uuidv4();
        set_s_override(guid.substr(0, 3));
        setValidated(false);
    }

    const enableSubmit = () => {
        return s_override.length > 0 && s_reason.length > 0;
    }

    const override = async () => {
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        const { s_email } = user && user;

        const data = {
            t_created: now,
            s_creator: s_email,
            s_override,
            b_used: false,
            s_reason
        }

        const response = await axios.post(`${baseApiUrl}/override`, {
            data
        }, {
            headers: { 'Authorization': `Bearer ${headerAuthCode}` }
        });

        if (response.status === 200) {
            setValidated(true);
            createSuccessNotification('Override Code Ready');
            set_s_reason('');
        }
    }

    return (
        <Row>
            <Col md={12}>
                <Card>
                    <CardBody className='custom-card-transparent'>
                        <Row className='mb-2'>
                            <Button color='info' onClick={() => generateCode()}>Start Override</Button>
                            <h4 className={`ml-5 ${s_override.length > 0 ? 'px-2' : ''}`} style={{backgroundColor: `${validated ? 'lightgreen' : 'red'}`, fontSize: '28px', fontWeight: 'bold'}}>{s_override}</h4>
                        </Row>
                        <Row>
                            <h4>Enter Override Reason:</h4>
                            <Input type='textarea' value={s_reason} onChange={(e) => set_s_reason(e.target.value)} />
                            <Button disabled={!enableSubmit()} onClick={() => override()} className='mt-2'>Create Override</Button>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}