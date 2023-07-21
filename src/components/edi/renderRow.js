export default function renderRow (printConsignee, name) {
    if (!printConsignee && name === 'Consignee') {
        return false;
    }
    return true;
}
