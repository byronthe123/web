import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';

import ReactTable from '../../custom/ReactTable';
import BackButton from '../../custom/BackButton';
import { IAirport } from '../../../globals/interfaces';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    data: Array<IAirport>;
}

export default function ModalAirports ({
    modal,
    setModal,
    data
}: Props) {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>Airports List</h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <ReactTable 
                    data={data}
                    mapping={[{
                        name: 'Code',
                        value: 'code'
                    }, {
                        name: 'Name',
                        value: 'name'
                    }]}
                    index
                    numRows={15}
                />
            </ModalBody>
        </Modal>
    );
}

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;
