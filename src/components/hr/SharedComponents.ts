import styled from 'styled-components';
import Card from '../custom/Card';

export const CardWrapper = styled(Card).attrs({ className: 'hidden-scroll' })`
    background-color: ${(p) => p.selected && '#daf9da'};
    border: ${(p) => p.selected && '2px solid #0cf00c'};
    flex: 1 1 350px;
    max-width: 350px;
    max-height: 530px;
    /* overflow-y: scroll; */
`;
