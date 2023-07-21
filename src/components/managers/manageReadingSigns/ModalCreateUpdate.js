import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Row, Col } from 'reactstrap';
import SunEditor, { buttonList } from 'suneditor-react';
import { Field } from 'formik';
import moment from 'moment';

export default ({
    modal,
    setModal,
    createNew,
    values,
    setFieldValue,
    units,
    editorRef,
    isValid,
    createUpdateRecord,
    deleteReadingSign
}) => {

    const toggle = () => setModal(!modal);

    const [refreshKey, setRefreshKey] = useState(0);

    const handleSelectUnit = (key) => {
        units[key] = !units[key];
        setRefreshKey(refreshKey + 1);
    }

    const enableSubmit = () => {
        let unitSelected = false;
        for (let key in units) {
            if (units[key] === true) {
                unitSelected = true;
            }
        }   
        const valid = 
            unitSelected && 
            values.title && values.title.length > 0 && 
            values.dueDate && moment(values.dueDate).isValid() &&
            (editorRef.current && editorRef.current.editor.getContents().length > 0);
        return valid;
    }

    return (
        <Modal isOpen={modal} toggle={toggle} style={{ width: '1000px', maxWidth: '100%' }}>
            <ModalHeader>{createNew ? 'Add' : 'Update'} Reading Sign</ModalHeader>
            <ModalBody>
                <Row>
                    <Col md={6} className={'step-2-create'}>
                        <FormGroup>
                            <Label>Title</Label>
                            <Field name={'title'} type={'text'} className={'form-control'} />
                        </FormGroup>
                    </Col>
                    <Col md={3} className={'step-3-create'}>
                        <FormGroup>
                            <Label>Reference</Label>
                            <Field name={'reference'} type={'text'} className={'form-control'} />
                        </FormGroup>
                    </Col>
                    <Col md={3} className={'step-3-create'}>
                        <FormGroup>
                            <Label>Due Date</Label>
                            <Field name={'dueDate'} type={'date'} className={'form-control'} />
                        </FormGroup>
                    </Col>
                </Row>
                <FormGroup key={refreshKey} className={'step-4-create'}>
                    <Label className={'mr-3'}>Units</Label>
                    {
                        Object.keys(units).map((key, i) => (
                            <Button 
                                active={units[key] === true}
                                onClick={() => handleSelectUnit(key)}
                                className={'mx-1'}
                                key={i}
                            >
                                {key}
                            </Button>
                        ))
                    }
                </FormGroup>
                <FormGroup className={'step-5-create'}>
                    <Label>Content</Label>
                    <SunEditor 
                        enable={true} 
                        ref={editorRef}
                        defaultValue={values.content}
                        setOptions={{
                            buttonList: buttonList.complex
                        }}
                        height={300}
                    />
                </FormGroup>
            </ModalBody>
            <ModalFooter style={{ width: '100%' }}>
                <Row style={{ width: '100%' }}>
                    <Col md={12}>
                        <div className={'float-left'}>
                            <Button color={'danger'} onClick={() => deleteReadingSign()}>Delete</Button>
                        </div>
                        <div className={'float-right'}>
                            <Button 
                                color="primary" 
                                className={'step-6-create'}
                                onClick={toggle} 
                                disabled={!enableSubmit()} 
                                onClick={() => createUpdateRecord(values)}
                            >
                                Submit
                            </Button>
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </div>
                    </Col>
                </Row>
            </ModalFooter>
        </Modal>
    );
}