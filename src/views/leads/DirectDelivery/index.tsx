import dayjs from 'dayjs';
import { useState } from 'react';
import { Input } from 'reactstrap';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';

import ReactTable from '../../../components/custom/ReactTable';
import Card from '../../../components/custom/Card';
import Layout from '../../../components/custom/Layout';
import { useAppContext } from '../../../context';
import useData from './useData';
import ModalDeliver from './ModalDeliver';
import { api, getTsDate, notify } from '../../../utils';
import { IExtendedFFM, IFlight } from './interfaces';
import useLoading from '../../../customHooks/useLoading';

export default function DirectDelivery() {
    const { setLoading } = useLoading();
    const { user } = useAppContext();
    const [d_arrival_date, set_d_arrival_date] = useState(
        dayjs().format('YYYY-MM-DD')
    );
    const {
        dataMap,
        setDataMap,
        flights,
        selectedFlightNumber,
        selectedAwb,
        setSelectedAwb,
        handleSelectFlight,
    } = useData(d_arrival_date, user.s_unit.substring(1, 4));

    const [modal, setModal] = useState(false);
    const [customer, setCustomer] = useState('');

    const handleDeliver = (awb: IExtendedFFM) => {
        setSelectedAwb(awb);
        setModal(true);
    }

    const directDeliver = async () => {
        const awb = selectedAwb;
        if (!awb) {
            return;
        }

        const date = getTsDate();
        const { s_email } = user;
        const guid = uuid();

        const awbs = dataMap[selectedFlightNumber];
        const awbsCopy = _.cloneDeep(awbs);
        awbsCopy.sort((a, b) => +a.d_arrival_date - +b.d_arrival_date);
        const d_last_arrival_date = awbsCopy[0].d_arrival_date;

        const data = {
            rackData: {
                t_created: date,
                s_created_by: s_email,
                t_modified: date,
                s_modified_by: s_email,
                s_status: 'DELIVERED',
                s_unit: user.s_unit,
                s_location: 'RAMP',
                s_mawb: awb.s_mawb,
                i_pieces: awb.i_actual_piece_count,
                s_special_hanlding_code: awb.s_special_handling_code,
                s_priority: 'NORMAL',
                t_delivered: date,
                s_delivered_by: s_email,
                s_guid: guid,
                d_flight: d_arrival_date,
                s_flightnumber: awb.s_flight_number,
                s_flight_uld: awb.s_uld,
                b_processed: true,
                t_processed: date,
                s_processed_agent: s_email,
                b_delivered: true,
                s_delivered_agent: s_email,
                s_flight_id: awb.s_flight_id,
                s_platform: 'EOS',
                s_delivered_transaction_id: guid
            },
            importData: {
                s_unit: user.s_unit,
                s_awb_type: 'IMPORT',
                s_status: 'DELIVERED',
                s_mawb: awb.s_mawb,
                s_transaction_id: guid,
                i_pieces: awb.i_actual_piece_count,
                i_pieces_auto: awb.i_actual_piece_count,
                f_weight: awb.f_weight,
                f_weight_auto: awb.f_weight,
                d_last_arrival_date,
                b_cargo_located: true,
                s_driver_name: customer,
                s_driver_company: customer,
                t_kiosk_submittedtime: date,
                s_counter_assigned_agent: s_email,
                t_counter_assigned_start: date,
                s_counter_by: s_email,
                t_counter_start_time: date,
                t_counter_endtime: date,
                t_created: date,
                s_created_by: s_email,
                t_modified: date,
                s_modified_by: s_email,
                s_mawb_id: awb.id,
                b_delivered: true,
                s_browser: 'EOS',
                i_pcs_delivered: awb.i_actual_piece_count                
            }
        }

        setLoading(true);
        const res = await api('post', 'direct-delivery', data);
        if (res.status === 204) {
            setDataMap(prev => {
                const copy = _.cloneDeep(prev);
                const awbs = copy[selectedAwb.s_flight_number];
                const index = awbs.findIndex(awb => awb.id === selectedAwb.id);
                awbs[index].deliveredPcs += selectedAwb.i_actual_piece_count;
                return copy;
            });

            setModal(false);
            notify('Submitted');
        }
        setLoading(false);
    }

    return (
        <Layout>
            <h4>Direct Delivery</h4>
            <Container>
                <FlightsContainer>
                    <Card>
                        <h6>Flights</h6>
                        <Input
                            type={'date'}
                            value={d_arrival_date}
                            onChange={(e: any) =>
                                set_d_arrival_date(e.target.value)
                            }
                        />
                        <ReactTable
                            data={flights}
                            mapping={[
                                {
                                    name: 'Flight',
                                    value: 's_flight_number',
                                }
                            ]}
                            enableClick
                            handleClick={(flight: IFlight) =>
                                handleSelectFlight(flight.s_flight_number)
                            }
                            index
                            numRows={10}
                        />
                    </Card>
                </FlightsContainer>
                <UldsContainer>
                    <Card>
                        <h6>ULDs</h6>
                        <ReactTable
                            data={dataMap[selectedFlightNumber]}
                            mapping={[
                                {
                                    name: 'ULD',
                                    value: 's_uld',
                                },
                                {
                                    name: 'AWB',
                                    value: 's_mawb',
                                    s_mawb: true,
                                },
                                {
                                    name: 'Dest.',
                                    value: 's_destination',
                                    smallWidth: true,
                                },
                                {
                                    name: 'Pieces',
                                    value: 'i_actual_piece_count',
                                    mediumWidth: true,
                                    number: true
                                },
                                {
                                    name: 'Rack Pieces',
                                    value: 'rackPcs',
                                    number: true
                                },
                                {
                                    name: 'Delivered Pieces',
                                    value: 'deliveredPcs',
                                    number: true
                                },
                                {
                                    name: 'Devlier',
                                    value: 'fas fa-plus',
                                    icon: true,
                                    mediumWidth: true,
                                    function: (awb: IExtendedFFM) => handleDeliver(awb)
                                },
                            ]}
                            index
                            numRows={10}
                        />
                    </Card>
                </UldsContainer>
            </Container>
            <ModalDeliver 
                modal={modal}
                setModal={setModal}
                customer={customer}
                setCustomer={setCustomer}
                directDeliver={directDeliver}
            />
        </Layout>
    );
}

const Container = styled.div`
    display: flex;
    gap: 10px;
`;

const FlightsContainer = styled.div`
    flex: 1;
`;

const UldsContainer = styled.div`
    flex: 3;
`;
