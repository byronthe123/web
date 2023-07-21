import React, { Component, useState, useEffect, Fragment } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  ButtonGroup,
  CardHeader,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  Button,
  Table
} from "reactstrap";
import { NavLink } from "react-router-dom";
import moment from 'moment';
import Update from './Update';
import ReadingSignModal from './ReadingSignModal';

import classnames from "classnames";
import { asyncHandler } from "../../utils";
import Axios from "axios";
import _ from 'lodash';

const ProfileTabCard = ({
    user,
    baseApiUrl,
    headerAuthCode,
    createSuccessNotification,
    updates,
    readingSigns,
    setReadingSigns
}) => {
  
    const [activeTab, setActiveTab] = useState('1');

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    }

    const [selectedReadingSign, setSelectedReadingSign] = useState({});
    const [modal, setModal] = useState(false);
    const handleSelectReadingSign = (readingSign) => {
        setSelectedReadingSign(readingSign);
        setModal(true);
    }

    const resolveBackgroundColor = (theme) => {
        if (theme && theme) {
            switch(theme) {
                case 'green':
                    return '#32cd32';
            }
        }
    }

    const [viewRead, setViewRead] = useState(false);
    const [key, setKey] = useState(0);

    const acknowledgeReadingSign = asyncHandler(async() => {
        await Axios.put(`${baseApiUrl}/acknowledgeReadingSign`, {
            _id: selectedReadingSign._id
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        // const updatedIndex = readingSigns.findIndex(rs => rs._id === selectedReadingSign._id);
        // readingSigns[updatedIndex].acknowledged = true;

        const copy = Object.assign([], readingSigns);
        const updatedIndex = copy.findIndex(rs => rs._id === selectedReadingSign._id);
        copy[updatedIndex].acknowledged = true;
        setReadingSigns(copy);

        setKey(key + 1);
        setModal(false);
        createSuccessNotification('Thank you');
    });

    return (
        <Fragment>
            <CardHeader className='py-3'>
                <Nav tabs className="card-header-tabs ">
                    <NavItem>
                        <NavLink
                            to="#"
                            location={{}}
                            className={classnames({
                            active: activeTab === "1",
                            "nav-link": true
                            })}
                            onClick={() => {
                            toggleTab("1");
                            }}
                        >
                            Reading Signs
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            to="#"
                            location={{}}
                            className={classnames({
                            active: activeTab === "3",
                            "nav-link": true
                            })}
                            onClick={() => {
                            toggleTab("3");
                            }}
                        >
                            Human Resources
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            to="#"
                            location={{}}
                            className={classnames({
                            active: activeTab === "4",
                            "nav-link": true
                            })}
                            onClick={() => {
                            toggleTab("4");
                            }}
                        >
                            EOS
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            to="#"
                            location={{}}
                            className={classnames({
                            active: activeTab === "5",
                            "nav-link": true
                            })}
                            onClick={() => {
                            toggleTab("5");
                            }}
                        >
                            Others
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            to="#"
                            location={{}}
                            className={classnames({
                            active: activeTab === "6",
                            "nav-link": true
                            })}
                            onClick={() => {
                            toggleTab("6");
                            }}
                        >
                            Shifts
                        </NavLink>
                    </NavItem>
                </Nav>
            </CardHeader>

            <TabContent activeTab={activeTab}>
                {/* All Updates */}
                <TabPane tabId="1">
                    <Row>
                        <Col md={12} lg={12}>
                            <CardBody className={'py-1'}>
                                <Row className={'mb-2'}>
                                    <Col md={12}>
                                        <ButtonGroup>
                                            <Button onClick={() => setViewRead(false)} active={viewRead === false}>Unread</Button>
                                            <Button onClick={() => setViewRead(true)} active={viewRead === true}>Read</Button>
                                        </ButtonGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} key={key}>
                                    {
                                        readingSigns && readingSigns.map((rs, i) => rs.acknowledged === viewRead && rs.readingSignId && 
                                            <li className='mb-2 hover-pointer' key={i} onClick={() => handleSelectReadingSign(rs)} style={{ fontSize: '16px' }}>
                                                {moment(moment(_.get(rs, 'readingSignId.dueDate', null)).format('YYYY-MM-DD')).isBefore(moment().format('YYYY-MM-DD')) && <span className={'mr-1 text-danger bg-warning font-weight-bold'}>OVERDUE</span>}
                                                {
                                                    `${ moment.utc(rs.createdAt).format('MM/DD/YYYY') } - ${rs.readingSignId.title} (due on ${moment(rs.readingSignId.dueDate).format('MM/DD/YYYY')})`
                                                }
                                            </li>
                                        )
                                    }
                                    </Col>
                                </Row>
                            </CardBody>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="2">
                    <Row>
                        <Col md={12} lg={12}>
                            <CardBody>
                                <ul className='updates-ul'>
                                    {
                                        updates.map((u, i) => u.b_display && 
                                            <li className='mb-2' key={i}>
                                                <Update 
                                                    update={u}
                                                />
                                            </li>
                                        )
                                    }
                                </ul>
                            </CardBody>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="3">
                    <Row>
                        <Col md={12} lg={12}>
                            <CardBody>

                            </CardBody>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="4">
                    <Row>
                        <Col md={12} lg={12}>
                            <CardBody>
                                
                            </CardBody>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="5">
                    <Row>
                        <Col md={12} lg={12}>
                            <CardBody>
                                
                            </CardBody>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="6">
                    <Row>
                        <Col md={12} lg={12}>
                            <CardBody>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name:</th>
                                            <th>Start</th>
                                            <th>End</th>
                                            <th>Modified</th>
                                            <th>Modified By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        user && user.shifts && user.shifts.map((s, i) => 
                                            <tr key={i} style={{backgroundColor: resolveBackgroundColor(s.sharedShift.theme), fontWeight: 'bolder'}}>
                                                <td>{i+1}</td>
                                                <td>{s.sharedShift.displayName}</td>
                                                <td>{moment(s.sharedShift.startDateTime).format('MM/DD/YYYY HH:mm A')}</td>
                                                <td>{moment(s.sharedShift.endDateTime).format('MM/DD/YYYY HH:mm A')}</td>
                                                <td>{moment(s.lastModifiedBy.lastModifiedDateTime).format('MM/DD/YYYY HH:mm A')}</td>
                                                <td>{s.lastModifiedBy.user.displayName}</td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </Table>

                            </CardBody>
                        </Col>
                    </Row>
                    <ReadingSignModal 
                        modal={modal}
                        setModal={setModal}
                        selectedReadingSign={selectedReadingSign}
                        user={user}
                        acknowledgeReadingSign={acknowledgeReadingSign}
                    />
                </TabPane>
            </TabContent>
      </Fragment>
    );
}

export default ProfileTabCard;
