import React from 'react';
import Navigate from '../custom/Navigate';

interface Props {
    title: string;
    navigation?: {
        path: string;
        toggle: () => void;
    }
}

export default function Header ({
    title,
    navigation
}: Props) {
    return (
        <div>
            <h6 className={'font-weight-bold float-left'}>
                { title }
            </h6>
            {
                navigation && 
                    <Navigate 
                        path={navigation.path}
                        classNames={'float-right'}
                        callback={() => navigation.toggle()}
                    />
            }
        </div>
    );
}