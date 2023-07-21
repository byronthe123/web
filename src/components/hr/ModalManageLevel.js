import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Row, Col, ButtonGroup, Label, Input } from 'reactstrap';
import data from '../../constants/menu';

export default ({
    modal,
    setModal,
    accessTabs,
    s_name,
    i_access_level,
    set_s_name,
    createAccessLevel,
    selectedTabs,
    addTab,
    newLevel,
    selectedLevel,
    deleteAccessLevel
}) => {

    const toggle = () => setModal(!modal);

    const enableCreateLevel = () => {
        return selectedTabs.length > 0 && s_name.length > 0;
    }

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} size={'lg'}>
                <ModalHeader>{newLevel ? 'Create' : 'Update'} Level</ModalHeader>
                <ModalBody className='text-center'>
                    <h4>Next Level: {i_access_level}</h4>
                    <h4>Level Name</h4>
                    <Input type='text' className='text-center' value={s_name} onChange={(e) => set_s_name(e.target.value)} />
                    <Row className='mt-2'>
                        <Col md={12}>
                            <ButtonGroup>
                                {
                                    accessTabs.map((t, i) => 
                                        <Button
                                            key={i}
                                            value={t.id}
                                            onClick={() => addTab(t.id)}
                                            active={selectedTabs.includes(t.id)}
                                        >
                                            {t.s_tab_name}
                                        </Button>
                                    )
                                }
                            </ButtonGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" disabled={!enableCreateLevel()} onClick={() => createAccessLevel()}>Submit</Button>{' '}
                    <Button color='danger' onClick={() => deleteAccessLevel()} >Delete</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}