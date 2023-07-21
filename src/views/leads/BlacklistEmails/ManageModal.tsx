import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label, Button } from 'reactstrap';
import { formatEmail } from '../../../utils';
import SaveButton from '../../../components/custom/SaveButton';
import {IBlacklistEmail, IMap} from './interfaces';

interface Props {
    modal: boolean,
    setModal: (state: boolean) => void,
    create: boolean,
    s_email: string,
    set_s_email: (s_email: string) => void,
    s_reason: string,
    set_s_reason: (s_email: string) => void,
    handleCreateUpdate: () => Promise<void>,
    deleteBlacklistEmail: (id: number) => Promise<void>,
    selectedItem: IBlacklistEmail,
    existingMap: IMap,
    emailsMap: IMap,
    deleteFoundBlacklistEmail: (s_email: string) => Promise<void>
}

export default function ManageModal ({
    modal,
    setModal,
    create,
    s_email,
    set_s_email,
    s_reason,
    set_s_reason,
    handleCreateUpdate,
    deleteBlacklistEmail,
    selectedItem,
    existingMap,
    emailsMap,
    deleteFoundBlacklistEmail
}: Props) {

    console.log(existingMap);

    const toggle = () => setModal(!modal);

    const emailExists = useMemo(() => {
        if (!create) {
            if (s_email.toUpperCase() !== selectedItem.s_email && existingMap[s_email.toUpperCase()]) {
                return true;
            } else {
                return false;
            }
        } else {
            return existingMap[s_email.toUpperCase()];
        }
    }, [existingMap, s_email, create, selectedItem.s_email]);


    const foundBlacklisted = useMemo(() => {
        if (s_email) {
            return emailsMap[s_email.toUpperCase()];
        }
    }, [emailsMap, s_email]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader>{create ? 'Add'  : 'Update'} Email</ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label>
                        Email 
                        {
                            foundBlacklisted && 
                                <span className={'bg-warning text-danger ml-2 font-weight-bold'}>
                                    Found in List: Created by {formatEmail(foundBlacklisted.s_created_by)}  at {dayjs(foundBlacklisted.t_created).format('MM/DD/YYYY HH:mm')} 
                                    <i className={'fas fa-trash d-inline text-danger ml-2'} onClick={() => deleteFoundBlacklistEmail(s_email)} />
                                </span>
                        }
                        {
                            emailExists && <span className={'bg-warning text-danger ml-2'}>Already exists</span>
                        }
                    </Label>
                    <Input type={'text'} value={s_email} onChange={(e: any) => set_s_email(e.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Label>Reason</Label>
                    <Input type={'textarea'} value={s_reason} onChange={(e: any) => set_s_reason(e.target.value)} />
                </FormGroup>
            </ModalBody>
            <ModalFooter style={{ width: '100%' }} className={'pl-0 pt-2'}>
                <Row style={{ width: '100%' }}>
                    {
                        !create && 
                        <Col md={12}>
                            Last modified by {formatEmail(selectedItem.s_created_by)} at {dayjs(selectedItem.t_modified).format('MM/DD/YYYY HH:mm:ss')}
                        </Col>
                    }
                    <Col md={12}>
                        <SaveButton 
                            enableSave={s_email && s_email.length > 0 && !emailExists}
                            handleSave={() => handleCreateUpdate()}
                            className={'d-inline float-right'}
                        />
                        <i 
                            className={'fas fa-trash d-inline text-danger text-large mt-2 float-left'} 
                            onClick={() => deleteBlacklistEmail(selectedItem.id)}
                        />
                    </Col>
                </Row>
            </ModalFooter>
        </Modal>
    );
}