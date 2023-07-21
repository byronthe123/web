import React, { Fragment } from "react";
import {
  Row,
  Col,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  TabContent,
  TabPane,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import Update from './Update';

export default function UpdatesCard ({
    updates
}) {

    return (
        <Fragment>
            <CardHeader>
                <Nav tabs className="card-header-tabs">
                    <NavItem>
                        <NavLink
                            to="#"
                            location={{}}
                            className={'nav-link'}
                        >
                            Updates
                        </NavLink>
                    </NavItem>
                </Nav>
            </CardHeader>
            <TabContent activeTab={'1'}>
                <TabPane tabId="1">
                    <Row>
                        <Col md={12} lg={12}>
                            <CardBody className={'py-1'}>
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
            </TabContent>
      </Fragment>
    );
}
