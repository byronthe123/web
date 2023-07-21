import React, { useMemo } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import { formatEmail } from '../../../utils';
import _ from 'lodash';
import { DeleteLevel, IAirline, IExtendedFFM, IExtendedULD } from './interfaces';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    deleteLevel: DeleteLevel;
    deleteFlight: string;
    deleteUld: string;
    deleteId: string;
    confirmDelete: () => Promise<void>;
    selectedFlight: IAirline | undefined;
    selectedUld: IExtendedULD | undefined;
    selectedAwb: IExtendedFFM | undefined;
}

export default function ModalConfirmDelete ({
    modal,
    setModal,
    deleteLevel,
    deleteFlight, 
    deleteUld,
    deleteId,
    confirmDelete,
    selectedFlight,
    selectedUld,
    selectedAwb
}: Props) {

    const toggle = () => setModal(!modal);

    const resolveMessage = () => {
        if (deleteLevel === 'FLIGHT' && selectedFlight) {
            return (
                <div>
                    <h4>Status: {selectedFlight.s_status}. Last modified by {formatEmail(selectedFlight.s_modified_by)} at {moment.utc(selectedFlight.t_modified).format('MM/DD/YYYY HH:mm:ss')}</h4>
                    <h4>Are you sure you want to delete flight {deleteFlight}?</h4>
                </div>
            );
        } else if (deleteLevel === 'ULD' && selectedUld) {
            return (
                <div>
                    <h4>Status: {selectedUld.s_status}. Last modified by {formatEmail(selectedUld.s_modified_by)} at {moment.utc(selectedUld.t_modified).format('MM/DD/YYYY HH:mm:ss')}</h4>
                    <h4>Are you sure you want to delete ULD {deleteUld} in Flight {deleteFlight}?</h4>
                </div>
            );
        } else if (deleteLevel === 'AWB' && selectedAwb) {
            return (
                <div>
                    <h4>Status: {selectedAwb.s_status}. Last modified by {formatEmail(selectedAwb.s_modified_by)} at {moment.utc(selectedAwb.t_modified).format('MM/DD/YYYY HH:mm:ss')}</h4>
                    <h4>Are you sure you want to delete AWB with ID {deleteId} in Flight {deleteFlight}?</h4>
                </div>
            );
        }
    }

    const disableDelete = useMemo(() => {
        const array = [selectedFlight, selectedUld, selectedAwb];
        for (let i = 0; i < array.length; i++) {
            const value = _.get(array[i], 's_status', '');
            if (value === 'DELETED') {
                return true;
            }
        }
        return false;
    }, [selectedFlight, selectedUld, selectedAwb]);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader>Mark {deleteLevel} as Deleted</ModalHeader>
            <ModalBody>
                {resolveMessage()}
            </ModalBody>
            <ModalFooter>
                <Button 
                    color="danger" 
                    onClick={() => confirmDelete()}
                    disabled={disableDelete}
                >
                    {
                        disableDelete ? 
                            'Already Deleted' :
                            'Delete'
                    }
                </Button>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}