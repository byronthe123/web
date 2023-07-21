import React, {Fragment} from 'react';
import {Row, Col, Button, Table, Card, CardBody} from 'reactstrap';
import "rc-switch/assets/index.css";

const StatsReport = ({
    handleInput,
    user,
    statsReport,
    enableStatsReport,
    eightyWindow,
    width
}) => {

    return (
        <div>
            <Row>
                <Col md='12' lg='12'>
                    <h4>Stats Report</h4>
                </Col>
            </Row>
            <Row>
                <Card className='mb-2' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='mb-3 py-4'>
                        <Button disabled={!enableStatsReport()} style={{width: '240px', height: '120px', fontSize: '24px', borderRadius: '25px', border: '2px solid white'}} className='px-1' onClick={() => statsReport()}>Request Previous Month Stats</Button>
                    </CardBody>
                </Card>
            </Row>
        </div>
    );
}

export default StatsReport;