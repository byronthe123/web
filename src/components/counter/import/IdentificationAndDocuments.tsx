import React, { useEffect, useState } from 'react';
import { useImportContext } from './context';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import fileDownload from 'js-file-download';
import classNames from 'classnames';


import ModalFiles from './ModalFiles';
import ModalViewFile from './ModalViewFile';
import CustomerDetails from './CustomerDetails';
import ReactTable from '../../custom/ReactTable';
import { IStep } from '../../../globals/interfaces';
import { File } from './interfaces';
import { IFileType } from './fileTypes';
import useBreakpoint from '../../../customHooks/useBreakpoint';
import useBalanceCheck from './useBalanceCheck';

interface Props {
    step: IStep,
    previous: () => void
}

export default function IdentificationAndDocuments ({
    step, 
    previous
}: Props) {

    const { breakpoint } = useBreakpoint();
    const { module, fileProps, identification, paymentsCharges } = useImportContext();
    const {  selectedAwb } = module;

    const { balanceDue } = paymentsCharges;

    // @ts-ignore
    const openBalance = useBalanceCheck(step.id, balanceDue, selectedAwb.s_type);

    useEffect(() => {
        if (openBalance) {
            previous();
        }
    }, [openBalance]);


    const { fileTypes, files, removeFile } = fileProps;
    const { removeIdentificationInfo } = identification;
 
    const [modalViewFile, setModalViewFile] = useState(false);
    const [selectedFile, setSelectedFile] = useState({});

    const [modalFilesType, setModalFilesType] = useState('');
    const [modalFiles, setModalFiles] = useState(false);
    const [reviewIdentification, setRevieweIdentification] = useState(false);

    const handleViewFile = (file: File) => {
        setSelectedFile(file);
        if (file.s_file_type === 'IDENTIFICATION') {
            setModalFilesType(file.modalType!);
            setRevieweIdentification(true);
            setModalFiles(true);
        } else {
            const imageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
            if (file.type && !imageTypes.includes(file.type)) {
                fileDownload(file.base64, file.name!);
            } else {
                setRevieweIdentification(false);
                setModalViewFile(true);    
            }
        }
    }

    const handleModalFiles = (type: string) => {
        setRevieweIdentification(false);
        setModalFilesType(type);
        setModalFiles(true);
    }

    const requiredFileType = (key: string, fileType: IFileType) => {
        if (selectedAwb.s_type === 'TRANSFER-IMPORT' && key === 'AWB' && !fileType.uploaded) {
            return true;
        }
        return fileType.required && !fileType.uploaded;
    };

    const handleRemoveFile = (file: File) => {
        removeFile(file);
        removeIdentificationInfo(file);
    }

    console.log(fileTypes);

    return (
        <Row>
            <Col md={12}>
                <Row>
                    <Col md={6}>
                        <Card>
                            <CustomerDetails 
                                selectedAwb={selectedAwb} 
                                viewMyAssignmentCompany={undefined} 
                            />
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card onClick={() => handleModalFiles('WEBCAM')} className='text-center card-hover hover-pointer' style={{ borderRadius: '0.75rem' }}>
                            <CardBody>
                                <img src={'/assets/img/scanner.png'} style={{ width: '50px', height: 'auto' }} />
                                <h4 className={'mt-1'}>Open Scanning Tool</h4>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card onClick={() => handleModalFiles('UPLOAD')} className='text-center card-hover hover-pointer' style={{ borderRadius: '0.75rem' }}>
                            <CardBody style={{ borderRadius: '0.75rem' }}>
                                <i className={'fas fa-paperclip'} style={{ fontSize: '50px', color: 'rgba(51,153,26,255)' }} />
                                <h4 className={'mt-2'}>Upload File</h4>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className={'mt-3'}>
                    <Col md={breakpoint ? 4 : 3}>
                        <h4>Required Documents {selectedAwb.s_type}</h4>
                        <Table striped>
                            <thead></thead>
                            <tbody>
                                {
                                    Object.keys(fileTypes).map((key, i) => (
                                        <tr key={i}>
                                            <td className={classNames('float-left', { 'bg-warning': requiredFileType(key, fileTypes[key]) })}>
                                                { key } { (selectedAwb.s_type === 'TRANSFER-IMPORT' && key === 'AWB') ? 'REQUIRED' : fileTypes[key].required ? 'REQUIRED' : 'NOT REQUIRED' }
                                            </td>
                                            <td className={classNames( 'float-right', { 'bg-warning': requiredFileType(key, fileTypes[key]) })}>
                                                { 
                                                    fileTypes[key].uploaded ? 
                                                        <span className='text-success'>Scanned</span> : 
                                                        <span className='text-danger'>Not Scanned</span>
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </Col>
                    <Col md={breakpoint ? 8 : 9}>
                        <h4>Selected Documents to Upload</h4>
                        <ReactTable 
                            data={files}
                            mapping={[
                                {
                                    name: 'Type',
                                    value: 's_file_type'
                                },
                                {
                                    name: 'Size',
                                    value: 'displaySize'
                                },
                                {
                                    name: '',
                                    value: 'fas fa-eye',
                                    icon: true,
                                    function: (item: File) => handleViewFile(item)
                                },
                                {
                                    name: '',
                                    value: 'fas fa-trash',
                                    icon: true,
                                    function: (item: File) => handleRemoveFile(item)
                                }
                            ]}
                            index={true}
                            numRows={5}
                        />
                    </Col>
                </Row>
            </Col>
            <ModalFiles 
                type={modalFilesType}
                modal={modalFiles}
                setModal={setModalFiles}
                reviewIdentification={reviewIdentification}
                selectedFile={selectedFile}
            />
            <ModalViewFile 
                modal={modalViewFile}
                setModal={setModalViewFile}
                selectedFile={selectedFile}
            />
        </Row>
    );
}