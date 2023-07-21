import { useState, useMemo } from 'react';
import _ from 'lodash';

const checkSize = (prop) => {
    return _.size(prop) > 0;
}

export default function useUpdateValues () {
    const [value, setValue] = useState('');
    const [tower, setTower] = useState('');
    const [level, setLevel] = useState('');
    const [location, setLocation] = useState('');
    const [allowDuplicateLoc, setAllowDuplicateLoc] = useState('');
    const [action, setAction] = useState('');
    const [type, setType] = useState('');

    const enableProcess = useMemo(() => {
        if (type === 'TOWER') {
            return checkSize(value);
        } else if (type === 'LEVEL') {
            return (
                checkSize(tower) &&
                checkSize(value)
            );
        } else if (type === 'LOCATION') {
            const base = (
                checkSize(tower) &&
                checkSize(level) &&
                _.isBoolean(allowDuplicateLoc)
            );
            if (action === 'CREATE') {
                return base;
            } else if (action === 'UPDATE') {
                return base && checkSize(location);
            }
        } else if (type === 'SPECIAL') {
            if (action === 'CREATE') {
                return checkSize(value);
            } else if (action === 'UPDATE') {
                return checkSize(value) && checkSize(location);
            }
        }
    }, [action, type, tower, level, location, value, allowDuplicateLoc]);

    const handleSetActionType = (action, type) => {
        setAction(action);
        setType(type);
    }

    return {
        value, 
        setValue,
        tower, 
        setTower,
        level,
        setLevel,
        location,
        setLocation,
        allowDuplicateLoc, 
        setAllowDuplicateLoc,
        action,
        type, 
        handleSetActionType,
        enableProcess
    }
}