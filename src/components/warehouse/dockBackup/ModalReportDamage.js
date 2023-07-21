import React, {Fragment, useState, useEffect} from 'react';
import axios from 'axios';

import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Input,
    Label,
    Row
  } from "reactstrap";
import moment from 'moment';
import FileBase64 from 'react-file-base64';

const ModalReportDamage = ({
    open, 
    handleModal,
    _user,
    selectedAwbs,
    createSuccessNotification
}) => {

    const [comments, setComments] = useState('');
    const [awb_uld, set_awb_uld] = useState('');
    const [fileInputKey, setFileInputKey] = useState(0);
    const [files, setFiles] = useState([]);

    const getFiles = (files) => setFiles(files);

    const submitDamageReport = () => {
        const user = {
            email: _user && _user.s_email,
            displayName: _user && _user.displayName
        }

        axios.post('https://visualreportingbackend.azurewebsites.net/submit-report', {
            user,
            awb_uld,
            comments, 
            files
          }, {
            headers: {'Authorization': `Bearer %C*F-JaNdRgUkXp2s5v8y/A?D(G+KbPeShVmYq3t6w9z$C&E)H@McQfTjWnZr4u7x!A%D*G-KaNdRgUkXp2s5v8y/B?E(H+MbQeShVmYq3t6w9z$C&F)J@NcRfUjWnZr4u7x!A%D*G-KaPdSgVkYp2s5v8y/B?E(H+MbQeThWmZq4t6w9z$C&F)J@NcRfUjXn2r5u8x!A%D*G-KaPdSgVkYp3s6v9y$B?E(H+MbQeThWmZq4t7w!z%C*F)J@NcRf`}
          }).then(res => {
                console.log('DAMAGE REPORT SUBMITTED');
                setFileInputKey(fileInputKey++)
          }).catch(err => {
            console.log(err);
        });

        handleModal(false);
        createSuccessNotification('Submitting your report - you will receive a confirmation email.');

    }

    useEffect(() => {
        console.log(selectedAwbs);
        const mawb = selectedAwbs && selectedAwbs.length > 0 && selectedAwbs[0].s_mawb;
        const hawb = selectedAwbs && selectedAwbs.length > 0 ? selectedAwbs[0].s_hawb : '';
        if (hawb !== null && hawb.length > 0) {
            set_awb_uld(`${mawb}/${hawb}`);
        } else {
            set_awb_uld(mawb);
        }
    }, [selectedAwbs]);

    useEffect(() => {
        console.log(awb_uld);
    }, [awb_uld]);

    return (
        <Fragment>
            <Modal isOpen={open} toggle={(e) => handleModal(!open)} style={{marginTop: '10%'}}>
                <div className="modal-content" style={{width: '600px'}}>
                    <div className="modal-body mx-auto">
                        <div className='text-center'>
                            <h1>Report Damage for AWB/ULD: {awb_uld}</h1>
                            <h4>Notes</h4>
                            <Input type='textarea' className='mb-3' value={comments} onChange={(e) => setComments(e.target.value)} />
                            <FileBase64
                                multiple={ true }
                                onDone={ getFiles } 
                                key={fileInputKey}
                            />
                            <button type="button" className="btn btn-secondary mr-3" onClick={(e) => handleModal(!open)}>Cancel</button>
                            <button className="btn btn-success" onClick={() => submitDamageReport()}>Submit Damage Report</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
}

export default ModalReportDamage;