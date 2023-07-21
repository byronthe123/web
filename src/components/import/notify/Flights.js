import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap';
import Switch from "rc-switch";
import GraphCard from '../../custom/GraphCard';
import { ThemeColors } from '../../helpers/ThemeColors';
import useDev from '../../../customHooks/useDev';
import styled from 'styled-components';
import Card from '../../custom/Card';
import VirtualTable from '../../custom/VirtualTable';
const colors = ThemeColors();

export default function Flights ({
    user,
    d_arrival_date,
    set_d_arrival_date,
    flightsArray,
    selectedFlight,
    setSelectedFlight,
    onClickNext
}) {

    const isDev = useDev(user);
    const [graphData, setGraphData] = useState({});

    useEffect(() => {
        const { notifiedSum, uniqueFlightAwbs } = selectedFlight;
        if (uniqueFlightAwbs.length > 0) {
            const graphData = {
                labels: ['Notified', 'Not Notified'],
                datasets: [
                    {
                        borderColor: [colors.themeColor1, 'grey'],
                        backgroundColor: [colors.themeColor1_10, 'white'],
                        borderWidth: 2,
                        data: [notifiedSum, uniqueFlightAwbs.length - notifiedSum],
                    },
                ],
            };

            setGraphData(graphData);
        }
    }, [selectedFlight]);

    return (
        <Container>
            <TitleContainer>
                <h2 className={'pr-5'}>Select Flight</h2>
            </TitleContainer>
            <CardsContainer>
                <FlightsContainer>
                    <Card>
                        <h4>Flight Date</h4>
                        <Input type='date' value={d_arrival_date} onChange={(e) => set_d_arrival_date(e.target.value)} className='mb-2' />
                        <VirtualTable 
                            data={flightsArray}
                            mapping={[
                                {
                                    name: '',
                                    value: 's_logo',
                                    image: true,
                                    imageWidth: 30,
                                    imageHeight: 30,
                                    square: true,
                                    customWidth: 35
                                },
                                {
                                    name: 'Flight', 
                                    value: 's_flight_number'
                                },
                                {
                                    name: 'Progress',
                                    value: 'notifiedPercent',
                                    sortMethod: (a, b) => Number.parseInt(a) - Number.parseInt(b)
                                }
                            ]}
                            enableClick={true}
                            handleClick={(flight) => setSelectedFlight(flight)}
                            numRows={10}
                            wizardNext={true}
                            onClickNext={onClickNext}
                            //key={key}
                        />
                    </Card>
                </FlightsContainer>
                <GraphContainer>
                    {
                        graphData.datasets && 
                            <GraphCard 
                                type={'doughnut'}
                                title={
                                    <div>
                                        <h4>AWBs for {selectedFlight.s_flight_id}</h4>
                                        <h4>{selectedFlight.notifiedSum} / {selectedFlight.uniqueFlightAwbs.length} Notified</h4>
                                    </div>
                                }
                                graphData={graphData}
                                height={'500px'}
                            />
                    }                 
                </GraphContainer>
            </CardsContainer>
        </Container>
    );
}

const Container = styled.div``;

const TitleContainer = styled.div`
    display: flex;
    align-items: baseline;
`;

const ManualModeContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const CardsContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const FlightsContainer = styled.div`
    flex-basis: 400px;
`;

const GraphContainer = styled.div`
    flex: 1;
    min-width: 500px;
`;