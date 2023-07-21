import React, { useState, useRef } from 'react';
import moment from 'moment';
import { Row, Col, Button } from 'reactstrap';
import ReactTooltip from 'react-tooltip';
import ReactTable from '../custom/ReactTable';
import fileDownload from 'js-file-download';
import fields from './exportFields';

import employeeTableMapping from './employeeTableMapping';
import ModalManageEmployee from './ModalManageEmployee';
import ModalProvidePassword from './ModalProvidePassword';
import { updateLocalValue, isChoiceEmail, api, notify, getTsDate } from '../../utils';
import _ from 'lodash';
import useEmployeesMap from './useEmployeesMap';
import { logAliasMap } from './logAliasMap';

export default function Employees ({
    user,
    units,
    employees, 
    setEmployees,
    accessLevels,
    getAirlines,
    airlines,
    setLoading,
    nativeAccessMapSchema
}) {    

    const employeesMap = useEmployeesMap(employees);
    const [modalManageEmployee, setModalManageEmployee] = useState(false);
    const [newEmployee, setNewEmployee] = useState(false);
    const [modalPassword, setModalPassword] = useState(false);
    const [createdEmployee, setCreatedEmployee] = useState({});
    const [selectedEmployee, setSelectedEmployee] = useState({});
    const [tableKey, setTableKey] = useState(0);
    const reactTableRef = useRef();

    const handleNewEmployee = () => {
        setNewEmployee(true);
        setModalManageEmployee(true);
    }

    const handleUpdateEmployee = (employee) => {
        setNewEmployee(false);
        setSelectedEmployee(employee);
        setModalManageEmployee(true);
    }

    const resolveAirlines = (map) => {
        let string = '';
        for (let key in map) {
            string += `${key},`;
        }
        return string;
    }

    const offsetDateValue = (value) => {
        if (moment(value).isValid()) {
            return moment(value).utc().add(1, 'day').format('YYYY-MM-DD');
        }
        // if (moment(value).isValid() && !moment().isDST()) {
        //     alert('working');
        //     value = moment(value).add(1, 'day');
        //     return value;
        // } else {
        //     return null;
        // }
    }

    const addChoiceEmployee = async (values, selectedAirlines, employeeLog, resetForm) => {
        setLoading(true);

        // Offset date values by +1 day if NOT daylight savings:
        values.d_hire = offsetDateValue(values.d_hire);

        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        const email = user && user.s_email;

        const data = values;
        
        data.t_created = now;
        data.s_created_by = email;
        data.t_modified = now;
        data.s_modified_by = email;
        data.b_internal = isChoiceEmail(values.s_email) ? true : false;
        data.b_airline = data.b_airline ? true : false;

        data.s_airline_codes = resolveAirlines(selectedAirlines);
        data.employeeLog = employeeLog;

        try {
            const response = await api('post', 'addChoiceEmployee', { data });

            if (response.status === 200) {
                const createdEmployee = response.data;
                setEmployees(prev => {
                    const copy = _.cloneDeep(prev);
                    copy.push(createdEmployee);
                    return copy;
                })
                setTableKey(tableKey + 1);
                notify('Employee Added');

                setCreatedEmployee(createdEmployee);
                setSelectedEmployee(createdEmployee);
                setNewEmployee(false);
            }
        } catch (err) {
            alert(err);
        }
        setLoading(false);
    }

    const updateChoiceEmployee = async (values, selectedAirlines, employeeLog, resetForm) => {
        setLoading(true);

        // Offset date values by +1 day:
        values.d_hire = offsetDateValue(values.d_hire);

        console.log(selectedAirlines);
        const employee = values;
        console.log(employee);
        console.log(selectedEmployee);
        employee.id = selectedEmployee.id;
        employee.s_modified_by = user.s_email;
        employee.t_modified = getTsDate();
        
        const census = {
            s_type: values.s_status,
            s_email: values.s_email,
        }

        if (values.s_status === 'TERMINATED') {
            employee.s_ip_subnet = null;
            census.d_terminated = values.d_terminated;
        } else if (values.s_status === 'SUSPENDED') {
            employee.s_ip_subnet = null;
            census.d_suspended_start = values.d_suspended_start;
            census.d_suspended_end = values.d_suspended_end;
        } else if (values.s_status === 'FURLOUGHED') {
            census.d_furlough_start = values.d_furlough_start;
            census.d_furlough_end = values.d_furlough_end;
        }

        employee.b_internal = isChoiceEmail(values.s_email) ? true : false;
        employee.b_airline = employee.b_airline ? true : false;
        employee.s_airline_codes = resolveAirlines(selectedAirlines);

        const data = {
            employee,
            census,
            employeeLog
        }

        try {
            const response = await api('put', 'updateChoiceEmployee', { data });

            if (response.status === 200) {
                notify('Employee updated');
                setModalManageEmployee(false);
                setEmployees(prev => {
                    const copy = _.cloneDeep(prev);
                    for (let i = 0; i < copy.length; i++) {
                        if (copy[i].id === response.data.id) {
                            copy[i] = response.data;
                            break;
                        }
                    }
                    return copy;
                });
                resetForm();
                setTableKey(tableKey + 1);
            }
        } catch (err) {
            alert(err);
        }
        setLoading(false);
    }

    const generateEmployeeLog = (initialValues, currentValues) => {
        // Start building the changes string
        let changesString = 'Changes made to the following fields - ';

        // Iterate over each field
        for (let fieldName in initialValues) {
            // If the field's value has been changed
            if (initialValues[fieldName] !== currentValues[fieldName]) {
                // Add to the changes string
                const fieldAlias = logAliasMap[fieldName] || fieldName;
                const newValue = currentValues[fieldName] || ''.toUpperCase();
                changesString += `${fieldAlias}: ${initialValues[fieldName]} -> ${newValue}; `;
            }
        }

        // Trim the trailing comma and space
        if (changesString.endsWith(', ')) {
            changesString = changesString.substring(0, changesString.length - 2);
        }

        return changesString;
    }

    const handleAddEditEmployee = (initialValues, values, selectedAirlines, resetForm) => {
        const employeeLog = generateEmployeeLog(initialValues, values);

        if (newEmployee) {
            addChoiceEmployee(values, selectedAirlines, employeeLog, resetForm);
        } else {
            updateChoiceEmployee(values, selectedAirlines, employeeLog, resetForm);
        }
    }

    const formatDateTime = (date) => moment(date).format('MM/DD/YYYY HH:mm:ss');

    const exportHrData = () => {
        const Json2csvParser = require("json2csv").Parser;
        const raw = reactTableRef.current.getResolvedState().sortedData;

        if (raw.length > 0) {
            const data = raw.map(record => {
            
                // Delete AccessLevel property
                delete record._original.AccessLevel;
                
                // Offset id by -1
                record._original.id--;
    
                // Format Dates correctly
                const formatDates = ['t_created', 't_modified'];
    
                for (let i = 0; i < formatDates.length; i++) {
                    record._original[formatDates[i]] = formatDateTime(record._original[formatDates[i]]);
                }
    
                return record._original;
            });
            const jsonData = JSON.parse(JSON.stringify(data));
            const json2csvParser = new Json2csvParser({ excelStrings: true, withBOM: true, fields});
            const csv = json2csvParser.parse(jsonData);
            fileDownload(csv, `CHOICE Employees Report ${moment().format('YYYY-MM-DD')}.csv`);
        } else {
            notify('No records to download.', 'warning');
        }

    }

    return (
        <Row>
            <ReactTooltip />
            <Col md={12} className='mb-2'>
                <i 
                    className="fas fa-plus-circle text-primary float-left hover-pointer"
                    style={{ fontSize: '24px' }} 
                    onClick={() => handleNewEmployee()}
                    data-tip={'Add New Employee'} 
                ></i>
                <i 
                    className="fas fa-file-download text-primary float-right hover-pointer" 
                    style={{ fontSize: '24px' }} 
                    onClick={() => exportHrData()}
                    data-tip={'Download data'} 
                ></i>
            </Col>
            <Col md={12}>
                <ReactTable
                    data={employees}
                    index={true}
                    mapping={employeeTableMapping}
                    enableClick={true}
                    handleClick={handleUpdateEmployee}
                    reactTableRef={reactTableRef}
                />
            </Col>

            <ModalManageEmployee 
                user={user}
                units={units}
                modal={modalManageEmployee}
                setModal={setModalManageEmployee}
                newEmployee={newEmployee}
                handleAddEditEmployee={handleAddEditEmployee}
                selectedEmployee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                accessLevels={accessLevels}
                getAirlines={getAirlines}
                airlines={airlines}
                employeesMap={employeesMap}
                nativeAccessMapSchema={nativeAccessMapSchema}
            />

            <ModalProvidePassword 
                modal={modalPassword}
                setModal={setModalPassword}
                employee={createdEmployee}
            />
        </Row>
    )
}