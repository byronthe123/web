export const normalizer = (string) => {
    if (string && string.length > 0) {
        return string.replace(/[\t\n]/g, '').trim().toUpperCase();
    }
}

export const markSelected = (array, value) => {
    const copy = Object.assign([], array);
    for (let i = 0; i < copy.length; i++) {
        copy[i].selected = value;
    }
    return copy;
}


export const markPaymentsByMaster = (payments) => {
    const copy = Object.assign([], payments);
    for (let i = 0; i < payments.length; i++) {
        if (!payments[i].s_hawb || (payments[i].s_hawb && payments[i].s_hawb.trim().length === 0)) {
            payments[i].selected = true;
        } else {
            payments[i].selected = false;
        }
    }
    return copy;
}

export const markLocationsByMaster = (locations) => {
    const copy = Object.assign([], locations);
    for (let i = 0; i < copy.length; i++) {
        if (copy[i].s_hawb === null || copy[i].s_hawb.length === 0) {
            copy[i].selected = true;
        } else {
            copy[i].selected = false;
        }
    }
    return copy;
}

export const markByHouse = (s_hawb, array) => {
    const copy = Object.assign([], array);
    for (let i = 0; i < copy.length; i++) {
        if (normalizer(copy[i].s_hawb) === s_hawb) {
            copy[i].selected = true;
        } else {
            copy[i].selected = false;
        }
    }
    return copy;
}

export const parseAmount = (amount) => {
    const parsed = parseFloat(amount);
    if (parsed > 0) {
        return parsed;
    }
    return 0;
}

export const getNum = (num) => {
    const parsed = parseFloat(num);
    if (!isNaN(parsed)) {
        return Number(parsed.toFixed(2));
    }
    return 0;
};
