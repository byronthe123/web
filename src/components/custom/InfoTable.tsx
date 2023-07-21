import { Table } from "reactstrap";
import styled from "styled-components";

export const InfoTable = styled(Table)<{customWidth?: number}>`
    width: ${p => p.customWidth ? p.customWidth + 'px' : '225px'};
    tr td:first-child {
        font-weight: bold;   
    }
    td {
        padding-left: 0px;
        padding-bottom: 5px;
    }
`;