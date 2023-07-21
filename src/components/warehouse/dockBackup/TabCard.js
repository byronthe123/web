import React, { Component, useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  Button,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";

import CompanyCard from './CompanyCard';

const TabCard = ({
  dockData,
  companies,
  width,
  eightyWindow,
  handleAssign,
  handleSetSelectedAwbs,
  finishDocking,
  removeDockDoorAgent,
  removeDockDoor,
  handleExportAcceptPcs,
  handleModalReject,
  markLeftEarly,
  handleModalConfirmLeftEarly
}) => {
  
    const [activeTab, setActiveTab] = useState('1');

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    }

    return (
      <Row>
        <Col md={12} lg={12}>
          <CardTitle className="mb-4">

          </CardTitle>
          <Row>
            <Col md={12} lg={12}>
              <Card className="mb-4" style={{borderRadius: '0.75rem'}}>
                <CardHeader>
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
                        All
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        to="#"
                        location={{}}
                        className={classnames({
                          active: activeTab === "2",
                          "nav-link": true
                        })}
                        onClick={() => {
                          toggleTab("2");
                        }}
                      >
                        Assigned
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
                        Import
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
                        Export
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>

                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <Row>
                        <Col md={12} lg={12}>
                            <CardBody>
                                <div class="card-columns">
                                    {
                                        companies.map((c, i) => 
                                            <CompanyCard
                                                company={c}
                                                dockData={dockData}
                                                width={width}
                                                handleAssign={handleAssign}
                                                handleSetSelectedAwbs={handleSetSelectedAwbs}
                                                key={i}
                                                finishDocking={finishDocking}
                                                removeDockDoorAgent={removeDockDoorAgent}
                                                removeDockDoor={removeDockDoor}
                                                handleExportAcceptPcs={handleExportAcceptPcs}
                                                handleModalReject={handleModalReject}
                                                markLeftEarly={markLeftEarly}
                                                handleModalConfirmLeftEarly={handleModalConfirmLeftEarly}
                                            />
                                        )
                                    }
                                </div>                        
                            </CardBody>
                        </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                        <Col md={12} lg={12}>
                            <CardBody>
                              <div class="card-columns">
                                    {
                                        companies.map((c, i) => c.s_status === 'DOCKING' && 
                                            <CompanyCard
                                                company={c}
                                                dockData={dockData}
                                                width={width}
                                                handleAssign={handleAssign}
                                                handleSetSelectedAwbs={handleSetSelectedAwbs}
                                                key={i}
                                                finishDocking={finishDocking}
                                            />
                                        )
                                    }
                                </div>                        
                            </CardBody>
                        </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="3">
                    <Row>
                      <Col md={12} lg={12}>
                        <CardBody>
                          <div class="card-columns">
                            {
                                companies.map((c, i) => c.s_type === 'IMPORT' && 
                                    <CompanyCard
                                        company={c}
                                        dockData={dockData}
                                        width={width}
                                        handleAssign={handleAssign}
                                        handleSetSelectedAwbs={handleSetSelectedAwbs}
                                        key={i}
                                        finishDocking={finishDocking}
                                    />
                                )
                            }
                          </div>                        
                        </CardBody>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="4">
                    <Row>
                      <Col md={12} lg={12}>
                        <CardBody>
                          <div class="card-columns">
                            {
                              companies.map((c, i) => c.s_type === 'EXPORT' && 
                                  <CompanyCard
                                      company={c}
                                      dockData={dockData}
                                      width={width}
                                      handleAssign={handleAssign}
                                      handleSetSelectedAwbs={handleSetSelectedAwbs}
                                      key={i}
                                      finishDocking={finishDocking}
                                  />
                              )
                            }
                          </div>                        
                        </CardBody>
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    );
}

export default TabCard;
