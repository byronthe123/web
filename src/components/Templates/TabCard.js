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
import { Colxx } from "../../common/CustomBootstrap";

const TabCard = ({

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
              <Card className="mb-4">
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
                        Tab 1
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
                        Tab 2
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
                        Tab 3
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>

                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <Row>
                        <Col md={12} lg={12}>
                            <CardBody>
                            <CardTitle className="mb-4">
                                Cheesecake with Chocolate Cookies and Cream Biscuits
                            </CardTitle>
                            <Button outline size="sm" color="primary">
                                Edit
                            </Button>
                            </CardBody>
                        </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                        <Col md={12} lg={12}>
                            <CardBody>
                                <CardTitle className="mb-4">
                                    Cheesecake with Chocolate Cookies and Cream Biscuits
                                </CardTitle>
                            </CardBody>
                        </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="3">
                    <Row>
                      <Col md={12} lg={12}>
                        <CardBody>
                          <CardTitle className="mb-4">
                            Cheesecake with Chocolate Cookies and Cream Biscuits
                          </CardTitle>
                          <Button outline size="sm" color="primary">
                            Edit
                          </Button>
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
