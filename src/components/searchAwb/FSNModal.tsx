import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, Table } from 'reactstrap';
import styled from 'styled-components';

import BackButton from '../custom/BackButton';
import { IFsnCbpJoin } from './interfaces';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    selectedItem: IFsnCbpJoin | undefined;
}

const resolveHolds = (item: IFsnCbpJoin) => {
    const keys = [{
        name: 'Customs Hold',
        value: 'b_customs_hold'
    }, {
        name: 'USDA Hold',
        value: 'b_usda_hold'
    }, {
        name: 'Choice Hold',
        value: 'b_hold'
    }, {
        name: 'General Order',
        value: 'b_general_order'
    }];

    const holds = [];

    for (let i = 0; i < keys.length; i++) {
        //  @ts-ignore
        console.log(item, keys[i].value, item[keys[i].value]);
        //  @ts-ignore
        if (item[keys[i].value]) {
            holds.push(keys[i].name);
        }
    }

    return holds.toString();
}

export default function FsnModal ({
    modal,
    setModal,
    selectedItem
}: Props) {

    const toggle = () => setModal(!modal);
    const [holds, setHolds] = useState('');

    useEffect(() => {
        if (selectedItem) {
            setHolds(resolveHolds(selectedItem));
        }
    }, [selectedItem]);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader className={'d-flex'}>
                <FooterHeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2 pt-2'}>Record Detail</h4>
                </FooterHeaderContainer>
            </ModalHeader>
            {
                selectedItem && 
                <ModalBody>
                    <Table>
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td>MAWB</td>
                                <td>{selectedItem.s_mawb}</td>
                            </tr>
                            <tr>
                                <td>HAWB</td>
                                <td>{selectedItem.s_hawb}</td>
                            </tr>
                            <tr>
                                <td>Location</td>
                                <td>{selectedItem.s_location}</td>
                            </tr>
                            <tr>
                                <td>Flight</td>
                                <td>{selectedItem.s_arr}</td>
                            </tr>
                            <tr>
                                <td>Message</td>
                                <td>{selectedItem.s_csn}</td>
                            </tr>
                            <tr>
                                <td>Disposition Code</td>
                                <td>{selectedItem.s_csn_code}</td>
                            </tr>
                            <tr>
                                <td>Hold Type</td>
                                <td>{holds}</td>
                            </tr>
                            <tr>
                                <td>Description</td>
                                <td>{selectedItem.s_description}</td>
                            </tr>
                            <tr>
                                <td>Reason</td>
                                <td>{selectedItem.s_reason}</td>
                            </tr>
                        </tbody>
                    </Table>
                </ModalBody>
            }
        </Modal>
    );
}

const FooterHeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;
