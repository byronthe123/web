import React, { useEffect, useState } from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import BackButton from '../custom/BackButton';
import ActionIcon from '../custom/ActionIcon';
import { formatDatetime, getTsDate } from '../../utils';
import { ChangeEvent, IUser, IUserPassword } from '../../globals/interfaces';
import { yupResolver } from '@hookform/resolvers/yup';
import { createPasswordSchema, updatePasswordSchema } from './passwordSchema';
import FormInput from '../custom/hookForm/FormInput';
import PasswordGenerator from './PasswordGenerator';
import _ from 'lodash';
import { Input } from 'reactstrap';
import Icon from '../custom/Icon';
import { Button } from 'reactstrap';

import { Tab } from './index';
import { Nav } from 'reactstrap';
import CustomNavItem from '../custom/CustomNavItem';
import { TabContent } from 'reactstrap';
import { TabPane } from 'reactstrap';
import VirtualTable from '../custom/VirtualTable';
import useAssignedPasswords from './useAssignedPasswords';
import useUserAssignedPasswords, {
    UserAssignedMap,
} from './useUserAssignedPasswords';

export type LocalTab = 'MANAGE' | 'ASSIGN';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    user: IUser;
    selectedPassword?: IUserPassword;
    createUpdatePassword: (password: IUserPassword) => Promise<void>;
    deletePassword: (id: number) => Promise<void>;
    activeTab: Tab;
    users: Array<IUser>;
    assignPassword: (userAssignedMap: UserAssignedMap) => Promise<void>;
}

export default function PasswordForm({
    modal,
    setModal,
    user,
    selectedPassword,
    createUpdatePassword,
    deletePassword,
    activeTab,
    users,
    assignPassword,
}: Props) {
    const {
        formState: { isValid, isDirty, errors },
        handleSubmit,
        reset,
        trigger,
        register
    } = useForm<IUserPassword>({
        defaultValues,
        mode: 'onChange',
        resolver: selectedPassword
            ? yupResolver(updatePasswordSchema)
            : yupResolver(createPasswordSchema),
    });

    const [localActiveTab, setLocalActiveTab] = useState<LocalTab>('MANAGE');
    const [showPassword, setShowPassword] = useState(false);
    const [showGenerator, setShowGenerator] = useState(false);
    const { assignedPasswords } = useAssignedPasswords(
        localActiveTab,
        selectedPassword?.guid
    );
    const { userAssignedMap, selectedIds, handleSelectUser } =
        useUserAssignedPasswords(assignedPasswords, users);

    useEffect(() => {
        if (!selectedPassword) {
            const copy = _.cloneDeep(defaultValues);
            copy.userId =
                activeTab === 'SHARED_PASSWORDS' ? 'SHARED' : user.s_guid;
            copy.created = getTsDate();
            copy.createdBy = user.s_email;
            copy.modified = getTsDate();
            copy.modifiedBy = user.s_email;
            reset(copy);
        } else {
            selectedPassword.modified = getTsDate();
            selectedPassword.modifiedBy = user.s_email;
            reset(selectedPassword);
        }
        trigger();
        setShowPassword(false);
    }, [user, selectedPassword, activeTab]);

    const toggle = () => setModal(!modal);

    const toggleTab = (tab: LocalTab) => setLocalActiveTab(tab);

    return (
        <Container isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader>
                <HeaderContainer>
                    <FlexContainer>
                        <BackButton onClick={toggle} />
                        <h4 className={'pl-2'}>
                            {selectedPassword ? 'Update' : 'Create'} Password
                        </h4>
                    </FlexContainer>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <Nav tabs className={'separator-tabs'}>
                    <CustomNavItem<LocalTab>
                        tabName={'Manage'}
                        tabId="MANAGE"
                        activeTabId={localActiveTab}
                        toggleTab={toggleTab}
                    />
                    {user.sharedVaultAccess &&
                        selectedPassword &&
                        activeTab === 'SHARED_PASSWORDS' && (
                            <CustomNavItem<LocalTab>
                                tabName={'Assign'}
                                tabId="ASSIGN"
                                activeTabId={localActiveTab}
                                toggleTab={toggleTab}
                            />
                        )}
                </Nav>
                <TabContent activeTab={localActiveTab}>
                    <TabPane tabId={'MANAGE'}>
                        <FlexContainer className={'pt-2'}>
                            <FormContainer>
                                <FormInput<IUserPassword>
                                    label={'Name'}
                                    register={register}
                                    name={'name'}
                                    errors={errors}
                                />
                                <FormInput<IUserPassword>
                                    label={'Username'}
                                    register={register}
                                    name={'username'}
                                    errors={errors}
                                />
                                <FormInput<IUserPassword>
                                    label={
                                        'Link/URL - Please COPY and PASTE here'
                                    }
                                    register={register}
                                    name={'link'}
                                    errors={errors}
                                />
                                <PasswordLabelContainer>
                                    <Button
                                        onClick={() =>
                                            setShowGenerator((prev) => !prev)
                                        }
                                    >
                                        {showGenerator ? 'Hide' : 'Show'}{' '}
                                        Password Generator
                                    </Button>
                                </PasswordLabelContainer>
                                <FlexContainer className={'pb-2'}>
                                    <FormInput<IUserPassword>
                                        label={'Password'}
                                        register={register}
                                        name={'password'}
                                        errors={errors}
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                    />
                                    <Icon
                                        className={
                                            'fa-duotone fa-eye text-success'
                                        }
                                        size={30}
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                    />
                                </FlexContainer>
                                <FormInput<IUserPassword>
                                    label={'Notes'}
                                    register={register}
                                    name={'notes'}
                                    errors={errors}
                                    type={'textarea'}
                                />
                            </FormContainer>
                            <PasswordGenerator showGenerator={showGenerator} />
                        </FlexContainer>
                    </TabPane>
                </TabContent>
                <TabContent activeTab={localActiveTab}>
                    <TabPane tabId={'ASSIGN'}>
                        <VirtualTable
                            data={users}
                            mapping={[
                                {
                                    name: 'First Name',
                                    value: 's_first_name',
                                },
                                {
                                    name: 'Last Name',
                                    value: 's_last_name',
                                },
                                {
                                    name: 'Email',
                                    value: 's_email',
                                },
                            ]}
                            numRows={10}
                            selectable
                            selectedIds={selectedIds}
                            enableClick
                            handleClick={(user) => handleSelectUser(user)}
                        />
                        <Button onClick={() => assignPassword(userAssignedMap)} className={'mt-2'}>
                            Assign
                        </Button>
                    </TabPane>
                </TabContent>
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    {selectedPassword && (
                        <Label>
                            Password updated on{' '}
                            {formatDatetime(selectedPassword.modified)}
                        </Label>
                    )}
                    {localActiveTab === 'MANAGE' && (
                        <FooterButtonsContainer
                            selectedPassword={selectedPassword}
                        >
                            {selectedPassword && (
                                <ActionIcon
                                    type={'delete'}
                                    onClick={() =>
                                        deletePassword(selectedPassword.id)
                                    }
                                />
                            )}
                            <ActionIcon
                                type={'save'}
                                disabled={!isValid || !isDirty}
                                onClick={handleSubmit(createUpdatePassword)}
                            />
                        </FooterButtonsContainer>
                    )}
                </FooterContentContainer>
            </ExpandedFooter>
        </Container>
    );
}

const defaultValues: IUserPassword = {
    id: 0,
    userId: '',
    username: '',
    name: '',
    password: '',
    link: '',
    notes: '',
    created: getTsDate(),
    createdBy: '',
    modified: getTsDate(),
    modifiedBy: '',
    guid: '',
};

const Container = styled(Modal)`
    input {
        text-transform: none;
    }
`;

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const FlexContainer = styled.div`
    display: flex;
    gap: 20px;
`;

const PasswordLabelContainer = styled.div`
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 10px;
`;

const FormContainer = styled.div`
    flex: 2;
`;

const ExpandedFooter = styled(ModalFooter)`
    width: 100%;
`;

const FooterContentContainer = styled.div`
    width: 100%;
`;

const FooterButtonsContainer = styled.div<{ selectedPassword?: IUserPassword }>`
    width: 100%;
    display: flex;
    justify-content: ${(p) =>
        p.selectedPassword ? 'space-between' : 'flex-end'};
`;
