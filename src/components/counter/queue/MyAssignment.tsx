import React, { useMemo } from 'react';
import { Col, Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import {
    CSSTransition
} from 'react-transition-group';

import Card from '../../custom/Card';
import useBreakpoint from '../../../customHooks/useBreakpoint';
import { IQueue } from '../../../globals/interfaces';
import { formatMawb } from '../../../utils';

interface IExtendedAwb extends IQueue {
    s_payment_type?: string;
    s_located_status?: string;
    b_hold?: boolean;
    s_location?: string;
}

interface Props {
    awb: IExtendedAwb;
    handleSearchAwb: (e: any, overrideAwb: string) => Promise<void>;
}

export default function MyAssignment ({
    awb,
    handleSearchAwb
}: Props) {

    const history = useHistory();
    const { breakpoint } = useBreakpoint();

    const resolveBooleanValue = (condition: boolean | undefined) => condition ? 'Yes' : 'No';

    const jumpToProcess = (awb: IQueue) => {
        const page = ['EXPORT', 'TRANSFER-EXPORT'].includes(awb.s_type) ? 
            'Acceptance' : 
            'Delivery';
        history.push(`/EOS/Operations/Counter/${page}?s_mawb=${awb.s_mawb}`);
    } 

    const awbBackground = useMemo(() => {
        const { s_type } = awb;

        switch(s_type) {
            case 'EXPORT':
                return '#6BB4DD';
            case 'IMPORT':
                return '#61B996';
            case 'TRANSFER-IMPORT':
                return '#BBA0CA';
            default:
                return '#61B996';
        }
    }, [awb]);

    return (
        <CSSTransition classNames={'drop-in'} timeout={500}>
            <CardWrapper background={awbBackground} strongShadow={true}>
                <Header>
                    <h3 className='font-weight-bold hyperlink' onClick={() => handleSearchAwb(null, awb.s_mawb)}>{formatMawb(awb.s_mawb)}</h3>
                    <div className={'text-right'}>
                        <h4>Added at {moment.utc(awb.t_created).format('hh:mm A')}</h4>
                        <h4 className='mb-0'>{awb.s_type}</h4>
                    </div>
                </Header>
                {
                    awb.s_type === 'IMPORT' &&
                    <AwbInfo>
                        <div>ISC Paid: {resolveBooleanValue(awb.s_payment_type === 'ISC')}</div>
                        <div>Located: {resolveBooleanValue(awb.s_located_status === 'LOCATED')}</div>
                        <div>On Hold: {resolveBooleanValue(awb.b_hold)}</div>
                        <div>Valuable: {resolveBooleanValue(awb.s_location === 'VAL')}</div>
                    </AwbInfo>
                }
                <ProcessButtonWrapper>
                    <Button color='light' onClick={() => jumpToProcess(awb)}>Process AWB</Button>
                </ProcessButtonWrapper>
            </CardWrapper>
        </CSSTransition>
        
    );
}

const CardWrapper = styled(Card)`
    background-color: ${p => p.background};
    /* flex: 1 1 450px; */
    width: min(49%, 650px);
    animation: drop-in 1000ms;

    @media (max-width: 1050px) {
        width: 100%;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
`;

const AwbInfo = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    font-size: 18px;
    gap: 5px;

    div {
        min-width: 90px;
        max-width: 90px;
    }
`;

const ProcessButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;
