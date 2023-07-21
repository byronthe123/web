import { Row, Col, FormGroup, Label, ButtonGroup, Button } from 'reactstrap';
import { Field } from 'formik';
import { IAccessLevel, IMap, SetFieldValue } from '../../globals/interfaces';
import styled from 'styled-components';
import { IUnitMap, isChoiceEmail } from '../../utils';
import Switch from 'rc-switch';



interface Props {
    values: any;
    uniqueEmail: (email: string) => boolean;
    unitsMap: IMap<IUnitMap>;
    selectedUnits: Array<string>;
    setFieldValue: SetFieldValue;
    handleSelectUnit: (unit: string, setFieldValue: SetFieldValue) => void;
    newEmployee: boolean;
    statusOptions: Array<string>;
    restrictedAccess: boolean;
    sortedAccessLevels: Array<IAccessLevel>;
    handleModalAirlines: () => Promise<void>;
    ipAddresses: Record<string, string>;
    handleCreateUpdateIp: (create: boolean, address: string, updateIndex: string) => void;
    setManageAccessMap: React.Dispatch<React.SetStateAction<boolean>>;
    setManageNativeAccessMap: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EmployeeForm({
    values,
    uniqueEmail,
    unitsMap,
    selectedUnits,
    setFieldValue,
    handleSelectUnit,
    newEmployee,
    statusOptions,
    restrictedAccess,
    sortedAccessLevels,
    handleModalAirlines,
    ipAddresses,
    handleCreateUpdateIp,
    setManageAccessMap,
    setManageNativeAccessMap
}: Props) {

    const workTypeOptions = [
        '',
        'FULL TIME',
        'PART TIME',
        'TEMPORARY',
        'SEASONAL',
        'CONTRACTOR',
        'FREELANCER',
        'CONSULTANT',
    ];

    const disabledAccessSettings = (values: any) =>
        ['TERMINATED', 'SUSPENDED'].includes(values.s_status);


    return (
        <Row>
            <Col md={6}>
                <FormGroup>
                    <Label>
                        Email{' '}
                        <span className={'bg-warning text-danger'}>
                            {!uniqueEmail(values.s_email) &&
                                'Email already exists'}
                        </span>
                    </Label>
                    <Field
                        type="email"
                        name="s_email"
                        className="form-control"
                    />
                </FormGroup>
                <FormGroup>
                    <Label className="d-block">Unit</Label>
                    <UnitsContainer>
                        {Object.keys(unitsMap).map((key, i) => (
                            <div key={i}>
                                {unitsMap[key].array.map((unit, j) => (
                                    <UnitContainer
                                        key={`${unit}-${j}`}
                                        selected={selectedUnits.includes(unit)}
                                        color={unitsMap[key].color}
                                        onClick={() =>
                                            handleSelectUnit(
                                                unit,
                                                setFieldValue
                                            )
                                        }
                                    >
                                        {unit}
                                    </UnitContainer>
                                ))}
                            </div>
                        ))}
                    </UnitsContainer>
                </FormGroup>
                <FormGroup>
                    <Label>Employee Number</Label>
                    <Field
                        type="number"
                        name="i_employee_number"
                        className="form-control"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>First Name</Label>
                    <Field
                        type="text"
                        name="s_first_name"
                        className="form-control"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Last Name</Label>
                    <Field
                        type="text"
                        name="s_last_name"
                        className="form-control"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Date of Hire</Label>
                    <Field type="date" name="d_hire" className="form-control" />
                </FormGroup>
            </Col>
            <Col md={6}>
                <FormGroup>
                    <Label>Work Type</Label>
                    <Field
                        component="select"
                        name="s_work_type"
                        className="form-control"
                    >
                        {workTypeOptions.map((type, i) => (
                            <option value={type} key={i}>
                                {type}
                            </option>
                        ))}
                    </Field>
                </FormGroup>
                <FormGroup>
                    <Label>Phone Number</Label>
                    <Field
                        type="number"
                        name="s_phone_num"
                        className="form-control"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Job Title</Label>
                    <Field
                        type="text"
                        name="s_job_title"
                        className="form-control"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Department</Label>
                    <Field
                        type="text"
                        name="s_department"
                        className="form-control"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Status:</Label>
                    <Field
                        component="select"
                        name="s_status"
                        className="form-control"
                    >
                        {newEmployee ? (
                            <option value={statusOptions[0]}>
                                {statusOptions[0]}
                            </option>
                        ) : (
                            statusOptions.map((o, i) => (
                                <option value={o} key={i}>
                                    {o}
                                </option>
                            ))
                        )}
                    </Field>
                </FormGroup>
                {values.s_status &&
                    values.s_status.toUpperCase() !== 'ACTIVE' && (
                        <FormGroup>
                            {values.s_status === 'TERMINATED' ? (
                                <>
                                    <Label>Termination Date</Label>
                                    <Field
                                        type="date"
                                        name="d_terminated"
                                        className="form-control"
                                    />
                                </>
                            ) : values.s_status === 'SUSPENDED' ? (
                                <>
                                    <Label>Suspension Start</Label>
                                    <Field
                                        type="date"
                                        name="d_suspended_start"
                                        className="form-control mb-2"
                                    />
                                    <Label>Suspension End</Label>
                                    <Field
                                        type="date"
                                        name="d_suspended_end"
                                        className="form-control"
                                    />
                                </>
                            ) : (
                                <>
                                    <Label>Furlough Start</Label>
                                    <Field
                                        type="date"
                                        name="d_furlough_start"
                                        className="form-control mb-2"
                                    />
                                    <Label>Furlough End</Label>
                                    <Field
                                        type="date"
                                        name="d_furlough_end"
                                        className="form-control"
                                    />
                                </>
                            )}
                        </FormGroup>
                    )}
                {restrictedAccess && (
                    <>
                        <FormGroup>
                            <Label>Access Level</Label>
                            <Row>
                                <Col md={12}>
                                    <ButtonGroup>
                                        {sortedAccessLevels.map((l, i) => (
                                            <Button
                                                key={i}
                                                active={
                                                    values.i_access_level ===
                                                    l.i_access_level
                                                }
                                                onClick={() =>
                                                    setFieldValue(
                                                        'i_access_level',
                                                        l.i_access_level
                                                    )
                                                }
                                            >
                                                {l.i_access_level}
                                            </Button>
                                        ))}
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </FormGroup>
                        <Row>
                            <Col md={4}>
                                <FormGroup
                                    style={{
                                        width: '150px',
                                    }}
                                >
                                    <Label>Internal</Label>
                                    <Switch
                                        className="custom-switch custom-switch-primary"
                                        checked={isChoiceEmail(values.s_email)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup
                                    style={{
                                        width: '150px',
                                    }}
                                >
                                    <Label>Airline</Label>
                                    <Switch
                                        className="custom-switch custom-switch-primary"
                                        checked={values.b_airline}
                                        onClick={() =>
                                            setFieldValue(
                                                'b_airline',
                                                !values.b_airline
                                            )
                                        }
                                    />
                                </FormGroup>
                            </Col>
                            {values.b_airline && (
                                <Col md={4}>
                                    <button
                                        className={'mt-4 btn btn-outline-dark'}
                                        onClick={() => handleModalAirlines()}
                                    >
                                        Manage Airlines
                                    </button>
                                </Col>
                            )}
                        </Row>
                        {!newEmployee && (
                            <Row
                                className={`${
                                    disabledAccessSettings(values) &&
                                    'custom-disabled'
                                }`}
                            >
                                <Col md={12}>
                                    <Label>
                                        IP Addresses{' '}
                                        <span className={'bg-warning'}>
                                            {disabledAccessSettings(values) &&
                                                'Only available for ACTIVE employees'}
                                        </span>
                                    </Label>
                                </Col>
                                {Object.keys(ipAddresses).map((key, i) => (
                                    <Col
                                        md={3}
                                        key={i}
                                        onClick={() =>
                                            handleCreateUpdateIp(
                                                false,
                                                ipAddresses[key],
                                                key
                                            )
                                        }
                                    >
                                        <Button>{ipAddresses[key]}</Button>
                                    </Col>
                                ))}
                                <Col
                                    md={3}
                                    onClick={() =>
                                        handleCreateUpdateIp(true, '', '')
                                    }
                                >
                                    <i
                                        className="fas fa-plus-circle text-primary float-left hover-pointer mt-1"
                                        style={{
                                            fontSize: '34px',
                                        }}
                                        data-tip={'Add New IP Address'}
                                    ></i>
                                </Col>
                            </Row>
                        )}
                    </>
                )}
                {!newEmployee && (
                    <AccessButtonsContainer
                        className={`mt-2 ${
                            disabledAccessSettings(values) && 'custom-disabled'
                        }`}
                    >
                        <Button onClick={() => setManageAccessMap(true)}>
                            Access Map
                        </Button>
                        <Button onClick={() => setManageNativeAccessMap(true)}>
                            Mobile Access Map
                        </Button>
                    </AccessButtonsContainer>
                )}
            </Col>
        </Row>
    );
}

const UnitsContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const UnitContainer = styled.div<{selected: boolean}>`
    background-color: ${(p) => (p.selected ? 'gold' : p.color)};
    border: 1px solid black;
    border-radius: 12px;
    text-align: center;
    margin: 5px 0px;
    padding: 10px;
    transition: 200ms;
    font-weight: bold;

    &:hover {
        cursor: pointer;
        transform: scale(1.1);
    }
`;

const AccessButtonsContainer = styled.div`
    display: flex;
    gap: 10px;
`;
