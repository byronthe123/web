import React, { useState, useRef } from 'react';
import { ModalFooter } from 'reactstrap';
import { Row, Col, Modal, ModalBody, ModalHeader, Table, Button } from 'reactstrap';
import { IAwbRackDataMap, ICompany, IDockAwb } from './interfaces';
import ChecklistTable from './ChecklistTable';
import SignatureCanvas from 'react-signature-canvas';
import _ from 'lodash';

interface Props {
    modal: boolean,
    setModal: (modal: boolean) => void,
    selectedCompany: ICompany,
    rackDataMap: IAwbRackDataMap,
    finishDocking: (base64: string) => Promise<void>
}

export default function ModalChecklist ({
    modal,
    setModal,
    selectedCompany,
    rackDataMap,
    finishDocking
}: Props) {

    const toggle = () => setModal(!modal);
    const [step, setStep] = useState<'LIST' | 'SIGN'>('LIST');
    const signatureRef = useRef();
    const [signInteraction, setSignInteraction] = useState(false);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader className={'py-1'}>
                <i className="fa-solid fa-left mr-2 d-inline text-success" onClick={toggle} style={{ fontSize: '40px' }}></i>
                <h4 className={'d-inline'}>Checklist AWBS: </h4>
            </ModalHeader>
            <ModalBody className={'text-center py-0 px-0'} style={{ height: '400px', overflowY: 'scroll' }}>
                {
                    step === 'LIST' ? 
                    <Row className={'py-4 px-4'}>
                        {
                            selectedCompany.awbs.map((awb, i) => (
                                <ChecklistTable 
                                    rackDataMap={rackDataMap}
                                    awb={awb}
                                    key={i}
                                />
                            ))
                        }
                    </Row> : 
                    <Row style={{ height: '320px' }}>
                        <div style={{ backgroundColor: 'blue', height: '350px', width: '500px', marginTop: '10px', border: '4px solid blue' }} className={'mx-auto'}>
                            <SignatureCanvas 
                                ref={signatureRef}
                                penColor={'black'}
                                canvasProps={{
                                    width: 500, 
                                    height: 350, 
                                    className: 'sigCanvas',
                                    border: '2px solid black'
                                }}
                                backgroundColor={'white'}
                                onEnd={() => setSignInteraction(true)}
                            />
                        </div>
                    </Row>
                }
            </ModalBody>
            <ModalFooter className={'py-1'}>
                {
                    step === 'LIST' ? 
                        <Button 
                            className={'extra-large-button-text py-2'}
                            color={'danger'}
                            onClick={() => setStep('SIGN')}
                        >
                            Print Name
                        </Button> :
                        <Row style={{ width: '100%' }}>
                            <Col md={12}>
                                <div className={'float-left'}>
                                    <Button
                                        className={'extra-large-button-text py-2'}
                                        color={'secondary'}
                                        onClick={() => setStep('LIST')}
                                    >
                                        View List
                                    </Button>
                                    <Button
                                        className={'extra-large-button-text py-2'}
                                        color={'primary'}
                                        // @ts-ignore
                                        onClick={() => signatureRef.current.clear()}
                                    >
                                        Clear
                                    </Button>
                                </div>
                                <Button 
                                    className={'extra-large-button-text py-2 float-right'}
                                    color={'danger'}
                                    // @ts-ignore
                                    // disabled={signatureRef && signatureRef.current && signatureRef.current.isEmpty() ? true : false}
                                    disabled={!signInteraction}
                                    // @ts-ignore
                                    onClick={() => finishDocking(signatureRef.current.toDataURL())}
                                >
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                }

            </ModalFooter>
        </Modal>
    );
}