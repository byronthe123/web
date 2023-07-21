import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonGroup, FormGroup, Label, Input } from 'reactstrap';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { api, notify, validateAwb } from '../../../utils';
import useLoading from '../../../customHooks/useLoading';
import MawbInput from '../../custom/MawbInput';
import styled from 'styled-components';

export default ({
    modal,
    setModal,
    selectedAwb,
    user,
    refresh
}) => {

    const toggle = () => setModal(!modal);
    const [s_mawb, set_s_mawb] = useState('');
    const [s_type, set_s_type] = useState('');
    const { setLoading } = useLoading();

    useEffect(() => {
        set_s_mawb('');
        set_s_type('');
    }, [modal]);

    const createAwb = async() => {
        setLoading(true);
        const agent = user && user.s_email;
        const now = moment().local().format('MM/DD/YYYY hh:mm A');
        const t_created = now;
        const s_created_by = agent;
        const t_modified = now;
        const s_modified_by = agent

        const {
            s_trucking_company,
            s_trucking_driver,
            s_trucking_cell,
            b_trucking_sms,
            s_trucking_email,
            s_trucking_language,
            s_transaction_id,
            s_unit,
            s_airline,
            s_airline_code,
            s_driver_photo_link
        } = selectedAwb;

        const s_status = 'DOCUMENTING';
        const s_priority = 'REGULAR';
        const t_kiosk_submitted = now;
        const s_state = selectedAwb.s_state === 'MIXED' || s_type !== selectedAwb.s_state ? 'MIXED' : s_type;
        const s_counter_ownership_agent = agent;
        const t_counter_ownership = now;
        const s_mawb_id = uuidv4();
        const t_kiosk_start = now;


        const data = {
            t_created,
            s_created_by,
            t_modified,
            s_modified_by,
            s_trucking_company,
            s_trucking_driver,
            s_trucking_cell,
            b_trucking_sms,
            s_trucking_email,
            s_trucking_language,
            s_mawb,
            s_type,
            s_status,
            s_priority,
            s_transaction_id,
            t_kiosk_submitted,
            s_state,
            s_counter_ownership_agent,
            t_counter_ownership,
            s_mawb_id,
            s_unit,
            s_airline,
            s_airline_code,
            t_kiosk_start,
            s_driver_photo_link
        }

        await api('post', 'createAwb', data);

        setModal(false);
        setLoading(false);
        notify('AWB Created');
        refresh && refresh();
    };

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader>Create AWB</ModalHeader>
                <ModalBody className={'text-center'}>
                    <CustomFormGroup>
                        <Label>AWB Nubmer:</Label>
                        <MawbInput 
                            value={s_mawb} 
                            onChange={set_s_mawb}
                        />
                    </CustomFormGroup>
                    <FormGroup>
                        <ButtonGroup>
                            {
                                ['IMPORT', 'EXPORT', 'TRANSFER-IMPORT'].map((type, i) =>
                                    <Button 
                                        onClick={() => set_s_type(type)} 
                                        active={s_type === type}
                                        key={i}
                                    >
                                        {type}
                                    </Button>
                                )
                            }
                        </ButtonGroup>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" disabled={!validateAwb(s_mawb)} onClick={() => createAwb()}>Create</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

const CustomFormGroup = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
`;