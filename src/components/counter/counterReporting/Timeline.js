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
import { Buffer } from 'buffer';

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: '6px 16px',
    },
    secondaryTail: {
      backgroundColor: theme.palette.secondary.main,
    },
}));

const DisplayPhoto = ({ photo }) => {
    if (photo && photo !== undefined) {
        return (
            <img 
                src={`data:image/jpeg;base64, ${photo}`}
                className={'counter-reporting-timeline-photo'}
            />
        );
    } else {
        return (
            <img 
                src={'https://lippianfamilydentistry.net/wp-content/uploads/2015/11/user-default.png'} 
                className={'counter-reporting-timeline-photo'}
            />
        );
    }
}


export default function CounterTimeline ({ awb, graphApiToken, refreshTimeline }) {

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
        if (time && moment(time).isValid()) {
            return moment.utc(time).format('HH:mm');
        } else {
            return '';
        }
    }

    const resolveDate = (time) => {
        if (time && moment(time).isValid()) {
            return moment.utc(time).format('MM/DD/YYYY');
        } else {
            return '';
        }
    }

    const diffMinutes = (start, end) => {
        if (moment(start).isValid() && moment(end).isValid()) {
            return `${moment(end).diff(start, 'minute')} minutes`;
        }
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
    
                            <TimelineContent className={'text-right'}>
                                    <h4>{resolveTime(awb.t_created)}</h4>
                                    <h4>{resolveDate(awb.t_created)}</h4>                            
                            </TimelineContent>
                            <TimelineSeparator>
                                <TimelineDot>
                                    <i className="fas fa-tablet-alt" style={{fontSize: '28px', color: backgroundColor}}></i>
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>

                            <TimelineOppositeContent className={'text-left'}>
                                <Paper elevation={3} className={classes.paper}>
                                    <Typography>Welcome Center/AWB Creation</Typography>
                                    <Typography className={'font-weight-bold'}>
                                    {
                                        createdBy && createdBy.displayName
                                    }
                                    </Typography>
                                </Paper>
                            </TimelineOppositeContent>
    
                        </TimelineItem>

                        {/* Minutes: Ownership - Creation */}
                        <TimelineItem>

                            <TimelineOppositeContent></TimelineOppositeContent>

                            <TimelineSeparator>
                                <TimelineDot>
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>

                            <TimelineContent className={'text-right'}>
                                <h6>{diffMinutes(awb.t_created, awb.t_counter_ownership)}</h6>
                            </TimelineContent>

                        </TimelineItem>
    
                        {/* Counter Ownership */}
                        {
                            awb.s_counter_ownership_agent && 
                            <TimelineItem>

                                <TimelineOppositeContent className={'text-right'}>
                                    <h4>{resolveTime(awb.t_counter_ownership)}</h4>
                                    <h4>{resolveDate(awb.t_counter_ownership)}</h4>
                                </TimelineOppositeContent>
                                
                                <TimelineSeparator>
                                    <TimelineDot>
                                        <i className="fas fa-comments" style={{fontSize: '28px', color: backgroundColor}}></i>
                                    </TimelineDot>
                                    <TimelineConnector />
                                </TimelineSeparator>

                                <TimelineContent className={'text-left'}>
                                    <Paper elevation={3} className={classes.paper}>
                                        <Row>
                                            <Col md={7}>
                                                <Typography>Counter Ownership</Typography>
                                                <Typography className={'font-weight-bold'}>
                                                {
                                                    counterOwnership && counterOwnership.displayName
                                                }
                                                </Typography>
                                            </Col>
                                            <Col md={3}>
                                                <DisplayPhoto 
                                                    photo={counterOwnership && counterOwnership.photo}
                                                />
                                            </Col>
                                        </Row>
                                    </Paper>
                                </TimelineContent>

                            </TimelineItem>
                        }

                        {/* Minutes: Process - Ownership */}
                        <TimelineItem>

                            <TimelineOppositeContent></TimelineOppositeContent>

                            <TimelineSeparator>
                                <TimelineDot>
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>

                            <TimelineContent className={'text-right'}>
                                <h6>{diffMinutes(awb.t_counter_ownership, awb.t_counter_end)}</h6>
                            </TimelineContent>

                        </TimelineItem>
    
                        {/* Counter Processed */}
                        {
                            awb.s_counter_ownership_agent && 
                            <TimelineItem>

                                <TimelineOppositeContent className={'text-right'}>
                                    <h4>{resolveTime(awb.t_counter_end)}</h4>
                                    <h4>{resolveDate(awb.t_counter_end)}</h4>
                                </TimelineOppositeContent>
    
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
                                                <Typography>Counter Processed</Typography>
                                                <Typography className={'font-weight-bold'}>
                                                {
                                                    counterOwnership && counterOwnership.displayName
                                                }
                                                </Typography>
                                            </Col>
                                            <Col md={3}>
                                                <DisplayPhoto 
                                                    photo={counterOwnership && counterOwnership.photo}
                                                />
                                            </Col>
                                        </Row>
                                    </Paper>
                                </TimelineContent>
                            </TimelineItem>
                        }

                        {/* Minutes: Dock Ownership - Counter End */}
                        <TimelineItem>

                            <TimelineOppositeContent></TimelineOppositeContent>

                            <TimelineSeparator>
                                <TimelineDot>
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>

                            <TimelineContent className={'text-right'}>
                                <h6>{diffMinutes(awb.t_counter_end, awb.t_dock_ownership)}</h6>
                            </TimelineContent>

                        </TimelineItem>
    
                        {/* Dock Ownership */}
                        {
                            awb.s_dock_ownership && 
                            <TimelineItem>

                                <TimelineOppositeContent className={'text-right'}>
                                    <h4>{resolveTime(awb.t_dock_ownership)}</h4>
                                    <h4>{resolveDate(awb.t_dock_ownership)}</h4>
                                </TimelineOppositeContent>    

                                <TimelineSeparator>
                                    <TimelineDot>
                                        <i className="fas fa-truck-moving" style={{fontSize: '28px', color: backgroundColor}}></i>
                                    </TimelineDot>
                                    <TimelineConnector />
                                </TimelineSeparator>
    
                                <TimelineContent>
                                    <Paper elevation={3} className={classes.paper}>
                                        <Row>
                                            <Col md={7}>
                                                <Typography>Dock Ownership</Typography>
                                                <Typography className={'font-weight-bold'}>
                                                {
                                                    dockOwnership && dockOwnership.displayName
                                                }
                                                </Typography>
                                            </Col>
                                            <Col md={3}>
                                                <DisplayPhoto 
                                                    photo={dockOwnership && dockOwnership.photo}
                                                />
                                            </Col>
                                        </Row>
                                    </Paper>
                                </TimelineContent>
                            </TimelineItem>
                        }

                        {/* Minutes: Dock End - Dock Ownership */}
                        <TimelineItem>

                            <TimelineOppositeContent></TimelineOppositeContent>

                            <TimelineSeparator>
                                <TimelineDot>
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>

                            <TimelineContent className={'text-right'}>
                                <h6>{diffMinutes(awb.t_dock_ownership, awb.t_dock_complete)}</h6>
                            </TimelineContent>

                            </TimelineItem>
    
                        {/* Dock Processed */}
                        {
                            awb.s_dock_agent_completed && 
                            <TimelineItem>
                               
                               <TimelineOppositeContent className={'text-right'}>
                                    <h4>{resolveTime(awb.t_dock_complete)}</h4>
                                    <h4>{resolveDate(awb.t_dock_complete)}</h4>
                                </TimelineOppositeContent> 
    
                                <TimelineSeparator>
                                    <TimelineDot>
                                        <i className="fas fa-dolly" style={{fontSize: '28px', color: backgroundColor}}></i>
                                    </TimelineDot>
                                    <TimelineConnector />
                                </TimelineSeparator>

                                <TimelineOppositeContent className={'text-left'}>
                                    <Paper elevation={3} className={classes.paper}>
                                        <Row>
                                            <Col md={7}>
                                                <Typography>Dock Processed</Typography>
                                                <Typography className={'font-weight-bold'}>
                                                {
                                                    dockProcess && dockProcess.displayName
                                                }
                                                </Typography>
                                            </Col>
                                            <Col md={3}>
                                                <DisplayPhoto 
                                                    photo={dockProcess && dockProcess.photo}
                                                />
                                            </Col>
                                        </Row>
                                    </Paper>
                                </TimelineOppositeContent>

                            </TimelineItem>
                        }
    
                        {/* Modified */}
                        {
                            awb.t_modified && 
                            <TimelineItem>

                                <TimelineContent className={'text-left'}>
                                    <Paper elevation={3} className={classes.paper}>
                                            <Row>
                                                <Col md={7}>
                                                    <Typography>Last Modified by</Typography>
                                                    <Typography className={'font-weight-bold'}>
                                                    {
                                                        modifiedBy && modifiedBy.displayName
                                                    }
                                                    </Typography>
                                                </Col>
                                                <Col md={3}>
                                                    <DisplayPhoto 
                                                        photo={modifiedBy && modifiedBy.photo}
                                                    />
                                                </Col>
                                            </Row>
                                        </Paper>
                                </TimelineContent>

                                <TimelineSeparator>
                                    <TimelineDot>
                                        <i className="fas fa-check" style={{fontSize: '28px', color: backgroundColor}}></i>
                                    </TimelineDot>
                                </TimelineSeparator>

                                <TimelineOppositeContent className={'text-right'}>
                                    <h4>{resolveTime(awb.t_modified)}</h4>
                                    <h4>{resolveDate(awb.t_modified)}</h4>
                                </TimelineOppositeContent> 
                                
                            </TimelineItem>
                        }
                    </>
                }
            </Timeline>    
        }
        </>
    );
}