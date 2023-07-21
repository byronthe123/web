import React from 'react';

import {
    Modal,
    Input,
} from "reactstrap";

import FileBase64 from 'react-file-base64';
import { IFile } from '../../../../globals/interfaces';

interface Props {
    open: boolean; 
    handleModal: (state: boolean) => void;
    comments: string;
    setComments: (state: string) => void;
    getFiles: (files: Array<IFile>) => void;
    fileInputKey: number;
    awb_uld: string;
    submitDamageReport: () => Promise<void>;
}

const ModalReportDamage = ({
    open, 
    handleModal,
    comments,
    setComments,
    getFiles,
    fileInputKey,
    awb_uld,
    submitDamageReport
}: Props) => {

    return (
        <Modal isOpen={open} toggle={() => handleModal(!open)} style={{marginTop: '10%'}}>
            <div className="modal-content" style={{width: '600px'}}>
                <div className="modal-body mx-auto">
                    <div className='text-center'>
                        <h1>Report Damage for ULD: {awb_uld}</h1>
                        <h4>Notes</h4>
                        <Input type='textarea' className='mb-3' value={comments} onChange={(e: any) => setComments(e.target.value)} />
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
    );
}

export default ModalReportDamage;