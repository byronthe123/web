import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../../context/index';
import {
    Modal,
    ModalHeader,
    Row,
    Col,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    ModalBody,
    Label,
    ButtonGroup,
    Button,
    ModalFooter,
    FormGroup,
} from 'reactstrap';
import { Buffer } from 'buffer';

import employeeMapping from './employeeMapping';
import * as Yup from 'yup';
import moment from 'moment';
import { restrictedEmails } from '../adminEmails';
import { api, asyncHandler, formatDatetime, getTsDate, getUnitsMap } from '../../utils';
import _ from 'lodash';
import classnames from 'classnames';
import axios from 'axios';

import ModalManageAirlines from './ModalManageAirlines';
import ModalManageIp from './ModalManageIp';
import ModalAccessMap from './ModalAccessMap';
import styled from 'styled-components';
import ModalNativeAccessMap from './ModalNativeAccessMap';
import { Field, Formik } from 'formik';
import Switch from 'rc-switch';
import SaveButton from '../custom/SaveButton';
import Files from './Files';
import apiClient from '../../apiClient';
import VirtualTable from '../custom/VirtualTable';
import EmployeeForm from './EmployeeForm';
import EmployeeLog from './EmployeeLog';

export default function ModalManageEmployee({
    user,
    units,
    modal,
    setModal,
    newEmployee,
    selectedEmployee,
    setSelectedEmployee,
    accessLevels,
    handleAddEditEmployee,
    getAirlines,
    airlines,
    employeesMap,
    nativeAccessMapSchema,
}) {
    const toggle = () => setModal(!modal);

    const unitsMap = useMemo(() => {
        return getUnitsMap(units);
    }, [units]);

    const { wiki, appData } = useContext(AppContext);
    const { setCustomWikiTitle } = wiki;
    const { accessToken } = appData;
    const statusOptions = ['ACTIVE', 'SUSPENDED', 'FURLOUGHED', 'TERMINATED'];

    const [initialValues, setInitialValues] = useState({});
    const [sortedAccessLevels, setSortedAccessLevels] = useState([]);
    const [restrictedAccess, setRestrictedAccess] = useState(false);
    const [selectedUnits, setSelectedUnits] = useState([]);

    // Manage Airlines
    const [modalAirlines, setModalAirlines] = useState(false);
    const [selectedAirlines, setSelectedAirlines] = useState({});

    // Access Map
    const [manageAccessMap, setManageAccessMap] = useState(false);

    // Native Access Map
    const [manageNativeAccessMap, setManageNativeAccessMap] = useState(false);

    const [userPhoto, setUserPhoto] = useState('');

    const uniqueEmail = (email) => {
        if (newEmployee && employeesMap[email && email.toUpperCase()]) {
            return false;
        }
        return true;
    };

    const handleModalAirlines = async () => {
        if (airlines.length === 0) {
            await getAirlines();
        }
        setModalAirlines(true);
    };

    const addRemoveAirline = (code) => {
        setSelectedAirlines((prevState) => {
            const copy = Object.assign({}, prevState);
            if (!copy[code]) {
                copy[code] = true;
            } else {
                delete copy[code];
            }
            return copy;
        });
    };

    const resolveSelectedUnits = (selectedEmployee) => {
        const selectedUnits = [];
        const employeeUnits = selectedEmployee.s_unit.split(',');
        for (let i = 0; i < employeeUnits.length; i++) {
            selectedUnits.push(employeeUnits[i]);
        }
        return selectedUnits;
    };

    const resolveSelectedAirlines = (selectedEmployee) => {
        let useString = selectedEmployee.s_airline_codes;
        if (useString[useString.length - 1] === ',') {
            useString = useString.substr(0, useString.length - 1);
        }

        const airlines = useString.split(',');
        const map = {};
        airlines.map((airline) => (map[airline] = true));

        return map;
    };

    useEffect(() => {
        if (selectedEmployee.s_unit) {
            setSelectedUnits(resolveSelectedUnits(selectedEmployee));
        }
        if (selectedEmployee.s_airline_codes) {
            setSelectedAirlines(resolveSelectedAirlines(selectedEmployee));
        }
    }, [selectedEmployee]);

    useEffect(() => {
        setInitialValues(resolveValues(employeeMapping));
        setSortedAccessLevels(
            accessLevels.sort((a, b) => a.i_access_level - b.i_access_level)
        );
    }, [modal, selectedEmployee, accessLevels]);

    useEffect(() => {
        if (user && user.s_email) {
            if (restrictedEmails.includes(user.s_email.toLowerCase())) {
                setRestrictedAccess(true);
            } else {
                setRestrictedAccess(false);
            }
        }
    }, [user]);

    const resolveValues = (mapping) => {
        console.log(selectedEmployee);
        const values = {};
        const dates = [
            'd_terminated',
            'd_suspended_start',
            'd_suspended_end',
            'd_furlough_start',
            'd_furlough_end',
        ];
        for (let i = 0; i < mapping.length; i++) {
            const key = mapping[i];
            if (newEmployee) {
                if (key === 's_status') {
                    values[key] = statusOptions[0];
                } else if (key === 's_unit') {
                    values[key] = units[0];
                } else if (key === 'i_access_level') {
                    values[key] = 1;
                } else if (key === 'b_internal') {
                    values[key] = false;
                } else {
                    values[key] = '';
                }
            } else {
                const { OEmployeeCensus, s_status } = selectedEmployee;

                if (dates.indexOf(key) !== -1) {
                    if (selectedEmployee && selectedEmployee.OEmployeeCensus) {
                        for (let i = OEmployeeCensus.length - 1; i > -1; i--) {
                            const currentRecord = OEmployeeCensus[i];
                            if (
                                currentRecord.s_type.toUpperCase() ===
                                s_status.toUpperCase()
                            ) {
                                if (currentRecord[key]) {
                                    // values[key] = moment(currentRecord[key]).local().format('YYYY-MM-DD');
                                    const utcDate = moment.utc(
                                        currentRecord[key]
                                    );
                                    const localDate = utcDate.local();
                                    values[key] = currentRecord[key];
                                }
                            }
                        }
                    }
                } else {
                    values[key] = selectedEmployee && selectedEmployee[key];
                    values['s_status'] = s_status;
                }
            }
        }
        return values;
    };

    const EmployeeSchema = Yup.object().shape({
        s_email: Yup.string().email('Invalid email').required('Required'),
        s_unit: Yup.string().required('Required'),
        i_employee_number: Yup.number().required('Required'),
        s_first_name: Yup.string().required('Required'),
        s_last_name: Yup.string().required('Required'),
        s_phone_num: Yup.string().min(10).nullable(),
        s_job_title: Yup.string().required('Required'),
        s_department: Yup.string().required('Required'),
        s_status: Yup.string().required('Required'),
        d_terminated: Yup.date().when('s_status', {
            is: 'TERMINATED',
            then: Yup.date().required('Required'),
        }),
        d_suspended_start: Yup.date().when('s_status', {
            is: 'SUSPENDED',
            then: Yup.date().required('Required'),
        }),
        d_suspended_end: Yup.date().when('s_status', {
            is: 'SUSPENDED',
            then: Yup.date().required('Required'),
        }),
        d_furlough_start: Yup.date().when('s_status', {
            is: 'FURLOUGHED',
            then: Yup.date().required('Required'),
        }),
        d_furlough_end: Yup.date().when('s_status', {
            is: 'FURLOUGHED',
            then: Yup.date().required('Required'),
        }),
    });

    const handleSelectUnit = (unit, setFieldValue) => {
        let units = _.cloneDeep(selectedUnits);
        if (units.includes(unit)) {
            units = units.filter((u) => u !== unit);
        } else {
            units.push(unit);
        }
        setSelectedUnits(units);
        setFieldValue('s_unit', units.toString());
    };

    // IP Addresses:

    const ipAddresses = useMemo(() => {
        if (selectedEmployee && selectedEmployee.s_ip_subnet) {
            const map = {};
            const array = selectedEmployee.s_ip_subnet.split(',');
            for (let i = 0; i < array.length; i++) {
                map[i] = array[i];
            }
            return map;
        }
        return {};
    }, [selectedEmployee]);

    const [ipAddress, setIpAddress] = useState('');
    const [createNewIp, setCreateNewIp] = useState(false);
    const [updateIndex, setUpdateIndex] = useState('');
    const [modalIpAddress, setModalIpAddress] = useState(false);

    const handleCreateUpdateIp = (create, address, updateIndex = '') => {
        setCreateNewIp(create);
        setIpAddress(address);
        setModalIpAddress(true);
        setUpdateIndex(updateIndex);
    };

    const saveIp = asyncHandler(async (deleteIp) => {
        const ipAddressesCopy = _.cloneDeep(ipAddresses);

        if (!createNewIp) {
            if (deleteIp) {
                delete ipAddressesCopy[updateIndex];
            } else {
                ipAddressesCopy[updateIndex] = ipAddress;
            }
        } else {
            const numKeys = Object.keys(ipAddresses).length; // This will be the next index to use.
            ipAddressesCopy[numKeys] = ipAddress;
        }

        const array = [];
        for (let key in ipAddressesCopy) {
            array.push(ipAddressesCopy[key]);
        }

        const string = array.join(',');

        console.log(ipAddressesCopy, array, string);

        // Update employee ipAddresses
        await api('post', 'updateEmployeeIpAddresses', {
            s_ip_subnet: string,
            id: selectedEmployee.id,
            employeeLog: `IP Address Updated: ${selectedEmployee.s_ip_subnet} -> ${string}`,
            logCreated: getTsDate(),
            logCreatedBy: user.s_email,
        });

        // Update selectedEmployee object with new ipAddress
        const selectedEmployeeCopy = _.cloneDeep(selectedEmployee);
        selectedEmployeeCopy.s_ip_subnet = string;
        setSelectedEmployee(selectedEmployeeCopy);

        setModalIpAddress(false);
    });

    const [activeTab, setActiveTab] = useState('INFO');
    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    const [employeeFiles, setEmployeeFiles] = useState([]);

    useEffect(() => {
        const getEmployeeFiles = async () => {
            try {
                const res = await apiClient.get(`/employeeFiles/${selectedEmployee.id}`);
                setEmployeeFiles(res.data);
            } catch (err) {
                alert(err);
            }
        }
        if (selectedEmployee && selectedEmployee.id) {
            getEmployeeFiles();
        }
    }, [selectedEmployee]);

    useEffect(() => {
        const getUserPhoto = () => {
            const url = `https://graph.microsoft.com/v1.0/users/${selectedEmployee.s_email}/photo/$value`;
            axios(url, {
                headers: { Authorization: `Bearer ${accessToken}` },
                responseType: 'arraybuffer',
            })
                .then((response) => {
                    const photo = new Buffer(response.data, 'binary').toString(
                        'base64'
                    );
                    console.log(photo);
                    setUserPhoto(`data:image/jpeg;base64, ${photo}`);
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        if (!newEmployee && selectedEmployee && accessToken) {
            getUserPhoto();
        }
    }, [newEmployee, selectedEmployee, accessToken]);

    return (
        <div>
            <Modal
                isOpen={modal}
                toggle={toggle}
                style={{ maxWidth: '1400px', width: '100%' }}
            >
                <ModalHeader>
                    <Row>
                        <Col md={12}>
                            <span className={'float-left'}>
                                {newEmployee ? 'Add' : 'Edit'} Employee
                                {
                                    (!newEmployee && selectedEmployee) && (
                                        <FlexContainer>
                                            <ImgUser src={userPhoto} />
                                            <div>
                                                <h6>{selectedEmployee.s_first_name} {selectedEmployee.s_last_name}</h6>
                                                <h6>{selectedEmployee.s_job_title}</h6>
                                                <h6>{selectedEmployee.i_employee_number}</h6>
                                                <h6>{selectedEmployee.s_email}</h6>
                                            </div>
                                            <div>
                                                <h6>Reports to: {}</h6>
                                                <h6>Date of hire: {formatDatetime(selectedEmployee.d_hire, true)}</h6>
                                                <h6>Department: {selectedEmployee.s_department}</h6>
                                            </div>
                                        </FlexContainer>
                                    )
                                }
                            </span>
                            <i
                                className={'fal fa-question float-right'}
                                style={{ fontSize: '24px' }}
                                onClick={() =>
                                    setCustomWikiTitle('POPUP_EMPLOYEE_DETAILS')
                                }
                                data-tip={'Wiki'}
                            />
                        </Col>
                    </Row>
                </ModalHeader>

                <Formik
                    initialValues={initialValues}
                    validationSchema={EmployeeSchema}
                    validateOnMount={true}
                    enableReinitialize={true}
                    validateOnChange={true}
                >
                    {({
                        initialValues,
                        values,
                        isValid,
                        setFieldValue,
                        validateForm,
                        errors,
                        resetForm,
                    }) => (
                        <>
                            <ModalBody>
                                <Nav tabs className="separator-tabs ml-0 mb-2">
                                    <NavItem>
                                        <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeTab === 'INFO',
                                                'nav-link': true,
                                            })}
                                            onClick={() => {
                                                toggleTab('INFO');
                                            }}
                                        >
                                            Employee Info.
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeTab === 'FILES',
                                                'nav-link': true,
                                            })}
                                            onClick={() => {
                                                toggleTab('FILES');
                                            }}
                                        >
                                            Files
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeTab === 'LOG',
                                                'nav-link': true,
                                            })}
                                            onClick={() => {
                                                toggleTab('LOG');
                                            }}
                                        >
                                            Log
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent
                                    activeTab={activeTab}
                                    className={'mt-2'}
                                >
                                    <TabPane tabId={'INFO'}>
                                        <EmployeeForm 
                                            values={values}
                                            uniqueEmail={uniqueEmail}
                                            unitsMap={unitsMap}
                                            selectedUnits={selectedUnits}
                                            setFieldValue={setFieldValue}
                                            handleSelectUnit={handleSelectUnit}
                                            newEmployee={newEmployee}
                                            statusOptions={statusOptions}
                                            restrictedAccess={restrictedAccess}
                                            sortedAccessLevels={sortedAccessLevels}
                                            handleModalAirlines={handleModalAirlines}
                                            ipAddresses={ipAddresses}
                                            handleCreateUpdateIp={handleCreateUpdateIp}
                                            setManageAccessMap={setManageAccessMap}
                                            setManageNativeAccessMap={setManageNativeAccessMap}
                                        />
                                    </TabPane>
                                    <TabPane tabId={'FILES'}>
                                        <Files 
                                            user={user}
                                            employeeFiles={employeeFiles}
                                            setEmployeeFiles={setEmployeeFiles}
                                            selectedEmployee={selectedEmployee}
                                        />
                                    </TabPane>
                                    <TabPane tabId={'LOG'}>
                                        <EmployeeLog 
                                            selectedEmployee={selectedEmployee}
                                        />
                                    </TabPane>
                                </TabContent>
                            </ModalBody>
                            <ModalFooter style={{ width: '100%' }}>
                                <Row style={{ width: '100%' }}>
                                    <Col md={12}>
                                        {!newEmployee && (
                                            <div className={'float-left'}>
                                                Created by{' '}
                                                {selectedEmployee.s_created_by}{' '}
                                                at{' '}
                                                {moment
                                                    .utc(
                                                        selectedEmployee.t_created
                                                    )
                                                    .format(
                                                        'MM/DD/YYYY HH:mm:ss'
                                                    )}
                                                . Updated by{' '}
                                                {selectedEmployee.s_modified_by}{' '}
                                                at{' '}
                                                {moment
                                                    .utc(
                                                        selectedEmployee.t_modified
                                                    )
                                                    .format(
                                                        'MM/DD/YYYY HH:mm:ss'
                                                    )}
                                            </div>
                                        )}
                                        {
                                            activeTab === 'INFO' && (
                                                <div className={'float-right'}>
                                                    <SaveButton
                                                        enableSave={
                                                            Object.keys(errors).length <
                                                                1 &&
                                                            uniqueEmail(values.s_email)
                                                        }
                                                        handleSave={() =>
                                                            handleAddEditEmployee(
                                                                initialValues,
                                                                values,
                                                                selectedAirlines,
                                                                resetForm
                                                            )
                                                        }
                                                        className={''}
                                                    />
                                                </div>
                                            )
                                        }
                                    </Col>
                                </Row>
                            </ModalFooter>
                        </>
                    )}
                </Formik>

                <ModalManageAirlines
                    modal={modalAirlines}
                    setModal={setModalAirlines}
                    airlines={airlines}
                    selectedAirlines={selectedAirlines}
                    addRemoveAirline={addRemoveAirline}
                    selectedEmployee={selectedEmployee}
                />

                <ModalManageIp
                    modal={modalIpAddress}
                    setModal={setModalIpAddress}
                    ipAddress={ipAddress}
                    setIpAddress={setIpAddress}
                    createNewIp={createNewIp}
                    saveIp={saveIp}
                />

                <ModalAccessMap
                    user={user}
                    modal={manageAccessMap}
                    setModal={setManageAccessMap}
                    selectedEmployee={selectedEmployee}
                />

                <ModalNativeAccessMap
                    user={user}
                    modal={manageNativeAccessMap}
                    setModal={setManageNativeAccessMap}
                    selectedEmployee={selectedEmployee}
                    nativeAccessMapSchema={nativeAccessMapSchema}
                />
            </Modal>
        </div>
    );
}

const FlexContainer = styled.div`
    display: flex;
    gap: 25px;
    margin-top: 25px;
`;

const ImgUser = styled.img`
    border-radius: 50%;
    width: 100px;
    height: auto;
`;