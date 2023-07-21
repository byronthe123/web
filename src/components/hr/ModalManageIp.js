import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Input } from 'reactstrap';
import SaveButton from '../custom/SaveButton';
import DeleteButton from '../custom/DeleteButton';

export default function ModalManageIp ({
    modal,
    setModal,
    ipAddress,
    setIpAddress,
    createNewIp,
    saveIp
}) {

    const toggle = () => setModal(!modal);
    const [allAccess, setAllAccess] = useState(false);

    useEffect(() => {
        setAllAccess(ipAddress === '*');
    }, [ipAddress]);

    const handleChangeOption = (allAccess) => {
        setAllAccess(allAccess);
        if (allAccess) {
            setIpAddress('*');
        } else {
            setIpAddress('');
        }
    }

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader>{createNewIp ? 'Create' : 'Update'} IP Address</ModalHeader>
            <ModalBody>
                <Row onClick={() => handleChangeOption(true)} style={{ height: '100px', backgroundColor: allAccess && '#DAF7A6' }}>
                    <Col md={12}>
                        <h6>Access from Anywhere</h6>
                        <Input type={'text'} value={'*'} disabled />
                    </Col>
                </Row>
                <hr />
                <Row onClick={() => handleChangeOption(false)} style={{ height: '100px', backgroundColor: !allAccess && '#DAF7A6' }}>
                    <Col md={12}>
                        <h6>Specific IP Subnet</h6>
                        <Input type={'text'} value={allAccess ? '' : ipAddress} onChange={(e) => setIpAddress(e.target.value)} disabled={allAccess} />
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter style={{ width: '100%' }}>
                <Row style={{ width: '100%' }}>
                    <Col md={12}>
                        {
                            !createNewIp && 
                            <DeleteButton 
                                enableSave={true}
                                handleDelete={() => saveIp(true)}
                                className={'float-left'}
                            />
                        }
                        <SaveButton 
                            enableSave={true}
                            handleSave={() => saveIp(false)}
                            className={'float-right'}
                        />
                    </Col>
                </Row>
            </ModalFooter>
        </Modal>
    );
}