import React, {useMemo} from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input
  } from "reactstrap";
import styled from 'styled-components';

import { validateEmail } from '../../../utils';
import BackButton from '../../custom/BackButton';
import ActionIcon from '../../custom/ActionIcon';

export default function ModalCreateRecord ({
    open, 
    handleModal,
    createValue,
    setCreateValue,
    modalCreateType,
    handleCreateRecord,
    companyData,
    emailData,
    phoneData,
    selectedCompany,
    blacklist
}) {

    const toggle = () => handleModal(false);

    const existingEmails = useMemo(() => {
        return emailData.filter(d => selectedCompany && selectedCompany.s_guid === d.s_guid);
    }, [emailData, selectedCompany]);

    const capitalize = (string) => {
        const stringArray = Array.from(string);
        let newString = '';
        for(let i = 0; i < stringArray.length; i++) {
          if(i === 0) {
            stringArray[i] = stringArray[i].toUpperCase();
          }
          newString += stringArray[i];
        }
        return newString;
      } 

    const resolveTitle = () => {
        if (modalCreateType) {
            return capitalize(modalCreateType);
        }
        return '';
    }

    const resolveSubtitle = () => {
        if (modalCreateType) {
            if (modalCreateType === 'company' || modalCreateType === 'name') {
                return 'Company Name:';
            } else if (modalCreateType === 'email') {
                return 'Email Address:'
            } else {
                return 'Phone Number'
            }
        }
        return '';
    }

    const validatePhone = (phoneNum) => {
        if(phoneNum.length >= 10) {
            return true;
        }
    }

    const getDuplicateNamesArray = () => {
        const matchArray = companyData.filter(c => c.s_name.toUpperCase() === createValue.toUpperCase());
        return matchArray;
    }

    const getDuplicatePhonesArray = () => {
        const matchArray = phoneData.filter(c => c.s_phone === createValue);
        return matchArray;
    }

    const checkDuplicateName = () => {
        const duplictesArray = getDuplicateNamesArray();
        return duplictesArray.length === 0;
    }

    const checkDuplicateEmail = () => {
        const matchArray = emailData.filter(c => c.s_email && c.s_email.toUpperCase() === createValue.toUpperCase());
        
        let result = { 
            match: false,
            foundCompany: null
        };

        if (matchArray.length > 0) {
            const company = companyData.find(c => c.s_guid === matchArray[0].s_guid);
            if (company) {
                result.match = true;
                result.foundCompany = company.s_name;    
            }
        }

        return result;
    }

    const checkDuplicatePhone = () => {
        const duplicatesArray = getDuplicatePhonesArray();
        return duplicatesArray.length === 0;
    }

    const validateValue = () => {
        if(modalCreateType) {
            if (modalCreateType === 'company' || modalCreateType === 'name') {
                if(createValue.length > 0) {
                    return checkDuplicateName();
                }
            } else if (modalCreateType === 'email') {
                if (validateEmail(createValue) && existingEmails.length < 3 && blacklist[createValue.toUpperCase()] === undefined) {
                    return true;
                }
            } else {
                if (validatePhone(createValue)) {
                    return checkDuplicatePhone();
                }
            }
        }
        return false;
    }

    const resolveType = () => {
        if(modalCreateType) {
            if (modalCreateType === 'phone') {
                return 'number';
            } else {
                return 'text';
            }
        }
        return 'text';
    }

    const resolveDuplicatesLabel = () => {
        let label = '';
        if(modalCreateType) {
            if (modalCreateType === 'record' || modalCreateType === 'name') {
                if(createValue.length > 0) {
                    if (!checkDuplicateName()) {
                        const duplicatesArray = getDuplicateNamesArray();
                        label = `Duplicate company exists: ID ${duplicatesArray[0].i_record}, ${duplicatesArray[0].s_name}`;
                    }
                }
            } else if (modalCreateType === 'email') {
                if (existingEmails.length >= 3) {
                    return '3 or more emails exist for this profile. No more can be added.'
                } else if (createValue.length > 0) {
                    if (validateEmail(createValue)) {
                        const result = checkDuplicateEmail();
                        if (result.match) {
                            label = `Duplicate email exists for company: ${result.foundCompany}`;
                        } else if (blacklist[createValue.toUpperCase()] !== undefined) {
                            label = `This email has been blacklisted. Reason: ${blacklist[createValue.toUpperCase()] || 'N/A'}.`;
                        }
                    } else {
                        label = 'Invalid email format';
                    }    
                }
            } else {
                if (createValue.length >= 10) {
                    if (validatePhone(createValue)) {
                        if (!checkDuplicatePhone()) {
                            const duplicatesArray = getDuplicatePhonesArray();
                            label = `Duplicate phone number exists: ID ${duplicatesArray[0].i_record}, ${duplicatesArray[0].s_phone}`;
                        }
                    } else {
                        label = 'Invalid phone format';
                    }    
                }
            }
        }
        return label;
    }

    return (
        <Modal isOpen={open} toggle={toggle} style={{ maxWidth: '550px' }}>
            <ModalHeader>
                <FooterHeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2 pt-2'}>Create {resolveTitle()}</h4>
                </FooterHeaderContainer>
            </ModalHeader>
            <ModalBody>
                <h6>{resolveSubtitle()}</h6>
                <Input 
                    type={resolveType()} 
                    value={createValue} 
                    onChange={(e) => setCreateValue(e.target.value)} 
                    className="form-control"
                />
                <h6 className='mt-3 mx-auto text-danger'>{resolveDuplicatesLabel()}</h6>
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <ActionIcon 
                        type={'save'}
                        onClick={() => handleCreateRecord()}
                        disabled={!validateValue()}
                    />
                </FooterContentContainer>
            </ExpandedFooter>
        </Modal>
    );
}

const ExpandedFooter = styled(ModalFooter)`
    width: 100%;

`;

const FooterHeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const FooterContentContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
`;