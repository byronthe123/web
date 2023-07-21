import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Input, Label } from 'reactstrap';
import SunEditor, { buttonList } from 'suneditor-react';
import Clipboard from 'react-clipboard.js';
import Switch from "rc-switch";
import usersMapping from '../managers/manageTraining/usersMapping';

export default ({
    modal,
    setModal,
    editorRef,
    setModalCreateLink,
    createdLink,
    createNew,
    s_wiki,
    s_title,
    set_s_title,
    s_category,
    set_s_category,
    b_locked,
    set_b_locked,
    i_access_level,
    set_i_access_level,
    createUpdateWiki,
    setModalLinkWiki,
    tags,
    setModalAddTag,
    removeTag,
    user,
    accessLevels
}) => {

    const toggle = () => setModal(!modal);

    const enableSave = () => {
        return s_title && s_title.length > 0 && s_category.length > 0 && editorRef.current && editorRef.current.editor.getContents().length > 0;
    }

    const categories = ['PORTAL', 'TRAINING', 'OPERATIONS', 'LEADS', 'MANAGERES', 'CORPORATE', 'HR'];

    return (
        <Modal isOpen={modal} toggle={toggle} style={{ width: '1200px', maxWidth: '100%' }}>
            <ModalHeader>
                <Row>
                    <Col md={2}>
                        {createNew ? 'Create' : 'Update'} Wiki
                    </Col>
                    <Col md={6}>
                        <h6 className={'d-inline mr-2'}>Title</h6>
                        <Input type='text' className={'d-inline'} value={s_title} onChange={(e) => set_s_title(e.target.value)} />
                    </Col>
                    <Col md={4}>
                        <h6 className={'d-inline mr-2'}>Category</h6>
                        <Input type='select' className={'d-inline'} value={s_category} onChange={(e) => set_s_category(e.target.value)}>
                            {
                                categories.map(c => (
                                    <option value={c}>{c}</option>
                                ))
                            }
                        </Input>
                    </Col>
                </Row>
                <Row className={'mt-2'}>
                    {
                        user.i_access_level === 8 && 
                            <Col md={1}>
                                <Label className={'mr-2'}>Locked</Label>
                                <Switch 
                                    className={'switch-dg'}
                                    checked={b_locked || false}
                                    onClick={() => set_b_locked(!b_locked)} 
                                />
                            </Col>
                    }
                    <Col md={11}>
                        <Label>Maximum Access Level:</Label>
                        <Row>
                            {
                                accessLevels && accessLevels.map((l, i) => (
                                    <Button 
                                        key={i} 
                                        className={'d-inline mr-1'} 
                                        color={'primary'}
                                        onClick={() => set_i_access_level(l.i_access_level)}
                                        active={i_access_level === l.i_access_level}
                                    >
                                        {l.i_access_level}. {l.s_name}
                                    </Button>
                                )) 
                            }
                        </Row>
                    </Col>
                </Row>
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col md={12}>
                        <Row className={'mb-2'}>
                            <Col md={12}>
                                <Button 
                                    className={'d-inline mr-5'}
                                    onClick={() => setModalCreateLink(true)}
                                >
                                    Create Image Link
                                </Button>
                                <Button 
                                    className={'d-inline'}
                                    onClick={() => setModalLinkWiki(true)}
                                >
                                    Link to Another Wiki
                                </Button>
                                {
                                    createdLink.length > 0 && 
                                    <Row>
                                        <Col md={12}>
                                            <Label className={'d-inline mr-1'}>Last link:</Label>
                                            <Label id={'copyLink2'} className={'d-inline mr-1'}>
                                                {createdLink}
                                            </Label>
                                            <Clipboard data-clipboard-target="#copyLink2" className={'d-inline btn btn-secondary'}>
                                                <i className={'fas fa-copy'} style={{ fontSize: '20px' }} />
                                            </Clipboard>
                                        </Col>
                                    </Row>
                                }
                            </Col>
                        </Row>
                        <SunEditor 
                            enable={true} 
                            ref={editorRef}
                            defaultValue={s_wiki}
                            setOptions={{
                                buttonList: buttonList.complex
                            }}
                            height={500}
                        />
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter style={{width: '100%'}}>
                <Row style={{width: '100%'}}>
                    <Col md={10}>
                        <Label className={'d-inline mr-2'}>Tags:</Label>
                        {
                            tags && tags.length > 0 && tags.map((t, i) => (
                                <button 
                                    className={'default btn btn-info d-inline mr-2'} 
                                    key={i}
                                >
                                    {t}
                                    <i 
                                        className={'fal fa-times-circle ml-2'} 
                                        style={{ fontSize: '18px' }} 
                                        onClick={() => removeTag(t)}
                                    />
                                </button>
                            ))
                        }
                        <Button onClick={() => setModalAddTag(true)}>New</Button>
                    </Col>
                    <Col md={2}>
                        <Button 
                            color="primary" 
                            className={'d-inline mr-1'}
                            onClick={() => createUpdateWiki()}
                            disabled={!enableSave()}
                        >
                            Save
                        </Button>                
                        <Button color="secondary" className={'d-inline'} onClick={toggle}>Exit</Button>
                    </Col>
                </Row>
            </ModalFooter>
        </Modal>
    );
}