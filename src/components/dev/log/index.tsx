import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Input } from "reactstrap";
import ReactTable from '../../custom/ReactTable';

import { ILog } from "../../../globals/interfaces";
import { api } from "../../../utils";
import LogModal from "../../logNotes/LogModal";

export default function Log () {

    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [logs, setLogs] = useState<Array<ILog>>([]);
    const [modal, setModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ILog>();

    useEffect(() => {
        const getLogs = async (date: string) => {
            const res = await api('get', `/logs/null?startDate=${date}&endDate=${date}`);
            setLogs(res.data);
        }
        getLogs(date);
    }, [date]);

    const handleViewLog = (log: ILog) => {
        setSelectedItem(log);
        setModal(true);
    }

    return (
        <div>
            <Input 
                type={'date'} 
                value={date} 
                onChange={(e: any) => setDate(e.target.value)} 
                style={{ width: '200px' }}
            />
            <ReactTable 
                data={logs}
                mapping={[ {    
                    name: 'MAWB',
                    value: 's_mawb',
                    mawb: true
                }, {
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
                index
                enableClick
                handleClick={handleViewLog}
            />
            <LogModal 
                modal={modal}
                setModal={setModal}
                selectedItem={selectedItem}
            />
        </div>
    );
}