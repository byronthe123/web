import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import moment from 'moment';

export default ({
    company,
    handleViewCompany,
    user
}) => {

    const timeSince = (_start) => {
        const start = moment(_start)
        const now = moment();
        const diff = moment.duration(moment(now).diff(moment(start)));
        var days = parseInt(diff.asDays()); //84
        var hours = parseInt(diff.asHours()); //2039 hours, but it gives total hours in given miliseconds which is not expacted.
        hours = hours - days*24;  // 23 hours
        var minutes = parseInt(diff.asMinutes()); //122360 minutes,but it gives total minutes in given miliseconds which is not expacted.
        minutes = minutes - (days*24*60 + hours*60);
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        //daylight savings ? - 4 : - 5
        //daylight savings = March 8 to November 1
        const minusHours = moment().isDST() ? 4 : 5;
        hours = hours - minusHours;
        return `${hours}:${minutes}`;
    }

    const enableTakeOwnership = () => {
        if (!company.s_dock_ownership) {
            return -1;
        } else {
            if (company.s_dock_ownership.toUpperCase() === user.s_email.toUpperCase()) {
                return 1;
            }
            return 0;
        }
    }

    const resolveBg = () => {
        const result = enableTakeOwnership();
        if (result === -1) {
                const state = company.s_state.toUpperCase();
                const color = state === 'MIXED' ? 'goldenrod' : state === 'EXPORT' ? '#add8e6' : '#99e599';
                return color;
            } else if (result === 1) {
            return 'yellow';
        } else {
            return 'grey'
        }
    }

    return (
        <Col md={6} sm={12}>
            <Card className={'mb-2'} style={{ backgroundColor: resolveBg() }} onClick={() => handleViewCompany(company)}>
                <CardBody>
                    <Row>
                        <Col md={12}>
                            <div className={'float-left'}>
                                <h6>{company.s_trucking_driver}</h6>
                                <h6>{company.s_trucking_company}</h6>
                                <h6>{timeSince(company.t_counter_end)}</h6>
                                <h6>{company.s_dock_ownership}</h6>
                            </div>
                            <div className={'float-right'}>
                                <h6 className={'float-right'}>{company.awbs.length}</h6>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
    );
}