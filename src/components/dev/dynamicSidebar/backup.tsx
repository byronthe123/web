import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { IMap } from '../../../globals/interfaces';
import Card from '../../custom/Card';
import { SidebarMap } from '../../../globals/interfaces';
import sidebarMap from './map';
import styled from 'styled-components';
import { Table } from 'reactstrap';

const selectedMap: SidebarMap = {
	operations: {
        id: "Operations",
        icon: 'fa-cogs',
        label: "Operations",
        to: "",
        subs: {
            counter: {
                id: "Counter",
                icon: `fal fa-th-list`,
                label: "Counter",
                to: "/EOS/Operations/Counter/",
                subs: {
                    queue: {
                        id: "Queue",
                        icon: `fal fa-chair`,
                        label: "Queue",
                        to: "/EOS/Operations/Counter/Queue",
                        subs: {}
                    },
                    delivery: {
                        id: "Delivery",
                        icon: "fal fa-sign-out-alt",
                        label: "Delivery",
                        to: "/EOS/Operations/Counter/Delivery",
                        subs: {}
                    },
                    acceptance: {
                        id: "Acceptance",
                        icon: "fal fa-sign-in-alt",
                        label: "Acceptance",
                        to: "/EOS/Operations/Counter/Acceptance",
                        subs: {}
                    },
                    counterReporting: {
                        id: "CounterReporting",
                        icon: "fal fa-chart-bar",
                        label: "Counter Reporting",
                        to: "/EOS/Operations/Counter/CounterReporting",
                        subs: {}
                    }      
                }
            }
        }
	}
}

const getChecked = (selected: boolean | undefined) => selected ? 'fa-duotone fa-circle-check text-success' : 'fa-solid fa-circle-dashed';

export default function DynamicSidebar () {

    const [interactMenu, setInteractMenu] = useState<SidebarMap>({});
    const [selectedSubs, setSelectedSubs] = useState<IMap<boolean>>({});

    useEffect(() => {
        const sideBarMapCopy = { ...sidebarMap };
        for (let tabId in selectedMap) {
            sideBarMapCopy[tabId].selected = true;
            const { subs } = selectedMap[tabId];
            for (let subId in subs) {
                sideBarMapCopy[tabId].subs[subId].selected = true;
            }
        }
        setInteractMenu(sideBarMapCopy);
    }, []);

    const handleSelectTab = (tabId: string) => {
        setInteractMenu((prev) => {
            const copy = { ...prev };
            copy[tabId].selected = !copy[tabId].selected;
            return copy;
        })
    }

    const expandSub = (subId: string) => {
        setSelectedSubs((prev) => {
            const copy = { ...prev };
            if (copy[subId]) {
                delete copy[subId];
            } else {
                copy[subId] = true;
            }
            return copy;
        });
    }

    const selectSub = (tabId: string, subId: string) => {
        setInteractMenu(prev => {
            const copy = { ...prev };
            copy[tabId].subs[subId].selected = !copy[tabId].subs[subId].selected;
            return copy;
        });
    }

    const selectFinalSub = (tabId: string, subId: string, finalSubId: string) => {
        setInteractMenu(prev => {
            const copy = { ...prev };
            copy[tabId].subs[subId].subs[finalSubId].selected = !copy[tabId].subs[subId].subs[finalSubId].selected;
            return copy;
        });
    }

    return (
        <>
            {
                Object.keys(interactMenu).map((tabId: string, i: number) => (
                    <Wrapper 
                        selected={interactMenu[tabId].selected}
                    >
                        <Header>
                            <TitleDiv>
                                <h1>
                                    {interactMenu[tabId].label}
                                </h1>
                            </TitleDiv>
                            <CardIcon 
                                className={classnames(
                                    getChecked(interactMenu[tabId].selected)
                                )} 
                                onClick={() => handleSelectTab(tabId)}
                            />
                        </Header>
                        <div
                            className={`${!interactMenu[tabId].selected && 'custom-disabled'}`}
                        >
                            <Table>
                                <thead></thead>
                                <tbody>
                                    {
                                        Object.keys(interactMenu[tabId].subs).map((subId, j) => (
                                            <> 
                                                <tr 
                                                    className={'hover-pointer'}
                                                    onClick={() => selectSub(tabId, subId)}
                                                    key={j}
                                                >
                                                    <td width={100}>
                                                        {
                                                            <h4 
                                                                key={j}
                                                            >
                                                                {interactMenu[tabId].subs[subId].label}
                                                            </h4>
                                                        }
                                                    </td>
                                                    <td>
                                                        <SubIcon className={getChecked(interactMenu[tabId].subs[subId].selected)} />
                                                    </td>
                                                </tr>
                                                <FinalSubDiv>
                                                    <Table>
                                                        <thead></thead>
                                                        <tbody>
                                                            {
                                                                interactMenu[tabId].subs[subId].selected && Object.keys(interactMenu[tabId].subs[subId].subs).map((finalSubId, k) => (
                                                                    <tr 
                                                                        className={'hover-pointer'}
                                                                        onClick={() => selectFinalSub(tabId, subId, finalSubId)}
                                                                        key={k}
                                                                    >
                                                                        <td width={230}>
                                                                            {interactMenu[tabId].subs[subId].subs[finalSubId].label}
                                                                        </td>
                                                                        <td width={500}>
                                                                            <SubIcon className={getChecked(interactMenu[tabId].subs[subId].subs[finalSubId].selected)} />
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </FinalSubDiv>
                                            </>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </Wrapper>
                ))
            }
        </>
    );
}

const Wrapper = styled(Card)`
    margin-bottom: 5px;
    background-color: ${p => p.selected && '#daf9da'};
    border: ${p => p.selected && '2px solid #0cf00c'}
`;

const Header = styled.div`
    display: flex;
`;

const TitleDiv = styled.div`
    width: 250px;
`;

const CardIcon = styled.i`
    font-size: 30px;
    margin-top: 1px;
`;

const SubIcon = styled.i`
    font-size: 20px;
`;

const FinalSubDiv = styled.div`
    padding-left: 30px;
    border: 1px solid red;
`;
