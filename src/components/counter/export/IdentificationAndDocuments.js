import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card, CardBody, Table } from 'reactstrap';
import ReactTable from '../../custom/ReactTable';
import ModalFiles from './ModalFiles';
import ModalViewFile from './ModalViewFile';
import fileDownload from 'js-file-download';
import CustomerDetails from './CustomerDetails';
import classNames from 'classnames';

export default function IdentificationAndDocuments ({
    values,
    setFieldValue,
    importAttachments,
    setImportAttachments,
    fileTypes,
    modelId,
    setModelId,
    saveAndRecognizeForm,
    formFields,
    setFormFields,
    files,
    addToFiles,
    file,
    setFile,
    updateFile,
    removeFile,
    selectedAwb,
    checkIdentification,
    saveIdentificationInformation,
    checkAwbData,
    mobile,
    disableScanner,
    airportCodes,
    airportCodesMap,
    setBookingConfirmed,
    shcs,
    shcsDgMap
}) {

    const [modalViewFile, setModalViewFile] = useState(false);
    const [selectedFile, setSelectedFile] = useState({});

    const [modalFilesType, setModalFilesType] = useState('');
    const [modalFiles, setModalFiles] = useState(false);
    const [reviewIdentification, setRevieweIdentification] = useState(false);

    const handleViewFile = (file) => {
        setSelectedFile(file);
    
        if (['IDENTIFICATION1', 'IDENTIFICATION2', 'AWB'].includes(file.fileType)) {
            setModalFilesType(file.modalType);
            setRevieweIdentification(true);
            setModalFiles(true);
        } else {
            const imageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
            if (file.type && !imageTypes.includes(file.type)) {
                fileDownload(file.base64, file.name);
            } else {
                setRevieweIdentification(false);
                setModalViewFile(true);    
            }
        }
    }

    const handleModalFiles = (type) => {
        setRevieweIdentification(false);
        setModalFilesType(type);
        setModalFiles(true);
    }

    const requiredFileType = (s_file_type) => s_file_type.required && !s_file_type.uploaded;

    return (
        <Row>
            <Col md={12}>
                <Row>
                    <Col md={6}>
                        <Card>
                            <CustomerDetails 
                                selectedAwb={selectedAwb}
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
                    <Col md={mobile ? 4 : 3}>
                        <h4>Required Documents</h4>
                        <Table striped>
                            <thead></thead>
                            <tbody>
                                {
                                    Object.keys(fileTypes).map((key, i) => (
                                        <tr key={i}>
                                            <td className={classNames('float-left', { 'bg-warning': requiredFileType(fileTypes[key]) })}>
                                                { key } { fileTypes[key].required ? '(REQUIRED)' : '' }
                                            </td>
                                            <td className={classNames('float-right', {'bg-warning': requiredFileType(fileTypes[key]) })}>
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
                    <Col md={mobile ? 8 : 9}>
                        <h4>Selected Documents to Upload</h4>
                        <ReactTable 
                            data={files}
                            mapping={[
                                {
                                    name: 'Type',
                                    value: 'fileType'
                                },
                                {
                                    name: 'Size',
                                    value: 'displaySize'
                                },
                                {
                                    name: '',
                                    value: 'fas fa-eye',
                                    icon: true,
                                    function: (item) => handleViewFile(item)
                                },
                                {
                                    name: '',
                                    value: 'fas fa-trash',
                                    icon: true,
                                    function: (item) => removeFile(item)
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
                fileTypes={fileTypes}
                modelId={modelId}
                setModelId={setModelId}
                saveAndRecognizeForm={saveAndRecognizeForm}
                formFields={formFields}
                setFormFields={setFormFields}
                addToFiles={addToFiles}
                file={file}
                setFile={setFile}
                updateFile={updateFile}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                values={values}
                setFieldValue={setFieldValue}
                selectedAwb={selectedAwb}
                checkIdentification={checkIdentification}
                saveIdentificationInformation={saveIdentificationInformation}
                checkAwbData={checkAwbData}
                reviewIdentification={reviewIdentification}
                mobile={mobile}
                disableScanner={disableScanner}
                airportCodes={airportCodes}
                airportCodesMap={airportCodesMap}
                setBookingConfirmed={setBookingConfirmed}
                shcs={shcs}
                shcsDgMap={shcsDgMap}
            />
            <ModalViewFile 
                modal={modalViewFile}
                setModal={setModalViewFile}
                selectedFile={selectedFile}
            />
        </Row>
    );
}