import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import Card from '../../custom/Card';
import Layout from '../../custom/Layout';
import { Input } from 'reactstrap';
import MawbInput from '../../custom/MawbInput';
import { api, getTsDate, notify, validateAwb } from '../../../utils';
import { IFWB, IFFM } from '../../../globals/interfaces';
import ReactTable from '../../custom/ReactTable';
import ActionIcon from '../../custom/ActionIcon';
import { useAppContext } from '../../../context';
import _ from 'lodash';
import useAirportCodesMap from '../../../customHooks/useAirportCodesMap';
import useAirportCodes from '../../../customHooks/useAirportCodes';
import SelectAirport from '../../custom/SelectAirport';

export default function UpdateImportDestination() {

    const { user } = useAppContext();
    const [s_mawb, set_s_mawb] = useState('');
    const [fwb, setFwb] = useState<IFWB>();
    const [ffms, setFfms] = useState<Array<IFFM>>([]);
    const [s_destination, set_s_destination] = useState('');
    const { airportCodes } = useAirportCodes();
    const { airportCodesMap } = useAirportCodesMap(airportCodes);

    const reset = () => {
        setFwb(undefined);
        setFfms([]);
        set_s_destination('');
    }

    useEffect(() => {
        const updateImportDestinationData = async () => {
            const res = await api('get', `updateImportDestinationData/${s_mawb}`);
            console.log(res.data);
            setFwb(res.data.fwb);
            setFfms(res.data.ffms);
        }
        if (validateAwb(s_mawb)) {
            updateImportDestinationData();
        } else {
            reset();
        }
    }, [s_mawb]);

    const updateDestination = async () => {

        const res = await api('put', 'updateDestination', {
            s_mawb, 
            previousDestination: _.get(ffms, '[0].s_destination', 'NULL'),
            s_destination,
            s_modified_by: user.s_email,
            t_modified: getTsDate()
        });
        if (res.status === 204) {
            notify('Destination Updated');
            set_s_mawb('');
            reset();
        } 
    }

    return (
        <Layout>
            <div>
                <h1>Update Import Destination</h1>
            </div>
            <CardsContainer>
                <SearchCardContainer>
                    <Card>
                        <SearchInnerContainer>
                            <h4>Search MAWB</h4>
                            <MawbInput
                                value={s_mawb}
                                onChange={set_s_mawb}
                                classNames={'ml-5'}
                            />
                        </SearchInnerContainer>
                    </Card>
                </SearchCardContainer>
                <FwbContainer>
                    <Card>
                        <h4 className={'mb-3 font-italic'}>Latest FWB for this MAWB</h4>
                        {
                            fwb && 
                            <div>
                                <h4>MAWB: {s_mawb}</h4>
                                <h4>Pieces: {fwb.i_total_pieces}</h4>
                                <h4>Weight: {fwb.f_weight}</h4>
                                <h4>Destination: {fwb.s_destination}</h4>
                                <h4>Commodity: {fwb.s_goods_description}</h4>
                                <h4>Shipper: {fwb.s_shipper_name1}</h4>
                                <h4>Consignee: {fwb.s_consignee_name1}</h4>
                                <h4>Modified: {dayjs.utc(fwb.t_modified).format('MM/DD/YYYY HH:mm')}</h4>
                            </div>
                        }
                    </Card>
                </FwbContainer>
                <FfmsContainer>
                    <Card>
                        <h4 className={'mb-3 font-italic'}>Manifested Flights</h4>
                        <ReactTable 
                            data={ffms}
                            mapping={[{
                                name: 'Flight ID',
                                value: 's_flight_id'
                            }, {
                                name: 'Total Pieces',
                                value: 'i_pieces_total'
                            }, {
                                name: 'Current Destination',
                                value: 's_destination'
                            }]}
                            numRows={5}
                        />
                        <UpdateContainer>
                            <SelectAirport 
                                airports={airportCodes}
                                airportCodesMap={airportCodesMap}
                                code={s_destination}
                                setCode={set_s_destination}
                                label={'Update Destination to: '}
                            />
                            <ActionIcon 
                                type={'save'}
                                onClick={() => updateDestination()}
                                disabled={!airportCodesMap[s_destination]}
                                className={'mt-2'}
                                baseline={true}
                            />
                        </UpdateContainer>
                    </Card>
                </FfmsContainer>
            </CardsContainer>
        </Layout>
    );
}

const CardsContainer = styled.div`
    --breakpoint: 1350px;
    display: flex;
    margin-top: 10px;
    gap: 10px;
    flex-wrap: wrap;
`;

const SearchCardContainer = styled.div`
    display: flex;
    width: 100%;

    @media (max-width: 1350px) {
        flex-basis: 375px;
    }
`;

const SearchInnerContainer = styled.div`
    display: flex;
    align-items: baseline;
`;

const FwbContainer = styled.div`
    flex: 1;
`;

const FfmsContainer = styled.div`
    width: 68%;

    @media (max-width: 1350px) {
        width: 100%;
    }
`;

const UpdateContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
    align-items: baseline;
    gap: 10px;
`;

const DestinationInput = styled(Input)`
    width: 100px;
`;