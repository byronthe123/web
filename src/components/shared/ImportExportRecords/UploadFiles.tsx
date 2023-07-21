import { useEffect, useRef, useState } from 'react';
import { exportTypes, importTypes } from '../../counter/fileTypes';
import styled from 'styled-components';
import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Label,
    Input,
} from 'reactstrap';
import FileBase64 from 'react-file-base64';
import { Wizard, Steps, Step, WizardProps } from 'react-albus';

import BackButton from '../../custom/BackButton';
import { ButtonGroup } from 'reactstrap';
import { Button } from 'reactstrap';
import { File } from '../../counter/import/interfaces';
import {
    IStep,
    IUser,
    PushStep,
} from '../../../globals/interfaces';
import TopNavigation from '../../wizard-hooks/TopNavigation';
import Webcam from 'react-webcam';
import CropPhoto from '../../counter/CropPhoto';
import _ from 'lodash';
import moment from 'moment';
import apiClient from '../../../apiClient';

type Process = 'UPLOAD' | 'SCAN';

const defaultFile = {
    base64: '',
    type: '',
    guid: '',
};

interface Props {
    modal: boolean;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    s_type: 'IMPORT' | 'EXPORT';
    user: IUser;
    setFiles: (data: any) => void;
    s_mawb: string;
    s_transaction_id: string;
    s_mawb_id: string;
}

export default function UploadFiles({
    modal,
    setModal,
    s_type,
    user,
    setFiles,
    s_mawb,
    s_transaction_id,
    s_mawb_id,
}: Props) {
    const [fileTypes, setFileTypes] = useState(importTypes);
    const [types, setTypes] = useState<Array<string>>([]);
    const [s_file_type, set_s_file_type] = useState('');
    const [process, setProcess] = useState<Process>('UPLOAD');
    const processOptions: Array<{ name: string; type: Process }> = [
        {
            name: 'Upload',
            type: 'UPLOAD',
        },
        {
            name: 'Scan',
            type: 'SCAN',
        },
    ];
    const [file, setFile] = useState<File>(defaultFile);
    const webcamRef = React.useRef(null);

    const handleSelectProcess = (process: Process) => {
        setProcess(process);
        setFile(defaultFile);
    };

    const toggle = () => setModal((prev) => !prev);

    useEffect(() => {
        if (s_type === 'EXPORT') {
            // @ts-ignore
            setFileTypes(exportTypes);
        }
    }, [s_type]);

    useEffect(() => {
        const types: Array<string> = Object.keys(fileTypes).map((key) => key);
        setTypes(types);
        set_s_file_type(types[0]);
    }, [fileTypes]);

    const [deviceId, setDeviceId] = React.useState({});
    const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);

    useEffect(() => {
        if (devices.length > 0) {
            setDeviceId(devices[0].deviceId);
        }
    }, [devices]);

    useEffect(() => {
        function handleDevices(mediaDevices: MediaDeviceInfo[]) {
            const filteredDevices = mediaDevices.filter(
                ({ kind, deviceId }) =>
                    kind === 'videoinput' && deviceId.length > 0
            );
            setDevices(filteredDevices);
        }
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
    }, []);

    const topNavClick = (stepItem: IStep, push: PushStep) => {
        const { id } = stepItem;
        if (id === '3' && file.base64.length) {
            push(id);
        } else if (id !== '3') {
            push(id);
        }
    };

    const [rotated, setRotated] = useState(false);
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);

    const capture = (next: () => void) => {
        if (!webcamRef || !webcamRef.current) return;
        // @ts-ignore
        const imageSrc = webcamRef.current.getScreenshot();

        let img = document.createElement('img');
        img.setAttribute('src', imageSrc);

        // @ts-ignore
        imgRef.current = img;
        setUpImg(imageSrc);

        next();
    };

    const updateFile = (prop: string, value: any): void => {
        const copy: any = _.cloneDeep(file);
        copy[prop] = value;
        if (!copy.type) {
            copy.type = 'png';
        }
        setFile(copy);
    };

    const retakePhoto = (previous: () => void) => {
        previous();
    };

    const handleSave = async () => {
        const fileData = {
            file,
            requiredName: s_mawb,
            s_transaction_id,
            s_mawb_id,
            s_container: s_type === 'EXPORT' ? 'acceptance-files' : 'delivery-files',
            s_type,
            s_file_type,
            s_created_by: user.s_email,
            t_created: moment().format('MM/DD/YYYY HH:mm'),
        };
        const res = await apiClient.post('/addFile', fileData);

        if (res.status === 200) {
            setFiles(res.data);
            toggle();
        }
    };

    return (
        <Modal
            isOpen={modal}
            toggle={toggle}
            style={{ maxWidth: '1400px', width: '100%' }}
        >
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>Upload File</h4>
                </HeaderContainer>
            </ModalHeader>
            <CustomModalBody>
                <FlexContainer>
                    <SelectContainer>
                        <Label>File Type:</Label>
                        <Input type={'select'} value={s_file_type} onChange={(e: any) => set_s_file_type(e.target.value)}>
                            {types.map((t) => (
                                <option value={t}>{t}</option>
                            ))}
                        </Input>
                    </SelectContainer>
                    <div>
                        <Label className={'d-block'}>Upload Type: </Label>
                        <ButtonGroup>
                            {processOptions.map((option) => (
                                <Button
                                    onClick={() =>
                                        handleSelectProcess(option.type)
                                    }
                                    active={option.type === process}
                                >
                                    {option.name}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>
                </FlexContainer>
                {process === 'SCAN' ? (
                    <Wizard
                        render={({
                            next,
                            previous,
                            push,
                            step,
                        }: // @ts-ignore
                        WizardProps) => (
                            <div className="wizard wizard-default mt-1 text-center">
                                <TopNavigation
                                    className="justify-content-center"
                                    disableNav={false}
                                    topNavClick={topNavClick}
                                />
                                <Steps>
                                    <Step id={'1'} name={'Scan'}>
                                        <div className="mb-2">
                                            {devices.map((device, key) => (
                                                <Button
                                                    key={device.deviceId}
                                                    onClick={() =>
                                                        setDeviceId(
                                                            device.deviceId
                                                        )
                                                    }
                                                    active={
                                                        deviceId ===
                                                        device.deviceId
                                                    }
                                                    className="mr-2"
                                                >
                                                    {device.label ||
                                                        `Device ${key + 1}`}
                                                </Button>
                                            ))}
                                        </div>
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            videoConstraints={{
                                                deviceId,
                                                width: 2592,
                                                height: 1944,
                                            }}
                                            width={1280}
                                            height={720}
                                        />
                                        <Button onClick={() => capture(next)}>
                                            Next
                                        </Button>
                                    </Step>
                                    <Step id={'2'} name={'Crop'}>
                                        <CropPhoto
                                            upImg={upImg}
                                            setUpImg={setUpImg}
                                            imgRef={imgRef}
                                            retakePhoto={retakePhoto}
                                            next={next}
                                            previous={previous}
                                            updateFile={updateFile}
                                            rotated={rotated}
                                            setRotated={setRotated}
                                            mobile={false}
                                            fileType={s_file_type}
                                        />
                                    </Step>
                                    <Step id={'3'} name={'Save'}>
                                        <img
                                            src={file ? file.base64 : ''}
                                            style={{
                                                maxWidth: 1000,
                                                height: 'auto',
                                            }}
                                            alt={'user'}
                                        />
                                        <SaveButtonContainer>
                                            <Button onClick={previous}>
                                                Back
                                            </Button>
                                            <SaveButton
                                                disabled={!file.base64.length}
                                                handleSave={handleSave}
                                            />
                                        </SaveButtonContainer>
                                    </Step>
                                </Steps>
                            </div>
                        )}
                    />
                ) : (
                    <UploadFileContainer>
                        <FileBase64 onDone={setFile} />
                        <SaveButton
                            disabled={!file.base64.length}
                            handleSave={handleSave}
                        />
                    </UploadFileContainer>
                )}
            </CustomModalBody>
        </Modal>
    );
}

interface SaveButtonProps {
    disabled: boolean;
    handleSave: () => void;
}

const SaveButton = ({ disabled, handleSave }: SaveButtonProps) => {
    return (
        <Button disabled={disabled} onClick={() => handleSave()}>
            Save
        </Button>
    );
};

const CustomModalBody = styled(ModalBody)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const SelectContainer = styled.div`
    width: 300px;
`;

const UploadFileContainer = styled.div`
    margin-top: 30px;
`;

const FlexContainer = styled.div`
    display: flex;
    gap: 25px;
`;

const SaveButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10px;
    gap: 10px;
`;

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
