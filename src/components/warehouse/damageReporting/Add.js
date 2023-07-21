import React, {useState} from 'react';
import axios from 'axios';


import {Row, Col, Form, FormGroup, Input} from 'reactstrap';
import FileBase64 from 'react-file-base64';
import { api, getDate, notify } from '../../../utils';

const Add = ({
    user,
    appendCreatedRecords
}) => {

    //Properties:
    const [comments, setComments] = useState('');
    const [awb_uld, set_awb_uld] = useState('');
    const [fileInputKey, setFileInputKey] = useState(0);
    const [files, setFiles] = useState([]);

    //Procedures:
    const getFiles = (files) => setFiles(files);

    const submitDamageReport = async () => {
        const res = await api('post', '/submitVisualReport', {
            user: {
                email: user && user.s_email,
                displayName: user && user.displayName
            },
            awb_uld,
            comments, 
            files,
            unit: user.s_unit,
            time_submitted: getDate()
        })

        notify('Report Submitted');
        appendCreatedRecords(res.data);
        reset();
    }

    const enableSubmitDamageReport = () => {
        return awb_uld.length > 0 && files.length > 0;
    }

    const reset = () => {
        set_awb_uld('');
        setComments('');
        setFiles([]);
        setFileInputKey(fileInputKey + 1);
    }

    //Return:
    return (
        <div>
            <Form>
                <FormGroup>
                    <Row>
                        <Col md={4}>
                            <h4>AWB:</h4>
                            <Input type="text" value={awb_uld} onChange={(e) => set_awb_uld(e.target.value)} />
                        </Col>
                    </Row>
                </FormGroup>
                <FormGroup>
                    <Row>
                        <Col md={4}>
                            <h4>Notes</h4>
                            <Input type='textarea' className='mb-3' value={comments} onChange={(e) => setComments(e.target.value)} />
                        </Col>
                    </Row>
                </FormGroup>
            </Form>
            <FileBase64
                multiple={ true }
                onDone={ getFiles } 
                key={fileInputKey}
            />
            <button className="btn btn-success" disabled={!enableSubmitDamageReport()} onClick={() => submitDamageReport()}>Submit Damage Report</button>
        </div>
    );
}

export default Add;