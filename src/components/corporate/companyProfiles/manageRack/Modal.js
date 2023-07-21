import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, ButtonGroup } from 'reactstrap';

export default ({
    modal,
    setModal,
    value,
    setValue,
    allowDuplicateLoc,
    setAllowDuplicateLoc,
    action,
    type,
    tower,
    level,
    handleUpdate,
    enableProcess
}) => {

    const toggle = () => setModal(!modal);
    const title = 
        type === 'LEVEL' ?
            `FOR TOWER ${tower}` :
        type === 'LOCATION' ?
            `FOR LEVEL ${level}` :
        type === 'SPECIAL' ?
            'LOCATION' :
            '';

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader>
                {action} {type} {title}
            </ModalHeader>
            <ModalBody>
                <Input 
                    type={'text'} 
                    value={value} 
                    onChange={(e) => setValue(e.target.value)}
                    className={'d-inline'} 
                    style={{ width: type === 'LOCATION' ? '50%' : '100%'  }}
                />
                {
                    type === 'LOCATION' && 
                        <>
                            <h6 className={'d-inline ml-2'}>
                                (Location = {`${level}${value}`})
                            </h6>
                            <div className={'d-block mx-2 px-2 text-white'}>-</div>
                            <h6 className={'d-inline mr-2'}>Allow Duplicates:</h6>
                            <ButtonGroup className={'d-inline mt-2'}>
                                {
                                    [true, false].map((option, i) => (
                                        <Button 
                                            onClick={() => setAllowDuplicateLoc(option)}
                                            active={option === allowDuplicateLoc}
                                            key={i}
                                        >
                                            {option ? 'Yes' : 'No'}
                                        </Button>
                                    ))
                                }
                            </ButtonGroup>
                        </>
                }
            </ModalBody>
            <ModalFooter>
                <Button 
                    color="primary" 
                    disabled={!enableProcess}
                    onClick={() => handleUpdate()}
                >
                    {action}
                </Button>
                {
                    action !== 'CREATE' && 
                        <Button 
                            color="danger" 
                            onClick={() => handleUpdate('DELETE')}
                        >
                            DELETE
                        </Button>
                }
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}