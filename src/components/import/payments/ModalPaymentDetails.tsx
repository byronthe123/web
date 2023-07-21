import React, { useState } from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';

import BackButton from '../../custom/BackButton';
import ActionIcon from '../../custom/ActionIcon';
import {
    createdUpdatedInfo,
    formatCost,
    formatDatetime,
    formatEmail,
} from '../../../utils';
import { IPayment } from '../../../globals/interfaces';
import { Table } from 'reactstrap';
import { DeletePayment } from './interfaces';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    selectedPayment: IPayment | undefined;
    deletePayment: DeletePayment;
}

export default function ModalPaymentDetails({
    modal,
    setModal,
    selectedPayment,
    deletePayment,
}: Props) {
    const [loading, setLoading] = useState(false);
    const toggle = () => setModal(!modal);

    const handleDeletePayment = async (selectedPayment: IPayment) => {
        setLoading(true);
        const result = await deletePayment(selectedPayment);
        if (result) {
            setModal(false);
        }
        setLoading(false);
    };

    if (!selectedPayment) {
        return null;
    }

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>
                        Record {selectedPayment.i_id}: MAWB:{' '}
                        {selectedPayment.s_awb}, HAWB: {selectedPayment.s_hawb}
                    </h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <TableContainer>
                    <CustomTable>
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td>Status</td>
                                <td>{selectedPayment.s_status}</td>
                            </tr>
                            <tr>
                                <td>Amount</td>
                                <td>{formatCost(selectedPayment.f_amount)}</td>
                            </tr>
                            <tr>
                                <td>Type</td>
                                <td>{selectedPayment.s_payment_type}</td>
                            </tr>
                            <tr>
                                <td>Method</td>
                                <td>{selectedPayment.s_payment_method}</td>
                            </tr>
                            <tr>
                                <td>Name</td>
                                <td>{selectedPayment.s_name}</td>
                            </tr>
                        </tbody>
                    </CustomTable>
                    <CustomTable>
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td>Processed</td>
                                <td>
                                    {selectedPayment.b_processed ? 'YES' : 'NO'}
                                </td>
                            </tr>
                            <tr>
                                <td>Processed On</td>
                                <td>
                                    {formatDatetime(
                                        selectedPayment.t_processed
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td>Processed By</td>
                                <td>
                                    {formatEmail(
                                        selectedPayment.s_processed_by
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td>Override Approved</td>
                                <td>
                                    {selectedPayment.s_payment_method !==
                                    'OVERRIDE'
                                        ? 'NA'
                                        : selectedPayment.b_override_approved
                                        ? 'YES'
                                        : 'NO'}
                                </td>
                            </tr>
                            <tr>
                                <td>Notes</td>
                                <td>{selectedPayment.s_notes}</td>
                            </tr>
                        </tbody>
                    </CustomTable>
                </TableContainer>
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <Label>{createdUpdatedInfo(selectedPayment)}</Label>
                    {selectedPayment.s_payment_method !== 'PAYMENT' && (
                        <FooterButtonsContainer>
                            <ActionIcon
                                type={'delete'}
                                onClick={() =>
                                    handleDeletePayment(selectedPayment)
                                }
                                loading={loading}
                            />
                        </FooterButtonsContainer>
                    )}
                </FooterContentContainer>
            </ExpandedFooter>
        </Modal>
    );
}

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const ExpandedFooter = styled(ModalFooter)`
    width: 100%;
`;

const FooterContentContainer = styled.div`
    width: 100%;
`;

const FooterButtonsContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
`;

const TableContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const CustomTable = styled(Table)``;
