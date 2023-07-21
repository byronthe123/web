import React, { useEffect, useMemo, useState } from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup } from 'reactstrap';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAppContext } from '../../context';
import BackButton from '../custom/BackButton';
import ActionIcon from '../custom/ActionIcon';
import { ILog } from '../../globals/interfaces';
import MawbInput from '../custom/MawbInput';
import { Input, Textarea } from '../custom/hookForm/Input';
import FormError from '../custom/FormError2';
import { validateAwb, api, getDate, notify } from '../../utils';
import ViewLogs from './ViewLogs';

export default function LogAddNotes () {

    const { user, logAddNotes, searchAwb } = useAppContext();
    const { 
        addNotesModal, 
        setAddNotesModal,
        showNotes
    } = logAddNotes;

    const { searchAwbNum } = searchAwb;

    const { register, getValues, setValue, reset, handleSubmit, formState: { isValid, errors } } = useForm({
        mode: 'onChange',
        resolver: yupResolver(yup.object().shape({
            s_mawb: yup.string().required().test('Validate AWB', 'AWB must be valid', (value: string) => validateAwb(value)),
            s_hawb: yup.string().notRequired().nullable(),
            s_notes: yup.string().required('Notes are required'),
            s_created_by: yup.string().email().required(),
            t_created: yup.date().required(),
            s_procedure: yup.string().required()
        }))
    });

    const setMawb = (value: string) => {
        setValue('s_mawb', value, { shouldValidate: true });
    }

    const s_mawb = getValues('s_mawb');

    const [logs, setLogs] = useState<Array<ILog>>([]);

    useEffect(() => {
        const getLogs = async () => {
            const s_airline_codes = user.s_airline_codes.join(',');
            const res = await api('get', `logs/${s_mawb}?s_airline_codes=${s_airline_codes}`);
            setLogs(res.data);
        }
        if (showNotes && validateAwb(s_mawb)) {
            getLogs();
        } else {
            setLogs([]);
        }
    }, [showNotes, s_mawb]);

    useEffect(() => {
        if (addNotesModal) {
            reset({
                s_mawb: searchAwbNum || '',
                s_hawb: '',
                s_notes: '',
                s_created_by: user.s_email,
                t_created: getDate(),
                s_procedure: 'controller: createLogNote',
                s_priority: 'NORMAL'
            });
        }
    }, [addNotesModal, reset, searchAwbNum, user.s_email]);

    const submitForm = async (values: any) => {
        console.log(values);
        const res = await api('post', 'logs', values);
        if (res.status === 204) {
            setAddNotesModal(false);
            notify('Notes saved');
        }
    }

    const toggle = () => setAddNotesModal(!addNotesModal);

    return (
        <Modal isOpen={addNotesModal} toggle={toggle} className={showNotes ? 'responsive-modal' : null}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>Add Notes</h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <FormContainer>
                    <MawbHawbContainer>
                        <FormGroup>
                            <Label>MAWB <FormError errors={errors} name={'s_mawb'} /></Label>
                            <MawbInput 
                                value={getValues('s_mawb')}
                                onChange={setMawb}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>HAWB</Label>
                            <Input {...register('s_hawb')} error={Boolean(errors['s_hawb'])} />
                        </FormGroup>
                    </MawbHawbContainer>
                    <NotesFieldContainer>
                        <Label>Notes <FormError errors={errors} name={'s_notes'} /></Label>
                        <NotesInput {...register('s_notes')} error={Boolean(errors['s_notes'])} style={{ height: '74%' }} />
                    </NotesFieldContainer>
                </FormContainer>
                {
                    showNotes && 
                    <ShowNotesContainer>
                        <ViewLogs 
                            data={logs}
                        />
                    </ShowNotesContainer>
                }
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <FooterButtonsContainer>
                        <ActionIcon 
                            type={'save'} 
                            onClick={handleSubmit(submitForm)} 
                            disabled={!isValid}
                        />
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

const FormContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const MawbHawbContainer = styled.div`
    flex: 1;
`;

const NotesFieldContainer = styled.div`
    flex: 3;
`;

const NotesInput = styled(Textarea)`
    height: 74%;
`;

const ShowNotesContainer = styled.div`
    width: 100%;
`;