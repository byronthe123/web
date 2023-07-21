import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import React from 'react';
import { Modal, ModalHeader, ModalBody, Label, Input } from 'reactstrap';
import FileBase64 from 'react-file-base64';
import { Wizard, Steps, Step } from 'react-albus';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import * as jsPDF from 'jspdf';

import { ButtonGroup } from 'reactstrap';
import { Button } from 'reactstrap';
import { File } from '../../counter/import/interfaces';
import {
    HrFileCategory,
    IHrFile,
    ISelectOption,
    IStep,
    IUser,
    PushStep,
    hrFileCategories,
} from '../../../globals/interfaces';
import TopNavigation from '../../wizard-hooks/TopNavigation';
import Webcam from 'react-webcam';
import CropPhoto from '../../counter/CropPhoto';
import _ from 'lodash';
import moment from 'moment';
import apiClient from '../../../apiClient';
import { FormGroup } from 'reactstrap';
import { FileTypesMap, PostSave } from '../../hr/Files';
import Switch from 'rc-switch';
import ActionIcon from '../ActionIcon';

type Process = 'UPLOAD' | 'SCAN';

const defaultFile = {
    base64: '',
    type: '',
    guid: '',
};

const defaultOption = {
    label: '',
    value: '',
};

interface Props<T> {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: IUser;
    s_container: string;
    s_type: string;
    requiredName?: string;
    s_transaction_id: string;
    s_mawb_id?: string;
    fileTypesMap: FileTypesMap;
    expiration_date?: string;
    set_expiration_date?: React.Dispatch<React.SetStateAction<string>>;
    postSave?: PostSave;
    additionalDisabled?: boolean;
    requiredFileType?: 'png' | 'jpg' | 'jpeg';
    multiple?: boolean;
}

type UseHrFileCategory = HrFileCategory | '';

export default function UploadFiles<T>({
    open,
    setOpen,
    requiredName,
    user,
    s_container,
    s_type,
    s_transaction_id,
    s_mawb_id,
    fileTypesMap,
    expiration_date,
    set_expiration_date,
    postSave,
    additionalDisabled,
    requiredFileType,
}: Props<T>) {
    const [types, setTypes] = useState<Array<ISelectOption>>([]);
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
    const [files, setFiles] = useState<Array<File>>([]);
    const [selectedFileOption, setSelectedFileOption] =
        useState<ISelectOption>(defaultOption);
    const [multiple, setMultiple] = useState(false);
    const [category, setCategory] = useState<UseHrFileCategory>('ID');
    const [saving, setSaving] = useState(false);
    const webcamRef = React.useRef(null);

    const handleSelectProcess = (process: Process) => {
        setProcess(process);
        setFile(defaultFile);
    };

    const toggle = () => setOpen((prev) => !prev);

    useEffect(() => {
        const types: Array<ISelectOption> = [];
        for (const type in fileTypesMap) {
            if (category && fileTypesMap[type].category === category) {
                types.push({
                    label: type,
                    value: type,
                });
            } else if (!category) {
                types.push({
                    label: type,
                    value: type,
                });
            }
        }
        setTypes(types);
    }, [fileTypesMap, category]);

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

    const handleSelectOption = (option: ISelectOption) => {
        setSelectedFileOption(option);
        set_s_file_type(String(option.value));
    };

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
            copy.type = requiredFileType || 'png';
        }
        setFile(copy);

        if (multiple) {
            const file: File = {
                base64: copy.base64,
                guid: uuidv4(),
                type: 'jpeg',
            };
            setFiles((prev) => {
                return [...prev, file];
            });
        }
    };

    const retakePhoto = (previous: () => void) => {
        previous();
    };

    const handleSave = async () => {
        setSaving(true);
        let useFile = file;

        if (multiple) {
            const doc = new jsPDF();

            files.forEach((file, index) => {
                const imgData = file.base64.split(',')[1]; // Remove the data:image/png;base64, part
                if (index !== 0) {
                    doc.addPage(); // Add new page for each image after the first one
                }
                doc.addImage(imgData, 'JPEG', 15, 40, 180, 160);
            });

            // Output as base64
            const base64String = doc.output('datauristring');

            // Remove the data:application/pdf;base64, part
            const base64Data = base64String.split(',')[1];

            useFile.base64 = base64Data;
            useFile.type = 'pdf';
        }

        const fileData = {
            file: useFile,
            requiredName: requiredName || null,
            s_transaction_id,
            s_mawb_id: s_mawb_id || uuidv4(),
            s_container,
            s_type,
            s_file_type,
            s_created_by: user.s_email,
            t_created: moment().format('MM/DD/YYYY HH:mm'),
        };
        const res = await apiClient.post('/addFile', fileData);
        let expirationReminder;
        if (fileTypesMap[selectedFileOption.value]) {
            expirationReminder =
                fileTypesMap[selectedFileOption.value].expirationReminder;
        }
        if (res.status === 200) {
            postSave && (await postSave(res.data, expirationReminder, category, s_file_type));
            setFile(defaultFile);
            setFiles([]);
            setSelectedFileOption(defaultOption);
            toggle();
        }
        setSaving(false);
    };

    const handleSelectCategory = (_category: UseHrFileCategory) => {
        if (category === _category) {
            setCategory('');
        } else {
            setCategory(_category);
        }
    }

    const expirationRequired = Boolean(_.get(
        fileTypesMap,
        `${selectedFileOption.value}.expires`
    ));
    const expirationSelected = !expirationRequired || (expirationRequired && Boolean(expiration_date));
    const base = additionalDisabled === true || !selectedFileOption.value || !expirationSelected;
    const disabled = !file.base64.length || base;
    const disabledMultiple = !files.length || base;

    return (
        <CustomModal isOpen={open} toggle={toggle}>
            <ModalHeader>Upload Files</ModalHeader>
            <ModalBody>
                <div>
                    <FlexContainer>
                        <div>
                            <Label className={'d-block'}>
                                Category:{' '}
                            </Label>
                            <ButtonGroup>
                                {hrFileCategories.map((option) => (
                                    <Button
                                        onClick={() =>
                                            handleSelectCategory(option)
                                        }
                                        active={option === category}
                                    >
                                        {option}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </div>
                        <SelectContainer>
                            <Label>File Type:</Label>
                            <Select
                                value={selectedFileOption}
                                options={types}
                                onChange={(option: ISelectOption) =>
                                    handleSelectOption(option)
                                }
                            />
                        </SelectContainer>
                        <FlexContainer>
                            <div>
                                <Label className={'d-block'}>
                                    Upload Type:{' '}
                                </Label>
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
                            {process === 'SCAN' && (
                                <div>
                                    <Label className={'mr-2 d-block'}>Multiple Pages (PDF)</Label>
                                    <Switch
                                        checked={multiple}
                                        onChange={() =>
                                            setMultiple((prev) => !prev)
                                        }
                                    />
                                </div>
                            )}
                        </FlexContainer>
                        {expiration_date !== undefined &&
                            set_expiration_date &&
                            _.get(
                                fileTypesMap,
                                `${selectedFileOption.value}.expires`
                            ) && (
                                <FormGroup>
                                    <Label>Expiration Date</Label>
                                    <Input
                                        type={'date'}
                                        value={expiration_date}
                                        onChange={(e: any) =>
                                            set_expiration_date(e.target.value)
                                        }
                                    />
                                </FormGroup>
                            )}
                    </FlexContainer>
                    {process === 'SCAN' ? (
                        <Wizard
                            render={({
                                next,
                                previous,
                                push,
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
                                            <Button
                                                onClick={() => capture(next)}
                                            >
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
                                            {multiple && (
                                                <div className={'mt-4'}>
                                                    <h6>
                                                        Previously Scanned Files
                                                    </h6>
                                                    <FlexContainer>
                                                        {files
                                                            .slice(
                                                                0,
                                                                files.length - 1
                                                            )
                                                            .map((file, i) => (
                                                                <div
                                                                    className={
                                                                        'text-center'
                                                                    }
                                                                >
                                                                    <h6>
                                                                        {i + 1}
                                                                    </h6>
                                                                    <img
                                                                        src={
                                                                            file.base64
                                                                        }
                                                                        style={{
                                                                            maxWidth: 100,
                                                                            height: 'auto',
                                                                        }}
                                                                        alt={
                                                                            'img'
                                                                        }
                                                                    />
                                                                </div>
                                                            ))}
                                                    </FlexContainer>
                                                </div>
                                            )}
                                            <SaveButtonContainer>
                                                <Button onClick={previous}>
                                                    Back
                                                </Button>
                                                {multiple ? (
                                                    <div>
                                                        <Button
                                                            onClick={() =>
                                                                push('1')
                                                            }
                                                            className={'mr-2'}
                                                        >
                                                            Scan another page
                                                        </Button>
                                                        <ActionIcon
                                                            disabled={disabledMultiple}
                                                            onClick={handleSave}
                                                            type={'save'}
                                                            loading={saving}
                                                        />
                                                    </div>
                                                ) : (
                                                    <ActionIcon
                                                        disabled={disabled}
                                                        onClick={handleSave}
                                                        type={'save'}
                                                        loading={saving}
                                                    />
                                                )}
                                            </SaveButtonContainer>
                                        </Step>
                                    </Steps>
                                </div>
                            )}
                        />
                    ) : (
                        <div className={'text-center'}>
                            <UploadFileContainer>
                                <FileBase64 onDone={setFile} />
                                <ActionIcon
                                    disabled={disabled}
                                    onClick={handleSave}
                                    type={'save'}
                                    loading={saving}
                                />
                            </UploadFileContainer>
                            {
                                file.base64 && file.type.includes('image') && (
                                    <div>
                                        <h6>Preview:</h6>
                                        <img
                                            src={
                                                file.base64
                                            }
                                            style={{
                                                maxWidth: 150,
                                                height: 'auto',
                                            }}
                                            alt={
                                                'img'
                                            }
                                        />
                                    </div>
                                )
                            }
                        </div>
                    )}
                </div>
            </ModalBody>
        </CustomModal>
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

const CustomModal = styled(Modal)`
    max-width: 1350px;
    width: 100%;
`;

const SelectContainer = styled.div`
    width: 300px;
`;

const UploadFileContainer = styled.div`
    margin-top: 30px;
    display: flex;
    justify-content: center;
`;

const FlexContainer = styled.div`
    display: flex;
    gap: 25px;
    justify-content: center;
`;

const SaveButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10px;
    gap: 10px;
`;