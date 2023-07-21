import React, { useState, useEffect } from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';

import BackButton from '../custom/BackButton';
import ActionIcon from '../custom/ActionIcon';
import { createdUpdatedInfo, formatDatetime } from '../../utils';
import { IEmployeeFile } from '../../globals/interfaces';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    file: IEmployeeFile | undefined;
    deleteHrFile: () => Promise<void>;
}

export default function ViewFile({ modal, setModal, file, deleteHrFile }: Props) {
    const [imageBase64, setImageBase64] = useState('');

    useEffect(() => {
        if (!file || !file.accessLink) return;
        fetch(file.accessLink)
            .then((response) => response.blob())
            .then((blob) => {
                const reader = new FileReader();
                reader.onloadend = function () {
                    setImageBase64(String(reader.result));
                };
                reader.readAsDataURL(blob);
            })
            .catch((error) => console.log(error));
    }, [file]);

    const handlePrint = () => {
        if (imageBase64) {
            const printWindow = window.open('', '_blank');
            if (!printWindow) return;
            const imageElement = printWindow.document.createElement('img');

            imageElement.onload = function () {
                printWindow.document.body.appendChild(imageElement);
                printWindow.print();
            };

            imageElement.src = imageBase64;
            printWindow.document.close();
        }
    };

    const handleDownload = () => {
        if (!file) return;
        const link = document.createElement('a');
        link.href = imageBase64;
        link.download = file?.s_file_name;
        link.click();
    }

    const toggle = () => setModal(!modal);

    if (!file) return null;

    let subtitle = '';

    if (file.expiration_date) {
        subtitle += `- Exp. ${formatDatetime(file.expiration_date, true)}`;
    }
    if (file.reminder_date) {
        subtitle += ` Renew by ${formatDatetime(file.reminder_date, true)}`;
    }

    const imageFile = checkImageFile(file.s_file_name);
    console.log(file);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>
                        {file.s_file_type}
                        {subtitle}
                    </h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody className={'text-center'}>
                {imageFile ? (
                    <Img src={imageBase64} />
                ) : (
                    <h6>
                        No preview for this type of file (non-image), please
                        download.
                    </h6>
                )}
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <Label>
                        {createdUpdatedInfo(file)}
                    </Label>
                    <FooterButtonsContainer>
                        <ActionIcon type={'delete'} onClick={() => deleteHrFile()} />
                        <FlexContainer>
                            <ActionIcon type={'download'} onClick={() => handleDownload()} />
                            <ActionIcon
                                type={'print'}
                                onClick={() => handlePrint()}
                                disabled={!imageBase64 || !imageFile}
                            />
                        </FlexContainer>
                    </FooterButtonsContainer>
                </FooterContentContainer>
            </ExpandedFooter>
        </Modal>
    );
}

const checkImageFile = (name: string) => {
    console.log(name);
    const images = ['jpeg', 'jpg', 'png'];
    for (const img of images) {
        if (name.includes(img)) {
            return true;
        }
    }
    return false;
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
    justify-content: space-between;
`;

const FlexContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const Img = styled.img`
    width: 700px;
    height: auto;
`;