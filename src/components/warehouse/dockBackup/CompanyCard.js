import React, {Component, useState, useEffect, Fragment} from 'react';
import moment from 'moment';
import CompanyCardDetails from './CompanyCardDetails';
import {Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const CompanyCard = ({
    width,
    myAssignments,
    company,
    dockData,
    handleAssign,
    handleSetSelectedAwbs,
    finishDocking,
    removeDockDoorAgent,
    removeDockDoor,
    handleExportAcceptPcs,
    handleModalReject,
    handleModalConfirmLeftEarly
}) => {

    const [showAwbDetails, setShowAwbDetails] = useState(false);
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [dropDownOpen2, setDropDownOpen2] = useState(false);

    const toggleDropDownButton = () => setDropDownOpen(!dropDownOpen);
    const toggleDropDownButton2 = () => setDropDownOpen2(!dropDownOpen2);

    const timeSince = (_start) => {
        const start = moment(_start)
        const now = moment();
        const diff = moment.duration(moment(now).diff(moment(start)));
        var days = parseInt(diff.asDays()); //84
        var hours = parseInt(diff.asHours()); //2039 hours, but it gives total hours in given miliseconds which is not expacted.
        hours = hours - days*24;  // 23 hours
        var minutes = parseInt(diff.asMinutes()); //122360 minutes,but it gives total minutes in given miliseconds which is not expacted.
        minutes = minutes - (days*24*60 + hours*60);
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        //daylight savings ? - 4 : - 5
        hours = hours - 4;
        return `${hours}:${minutes}`;
    }

    const getTruckingCoTimeWaiting = (company) => {
        return timeSince(company.t_counter_end);
    }

    const resolveBackground = () => {
        const state = company.s_state.toUpperCase();
        const color = state === 'MIXED' ? 'goldenrod' : state === 'EXPORT' ? '#add8e6' : '#99e599';
        return color;
    }

    const resolveTitleAssign = () => {
        if (company.s_dock_ownership !== null && company.s_dock_door === null) {
            return `${company.s_dock_ownership.toUpperCase().replace('@CHOICE.AERO', '')} at No Door`;
        } else if (company.s_dock_ownership === null && company.s_dock_door !== null) {
            return `Door ${company.s_dock_door}`;
        } else if (company.s_dock_ownership !== null && company.s_dock_door !== null) {
            return `${company.s_dock_ownership.toUpperCase().replace('@CHOICE.AERO', '')} at Door ${company.s_dock_door}`;
        }
    }

    const resolveCompleteStatus = () => {
        if (company.s_dock_ownership !== null && company.s_dock_door === null) {
            return 0;
        } else if (company.s_dock_ownership === null && company.s_dock_door !== null) {
            return 1;
        } else if (company.s_dock_ownership !== null && company.s_dock_door !== null) {
            return 2;
        } else if (company.s_dock_ownership === null && company.s_dock_door === null) {
            return -1;
        }
    }

    return(
        company && 
        <div className={`px-2 ${width > 1600 ? 'col-12' : width > 1200 ? 'col-6' : 'col-12' }`}>
            <div className={`bg-dark-grey card company-card`} style={{backgroundColor: resolveBackground(), borderRadius: '0.75rem', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', fontSize: '16px'}}>
                <div className="card-body px-4 py-3">
                    <div className='clearfix'>
                        <div style={{width: '95%'}}>
                            <span style={{float: 'left'}}>
                                <h5 className="my-1" style={{display: 'inline'}}>{company.s_trucking_company}</h5>
                            </span>
                        </div>
                        {
                            company.s_status !== 'DOCKING' || resolveCompleteStatus() === -1 ? 
                            <div style={{width: '5%', float: 'right'}}>
                                {
                                    <i className="fas fa-plus" style={{fontSize: "20px", float: "right", color: "black"}} onClick={() => handleAssign(company)}></i>
                                }
                            </div> : 
                            <div style={{width: '50%', float: 'right', textAlign: 'right'}}>
                                <ButtonDropdown isOpen={dropDownOpen} toggle={toggleDropDownButton}>
                                    <DropdownToggle caret color='info'>
                                        {resolveTitleAssign()}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {
                                            resolveCompleteStatus() === 0 ?
                                            <Fragment>
                                                <DropdownItem onClick={() => handleAssign(company)}>Assign Door</DropdownItem>
                                                <DropdownItem onClick={() => removeDockDoorAgent(company.s_warehouse_productivity_guid, company.s_dock_door_guid)}>Unassign Agent</DropdownItem>
                                            </Fragment> :
                                            resolveCompleteStatus() === 1 ?
                                            <Fragment>
                                                <DropdownItem onClick={() => handleAssign(company)}>Assign Agent</DropdownItem>
                                                <DropdownItem onClick={() => removeDockDoor(company.s_dock_door_guid)}>Unassign Door</DropdownItem>
                                            </Fragment> :
                                            resolveCompleteStatus() === 2 ?
                                            <Fragment>
                                                <DropdownItem onClick={() => finishDocking(company)}>Finish</DropdownItem>
                                                <DropdownItem onClick={() => removeDockDoorAgent(company.s_warehouse_productivity_guid, company.s_dock_door_guid)}>Unassign Agent</DropdownItem>
                                                <DropdownItem onClick={() => removeDockDoor(company.s_dock_door_guid)}>Unassign Door</DropdownItem>
                                            </Fragment> :
                                            <Fragment>
                                                <DropdownItem onClick={() => removeDockDoorAgent(company.s_warehouse_productivity_guid, company.s_dock_door_guid)}>Unassign Agent</DropdownItem>
                                                <DropdownItem onClick={() => removeDockDoor(company.s_dock_door_guid)}>Unassign Door</DropdownItem>
                                            </Fragment>
                                        }
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </div>
                        }

                    </div>
                    <b className="card-subtitle">{company && company.s_trucking_driver}</b>
                    <p className="queue-card-details mb-0" style={{fontSize: '16px'}}>
                        {company && moment.utc(company.t_counter_end).format('MM/DD/YYYY hh:mm A')}
                        <span className='ml-1'>{company && getTruckingCoTimeWaiting(company)}</span>
                    </p>
                    <div style={{display: showAwbDetails ? 'block' : 'none'}}>
                        {
                            dockData.map((item, i) => item.s_transaction_id === company.s_transaction_id ? <CompanyCardDetails detail={item} key={i} handleSetSelectedAwbs={handleSetSelectedAwbs} handleExportAcceptPcs={handleExportAcceptPcs} handleModalReject={handleModalReject} /> : null)
                        }
                    </div>
                    <div className='clearfix'>
                        <div style={{float: 'left'}}>
                            <span className="bg-info px-1">{company.exportCount}</span>
                            <span className="bg-success px-1">{company.importCount}</span>
                        </div>
                    </div>
                    <i onClick={() => handleModalConfirmLeftEarly(company)} className="far fa-times-circle dock-reject-alt"></i>
                    <span className="fas fa-chevron-down" onClick={() => setShowAwbDetails(!showAwbDetails)} style={{fontSize: "24px", color: 'black', position: 'relative', left: '92.5%', top: '10px'}}></span>
                </div>
            </div>
        </div>
    );    
}

export default CompanyCard;