import moment from 'moment';
import React, { useMemo } from 'react';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { formatEmail } from '../../../utils';
import ReactTable from '../../custom/ReactTable';

export default function UldModal ({
    modal,
    setModal,
    selectedUld,
    s_flight_id,
    handleViewRackData,
    uldData
}) {

    const toggle = () => setModal(!modal);
    const openedTime = useMemo(() => {
        let min = null;

        if (uldData.b_opened && !uldData.b_closed) {
            min = moment().diff(moment.utc(uldData.t_user_opened_uld), 'minutes');
        } else if (uldData.b_closed) {
            min = moment(uldData.t_user_closed_uld).diff(moment(uldData.t_user_opened_uld), 'minutes');
        }

        if (min !== null) {
            return `ULD Opened for ${min} minutes`;
        } else {
            return '';
        }
    }, [uldData]);

    return (
        <Modal isOpen={modal} toggle={toggle} scrollable size={'lg'}>
            <ModalHeader style={{ width: '100%' }}>
                <Row>
                    <Col md={12}>
                        <div className={'float-left'}>
                            <i className="far fa-arrow-left mr-2" onClick={toggle} />
                            Flight: {s_flight_id}. ULD: {selectedUld.s_uld}
                        </div>
                        <div className={'float-right'}>
                            {openedTime}
                        </div>
                    </Col>
                </Row>
            </ModalHeader>
            <ModalBody>
                <ReactTable 
                    data={selectedUld.awbs}
                    mapping={[{
                        name: 'Progress',
                        value: 'progress',
                        percent: true
                    }, {
                        name: 'MAWB',
                        value: 's_mawb',
                        s_mawb: true
                    }, {
                        name: 'Manifested',
                        value: 'i_actual_piece_count',
                        number: true
                    }, {
                        name: 'Brokendown',
                        value: 'rackPieces',
                        number: true
                    },  {
                        name: 'Under',
                        value: '',
                        breakdownUnder: true,
                        number: true
                    }, {
                        name: 'Over',
                        value: '',
                        breakdownOver: true,
                        number: true
                    }, {
                        name: 'Delivered',
                        value: 'deliveredPcs',
                        number: true
                    }, {
                        name: '',
                        value: 'far fa-expand-arrows',
                        icon: true,
                        function: item => handleViewRackData(item.s_mawb)
                    }]}
                    numRows={10}
                />
            </ModalBody>
            <ModalFooter style={{ width: '100%' }}>
                <Row style={{ width: '100%' }}>
                    <Col md={12}>
                        <UldData 
                            uldData={uldData}
                            prop={'b_opened'}
                            label={'Opened'}
                            user={'s_user_opened_uld'}
                            date={'t_user_opened_uld'}
                        />
                        <UldData 
                            uldData={uldData}
                            prop={'b_closed'}
                            label={'Closed'}
                            user={'s_user_closed_uld'}
                            date={'t_user_closed_uld'}
                        />
                    </Col>
                </Row>
            </ModalFooter>
        </Modal>
    );
}

const UldData = ({ uldData, prop, label, user, date }) => {
    if (uldData[prop]) {
        return <h6>{label} by {formatEmail(uldData[user])} on {moment.utc(uldData[date]).format('MM/DD/YYYY HH:mm')}</h6>
    } else {
        return '';
    }
}