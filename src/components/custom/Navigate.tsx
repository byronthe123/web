import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';

interface Props {
    path: string;
    classNames?: string;
    callback?: () => any;
}

export default function Navigate ({
    path,
    classNames,
    callback
}: Props) {

    const history = useHistory();
    const handleClick = () => {
        history.push(path);
        callback && callback();
    }

    return (
        <Icon 
            className={classnames(
                'fa-duotone fa-arrow-up-right-from-square hover-pointer text-success',
                classNames
            )}
            onClick={() => handleClick()}
        />
    );
}

const Icon = styled.i`
    font-size: 36px;
`;