import { useEffect, useRef } from 'react';
import Cleave from 'cleave.js/react';
import ReactTooltip from 'react-tooltip';

import { validateAwb } from '../../utils';
import styled from 'styled-components';

interface Props {
    value: string;
    onChange: (state: string) => void;
    classNames?: string;
}

export default function MawbInput({ value, onChange, classNames }: Props) {
    const tooltipRef = useRef(null);

    useEffect(() => {
        if ((value && value.length) === 11 && !validateAwb(value)) {
            ReactTooltip.show(tooltipRef.current);
        } else {
            ReactTooltip.hide(tooltipRef.current);
        }
    }, [value]);

    return (
        <Container>
            <ReactTooltip
                id={'mawb-input'}
                backgroundColor={'#F1AEB5'}
                textColor={'black'}
                className={'font-weight-bold'}
            />
            <TooltipContainer
                ref={tooltipRef}
                data-tip="AWB is invalid"
                data-for={'mawb-input'}
            />
            <Cleave
                placeholder=""
                options={{
                    delimiter: '-',
                    blocks: [3, 4, 4],
                }}
                onChange={(e: any) => onChange(e.target.rawValue)}
                value={value}
                className={`form-control && ${classNames}`}
                style={{
                    width: '150px',
                    border: !validateAwb(value) ? '1px solid red' : '',
                    zIndex: 1,
                }}
            />
        </Container>
    );
}

const Container = styled.div`
`;

const TooltipContainer = styled.div`
    width: 1px;
    position: relative;
    top: 10px;
    left: 80px;
    z-index: 0;
`;
