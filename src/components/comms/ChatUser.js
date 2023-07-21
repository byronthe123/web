import React from 'react';
import classnames from 'classnames';
import UserPhoto from './UserPhoto';
import { Row } from 'reactstrap';

export default function ChatUser ({
    key,
    user, 
    handleInitThred,
    accessToken
}) {

    return (
        <tr key={key} onClick={() => !user.busy && handleInitThred(user)}>
            <td style={{ width: '45px' }}>
                <UserPhoto 
                    user={user}
                    accessToken={accessToken}
                    fontSize={'24px'}
                    width={'42px'}
                />
            </td>
            <td>
                <Row className={'font-weight-bold'}>
                    {user.displayName}
                </Row>
                <Row style={{ fontSize: '11px' }}>
                    {user.s_unit}
                </Row>
            </td>
            <td>
                <i 
                    className={classnames(user.busy ? 'fad fa-comment-minus text-danger' : 'fal fa-comment-check text-success')} 
                    style={{ fontSize: '20px' }}
                    // data-tip={user.busy ? 'Busy' : 'Available'}
                ></i>
            </td>
        </tr>
    );
}