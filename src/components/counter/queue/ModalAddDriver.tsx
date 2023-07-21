import React, { useEffect, useState } from 'react';
import uuidv4 from 'uuid/v4';
import moment from 'moment';
import axios from 'axios';
import Webcam from "react-webcam";
import { Input, Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { Field } from 'formik';
import { Wizard, Steps, Step } from 'react-albus';
import BottomNavigation from '../../wizard-hooks/BottomNavigation';
import TopNavigation from '../../wizard-hooks/TopNavigation';
import { addLocalValue, api, asyncHandler, notify } from '../../../utils';
import { IUser, IMap } from '../../../globals/interfaces';
import { ICompany } from './interfaces';
import { IStep } from '../../../globals/interfaces';

interface Props {
    user: IUser; 
    modal: boolean;
    setModal: (modal: boolean) => void;
    values: IMap<any>;
    setFieldValue: (name: string, value: any) => void;
    resetForm: () => void;
    setQueueData: (data: {
        companiesList: Array<ICompany>;
        firstWaitingId: number;
        agentCompany: ICompany | null
        processingAgentsMap: IMap<boolean>;
        accessToken: string;
    }) => void
}

interface IAddAwb {
    s_mawb: string;
    s_type: string;
    s_mawb_id: string;
}

export default function ModalAddDriver ({
    user, 
    modal,
    setModal,
    values, 
    setFieldValue,
    resetForm,
    setQueueData,
}: Props) {

    const [s_mawb, set_s_mawb] = useState('');
    const [awbs, setAwbs] = useState<Array<IAddAwb>>([]);
    const [photo_base64, set_photo_base64] = useState('');
    const [takingPhoto, setTakingPhoto] = useState(true);
    const webcamRef = React.useRef(null);

    useEffect(() => {
        resetForm();
        setAwbs([]);
        set_s_mawb('');
        set_photo_base64('');
        setTakingPhoto(true);
    }, [modal]);

    const toggle = () => setModal(!modal);

    const topNavClick = (stepItem: IStep, push: (stepItemId: string) => void) => {
        if (resolveEnableNext(stepItem)) {
            push(stepItem.id);
        }
    };

    const onClickNext = (goToNext: () => void, steps: Array<IStep>, step: IStep) => {
        console.log(steps);
        step.isDone = true;
        if (steps.length - 1 <= steps.indexOf(step)) {
            return;
        } else if (!resolveEnableNext(step)) {
            step.disabled = true;
            return;
        } else {
            step.disabled = false;
            goToNext();
        }
    };
    
    const onClickPrev = (goToPrev: () => void, steps: Array<IStep>, step: IStep) => {
        if (steps.indexOf(step) <= 0) {
            return;
        }

        goToPrev();
    };

    const checkValidValues = (array: Array<string>) => {
        for (let i = 0; i < array.length; i++) {
            const current = values[array[i]];
            if (!current || current.length < 1) {
                return false;
            }
        }
        return true;
    };

    const resolveEnableNext = (step: IStep) => {
        if (step.id === '1') {
            const checkValues = ['s_trucking_company', 's_trucking_driver'];
            return checkValidValues(checkValues);
        }
        return true;
    };

    const enableAddAwb = () => {
        const check = s_mawb.replace(/-/g, '');
        if (check && check.length === 11) {
            const lastDigit = parseInt(check[check.length - 1]);
            const serial = parseFloat(check.substr(3, 7));
            const divResult = serial / 7.0;
            const decimal = divResult % 1;
            const multiplyDecimal = parseFloat(decimal.toString().substr(0, 3));
            const checkDigit = Math.ceil(multiplyDecimal * 7);
            return checkDigit === lastDigit; 
        }
        return false;
    }

    const addAwb = (s_type: 'IMPORT' | 'EXPORT') => {
        const awb = {
            s_mawb,
            s_type,
            s_mawb_id: uuidv4()
        }

        addLocalValue(awbs, setAwbs, awb);
        set_s_mawb('');
    }; 

    const deleteAwb = (s_mawb: string) => {
        const newAwbs = awbs.filter(a => a.s_mawb !== s_mawb);
        setAwbs(newAwbs);
    };

    const resolveState = (awbs: Array<IAddAwb>) => {
        const firstType = awbs[0].s_type;
        for (let i = 1; i < awbs.length; i++) {
            const currentAwb = awbs[i];
            if (currentAwb.s_type !== firstType) {
                return 'MIXED';
            }
        }
        return firstType;
    };

    const validatePhoneNumber = () => {
        const string = (values.s_trucking_cell && values.s_trucking_cell.toString()) || '';
        if (string.length > 0) {
            return string.match(/\d/g).length === 10;
        }

        return false;
    }

    const capture = React.useCallback(
        () => {
            // @ts-ignore
            const imageSrc = webcamRef.current && webcamRef.current.getScreenshot();
            set_photo_base64(imageSrc || '');
            setTakingPhoto(false);
        },
        [webcamRef]
    );

    const retakePhoto = () => {
        set_photo_base64('');
        setTakingPhoto(true);
    }

    const addKioskAwbs = asyncHandler(async() => {
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        const { s_email, s_unit } = user && user;

        values.t_created = now;
        values.s_created_by = s_email;
        values.t_modified = now;
        values.s_modified_by = s_email;
        values.s_unit = s_unit;
        values.s_transaction_id = uuidv4();
        values.s_priority = 'REGULAR';
        values.s_state = resolveState(awbs);
        values.s_status = 'WAITING';
        values.s_trucking_language = 'ENGLISH';
        values.t_kiosk_start = now;
        values.t_kiosk_submitted = now;
        values.b_trucking_sms = validatePhoneNumber();

        const photo = {
            base64: photo_base64,
            type: 'image/png',
            name: uuidv4()
        };

        const res = await api('post', 'addKioskAwbs', {
            data: {
                main: values,
                awbs,
                photo
            }
        });

        setModal(false);
        notify('AWBs Added');
        setQueueData(res.data);
    });
    

    // Select Camera:

    const [deviceId, setDeviceId] = React.useState({});
    const [devices, setDevices] = React.useState([]);
  
    const handleDevices = React.useCallback(
      (mediaDevices: any) =>
        // @ts-ignore
        setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
      [setDevices]
    );

    useEffect(() => {
        if (devices.length > 0) {
            // @ts-ignore
            setDeviceId(devices[0].deviceId);
        }
    }, [devices]);

    useEffect(() => {
        if (navigator && navigator.mediaDevices) {
            try {
                navigator.mediaDevices.enumerateDevices().then(handleDevices);
            } catch (err) {};
        }
    },[handleDevices, navigator]);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader>Add Driver</ModalHeader>
            <ModalBody className="wizard wizard-default">
                <Wizard>
                    <TopNavigation
                        className="justify-content-center mb-4"
                        disableNav={false}
                        topNavClick={topNavClick}
                    />

                    <Steps>
                        <Step id={'1'} name={'Company Info'}>
                            <div className="wizard-basic-step">
                                <FormGroup>
                                    <Label>Company Name</Label>
                                    <Field type='text' name={'s_trucking_company'} className='form-control' />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Full Name</Label>
                                    <Field type='text' name={'s_trucking_driver'} className='form-control' />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Cell Number</Label>
                                    <Field type='number' name={'s_trucking_cell'} className='form-control' />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Email</Label>
                                    <Field type='email' name={'s_trucking_email'} className='form-control' />
                                </FormGroup>
                            </div>
                        </Step>
                        <Step id={'2'} name={'Driver Photo'}>
                            <div className="wizard-basic-step">
                                <Row>
                                    {
                                        !takingPhoto ? 
                                            <>
                                                <Col md={12} className='text-center'>
                                                    <img src={`${photo_base64}`} />
                                                    <Button color='info mt-2' onClick={() => retakePhoto()}>Retake Photo</Button>
                                                    <h4 className='fas fa-check my-2 d-block' style={{ color: 'green' }}>Photo Saved</h4>
                                                </Col>
                                            </> :
                                            <>
                                                <Col md={12} className='text-center'>
                                                    <div className='mb-2'>
                                                        {devices.map((device, key) => (
                                                        <Button
                                                            // @ts-ignore
                                                            key={device.deviceId}
                                                            // @ts-ignore
                                                            onClick={() => setDeviceId(device.deviceId)}
                                                            // @ts-ignore
                                                            active={deviceId === device.deviceId}
                                                            className='mr-2'
                                                        >  
                                                            {
                                                                // @ts-ignore
                                                                device.label || `Device ${key + 1}`
                                                            }
                                                        </Button>
                                                        ))}
                                                    </div>
                                                </Col>
                                                <Col md={12} className='text-center'>
                                                    <Webcam
                                                        audio={false}
                                                        ref={webcamRef}
                                                        screenshotFormat="image/jpeg"
                                                        videoConstraints={{ deviceId }}
                                                        width={720}
                                                        height={480}
                                                    />
                                                </Col>
                                                <Col md={12} className='text-center'>
                                                    <Button onClick={capture} className='text-center'>Capture photo</Button>
                                                </Col>
                                                <Col md={12} className='text-center'>
                                                    <h4 className='fas fa-times mt-1' style={{ color: 'red' }}>Photo Not Saved</h4>
                                                </Col>
                                            </>
                                    }
                                </Row>
                            </div>
                        </Step>
                        <Step id={'3'} name={'AWBs'}>
                            <div className="wizard-basic-step">
                                <h4>Added AWBS: {awbs.length}</h4>
                                <ButtonGroup className='mb-4'>
                                {
                                    awbs.map((a, i) =>
                                        <Button key={i} className='mr-2' style={{ backgroundColor: `${a.s_type === 'EXPORT' ? '#6495ed' : '#51C175'}` }}>
                                            {a.s_mawb}
                                            <i className='fas fa-times ml-2' onClick={() => deleteAwb(a.s_mawb)} />
                                        </Button>
                                    )
                                }
                                </ButtonGroup>
                                <FormGroup>
                                    <Label className='mr-2'>Enter AWB</Label>
                                    <Input className='d-inline mr-2' type='text' value={s_mawb} onChange={(e: any) => set_s_mawb((e.target.value))} style={{ width: '300px' }} />
                                    <Button className='d-inline mr-1' disabled={!enableAddAwb()} onClick={() => addAwb('EXPORT')} style={{ backgroundColor: '#6495ed' }}>Dropping Off: Export</Button>
                                    <Button className='d-inline' disabled={!enableAddAwb()} onClick={() => addAwb('IMPORT')}>Picking Up: Import</Button>
                                </FormGroup>
                            </div>
                        </Step>
                    </Steps>

                    <BottomNavigation
                        onClickNext={onClickNext}
                        onClickPrev={onClickPrev}
                        className="justify-content-center"
                        prevLabel={'Back'}
                        nextLabel={'Next'}
                        resolveEnableNext={resolveEnableNext}
                    />
                </Wizard>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={toggle}>Cancel</Button>
                <Button disabled={awbs.length < 1} onClick={() => addKioskAwbs()}>Submit</Button>
            </ModalFooter>
        </Modal>
    );
}