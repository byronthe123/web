import React, {Fragment, useState, useEffect, useRef} from 'react';
import { Form, FormGroup, Table, Button, Input, Card, CardBody, Breadcrumb, BreadcrumbItem, Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import moment from 'moment';
import axios from 'axios';
import { Formik, Field } from 'formik';

const Locate = ({
    baseApiUrl,
    headerAuthCode,
    user,
    eightyWindow,
    createSuccessNotification
}) => {
    return (
        <Row>

            <div className={`${eightyWindow() ? 'col-12' : 'col-3'}`}>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row>
                            <h4>Make a Selection:</h4>
                        </Row>
                        <Row>
                            <h4>Date</h4>
                            <input type='date' style={{display: 'inline'}} />
                        </Row>
                    </CardBody>
                </Card>
            </div>

        </Row>
    );
}

export default Locate;