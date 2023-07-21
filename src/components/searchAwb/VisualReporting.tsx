import { useState } from "react";

import ReactTable from "../../components/custom/ReactTable";
import { IUser, IVisualReporting } from "../../globals/interfaces";
import { generateDamageReport } from '../../components/warehouse/damageReporting/utils';
import VisualReportingModal from './VisualReportingModal'

interface Props {
    data: Array<IVisualReporting>;
    user: IUser
}

export default function VisualReporting ({
    data,
    user
}: Props) {

    const [viewModal, setViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IVisualReporting>();
    
    const handleViewItem = (item: IVisualReporting) => {
        setSelectedItem(item);
        setViewModal(true);
    }

    return (
        <>
            <ReactTable 
                data={data}
                mapping={[{
                    name: 'Submitted by',
                    value: 'full_name',
                }, {
                    name: 'AWB/ULD',
                    value: 'awb_uld'
                }, {
                    name: 'Comments',
                    value: 'comments'
                }, {
                    name: 'Link',
                    value: 'file_link'
                }, {
                    name: 'Unit',
                    value: 'unit'
                }, {
                    name: 'Print',
                    value: 'fas fa-print',
                    icon: true,
                    function: (item: IVisualReporting) => generateDamageReport('print', user, item, data)
                }]}
                enableClick
                handleClick={handleViewItem}
            />
            <VisualReportingModal 
                modal={viewModal}
                setModal={setViewModal}
                item={selectedItem}
            />
        </>
    );
}