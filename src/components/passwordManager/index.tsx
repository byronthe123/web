import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import styled from 'styled-components';
import { atom, useRecoilState } from 'recoil';
import { Nav, TabPane, TabContent } from 'reactstrap';

import BackButton from '../custom/BackButton';
import { getTsDate, notify } from '../../utils';
import { useAppContext } from '../../context';
import {
    FormEvent,
    ChangeEvent,
    IUser,
    IUserPassword,
} from '../../globals/interfaces';
import { Input } from 'reactstrap';
import { Button } from 'reactstrap';
import apiClient from '../../apiClient';
import _ from 'lodash';
import LoadingButton from '../LoadingButton';
import ActionIcon from '../custom/ActionIcon';
import PasswordForm from './PasswordForm';
import CustomNavItem from '../custom/CustomNavItem';
import VirtualTable from '../custom/VirtualTable';
import PasswordsTable from './PasswordsTable';
import { UserAssignedMap } from './useUserAssignedPasswords';

type VaultState =
    | 'CREATE_PIN'
    | 'VERIFY_PIN'
    | 'RESET_PIN'
    | 'CONFIRM_RESET_PIN'
    | 'ACCESS_VAULT';

export const passwordManagerState = atom({
    key: 'passwordManager',
    default: false,
});

export default function PasswordManager() {
    const { user, setUser } = useAppContext();
    const [modal, setModal] = useRecoilState(passwordManagerState);
    const [vaultState, setVaultState] = useState<VaultState>('VERIFY_PIN');
    const pinVerified = vaultState === 'ACCESS_VAULT';
    let timerID: NodeJS.Timeout;

    useEffect(() => {
        if (!user.pinCreated) {
            setVaultState('CREATE_PIN');
        } else {
            setVaultState('VERIFY_PIN');
        }
    }, [modal]);

    useEffect(() => {
        // This function will be called after 1 minute of inactivity
        const handleInactivity = () => setModal(false);

        // Set up the event listeners for user activity
        const resetTimer = () => {
            // If there's a timer already running, clear it
            if (timerID) clearTimeout(timerID);

            // Set a new timer
            timerID = setTimeout(handleInactivity, 60000); // 60000ms = 1 minute
        };

        // Set the initial timer
        resetTimer();

        // Listen for any events that might indicate user activity
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('mousedown', resetTimer);
        window.addEventListener('keypress', resetTimer);
        window.addEventListener('scroll', resetTimer);
        window.addEventListener('touchmove', resetTimer);

        // Clean up
        return () => {
            // If the component unmounts, clear the timer and stop listening to events
            clearTimeout(timerID);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('mousedown', resetTimer);
            window.removeEventListener('keypress', resetTimer);
            window.removeEventListener('scroll', resetTimer);
            window.removeEventListener('touchmove', resetTimer);
        };
    }, []); // Empty dependency array so this runs once on mount and cleans up on unmount

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} size={pinVerified ? 'lg' : 'md'}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>Vault {!pinVerified && 'Login'}</h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <Main
                    user={user}
                    setUser={setUser}
                    vaultState={vaultState}
                    setVaultState={setVaultState}
                />
            </ModalBody>
        </Modal>
    );
}

export type Tab = 'USER_PASSWORDS' | 'SHARED_PASSWORDS';

const Main = ({
    user,
    setUser,
    vaultState,
    setVaultState,
}: {
    user: IUser;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    vaultState: VaultState;
    setVaultState: React.Dispatch<React.SetStateAction<VaultState>>;
}) => {
    const [pin, setPin] = useState('');
    const [verifyingPin, setVerifyingPin] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [userPasswords, setUserPasswords] = useState<Array<IUserPassword>>(
        []
    );
    const [sharedPasswords, setSharedPasswords] = useState<
        Array<IUserPassword>
    >([]);
    const [selectedPassword, setSelectedPassword] = useState<IUserPassword>();
    const [activeTab, setActiveTab] = useState<Tab>('USER_PASSWORDS');
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [waitingVerificationCode, setWaitingVerificationCode] =
        useState(false);
    const maskedPhone = (_.get(user, 's_phone_num', '') || '').replace(
        /^(\d{6})/,
        '******'
    );
    const [verificationCode, setVerificationCode] = useState('');
    const [
        waitingVerificationCodeConfirmation,
        setWaitingVerificationCodeConfirmation,
    ] = useState(false);
    const [users, setUsers] = useState<Array<IUser>>([]);
    const [waitingDelete, setWaitingDelete] = useState(false);
    const sharedPassword = user.sharedVaultAccess;

    useEffect(() => {
        const getUsers = async () => {
            const res = await apiClient.get('/password/users');
            setUsers(res.data);
        };
        getUsers();
    }, []);

    const createPin = async (e?: FormEvent) => {
        if (e) e.preventDefault();
        const date = getTsDate();
        const res = await apiClient.post('/password/pin', {
            pin,
            userId: user.s_guid,
            created: date,
            modified: date,
            update: user.resetPassword === true,
        });

        if (res.status === 200) {
            setUser((prev) => {
                const copy = _.cloneDeep(prev);
                copy.pinCreated = true;
                user.resetPassword = false;
                return copy;
            });
            setPin('');
            setVaultState('VERIFY_PIN');
            notify('Please remember your PIN to unlock your vault!');
        }
    };

    const verifyPin = async (e?: FormEvent) => {
        if (e) e.preventDefault();
        if (loginAttempts >= 3) return;

        setVerifyingPin(true);
        const { localAccountId, s_guid, s_email } = user;
        try {
            const res = await apiClient.post('/password/verify-pin', {
                pin,
                localAccountId,
                s_guid,
                sharedPassword,
                s_email,
            });
            if (res.status === 200) {
                setPin('');
                setVaultState('ACCESS_VAULT');
                const { passwords, sharedPasswords } = res.data;
                setUserPasswords(passwords);
                setSharedPasswords(sharedPasswords);
            }
        } catch (err) {
            notify('Invalid PIN', 'error');
            if (loginAttempts === 2) {
                setVaultState('RESET_PIN');
            }
            setLoginAttempts((prev) => prev + 1);
        }
        setVerifyingPin(false);
    };

    const requestResetPin = async () => {
        setWaitingVerificationCode(true);
        try {
            const res = await apiClient.post(
                `/password/request-verification-code`,
                {
                    userId: user.s_guid,
                    s_phone_num: user.s_phone_num,
                    created: getTsDate(),
                }
            );
            if (res.status === 200) {
                setVaultState('CONFIRM_RESET_PIN');
            }
        } catch (err) {
            notify('Error. Please refresh and try again', 'error');
        }
        setWaitingVerificationCode(false);
    };

    const confirmVerificationCode = async (e?: FormEvent) => {
        if (e) e.preventDefault();
        setWaitingVerificationCodeConfirmation(true);
        try {
            const res = await apiClient.post(
                `/password/confirm-verification-code`,
                {
                    verificationCode,
                    userId: user.s_guid,
                    now: getTsDate(),
                }
            );
            setUser((prev) => {
                const copy = _.cloneDeep(prev);
                copy.pinCreated = false;
                copy.resetPassword = true;
                return copy;
            });
            setVaultState('CREATE_PIN');
            setPin('');
            setVerificationCode('');
            setLoginAttempts(0);
        } catch (err: any) {
            if (JSON.stringify(err).includes('401')) {
                notify('Invalid verification code entered', 'error');
            } else {
                notify('Verification code expired', 'error');
            }
        }
        setWaitingVerificationCodeConfirmation(false);
    };

    const createUpdatePassword = async (passwordData: IUserPassword) => {
        const { localAccountId, s_guid } = user;
        const data = {
            passwordData,
            additional: {
                localAccountId,
                s_guid,
                sharedPassword: activeTab === 'SHARED_PASSWORDS',
            },
        };

        const update = selectedPassword !== undefined;
        const res = await apiClient[update ? 'put' : 'post']('/password', data);
        if (res.status === 200) {
            const updateState = (
                setter: React.Dispatch<
                    React.SetStateAction<Array<IUserPassword>>
                >
            ) => {
                setter((prev) => {
                    const copy = _.cloneDeep(prev);
                    if (update) {
                        const updateIndex = copy.findIndex(
                            (item) => item.id === passwordData.id
                        );
                        copy[updateIndex] = res.data;
                        return copy;
                    } else {
                        const copy = _.cloneDeep(prev);
                        copy.push(res.data);
                        return copy;
                    }
                });
            };
            if (sharedPassword) {
                updateState(setSharedPasswords);
            } else {
                updateState(setUserPasswords);
            }
            setOpenForm(false);
            notify('Success');
        }
    };

    const deletePassword = async (id: number) => {
        setWaitingDelete(true);
        try {
            await apiClient.delete(`/password/${id}`);
            setUserPasswords((prev) => {
                const updated = prev.filter((item) => item.id !== id);
                return updated;
            });
            notify('Password deleted');
        } catch (err) {
            notify('Error, please try again', 'error');
        }
        setWaitingDelete(false);
        setOpenForm(false);
    };

    const assignPassword = async (userAssignedMap: UserAssignedMap) => {
        if (!selectedPassword) return;

        try {
            await apiClient.post('/password/assign', {
                userAssignedMap,
                data: {
                    passwordGuid: selectedPassword.guid,
                    created: getTsDate(),
                    createdBy: user.s_email,
                },
            });
            setOpenForm(false);
            notify('Password assigned');
        } catch (err) {
            alert(err);
        }
    };

    const openPasswordForm = (selectedPassword?: IUserPassword) => {
        if (selectedPassword) {
            setSelectedPassword(selectedPassword);
        } else {
            setSelectedPassword(undefined);
        }
        setOpenForm(true);
    };

    const toggleTab = (tab: Tab) => setActiveTab(tab);

    const showAddButton =
        activeTab !== 'SHARED_PASSWORDS' ||
        (user.sharedVaultAccess && activeTab === 'SHARED_PASSWORDS');

    switch (vaultState) {
        case 'CREATE_PIN':
            return (
                <div>
                    <h1>Create a 4-digit PIN</h1>
                    <h6>
                        You must remember this PIN to access your passwords.
                        Your PIN cannot be 4 strictly increasing numbers like
                        1234
                    </h6>
                    <FlexContainer onSubmit={(e: FormEvent) => createPin(e)}>
                        <Input
                            value={pin}
                            onChange={(e: any) => setPin(e.target.value)}
                        />
                        <Button
                            disabled={!isValidPIN(pin)}
                            onClick={() => createPin()}
                        >
                            Submit
                        </Button>
                    </FlexContainer>
                </div>
            );
        case 'VERIFY_PIN':
            return (
                <div>
                    <form
                        onSubmit={(e: FormEvent) => verifyPin(e)}
                        className={'text-center'}
                    >
                        <h6>Please enter your PIN:</h6>
                        <Input
                            value={pin}
                            onChange={(e: ChangeEvent) =>
                                setPin(e.target.value)
                            }
                            type={'password'}
                            className={'mb-3'}
                        />
                        <LoadingButton
                            loading={verifyingPin}
                            disabled={!isValidPIN(pin)}
                            onClick={() => verifyPin()}
                            title={'Submit'}
                        />
                        <ResetPasswordText>Password reset option available after 3 failed attempts</ResetPasswordText>
                    </form>
                </div>
            );
        case 'RESET_PIN':
            return (
                <ResetPin
                    phoneNumber={Boolean(user.s_phone_num)}
                    waitingVerificationCode={waitingVerificationCode}
                    requestResetPin={requestResetPin}
                    maskedPhone={maskedPhone}
                />
            );
        case 'CONFIRM_RESET_PIN':
            return (
                <div>
                    <h6>
                        Your verification code was texted to {maskedPhone}.
                        Please enter it below:
                    </h6>
                    <form
                        onSubmit={(e: FormEvent) => confirmVerificationCode(e)}
                        className={'text-center'}
                    >
                        <Input
                            value={verificationCode}
                            onChange={(e: ChangeEvent) =>
                                setVerificationCode(e.target.value)
                            }
                            type={'text'}
                            className={'mb-3 normal-text'}
                        />
                        <LoadingButton
                            loading={waitingVerificationCodeConfirmation}
                            disabled={verificationCode.length < 5}
                            onClick={() => confirmVerificationCode()}
                            title={'Submit'}
                        />
                    </form>
                </div>
            );
        case 'ACCESS_VAULT':
            return (
                <div>
                    <FlexSpaceBetween>
                        <h6>Passwords</h6>
                        {showAddButton && (
                            <ActionIcon
                                onClick={() => openPasswordForm()}
                                type={'add'}
                            />
                        )}
                    </FlexSpaceBetween>
                    <Nav tabs className={'separator-tabs'}>
                        <CustomNavItem<Tab>
                            tabName={'My Passwords'}
                            tabId="USER_PASSWORDS"
                            activeTabId={activeTab}
                            toggleTab={toggleTab}
                        />
                        <CustomNavItem<Tab>
                            tabName={'Shared Passwords'}
                            tabId="SHARED_PASSWORDS"
                            activeTabId={activeTab}
                            toggleTab={toggleTab}
                        />
                    </Nav>

                    <TabContent activeTab={activeTab}>
                        <TabPane tabId={'USER_PASSWORDS'}>
                            <PasswordsTable
                                data={userPasswords}
                                openPasswordForm={openPasswordForm}
                                enableEdit={true}
                            />
                        </TabPane>
                    </TabContent>

                    <TabContent activeTab={activeTab}>
                        <TabPane tabId={'SHARED_PASSWORDS'}>
                            <PasswordsTable
                                data={sharedPasswords}
                                openPasswordForm={openPasswordForm}
                                enableEdit={Boolean(user.sharedVaultAccess)}
                            />
                        </TabPane>
                    </TabContent>

                    <PasswordForm
                        modal={openForm}
                        setModal={setOpenForm}
                        user={user}
                        selectedPassword={selectedPassword}
                        createUpdatePassword={createUpdatePassword}
                        deletePassword={deletePassword}
                        activeTab={activeTab}
                        users={users}
                        assignPassword={assignPassword}
                    />
                </div>
            );
    }
};

interface ResetPinProps {
    phoneNumber: boolean;
    waitingVerificationCode: boolean;
    requestResetPin: () => Promise<void>;
    maskedPhone: string;
}

const ResetPin = ({
    phoneNumber,
    waitingVerificationCode,
    requestResetPin,
    maskedPhone,
}: ResetPinProps) => {
    if (!phoneNumber) {
        return (
            <h6>
                You do not have a phone number to reset your PIN. Please contact
                EOS support.
            </h6>
        );
    }

    return (
        <>
            <h6>
                You will receive a 5 digit verification code to reset your PIN
                at {maskedPhone}.
            </h6>
            <div className={'text-center'}>
                <LoadingButton
                    loading={waitingVerificationCode}
                    onClick={() => requestResetPin()}
                    title={'Reset PIN'}
                />
            </div>
        </>
    );
};

const isValidPIN = (pin: string) => {
    if (!pin.length || pin.length < 4) return false;
    const arr = [];
    for (let i = 0; i < pin.length - 1; i++) {
        arr.push(Number(pin[i + 1]) - Number(pin[i]));
    }
    return arr.join('') !== '111' && arr.join('') !== '-1-1-1';
};

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const FlexContainer = styled.form`
    display: flex;
    gap: 10px;
`;

const FlexSpaceBetween = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ResetPasswordText = styled.p`
    font-size: 12px;
    color: red;
    margin: 10px 0px 0px 0px;;
`;