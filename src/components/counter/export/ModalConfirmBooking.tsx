import React from 'react';
import { Label } from 'reactstrap';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
} from 'reactstrap';
import styled from 'styled-components';
import classnames from 'classnames';

import BackButton from '../../custom/BackButton';
import ActionIcon from '../../custom/ActionIcon';
import { IExport } from '../../../globals/interfaces';
import { Field } from 'formik';
import moment from 'moment';
import { ButtonGroup } from 'reactstrap';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    selectedAwb: IExport;
    values: any;
    setFieldValue: (name: string, value: any) => void;
    setBookingConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalConfirmBooking({
    modal,
    setModal,
    selectedAwb,
    values,
    setFieldValue,
    setBookingConfirmed
}: Props) {

    console.log(setBookingConfirmed);

    const disableConfirm = !values.s_flight_number || !values.t_depart_date || !values.s_transport_type;
    const confirmBooking = () => {
        setBookingConfirmed(true);
        setModal(false);
    }
    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>
                        Confirm booking for {selectedAwb.s_mawb}
                    </h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label>Booked Flight Number</Label>
                    <Field
                        name={'s_flight_number'}
                        type={'text'}
                        className={'form-control d-inline'}
                        style={{ width: '350px' }}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Booked Flight Date</Label>
                    <Field
                        name={'t_depart_date'}
                        type={'date'}
                        min={moment().format('YYYY-MM-DD')}
                        className={classnames('form-control d-inline', {
                            'bg-warning':
                                !values.t_depart_date ||
                                values.t_depart_date.length < 1,
                        })}
                        style={{ width: '350px' }}
                    />
                </FormGroup>
                <FormGroup>
                    <Label className={'d-block'}>Aircraft Type:</Label>
                    <ButtonGroup>
                        {['CAO', 'PAX'].map((type, i) => (
                            <button
                                onClick={() =>
                                    setFieldValue('s_transport_type', type)
                                }
                                // @ts-ignore
                                active={values.s_transport_type === type}
                                className={classnames(
                                    'btn',
                                    values.s_transport_type === type
                                        ? 'btn-success'
                                        : 'btn-outline-dark'
                                )}
                                key={i}
                            >
                                {type}
                            </button>
                        ))}
                    </ButtonGroup>
                </FormGroup>
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <FooterButtonsContainer>
                        <ActionIcon disabled={disableConfirm} type={'save'} onClick={() => confirmBooking()} />
                    </FooterButtonsContainer>
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
    justify-content: flex-end;
`;
