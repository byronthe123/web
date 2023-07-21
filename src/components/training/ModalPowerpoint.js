import React, { useState, useEffect, Fragment } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
// import pdf from '../../components/data/pdf/CHOICE-Training-TSA-v1.pdf';

import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Input,
    Label,
    Row,
    Form,
    Col
  } from "reactstrap";
import moment from 'moment';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const ModalPowerpoint = ({
    open, 
    handleModal,
    s_link
}) => {

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const handleSetPageNumber = (number) => {
        if (number > 0 && number <= numPages) {
            setPageNumber(number);
        } else if (number === numPages) {
            handleModal(!open);
        }
    }

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    }

    return (
        s_link && 
        <Modal isOpen={open} toggle={(e) => handleModal(!open)}>
            <div className="modal-content" style={{width: '1800px', height: '900px', position: 'absolute', right: '-130%'}}>
                <div className="modal-body">
                    <div>
                        <Row>
                            <h4 className='pr-3'>PowerPoint: </h4>
                        </Row>
                        <Row className='pt-'>
                            <Col md={12} style={{height: '800px'}} className='text-center mx-auto'>
                                <div style={{height: '100%', width: '100%'}}>
                                    <div style={{marginLeft: '190px'}}>
                                        <Document
                                            file={`/assets/pdf/${s_link}`}
                                            onLoadSuccess={onDocumentLoadSuccess}
                                        >
                                            <Page scale={1.4} pageNumber={pageNumber}>

                                            </Page>
                                        </Document>
                                    </div>
                                    <p>Page {pageNumber} of {numPages}</p>
                                    <Button onClick={() => handleSetPageNumber(pageNumber - 1)}>Previous</Button>
                                    <Button onClick={() => handleSetPageNumber(pageNumber + 1)}>Next</Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ModalPowerpoint;