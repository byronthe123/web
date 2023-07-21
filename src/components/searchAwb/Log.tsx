import React from 'react'; 

import { useAppContext } from '../../context';
import { ILog, IUser } from '../../globals/interfaces';
import ActionIcon from '../custom/ActionIcon';
import ViewLogs from '../logNotes/ViewLogs';

interface Props {
    data: Array<ILog>;
    user: IUser;
}

export default function Log ({
    data
}: Props) {

    const { logAddNotes } = useAppContext();
    const { handleAddNotes } = logAddNotes;

    return (
        <div>
            <ActionIcon 
                type={'add'}
                onClick={() => handleAddNotes(false)}
            />
            <ViewLogs 
                data={data}
            />
        </div>
    );
}