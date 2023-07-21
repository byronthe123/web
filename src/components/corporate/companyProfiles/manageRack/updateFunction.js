export default function updatedFunction (schema, action, type, value, tower, level, location, allowDuplicateLoc) {
    value = value && value.toUpperCase();
    let success = true;
    const copy = Object.assign({}, schema);

    if (action === 'CREATE') {
        if (type === 'TOWER') {
            if (schema[value]) {
                success = false;
                alert(`Tower ${value} already exists.`);
            } else {
                copy[value] = {};
            }
        } else if (type === 'LEVEL') {
            if (copy[tower][value]) {
                success = false;
                alert(`Level ${value} already exists in tower ${tower}.`);
            } else {
                copy[tower][value] = {};
            }
        } else if (type === 'LOCATION') {
            if (copy[tower][level][value] !== undefined) {
                success = false;
                alert(`Location ${value} already exists in tower ${tower}, level ${level}.`);
            } else {
                copy[tower][level][value] = {
                    allowDuplicates: allowDuplicateLoc
                }
            }
        } else if (type === 'SPECIAL') {
            if (copy[value] !== undefined) {
                success = false;
                alert(`Location ${value} already exists.`);
            } else {
                copy[value] = {};
            }
        }
    } else if (action === 'UPDATE') {
        if (type === 'TOWER') {
            delete Object.assign(copy, {[value]: copy[tower] })[tower];
        } else if (type === 'LEVEL') {
            const levelCopy = copy[tower][level];
            delete copy[tower][level]
            copy[tower][value] = levelCopy;
        } else if (type === 'LOCATION') {
            if (value !== location && copy[tower][level][value] !== undefined) {
                alert(`Location ${value} already exists for Tower ${tower}, Level ${level}`);
                success = false;
            } else {
                delete copy[tower][level][location];
                copy[tower][level][value] = {
                    allowDuplicates: allowDuplicateLoc
                }
            }
        } else if (type === 'SPECIAL') {
            // this check has been removed for now: value !== location because 
            // no other property is updated
            if (copy[value] !== undefined) {
                alert(`Location ${value} already exists.`);
                success = false;
            } else {
                delete copy[location];
                copy[value] = {};
            }
        }
    } else if (action === 'DELETE') {
        if (type === 'TOWER') {
            delete copy[tower];
        } else if (type === 'LEVEL') {
            delete copy[tower][level];
        } else if (type === 'LOCATION') {
            delete copy[tower][level][location];
        } else if (type === 'SPECIAL') {
            delete copy[value];
        }
    }
    return {
        success, 
        copy
    };
}       