import React, { useMemo } from 'react';
import { ModalFooter } from 'reactstrap';
import { Row, Col, Modal, ModalBody, ModalHeader, Input, Button } from 'reactstrap';
import { IRack } from '../../../globals/interfaces';
import { ICompany, IDockAwb } from './interfaces';

interface Props {
    modal: boolean,
    setModal: (modal: boolean) => void,
    rejectType: 'COMPANY' | 'AWB'
    selectedAwb: IDockAwb,
    selectedCompany: ICompany,
    s_dock_reject_reason: string,
    set_s_dock_reject_reason: (s_dock_reject_reason: string) => void,
    rejectDockAwb: () => Promise<void>
}

export default function ModalReject ({
    modal,
    setModal,
    rejectType,
    selectedAwb,
    selectedCompany,
    s_dock_reject_reason,
    set_s_dock_reject_reason,
    rejectDockAwb
}: Props) {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader className={'py-1'}>
                <i className="fa-solid fa-left mr-2 d-inline text-success" onClick={toggle} style={{ fontSize: '40px' }}></i>
                <h4 className={'d-inline'}>Reject {rejectType === 'AWB' ? `AWB ${selectedAwb.s_mawb}` : `COMPANY ${selectedCompany.s_trucking_company}`}</h4>
            </ModalHeader>
            <ModalBody className={'text-center'}>
                <h4>Reject Reason</h4>
                <Input type={'select'} value={s_dock_reject_reason} onChange={(e: any) => set_s_dock_reject_reason(e.target.value)}>
                    <option></option>
                    <option value={'TEST'}>TEST</option>
                </Input>
            </ModalBody>
            <ModalFooter className={'py-1'}>
                <Button 
                    className={'extra-large-button-text py-2'}
                    color={'danger'}
                    disabled={!s_dock_reject_reason}
                    onClick={() => rejectDockAwb()}
                >
                    Confirm
                </Button>
            </ModalFooter>
        </Modal>
    );
}