import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import classnames from 'classnames';
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import sidebarMap from '../../constants/sidebarMap';
import { IEmployee, IUser, SidebarMap } from '../../globals/interfaces';
import Card from '../custom/Card';
import ActionIcon from '../custom/ActionIcon';
import { api, notify } from '../../utils';
import useRestrictedAccess from '../../customHooks/useRestrictedAccess';
import { CardWrapper } from './SharedComponents';

interface Props {
    user: IUser,
    modal: boolean;
    setModal: (state: boolean) => void;
    selectedEmployee: IEmployee
}

export default function ModalAccessMap ({
    user,
    modal,
    setModal,
    selectedEmployee
}: Props) {

    const toggle = () => setModal(!modal);

    const [userAccessMap, setUserAccessMap] = useState<SidebarMap>({});
    const [accessMap, setAccessMap] = useState<SidebarMap>({});
    const restirctedAccess = useRestrictedAccess(user.s_email);

    useEffect(() => {
        const getUserAccessMap = async () => {
            const res = await api('get', `accessMap/${selectedEmployee.s_email}`);
            setUserAccessMap(res.data);
        }
        getUserAccessMap();
    }, [selectedEmployee]);

    useEffect(() => {
        const sideBarMapCopy = _.cloneDeep(sidebarMap);
        for (let tabId in userAccessMap) {
            sideBarMapCopy[tabId].selected = true;
            delete sideBarMapCopy[tabId]['component'];
            const { subs } = userAccessMap[tabId];
            for (let subId in subs) {
                if (sideBarMapCopy[tabId].subs[subId]) {
                    sideBarMapCopy[tabId].subs[subId].selected = true;
                    delete sideBarMapCopy[tabId].subs[subId]['component'];
    
                    const finalSubs = subs[subId].subs;
                    for (let finalSubId in finalSubs) {
                        if (sideBarMapCopy[tabId].subs[subId].subs[finalSubId]) {
                            sideBarMapCopy[tabId].subs[subId].subs[finalSubId].selected = true;
                            delete sideBarMapCopy[tabId].subs[subId].subs[finalSubId]['component'];    
                        }
                    }
                }
            }
        }

        // delete sideBarMapCopy.display;
        delete sideBarMapCopy.dontRender;
        setAccessMap(sideBarMapCopy);
    }, [userAccessMap]);

    const handleSelectTab = (tabId: string) => {
        setAccessMap((prev) => {
            const copy = { ...prev };
            copy[tabId].selected = !copy[tabId].selected;
            return copy;
        })
    }

    const selectSub = (tabId: string, subId: string) => {
        setAccessMap(prev => {
            const copy = { ...prev };
            copy[tabId].subs[subId].selected = !copy[tabId].subs[subId].selected;
            return copy;
        });
    }

    const selectFinalSub = (tabId: string, subId: string, finalSubId: string) => {
        setAccessMap(prev => {
            const copy = { ...prev };
            copy[tabId].subs[subId].subs[finalSubId].selected = !copy[tabId].subs[subId].subs[finalSubId].selected;
            return copy;
        });
    }

    const manageAccessMap = async () => {
        const copy = _.cloneDeep(accessMap);
        for (let tabId in copy) {
            if (!copy[tabId].selected) {
                delete copy[tabId];
            } else {
                const subs = copy[tabId].subs;
                for (let subId in subs) {
                    if (!subs[subId].selected) {
                        delete subs[subId];
                    } else {
                        const thirdSubs = subs[subId].subs;
                        for (let thirdSubId in thirdSubs) {
                            if (!thirdSubs[thirdSubId].selected) {
                                delete thirdSubs[thirdSubId];
                            }
                        }
                    }
                }
            }
        }

        const res = await api('post', 'accessMap', {
            email: selectedEmployee.s_email,
            map: copy
        });
        if ([201, 204].indexOf(res.status) !== -1) {
            notify('Updated');
            toggle();
        }
    }

    const selectAllSubs = (tabId: string) => {
        setAccessMap(prev => {
            const copy = _.cloneDeep(prev);
            const { subs } = copy[tabId];
            for (let subId in subs) {
                subs[subId].selected = !subs[subId].selected;
                const finalSubs = subs[subId].subs;
                for (let finalSubId in finalSubs) {
                    finalSubs[finalSubId].selected = !finalSubs[finalSubId].selected;
                }
            }
            return copy;
        });
    }

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'} className={'responsive-modal'}>
            <ModalHeader>Manage Access Map for {`${selectedEmployee.s_first_name} ${selectedEmployee.s_last_name}`}</ModalHeader>
            <ModalBody>
                <Wrapper>
                    {
                        Object.keys(accessMap).map((tabId: string) => (
                            <CardWrapper 
                                selected={accessMap[tabId].selected}
                                key={tabId}
                            >
                                <Header>
                                    <TitleDiv>
                                        <h1>
                                            {accessMap[tabId].label}
                                        </h1>
                                    </TitleDiv>
                                    <CardIcon 
                                        className={classnames(
                                            getChecked(accessMap[tabId].selected)
                                        )} 
                                        onClick={() => handleSelectTab(tabId)}
                                    />
                                    {
                                        accessMap[tabId].selected &&
                                        <SelectAll 
                                            className={classnames('fa-duotone fa-check-double text-success')}
                                            onClick={() => selectAllSubs(tabId)}
                                        />
                                    }
                                </Header>
                                <div
                                    className={`${!accessMap[tabId].selected && 'custom-disabled'}`}
                                >
                                    {
                                        Object.keys(accessMap[tabId].subs).map((subId) => (
                                            <div key={subId}> 
                                                <div 
                                                    className={'d-flex hover-pointer'}
                                                    onClick={() => selectSub(tabId, subId)}
                                                >
                                                    <SubTitleDiv
                                                        
                                                    >
                                                        <h4>{accessMap[tabId].subs[subId].label}</h4>
                                                    </SubTitleDiv>
                                                    <SubIcon className={getChecked(accessMap[tabId].subs[subId].selected)} />
                                                </div>
                                                <FinalSubDiv>
                                                    {
                                                        accessMap[tabId].subs[subId].selected && Object.keys(accessMap[tabId].subs[subId].subs).map((finalSubId) => (
                                                            <div 
                                                                className={'hover-pointer d-flex'}
                                                                onClick={() => selectFinalSub(tabId, subId, finalSubId)}
                                                                key={finalSubId}
                                                            >
                                                                <FinalSubTitleDiv>
                                                                    <h5>- {accessMap[tabId].subs[subId].subs[finalSubId].label}</h5>
                                                                </FinalSubTitleDiv>
                                                                <SubIcon className={getChecked(accessMap[tabId].subs[subId].subs[finalSubId].selected)} />
                                                            </div>
                                                        ))
                                                    }
                                                </FinalSubDiv>
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
    display: flex;
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