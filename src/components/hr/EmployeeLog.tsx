import { useEffect, useState } from "react";
import apiClient from "../../apiClient";
import VirtualTable from "../custom/VirtualTable";
import ModalEmployeeLog from "./ModalEmployeeLog";
import { IEmployee, IEmployeeLog } from "../../globals/interfaces";

interface Props {
    selectedEmployee: IEmployee | undefined;
}

export default function EmployeeLog ({
    selectedEmployee
}: Props) {

    const [data, setData] = useState([]);
    const [selectedLog, setSelectedLog] = useState<IEmployeeLog>();
    const [employeeLogModal, setEmployeeLogModal] = useState(false);

    useEffect(() => {
        const getData = async (employee_id: number) => {
            const res = await apiClient.get(`/employee-log/${employee_id}`);
            if (res.status === 200) {
                setData(res.data);
            }
        }
        if (selectedEmployee) {
            getData(selectedEmployee.id);
        }
    }, [selectedEmployee]);

    const handleSelectLog = (log: IEmployeeLog) => {
        setSelectedLog(log);
        setEmployeeLogModal(true);
    }

    return (
        <div>
            <VirtualTable 
                data={data}
                mapping={[{
                    name: 'Event',
                    value: 'changes',
                    wordBreak: true
                }, {
                    name: 'Date',
                    value: 'created',
                    datetime: true,
                    utc: true
                }, {
                    name: 'Modified by',
                    value: 'createdBy',
                    email: true
                }]}
                enableClick
                handleClick={item => handleSelectLog(item)}
                numRows={10}
            />
            <ModalEmployeeLog 
                modal={employeeLogModal}
                setModal={setEmployeeLogModal}
                selectedEmployee={selectedEmployee}
                selectedLog={selectedLog}
            />
        </div>
    );
}