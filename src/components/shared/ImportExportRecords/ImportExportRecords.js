import React, { useState, useEffect, useContext  } from 'react';
import moment from 'moment';
import axios from 'axios';
import Cleave from 'cleave.js/react';
import { asyncHandler } from '../../../utils';
import { Row, Col, Input, Button, ButtonGroup } from 'reactstrap';
import _ from 'lodash';
import { renderToString } from 'react-dom/server';

import { AppContext } from '../../../context';
import AppLayout from '../../../components/AppLayout';
import VirtualTable from '../../../components/custom/VirtualTable';
import DataModal from './DataModal';
import FileModal from './FileModal';
import { api } from '../../../utils';
import { exportMapping, importMapping } from './mapping';
import CreateImportDeliverySheet from './CreateImportDeliverySheet';

export default function Records ({
    s_type, user, baseApiUrl, headerAuthCode
}) {

    const { setLoading, createSuccessNotification, searchAwb: mawbDashboard, appData: { accessToken } } = useContext(AppContext);
    const { handleSearchAwb } = mawbDashboard;

    const [d_start_date, set_d_start_date] = useState(moment().subtract(1, 'week').format('YYYY-MM-DD'));
    const [d_end_date, set_d_end_date] = useState(moment().format('YYYY-MM-DD'));
    const [data, setData] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState({});
    const [modal, setModal] = useState(false);
    const [modalFile, setModalFile] = useState(false);
    const [selectedFile, setSelectedFile] = useState({});
    const [files, setFiles] = useState([]);
    const [stationInfo, setStationInfo] = useState({});
    const [s_mawb, set_s_mawb] = useState('');

    const changeWeek = (add) => {
        const delta = add ? 'add' : 'subtract';
        set_d_start_date(date => moment(date)[delta](1, 'week').format('YYYY-MM-DD'));
        set_d_end_date(date => moment(date)[delta](1, 'week').format('YYYY-MM-DD'));
    }

    const getRecords = asyncHandler(async() => {
        setLoading(true);
        const data = {
            s_unit: user.s_unit,
            s_type,
            d_start_date,
            d_end_date
        }
        const res = await api('post', 'getImportExportRecords', { data });

        setData(res.data);
        setLoading(false);
    });

    useEffect(() => {
        if (user.s_unit && moment(d_start_date).isValid() && moment(d_end_date).isValid()) {
            getRecords();
        }
    }, [d_start_date, d_end_date, user.s_unit, s_type]);

    useEffect(() => {
        
        const resolveCorpStationInfo = async() => {
            const res = await api('get', `resolveCorpStationInfo/${user.s_unit}`);
            setStationInfo(_.get(res, 'data', {}));
        };

        if (user.s_unit) {
            resolveCorpStationInfo();
        }
    }, [user.s_unit]);

    const getAwbBlobFiles = async(record) => {
        try {
            const res = await axios.post(`${baseApiUrl}/getAwbBlobFile`, {
                data: {
                    s_mawb_id: record.s_mawb_id
                }
            }, {
                headers: {
                    Authorization: `Bearer ${headerAuthCode}`
                }
            });

            if (record.s_warehouse_signature_link && record.s_warehouse_signature_link.length > 0) {
                res.data.push({
                    s_file_type: 'SIGNATURE',
                    accessLink: record.s_warehouse_signature_link
                });
            }
            
            setFiles(res.data);
        } catch (err) {
            setFiles([]);
        }
        
    };

    const handleSelectRecord = (record) => {
        setLoading(true);
        setSelectedRecord(record);
        getAwbBlobFiles(record);
        setLoading(false);
        setModal(true);
    }

    const handleViewFile = (file) => {
        setSelectedFile(file);
        setModalFile(true);
    }

    const searchAwb = async () => {
        const res = await api('post', 'searchAwb', {
            s_mawb,
            s_type,
            s_unit: user.s_unit
        });

        setData(res.data);
        createSuccessNotification(`${res.data.length} records found`);
    }

    const getUserName = async (id, accessToken) => {
        if (!id) {
            return '';
        } 

        const url = `https://graph.microsoft.com/v1.0/users/${id}?$select=displayName`;
        
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            return response.data.displayName.split(' ')[0];
        } catch (error) {
            console.log(error);
        }

    };

    const generateImportDeliverySheet = async () => {

        const data = {
            s_mawb_id: selectedRecord.s_mawb_id,
            s_mawb: selectedRecord.s_mawb.replace(/-/g, ''),
            s_unit: user.s_unit
        }

        const res = await api('post', '/additionalProofOfDeliveryData', { data });
        const { additionalData, stationInfo, visualReportingNotes } = res.data;

        for (const key in additionalData) {
            selectedRecord[key] = additionalData[key];
        }

        let _officeAgent = null;

        if (selectedRecord.s_counter_by) {
            const name = await getUserName(selectedRecord.s_counter_by, accessToken);
            _officeAgent = name || _.get(selectedRecord, `s_counter_by.split('@')[0]`, '');
        }

        const _warehouseAgent = 
            await getUserName(selectedRecord.s_dock_agent_completed, accessToken) ||
            _.get(selectedRecord, `s_dock_agent_completed.split('@')[0]`, '');

        const deliverySheetPrint = renderToString(
            <CreateImportDeliverySheet 
                selectedMawb={selectedRecord}
                stationInfo={stationInfo}
                officeAgent={_officeAgent}
                warehouseAgent={_warehouseAgent}
                user={user}
                visualReportingNotes={visualReportingNotes}
            />
        );

        const myWindow = window.open("", "MsgWindow", "width=1920,height=1080");
        myWindow.document.write(deliverySheetPrint);
    }

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='pl-4 py-3'>
                        <Col md={12}>
                            <Row>
                                <Col md={12}>
                                    <h1 className={'d-block'}>{s_type} Records</h1>
                                </Col>
                            </Row>
                            <Row className={'mb-1'}>
                                <Col md={12}>
                                    <h4 className={'d-inline'}>Date Range: </h4>
                                    <Input 
                                        type={'date'} 
                                        style={{ width: '200px' }} 
                                        className={'d-inline'} 
                                        value={d_start_date} 
                                        disabled
                                    />
                                    <h4 className={'mx-1 d-inline'}>to</h4>
                                    <Input 
                                        type={'date'} 
                                        style={{ width: '200px' }} 
                                        className={'d-inline'} 
                                        value={d_end_date} 
                                        disabled
                                    />
                                    <ButtonGroup className={'d-inline ml-3'}>
                                        <Button 
                                            className={'mr-2'}
                                            onClick={() => changeWeek(false)}
                                        >
                                            Prev. Week
                                        </Button>
                                        <Button
                                            onClick={() => changeWeek(true)}
                                        >
                                            Next Week
                                        </Button>
                                    </ButtonGroup>
                                    <Cleave 
                                        placeholder=''
                                        options={{
                                            delimiter: '-',
                                            blocks: [3, 4, 4]
                                        }} 
                                        onChange={e => set_s_mawb(e.target.rawValue)}
                                        value={s_mawb}
                                        className={'form-control d-inline mx-2'}
                                        style={{ width: '150px' }}
                                    />
                                    <Button 
                                        disabled={s_mawb.length !== 11}
                                        onClick={() => searchAwb()}
                                    >
                                        Search AWB
                                    </Button>
                                    <span id={'copyAwb'} className={'text-white'}>{selectedRecord.s_mawb}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <VirtualTable 
                                        data={data}
                                        mapping={s_type === 'IMPORT' ? importMapping : exportMapping}
                                        index={true}     
                                        numRows={15}  
                                        enableClick={true}
                                        handleClick={(item) => handleSelectRecord(item)}                     
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
            <DataModal 
                modal={modal}
                setModal={setModal}
                s_type={s_type}
                selectedRecord={selectedRecord}
                handleViewFile={handleViewFile}
                files={files}
                user={user}
                stationInfo={stationInfo}
                handleSearchAwb={handleSearchAwb}
                generateImportDeliverySheet={generateImportDeliverySheet}
                setFiles={setFiles}
            />
            <FileModal
                modal={modalFile}
                setModal={setModalFile}
                selectedFile={selectedFile}
            />
        </AppLayout>
    );
}
