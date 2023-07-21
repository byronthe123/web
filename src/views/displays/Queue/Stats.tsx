import React from 'react';
import { Row, Col } from 'reactstrap';
import { defaultQueueStat } from '../../../components/counter/queue/defaults';
import { IQueueStats } from '../../../components/counter/queue/interfaces';

const styles = {
    largeFont: {
        fontSize: '75px'
    }
}

interface Props {
    stats: IQueueStats | undefined
}

export default function Stats({ stats }: Props) {

    const useStats = stats || defaultQueueStat;

    return (
        <Col md={12}>
            <Row>
                <Col md={12}>
                    <h1 className={'gold-color'}>Customer Wait</h1>
                </Col>
            </Row>
            <Row className={'useStats-row-height useStats-text'}>
                <Col md={4} className={'customer-useStats-bg d-flex justify-content-center align-items-center text-white'}>
                    <h1 style={{ ...styles.largeFont }}>{useStats.transactionsProcessed} Customers</h1>
                </Col>
                <div style={{ padding: '5px', display: 'inline' }}></div>
                <Col md={7} className={'customer-useStats-bg container d-flex justify-content-center text-white'}>
                    <div className={'element text-center'}>
                        <div className={'display-block'}>
                            <h1 style={{ ...styles.largeFont }}>{useStats.aveWaitingTime} minutes average</h1>
                        </div>
                        <div className={'display-block'}>
                            <h1 style={{ ...styles.largeFont }}>{useStats.maxWaitingTime} minutes highest</h1>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className={'mt-5'}>
                <Col md={12}>
                    <h1 className={'gold-color'}>AWBs Processed</h1>
                </Col>
            </Row>
            <Row className={'useStats-row-height useStats-text'}>
                <Col md={4} className={'awbs-useStats-bg d-flex justify-content-center align-items-center text-white'}>
                    <h1 style={{ ...styles.largeFont }}>{useStats.unitAwbsProcessed} AWBs</h1>
                </Col>
                <div style={{ padding: '5px', display: 'inline' }}></div>
                <Col md={7} className={'awbs-useStats-bg container d-flex justify-content-center text-white'}>
                    <div className={'element text-center'}>
                        <div className={'display-block'}>
                            <h1 style={{ ...styles.largeFont }}>{useStats.unitAveProcessingTime} minutes average</h1>
                        </div>
                        <div className={'display-block'}>
                            <h1 style={{ ...styles.largeFont }}>{useStats.unitMaxProcessingTime} minutes highest</h1>
                        </div>
                    </div>
                </Col>
            </Row>
        </Col>
    );
}