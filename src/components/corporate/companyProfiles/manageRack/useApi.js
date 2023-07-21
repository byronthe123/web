import { useEffect, useState } from "react";
import { api } from "../../../utils";

export default function useApi (unitRack, action, type, value, user) {
    const [updatedObj, setUpdatedObj] = useState({});
    useEffect(() => {

    });
}

const updatedFunction = (unitRack, action, type, value, tower, level, location) => {
    const copy = Object.assign({}, unitRack);
    if (action === 'CREATE') {
        if (type === 'TOWER') {
            copy[value] = {};
        } else if (type === 'LEVEL') {
            copy[tower][value] = [];
        } else if (type === 'LOCATION') {
            copy[tower][level].push(value);
        }
    } else if (action === 'UPDATE') {
        if (type === 'TOWER') {
            delete Object.assign(copy, {[value]: copy[tower] })[tower];
        } else if (type === 'LEVEL') {
            const levelCopy = copy[tower][level];
            delete copy[tower][level]
            copy[tower][value] = levelCopy;
        }
    } else if (action === 'DELETE') {
        if (type === 'TOWER') {
            delete copy[tower];
        } else if (type === 'LEVEL') {
            delete copy[tower][level];
        } else if (type === 'LOCATION') {
            delete copy[tower][level][location];
        }
    }
}       