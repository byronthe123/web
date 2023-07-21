import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Row, Col } from 'reactstrap';
import { api } from '../../utils';
import ReactTable from '../custom/ReactTable';
import fileDownload from 'js-file-download';
import dayjs from 'dayjs';
import { Input } from 'reactstrap';
import Modal from './accessRecord/Modal';
import { Button } from 'reactstrap';

export default function AccessRecord () {

    const [startDate, setStartDate] = useState(dayjs().subtract(7, 'days').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));

    const [accessRecords, setAccessRecords] = useState([]);

    useEffect(() => {
        const getAccessRecords = async () => {
            const res = await api('post', 'accessRecords', { 
                startDate: dayjs(startDate).toISOString(), 
                endDate: dayjs(endDate).add(1, 'day').toISOString()
            });
            setAccessRecords(res.data);
        }
        getAccessRecords();
    }, [startDate, endDate]);

    const reactTableRef = useRef();

    const exportToCsv = () => {
        const Json2csvParser = require("json2csv").Parser;
        const raw = reactTableRef.current.getResolvedState().sortedData;
        if (raw.length > 0) { 
            const data = raw.map(record => record._original);
            const jsonData = JSON.parse(JSON.stringify(data));
            const json2csvParser = new Json2csvParser({ excelStrings: true, withBOM: true });
            const csv = json2csvParser.parse(jsonData);
            fileDownload(csv, `Access Records ${dayjs().format('YYYY-MM-DD')}.csv`);
        }
    }

    const [modal, setModal] = useState(false);
    const [enableMaps, setEnableMaps] = useState(false);
    const [pushPins, setPushPins] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setEnableMaps(true);
        }, [4000]);
    }, []);

    const handleViewMap = () => {
        setModal(true);
        const raw = reactTableRef.current.getResolvedState().sortedData;
        const _pushPins = raw.map((record, i) => {
            return {
                center: {
                    latitude: record._original.latitude,
                    longitude: record._original.longitude,
                },
                options: {
                  title: `${i+1}`,
                },
            }
        });
        setPushPins(_pushPins);
    }

    return (
        <Row>
            <Col md={12}>
                <h6 className={'d-inline mr-2'}>From:</h6>
                <Input type={'date'} value={startDate} onChange={(e) => setStartDate(e.target.value)} className={'d-inline mr-2'} style={{ width: '200px' }} />
                <h6 className={'d-inline mr-2'}>To:</h6>
                <Input type={'date'} value={endDate} onChange={(e) => setEndDate(e.target.value)}  className={'d-inline mr-2'} style={{ width: '200px' }} />
                <i 
                    className="fas fa-file-download text-primary hover-pointer mr-2" 
                    style={{ fontSize: '28px' }} 
                    onClick={() => exportToCsv()}
                    data-tip={'Download data'} 
                ></i>
                <i 
                    className={`fa-solid fa-map text-primary hover-pointer ${!enableMaps && 'customDisabled'}`} 
                    style={{ fontSize: '28px' }} 
                    onClick={() => handleViewMap()}
                    data-tip={'Map'} 
                ></i>
                <ReactTable 
                    data={accessRecords}
                    mapping={[{
                        name: 'User',
                        value: 'user'
                    }, {
                        name: 'Page',
                        value: 'page'
                    }, {
                        name: 'Date',
                        value: 'date',
                        datetime: true,
                        utc: false
                    }, {
                        name: 'IP Address',
                        value: 'ip_address'
                    }, {
                        name: 'City',
                        value: 'city'
                    }, {
                        name: 'Region',
                        value: 'region'
                    }, {
                        name: 'Zip',
                        value: 'postal_code'
                    }, {
                        name: 'Country',
                        value: 'country'
                    }, {
                        name: 'Longitude',
                        value: 'longitude'
                    }, {
                        name: 'Latitude',
                        value: 'latitude'
                    }, {
                        name: 'VPN',
                        value: 'is_vpn',
                        boolean: true
                    }]}
                    reactTableRef={reactTableRef}
                />
            </Col>
            <Modal 
                modal={modal}
                setModal={setModal}
                pushPins={pushPins}
            />
        </Row>
    );
}