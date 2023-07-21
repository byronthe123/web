import { useState } from 'react';
import dayjs from 'dayjs';

import { ILog } from '../../globals/interfaces';
import ReactTable from '../../components/custom/ReactTable';
import LogModal from './LogModal';

interface Props {
    data: Array<ILog>;
}

export default function ViewLogs ({
    data
}: Props) {

    // custom multiSort (multi sort)
    const sorted = data.sort((a, b) => {
		if (a.s_priority === 'NORMAL' && b.s_priority !== 'NORMAL') {
			return -1;
		} else if (a.s_priority !== 'NORMAL' && b.s_priority === 'NORMAL') {
			return 1;
		} else {
			return +dayjs(b.t_created) - +dayjs(a.t_created);
		}
	});

    const [modal, setModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ILog>();

    const handleViewItem = (item: ILog) => {
        setSelectedItem(item);
        setModal(true);
    }

    return (
        <>
            <ReactTable 
                data={sorted}
                mapping={[{
                    name: 'Created by',
                    value: 's_created_by',
                    email: true
                }, {
                    name: 'Created',
                    value: 't_created',
                    datetime: true,
                    utc: true
                }, {
                    name: 'Priority',
                    value: 's_priority'
                }, {
                    name: 'HAWB',
                    value: 's_hawb'
                }, {
                    name: 'Notes',
                    value: 's_notes'
                }, {
                    name: 'Procedure',
                    value: 's_procedure',
                    dev: true
                }]}
                numRows={10}
                enableClick={true}
                handleClick={handleViewItem}
            />
            <LogModal 
                modal={modal}
                setModal={setModal}
                selectedItem={selectedItem}
            />
        </>
    );
}