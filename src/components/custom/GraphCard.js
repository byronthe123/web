import React from 'react';
import Card from './Card';
import Pie from '../charts/Pie';
import BarNew from '../charts/BarNew';
import Doughnut from '../charts/Doughnut';
import styled from 'styled-components';


export default function GraphCard ({
    type,
    title,
    graphData,
    height
}) {

    return (
        <Card>
            <h4 className={'text-center'}>{title}</h4>
            <FlexContainer>
                <Filler />
                <div style={{ height, width: '100%' }}>
                    {
                        graphData.datasets && 
                            type === 'pie' ?
                                <Pie 
                                    data={graphData}
                                    shadow={true}
                                /> : 
                            type === 'bar' ? 
                                <BarNew 
                                    data={graphData}
                                    shadow={true}
                                /> :
                            type === 'doughnut' ?
                                <Doughnut 
                                    data={graphData}
                                    shadow={true}
                                /> :
                                null
                    }
                </div>
                <Filler />
            </FlexContainer>
        </Card>
    );
}

const FlexContainer = styled.div`
    display: flex;
`;

const Filler = styled.div`
    flex: 1;
`;