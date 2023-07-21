import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';

export default ({
    viewOnly,
    s_activity
}) => {

    const [activityArray, setActivityArray] = useState([]);

    useEffect(() => {
        if (s_activity) {
            const activities = s_activity.split('.');
            setActivityArray(activities);
        }
    }, [s_activity]);

    if (viewOnly) {
        return (
            <Col md={12} className='mt-3'>
                <h6>Activity:</h6>
                <ul>
                    {
                        activityArray.map((a, i) => a.length > 0 && 
                            <li key={i}>{a}</li>
                        )
                    }
                </ul>
            </Col>
        );
    } 
    return <></>
}