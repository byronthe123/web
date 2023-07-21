import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import classnames from 'classnames';
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { IEmployee, IUser, SidebarMap } from '../../globals/interfaces';
import Card from '../custom/Card';
import ActionIcon from '../custom/ActionIcon';
import { api, notify } from '../../utils';
import useRestrictedAccess from '../../customHooks/useRestrictedAccess';
import { CardWrapper } from './SharedComponents';

export type NativeMap = Record<string, {
    name: string;
    pages: Record<string, {
        name: string;
    }>
}>;

interface Props {
    user: IUser,
    modal: boolean;
    setModal: (state: boolean) => void;
    selectedEmployee: IEmployee;
    nativeAccessMapSchema: NativeMap;
}

export default function ModalNativeAccessMap ({
    user,
    modal,
    setModal,
    selectedEmployee,
    nativeAccessMapSchema
}: Props) {

    const toggle = () => setModal(!modal);

    const [userAccessMap, setUserAccessMap] = useState<NativeMap>({});
    const [accessMap, setAccessMap] = useState<NativeMap>({});
    const restirctedAccess = useRestrictedAccess(user.s_email);

    useEffect(() => {
        const getUserNativeAccessMap = async () => {
            const res = await api('get', `nativeAccessMap/${selectedEmployee.s_email}`);
            setUserAccessMap(res.data || {});
        }
        getUserNativeAccessMap();
    }, [selectedEmployee]);

    useEffect(() => {
        const mapCopy = _.cloneDeep(userAccessMap);
        setAccessMap(mapCopy);
    }, [userAccessMap]);

    const handleSelectSection = (section: string) => {
        setAccessMap((prev) => {
            const copy = { ...prev };
            if (copy[section]) {
                delete copy[section];
            } else {
                copy[section] = {
                    name: nativeAccessMapSchema[section].name,
                    pages: {}
                }
            }
            return copy;
        })
    }

    const selectAllPages = (section: string) => {
        setAccessMap(prev => {
            const copy = _.cloneDeep(prev);
            if (copy[section]) {
                delete copy[section];
            } else {
                copy[section] = nativeAccessMapSchema[section];
            }
            return copy;
        });
    }

    const selectPage = (section: string, page: string) => {
        setAccessMap(prev => {
            const copy = { ...prev };
            if (copy[section].pages[page]) {
                delete copy[section].pages[page];
            } else {
                copy[section].pages[page] = nativeAccessMapSchema[section].pages[page];
            }
            return copy;
        });
    }

    const manageAccessMap = async () => {
        const res = await api('post', 'nativeAccessMap', {
            email: selectedEmployee.s_email,
            map: accessMap
        });
        if ([201, 204].indexOf(res.status) !== -1) {
            notify('Updated');
            toggle();
        }
    }

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'} className={'responsive-modal'}>
            <ModalHeader>Manage Mobile Access Map for {`${selectedEmployee.s_first_name} ${selectedEmployee.s_last_name}`}</ModalHeader>
            <ModalBody>
                <Wrapper>
                    {
                        Object.keys(nativeAccessMapSchema).map((section: string) => (
                            <CardWrapper 
                                selected={Object.keys(accessMap).length > 0}
                                key={section}
                            >
                                <Header>
                                    <TitleDiv>
                                        <h1>
                                            {nativeAccessMapSchema[section].name}
                                        </h1>
                                    </TitleDiv>
                                    <CardIcon 
                                        className={classnames(
                                            getChecked(accessMap[section] !== undefined)
                                        )} 
                                        onClick={() => handleSelectSection(section)}
                                    />
                                    {
                                        accessMap[section] &&
                                        <SelectAll 
                                            className={classnames('fa-duotone fa-check-double text-success')}
                                            onClick={() => selectAllPages(section)}
                                        />
                                    }
                                </Header>
                                <div
                                    className={`${!accessMap[section] && 'custom-disabled'}`}
                                >
                                    {
                                        Object.keys(nativeAccessMapSchema[section].pages).map((page) => (
                                            <div key={page}> 
                                                <div 
                                                    className={'d-flex hover-pointer'}
                                                    onClick={() => selectPage(section, page)}
                                                >
                                                    <SubTitleDiv
                                                        
                                                    >
                                                        <h4>{nativeAccessMapSchema[section].pages[page].name}</h4>
                                                    </SubTitleDiv>
                                                    <SubIcon className={getChecked(accessMap[section] && accessMap[section].pages[page] !== undefined)} />
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </CardWrapper>
                        ))
                    }
                </Wrapper>
            </ModalBody>
            <ModalFooter>
                {
                    restirctedAccess && 
                        <ActionIcon 
                            type={'save'}
                            onClick={() => manageAccessMap()}
                        />
                }
            </ModalFooter>
        </Modal>
    );
}

const getChecked = (selected: boolean | undefined) => selected ? 'fa-duotone fa-circle-check text-success' : 'fa-solid fa-circle-dashed';

const Wrapper = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 10px;
`;

const Header = styled.div`
    display: flex;
`;

const TitleDiv = styled.div`
    width: 240px;
`;

const CardIcon = styled.i`
    font-size: 30px;
    margin-top: 1px;
    margin-right: 5px;
`;

const SelectAll = styled.i`
    font-size: 30px;
    &:hover {
        cursor: pointer;
    }
`;

const SubTitleDiv = styled.div`
    width: 245px;
    display: inline;
`;

const SubIcon = styled.i`
    font-size: 20px;
    display: inline;
`;

const FinalSubDiv = styled.div`
    padding-left: 30px;
`;

const FinalSubTitleDiv = styled.div`
    width: 215px;
`;