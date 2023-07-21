import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import moment from 'moment';
import { Row, Col } from 'reactstrap';
import PulseLoader from 'react-spinners/PulseLoader';

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: '6px 16px',
    },
    secondaryTail: {
      backgroundColor: theme.palette.secondary.main,
    },
}));

export default ({ awb, graphApiToken, refreshTimeline }) => {

    console.log(awb);

    const classes = useStyles();
    const backgroundColor = awb && awb.s_type === 'IMPORT' ? '#61b996' : '#6bb4dd';
    const [createdBy, setCreatedBy] = useState(null);
    const [counterOwnership, setCounterOwnership] = useState(null);
    const [dockOwnership, setDockOwnership] = useState(null);
    const [dockProcess, setDockProcess] = useState(null);
    const [modifiedBy, setModifiedBy] = useState(null);
    const [loading, setLoading] = useState(false);

    const resolveProfileAndPhoto = async (email) => {
        const profileReponse = await axios.get(`https://graph.microsoft.com/v1.0/users/${email}?$select=displayName`, {
            headers: {
                'Authorization': `Bearer ${graphApiToken}`,
            }
        });

        let photoReponse = null;

        try {
            photoReponse = await axios(`https://graph.microsoft.com/v1.0/users/${email}/photo/$value`, { headers: { Authorization: `Bearer ${graphApiToken}` }, responseType: 'arraybuffer' });
        } catch (error) {

        }

        const data = {
            displayName: profileReponse.data.displayName,
            photo: photoReponse && new Buffer(photoReponse.data, 'binary').toString('base64'),
            initials: resolveInitials(profileReponse.data.displayName)
        }

        return data;
    }

    useEffect(() => {
        if (awb) {
            const resolveProfiles = async () => {
                const created = await resolveProfileAndPhoto(awb.s_created_by);
                setCreatedBy(created);

                const counterOwnership = awb.s_counter_ownership_agent && await resolveProfileAndPhoto(awb.s_counter_ownership_agent);
                setCounterOwnership(counterOwnership);

                const dockOwnership = awb.s_dock_ownership && await resolveProfileAndPhoto(awb.s_dock_ownership);
                setDockOwnership(dockOwnership);

                const dockProcess = awb.s_dock_agent_completed && await resolveProfileAndPhoto(awb.s_dock_agent_completed);
                setDockProcess(dockProcess);

                const modifiedBy = awb.s_modified_by && await resolveProfileAndPhoto(awb.s_modified_by);
                setModifiedBy(modifiedBy);
            }

            resolveProfiles();
        }
    }, [awb, graphApiToken]);

    const resolveInitials = (name) => {
        let initials = '';
        const namesArray = name.split(' ');
        for (let i = 0; i < namesArray.length; i++) {
            initials += namesArray[i] && namesArray[i].charAt(0);
        }
        return initials;
    }

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [refreshTimeline]);

    const resolveTime = (time) => {
        console.log(time);
        if (time && moment(time).isValid()) {
            return moment.utc(time).format('MM/DD/YYYY HH:mm:ss');
        }
        return '';
    }

    return (
        <>
        {
            loading ? 
                <Col md={12} className='text-center' style={{ marginTop: '150px' }}>
                    <PulseLoader 
                        size={50}
                        color={"#51C878"}
                        loading={true}
                    />
                </Col> :
                <Timeline align="alternate">
                {
                    awb && 
                    <>
                        {/* AWB Creation */}
                        <TimelineItem>
    
                            <TimelineOppositeContent>
                                <Paper elevation={3} className={classes.paper}>
                                    <Typography>{resolveTime(awb.fb_created)}</Typography>
                                    <Typography>Welcome Center/AWB Creation</Typography>
                                    <Typography variant="h6" component="h1">
                                    {
                                        createdBy && createdBy.displayName
                                    }
                                    </Typography>
                                    {/* <Typography>Because you need strength</Typography> */}
                                </Paper>
                            </TimelineOppositeContent>
    
                            <TimelineSeparator>
                                <TimelineDot>
                                    <i className="fas fa-tablet-alt" style={{fontSize: '28px', color: backgroundColor}}></i>
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
    
                            <TimelineContent>
    
                            </TimelineContent>
                        </TimelineItem>
    
                        {/* Counter Ownership */}
                        {
                            awb.s_counter_ownership_agent && 
                            <TimelineItem>
    
                                <TimelineOppositeContent>
                                    <Paper elevation={3} className={classes.paper}>
                                        <Row>
                                            <Col md={7}>
                                                <Typography>{resolveTime(awb.t_counter_ownership)}</Typography>
                                                <Typography>Counter Ownership</Typography>
                                                <Typography variant="h6" component="h1">
                                                {
                                                    counterOwnership && counterOwnership.displayName
                                                }
                                                </Typography>
                                            </Col>
                                            <Col md={3}>
                                                <img 
                                                    src={counterOwnership && counterOwnership.photo ? 
                                                    `data:image/jpeg;base64, ${counterOwnership.photo}` : 
                                                    'https://lippianfamilydentistry.net/wp-content/uploads/2015/11/user-default.png'} 
                                                    style={{width: '100px', height: 'auto'}}
                                                />
                                            </Col>
                                        </Row>
                                    </Paper>
                                </TimelineOppositeContent>
    
                                <TimelineSeparator>
                                    <TimelineDot>
                                        <i className="fas fa-comments" style={{fontSize: '28px', color: backgroundColor}}></i>
                                    </TimelineDot>
                                    <TimelineConnector />
                                </TimelineSeparator>
    
                                <TimelineContent>
    
                                </TimelineContent>
                            </TimelineItem>
                        }
    
    
                        {/* Counter Process */}
                        {
                            awb.s_counter_ownership_agent && 
                            <TimelineItem>
    
                                <TimelineSeparator>
                                    <TimelineDot>
                                        <i className="fas fa-desktop" style={{fontSize: '28px', color: backgroundColor}}></i>
                                    </TimelineDot>
                                    <TimelineConnector />
                                </TimelineSeparator>
                                
                                <TimelineContent>
                                    <Paper elevation={3} className={classes.paper}>
                                        <Row>
                                            <Col md={7}>
                                                <Typography>{resolveTime(awb.t_counter_start)}</Typography>
                                                <Typography>Counter Process</Typography>
                                                <Typography variant="h6" component="h1">
                                                {
                                                    counterOwnership && counterOwnership.displayName
                                                }
                                                </Typography>
                                                <Typography>{resolveTime(awb.t_counter_end)}</Typography>
                                            </Col>
                                            <Col md={3}>
                                                <img 
                                                    src={counterOwnership && counterOwnership.photo ? 
                                                    `data:image/jpeg;base64, ${counterOwnership.photo}` : 
                                                    'https://lippianfamilydentistry.net/wp-content/uploads/2015/11/user-default.png'} 
                                                    style={{width: '100px', height: 'auto'}}
                                                />
                                            </Col>
                                        </Row>
                                    </Paper>
                                </TimelineContent>
                            </TimelineItem>
                        }
    
                        {/* Dock Ownership */}
                        {
                            awb.s_dock_ownership && 
                            <TimelineItem>
    
                                <TimelineSeparator>
                                    <TimelineDot>
                                        <i className="fas fa-truck-moving" style={{fontSize: '28px', color: backgroundColor}}></i>
                                    </TimelineDot>
                                    <TimelineConnector />
                                </TimelineSeparator>
    
                                <TimelineContent>
                                    <Paper elevation={3} className={classes.paper}>
                                        <Row>
                                            <Col md={3}>
                                                <img 
                                                    src={dockOwnership && dockOwnership.photo ? 
                                                    `data:image/jpeg;base64, ${dockOwnership.photo}` : 
                                                    'https://lippianfamilydentistry.net/wp-content/uploads/2015/11/user-default.png'} 
                                                    style={{width: '100px', height: 'auto'}}
                                                />
                                            </Col>
                                            <Col md={9}>
                                                <Typography>{resolveTime(awb.t_dock_ownership)}</Typography>
                                                <Typography>Dock Ownership</Typography>
                                                <Typography variant="h6" component="h1">
                                                {
                                                    dockOwnership && dockOwnership.displayName
                                                }
                                                </Typography>
                                            </Col>
                                        </Row>
                                    </Paper>
                                </TimelineContent>
                            </TimelineItem>
                        }
    
                        {/* Dock Process */}
                        {
                            awb.s_dock_agent_completed && 
                            <TimelineItem>
    
                                <TimelineOppositeContent>
                                    <Paper elevation={3} className={classes.paper}>
                                        <Row>
                                            <Col md={3}>
                                                <img 
                                                    src={dockProcess && dockProcess.photo ? 
                                                    `data:image/jpeg;base64, ${dockProcess.photo}` : 
                                                    'https://lippianfamilydentistry.net/wp-content/uploads/2015/11/user-default.png'} 
                                                    style={{width: '100px', height: 'auto'}}
                                                />
                                            </Col>
                                            <Col md={9}>
                                                <Typography>{resolveTime(awb.t_dock_complete)}</Typography>
                                                <Typography>Dock Process</Typography>
                                                <Typography variant="h6" component="h1">
                                                {
                                                    dockProcess && dockProcess.displayName
                                                }
                                                </Typography>
                                                {/* <Typography>{moment(awb.t_dock_complete).format('MM/DD/YYYY HH:mm:ss')}</Typography> */}
                                            </Col>
                                        </Row>
                                    </Paper>
                                </TimelineOppositeContent>
    
                                <TimelineSeparator>
                                    <TimelineDot>
                                        <i className="fas fa-dolly" style={{fontSize: '28px', color: backgroundColor}}></i>
                                    </TimelineDot>
                                    <TimelineConnector />
                                </TimelineSeparator>
                                
                                <TimelineContent>
    
                                </TimelineContent>
                            </TimelineItem>
                        }
    
                        {/* Modified */}
                        {
                            awb.t_modified && 
                            <TimelineItem>
    
                                <TimelineSeparator>
                                    <TimelineDot>
                                        <i className="fas fa-check" style={{fontSize: '28px', color: backgroundColor}}></i>
                                    </TimelineDot>
                                </TimelineSeparator>
                                
                                <TimelineContent>
                                    <Paper elevation={3} className={classes.paper}>
                                            <Row>
                                                <Col md={3}>
                                                    <img 
                                                        src={modifiedBy && modifiedBy.photo ? 
                                                        `data:image/jpeg;base64, ${modifiedBy.photo}` : 
                                                        'https://lippianfamilydentistry.net/wp-content/uploads/2015/11/user-default.png'} 
                                                        style={{width: '100px', height: 'auto'}}
                                                    />
                                                </Col>
                                                <Col md={9}>
                                                    <Typography>{resolveTime(awb.t_modified)}</Typography>
                                                    <Typography>Modified by</Typography>
                                                    <Typography variant="h6" component="h1">
                                                    {
                                                        modifiedBy && modifiedBy.displayName
                                                    }
                                                    <Typography>Last Status: {awb.s_status}</Typography>
                                                    </Typography>
                                                </Col>
                                            </Row>
                                        </Paper>
                                </TimelineContent>
                            </TimelineItem>
                        }
                    </>
                }
            </Timeline>    
        }
        </>
    );
}