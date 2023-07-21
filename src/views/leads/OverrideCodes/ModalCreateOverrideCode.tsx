import React from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Button } from 'reactstrap';
import styled from 'styled-components';
import Clipboard from 'react-clipboard.js';
import BackButton from '../../../components/custom/BackButton';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    s_reason: string;
    set_s_reason: React.Dispatch<React.SetStateAction<string>>;
    s_override: string;
    createOverride: () => Promise<void>;
}

export default function ModalCreateOverrideCode ({
    modal,
    setModal,
    s_reason,
    set_s_reason,
    s_override,
    createOverride
}: Props) {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>Create Override Code</h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <FormGroup className={'mt-2'}>
                        <Label>Reason for Override</Label>
                        <Input type={'textarea'} value={s_reason} onChange={(e: any) => set_s_reason(e.target.value)} />
                    </FormGroup>
                    <Button 
                        className={'my-2 d-block'} 
                        onClick={() => createOverride()}
                        disabled={s_reason.length < 1}
                    >
                        Create Override
                    </Button>
                    <Label className={'d-inline'}>Override Code</Label>
                    {
                        s_override.length > 0 && 
                        <Clipboard data-clipboard-target="#copy" className={'d-inline ml-2 btn btn-secondary'}>
                            <i className={'fas fa-copy'} style={{ fontSize: '20px' }} />
                        </Clipboard>
                    }
                    <div className={'bg-danger text-center mt-2'} style={{ height: '50px' }}>
                        <h1 className={'mt-2 text-white'} id={'copy'}>{s_override}</h1>
                    </div>
            </ModalBody>
        </Modal>
    );
}

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;
