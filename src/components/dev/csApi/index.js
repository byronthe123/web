import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-view';
import { Row, Col, Input, Button } from 'reactstrap';
import useLoading from '../../../customHooks/useLoading';
import axios from 'axios';
import { api } from '../../../utils';

export default function CsApi ({ tabId }) {
    const { setLoading } = useLoading();
    const [s_mawb, set_s_mawb] = useState('');
    const [data, setData] = useState([]);

    const getData = async () => {
        setLoading(true);
        const res = await axios.get(`https://cargosprint-api.azurewebsites.net/data?awb=${s_mawb}`, {
            headers: {
                Authorization: `Bearer ${process.env.REACT_APP_CS_API_SECRET}`
            }
        });
        setLoading(false);
        if (res.status === 200) {
            console.log(res.data);
            setData(res.data);
        }
    }

    const [s_edi, set_s_edi] = useState('');

    useEffect(() => {
        const getEdi = async () => {
            const res = await api('get', 'readEdi');
            console.log(res.data);
            set_s_edi(res.data.s_edi);
        }
        if (tabId === '-6') {
            getEdi();
        }
    }, [tabId]);


    return (
        <Row>
            <Col md={12}>
                <h4>EDI</h4>
                <p style={{ whiteSpace: 'pre-line' }}>{s_edi}</p>
                <Input 
                    type={'text'} 
                    value={s_mawb} 
                    onChange={(e) => set_s_mawb(e.target.value)} 
                    style={{ width: '200px' }}
                    className={'d-inline mr-2'}
                />
                <Button
                    className={'d-inline'}
                    disabled={!s_mawb || s_mawb.length < 11}
                    onClick={() => getData()}
                >
                    Search
                </Button>
            </Col>
            <Col md={12} className={'mt-2'}>
                <h4>Results:</h4>
                {
                    data.length > 0 && 
                    <ReactJson src={data} displayDataTypes={false} />
                }
            </Col>
        </Row>
    );
}