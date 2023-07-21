import React from 'react';
import { Row, Col } from 'reactstrap';

export default ({
    viewOnly,
    previousNotes
}) => {
    if (viewOnly) {
        return (
            <Col md={12}>
                <h6>Previous Notes:</h6>
                <ol>
                    {
                        previousNotes.map((n, i) => n.length > 0 && 
                            <li key={i}>{n}</li>
                        )
                    }
                </ol>
            </Col>
        );
    } 
    return <></>
}