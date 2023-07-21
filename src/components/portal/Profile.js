import React, { useState, useEffect }  from 'react';
import { Card, CardBody, Row, Col, Button  } from "reactstrap";
import { api } from '../../utils';
import SelectAirport from '../custom/SelectAirport';

import ProfileTabCard from './ProfileTabCard';
import UpdatesCard from './UpdatesCard';

const Profile = ({
    baseApiUrl,
    headerAuthCode,
    user,
    createSuccessNotification,
    readingSigns,
    setReadingSigns,
    updates
}) => {

    return (
        <Row>
            <Col lg={3} md={12} style={{marginTop: '65px'}} className={'mb-2'}>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <img src={user.photo ? `data:image/jpeg;base64,${user.photo}` : '/assets/img/user.png'} className="img-thumbnail card-img social-profile-img" style={{borderRadius: '0.75rem'}} />
                    <CardBody className='custom-card-transparent py-3 px-3' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row className="text-muted text-right mb-2">
                            <Col md={12}>
                                {
                                    user.id && 
                                    <a href={`https://nam.delve.office.com/?u=${user.id}&v=work`} target={'blank'}>
                                        <i className="pr-3 far fa-edit"></i>
                                    </a>
                                }
                            </Col>
                        </Row>
                        <Row className='text-center'>
                            <Col md={12}>
                                <p className='mb-0'>{user.jobTitle}</p>
                                <p className='mb-0'>{user.department}</p>
                                <p>{user.s_unit}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                About Me
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                {user.aboutMe}
                            </Col>
                        </Row> 
                        <Row>
                            <Col md={12}>
                                Projects
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <ul>
                                    {
                                        user.projects && user.projects.map((p, i) => 
                                            <li key={i}>{p}</li>
                                        )
                                    }
                                </ul>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                My Skills
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <ul>
                                    {
                                        user.skills && user.skills.map((s, i) => 
                                            <li key={i}>{s}</li>
                                        )
                                    }
                                </ul>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                My Schools and Education
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <ul>
                                    {
                                        user.schools && user.schools.map((s, i) => 
                                            <li key={i}>{s}</li>
                                        )
                                    }
                                </ul>
                            </Col>
                        </Row>   
                    </CardBody>
                </Card>
            </Col>
    
            <Col lg={8} md={12}>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-4' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <ProfileTabCard
                            user={user} 
                            baseApiUrl={baseApiUrl}
                            headerAuthCode={headerAuthCode}
                            createSuccessNotification={createSuccessNotification}
                            updates={updates}
                            readingSigns={readingSigns}
                            setReadingSigns={setReadingSigns}
                        />
                    </CardBody>
                </Card>
                <Card className='custom-opacity-card mt-2' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-4' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <UpdatesCard
                            updates={updates}
                        />
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}

export default Profile;