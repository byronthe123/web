import React, { useMemo } from 'react';
import { ModalFooter } from 'reactstrap';
import { Row, Col, Modal, ModalBody, ModalHeader, Input, Button } from 'reactstrap';
import { IRack } from '../../../globals/interfaces';
import { IDockAwb } from './interfaces';

interface Props {
    modal: boolean,
    setModal: (modal: boolean) => void
    selectedLocation: IRack,
    splitPieces: number,
    setSplitPieces: (pieces: number) => void,
    splitLocation: () => Promise<void>
}

export default function ModalSplit ({
    modal,
    setModal,
    selectedLocation,
    splitPieces,
    setSplitPieces,
    splitLocation
}: Props) {

    const toggle = () => setModal(!modal);

    const enableSplit = useMemo(() => {
        return splitPieces > 1 && splitPieces < Number(selectedLocation.i_pieces);
    }, [splitPieces, selectedLocation]);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader className={'py-1'}>
                <i className="fa-solid fa-left mr-2 d-inline text-success" onClick={toggle} style={{ fontSize: '40px' }}></i>
                <h4 className={'d-inline'}>Split Location {selectedLocation.s_location}</h4>
            </ModalHeader>
            <ModalBody className={'text-center'}>
                <h4>Current pieces in this location: {selectedLocation.i_pieces}</h4>
                <div className={'d-block'}>
                    <h4 className={'d-inline'}>Pieces you are removing from this location: </h4>
                    <Input 
                        type={'number'} 
                        style={{ width: '100px', fontSize: '18px' }} 
                        className={'d-inline'}
                        onChange={(e: any) => setSplitPieces(e.target.value)}
                    />
                </div>
                <h4 className={'mt-2'}>Pieces remaining in this location: {Number(selectedLocation.i_pieces) - splitPieces}</h4>
            </ModalBody>
            <ModalFooter className={'py-1'}>
                <Button 
                    className={'extra-large-button-text py-2'}
                    disabled={!enableSplit}
                    onClick={() => splitLocation()}
                >
                    Confirm
                </Button>
            </ModalFooter>
        </Modal>
    );
}