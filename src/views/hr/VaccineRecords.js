import React, { useState, useEffect, useContext  } from 'react';
import { AppContext } from '../../context';
import {withRouter} from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import ReactTable from '../../components/custom/ReactTable';
import { asyncHandler, api } from '../../utils';
import Lightbox from 'react-image-lightbox';

import AppLayout from '../../components/AppLayout';

const VaccineRecords  = () => {

    const { setLoading, createSuccessNotification } = useContext(AppContext);
    const [data, setData] = useState([]);
    const [files, setFiles] = useState([]);
    const [lightBoxOpen, setLightBoxOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [selectedRecord, setSelectedRecord] = useState({});

    useEffect(() => {
        const getData = asyncHandler(async() => {
            setLoading(true);
            const res = await api('get', 'vaccineRecords');
            setData(res.data);
            setLoading(false);
        });
        getData();
    }, []);

    const getFiles = asyncHandler(async(record) => {
        setLoading(true);
        setSelectedRecord(record);
        const { s_files_transaction_id } = record;
        const res = await api('get', `vaccineRecordFiles/${s_files_transaction_id}`);
        setLoading(false);
        console.log(res.data);
        if (res.status === 200) {
            const files = res.data;
            if (files.length > 0) {
                setFiles(res.data);
                setLightBoxOpen(true);    
            } else {
                createSuccessNotification('No Files Found', 'warning');
            }
        }
    });

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md={12}>
                            <ReactTable 
                                data={data}
                                mapping={[
                                    {
                                        name: 'Employee Num.',
                                        value: 'i_employee_number'
                                    },
                                    {
                                        name: 'Email',
                                        value: 's_created_by'
                                    }, 
                                    {
                                        name: 'Took Vaccine',
                                        value: 'b_took_vaccine',
                                        boolean: true
                                    },
                                    {
                                        name: 'Have Vacc. Appt.',
                                        value: 'b_have_appointment',
                                        boolean: true
                                    }, 
                                    {
                                        name: 'Appt. Date',
                                        value: 'd_appointment',
                                        date: true
                                    },
                                    {
                                        name: 'Plan to get Vacc.',
                                        value: 'b_have_plan_appointment',
                                        boolean: true
                                    },
                                    {
                                        name: `Won't get Vacc.`,
                                        value: 'b_no_plan_vaccine',
                                        boolean: true
                                    },
                                    {
                                        name: 'Date',
                                        value: 't_created',
                                        datetime: true,
                                        utc: true
                                    }
                                ]}
                                index={true}
                                enableClick={true}
                                handleClick={(item) => getFiles(item)}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
            {
                lightBoxOpen && 
                <Lightbox
                    mainSrc={files[photoIndex] && files[photoIndex].accessLink}
                    nextSrc={files[(photoIndex + 1) % files.length]}
                    prevSrc={files[(photoIndex + files.length - 1) % files.length]}
                    onCloseRequest={() => setLightBoxOpen(false)}
                    onMovePrevRequest={() => setPhotoIndex((photoIndex + files.length - 1) % files.length)}
                    onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % files.length)}
                    imageCaption={selectedRecord.s_created_by}
                />
            }
        </AppLayout>
    );
}

export default withRouter(VaccineRecords);