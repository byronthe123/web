import styled from 'styled-components';

import { Types } from './index';
import { IChangeLog } from '../../globals/interfaces';
import { formatDatetime } from '../../utils';

interface Props {
    item: IChangeLog;
    type: Types;
    history: History;
}

export default function Item({ item, type, history }: Props) {
    const className =
        type === 'ADDED'
            ? 'fad fa-plus'
            : type === 'CHANGED'
            ? 'fad fa-pen'
            : 'fad fa-wrench';

    return (
        <div>
            <h6>
                <i className={`${className} pr-2`} />
                {item.title} ({formatDatetime(item.date, true)})
            </h6>
            <ul>
                {item.detail && <li>{item.detail}</li>}
                {/* @ts-ignore */}
                {item.url && <GotoLink onClick={() => history.push(item.url)}>{item.url} <i className="fa-solid fa-arrow-right-to-bracket pl-1"></i></GotoLink>}
            </ul>
        </div>
    );
}

const GotoLink = styled.li`
    color: blue;
    &:hover {
        cursor: pointer;
    }
`;