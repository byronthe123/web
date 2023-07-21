import React, { useState, useEffect, useRef } from 'react';
import { FormGroup, Label, Row, Col } from 'reactstrap';
import { Field } from 'formik';
import FormikCheckbox from '../../custom/FormikCheckbox';
import Switch from 'rc-switch';
import Select from 'react-select';

import Activity from './Activity';
import SelectAirline from './SelectAirline';
import FormError from '../../custom/FormError';
import {
    IAirline,
    IExtendedFFM,
} from '../../import/breakdownInstructions/interfaces';
import useApi from '../../corporate/companyProfiles/manageRack/useApi';
import { api, print } from '../../../utils';
import { IFFM, IMap, ISelectOption, IUser } from '../../../globals/interfaces';
import useLoading from '../../../customHooks/useLoading';
import ReactTable from '../../../components/custom/ReactTable';
import styled from 'styled-components';
import _ from 'lodash';
import ActionIcon from '../../custom/ActionIcon';
import StatsPrint from './StatsPrint';
import { Input } from 'reactstrap';

interface IffmMapRecord {
    s_flight_number: string;
    s_flight_id: string;
    s_logo: string;
    s_status: string;
    i_unique: number;
    uldsMap: Record<string, string>;
    awbs: Set<string>;
    uldTypes: Record<string, number>;
    i_awb: number;
    i_pieces: number;
    f_bup_kg: number;
    f_total_kg: number;
    i_ld3: number;
    i_ld3_bup: number;
    i_ld7: number;
    i_ld7_bup: number;
    f_mail_kg: number;
    transferAwbKg: Record<string, number>;
    f_awb_transfer: number;
    f_transfer_kg: number;
    shcs: Set<string>;
}

interface Props {
    user: IUser;
    values: any;
    setFieldValue: (name: string, value: string | number | boolean) => void;
    airlineOptions: Array<ISelectOption>;
    handleSelectAirline: (name: ISelectOption) => void;
    selectedAirline: ISelectOption;
    handleChange: any;
    selectedType: any;
    enterInLbs: boolean;
    setEnterInLbs: React.Dispatch<React.SetStateAction<boolean>>;
    selectedStat: any;
    viewOnly: boolean;
    checkDuplicateStat: any;
    duplicateWarning: boolean;
    errors: any;
    setUldsArray: React.Dispatch<React.SetStateAction<Array<string>>>;
}

const fieldsArray = [
    'i_awb',
    'i_pieces',
    'f_total_kg',
    'f_bup_kg',
    'i_ld3',
    'i_ld3_bup',
    'i_ld7',
    'i_ld7_bup',
    'f_mail_kg',
    'f_awb_transfer',
    'f_transfer_kg',
];

// Import POU must match unit
// Export is POL must match

const ld3UldTypes = ['AKE', 'AKH', 'AKL', 'AVA', 'DPE', 'PKC', 'RKN'];

const checkLd3 = (str: string) => {
    for (const code of ld3UldTypes) {
        if (str.includes(code)) {
            return true;
        }
    }
    return false;
};

export default function ImportExportForm({
    user,
    values,
    setFieldValue,
    airlineOptions,
    handleSelectAirline,
    selectedAirline,
    handleChange,
    selectedType,
    enterInLbs,
    setEnterInLbs,
    selectedStat,
    viewOnly,
    checkDuplicateStat,
    duplicateWarning,
    errors,
    setUldsArray,
}: Props) {
    const { setLoading } = useLoading();
    const [ffmData, setFfmData] = useState<Array<IExtendedFFM>>([]);
    const [flightsMap, setFlightsMap] = useState<Record<string, IffmMapRecord>>(
        {}
    );
    const [flightOptions, setFlightOptions] = useState<Array<ISelectOption>>(
        []
    );
    const [selectedFlight, setSelectedFlight] = useState<ISelectOption>();
    const [s_flight_id, set_s_flight_id] = useState('');

    useEffect(() => {
        const s_pou = user.s_unit.substring(1, 4);
        const { d_flight } = values;

        const resolveUniqueAirlines = (ffmData: Array<IExtendedFFM>) => {
            const flightsMap: Record<string, IffmMapRecord> = {};
            for (let i = 0; i < ffmData.length; i++) {
                const current = ffmData[i];
                const {
                    s_mawb,
                    s_flight_number,
                    s_flight_id,
                    i_unique,
                    s_uld,
                    s_uld_type,
                    i_actual_piece_count,
                } = current;
                const f_weight = Number((current.f_weight || 0).toFixed(2));
                if (flightsMap[s_flight_number] === undefined) {
                    flightsMap[s_flight_number] = {
                        s_flight_number,
                        s_flight_id,
                        s_logo: current.s_logo,
                        s_status: current.s_status,
                        i_unique,
                        uldsMap: {},
                        awbs: new Set(),
                        uldTypes: {},
                        i_awb: 0,
                        i_pieces: 0,
                        f_bup_kg: 0,
                        f_total_kg: 0,
                        i_ld3: 0,
                        i_ld3_bup: 0,
                        i_ld7: 0,
                        i_ld7_bup: 0,
                        f_mail_kg: 0,
                        transferAwbKg: {},
                        f_awb_transfer: 0,
                        f_transfer_kg: 0,
                        shcs: new Set()
                    };
                }

                const shc = _.get(current, 's_special_handling_code', '') || '';

                flightsMap[s_flight_number].awbs.add(s_mawb);
                if (!shc.includes('MAL')) {
                    flightsMap[s_flight_number].f_total_kg += f_weight;
                }

                if (shc.includes('BUP')) {
                    flightsMap[s_flight_number].f_bup_kg += f_weight;
                }

                flightsMap[s_flight_number].i_pieces += i_actual_piece_count;

                if (shc.includes('MAL')) {
                    flightsMap[s_flight_number].f_mail_kg += f_weight;
                }
                if (s_pou !== current.s_destination) {
                    if (flightsMap[s_flight_number].transferAwbKg[s_mawb] === undefined) {
                        flightsMap[s_flight_number].transferAwbKg[s_mawb] = 0;
                    }
                    flightsMap[s_flight_number].transferAwbKg[s_mawb] += f_weight;
                }

                flightsMap[s_flight_number].i_awb =
                    flightsMap[s_flight_number].awbs.size;

                if (s_uld && s_uld !== 'BULK') {
                    if (flightsMap[s_flight_number].uldsMap[s_uld] === undefined) {
                        flightsMap[s_flight_number].uldsMap[s_uld] = '';
                    }
                }
                if (shc.length > 0 && flightsMap[s_flight_number].uldsMap[s_uld] !== undefined) {
                    flightsMap[s_flight_number].uldsMap[s_uld] += `,${shc}`;
                }
            }

            for (const s_flight_number in flightsMap) {
                const { uldsMap } = flightsMap[s_flight_number];
                console.log(uldsMap);
                for (const uld in uldsMap) {
                    const s_uld_type = uld.substring(0, 3);
                    if (flightsMap[s_flight_number].uldTypes[s_uld_type] === undefined) {
                        flightsMap[s_flight_number].uldTypes[s_uld_type] = 0;
                    }
                    flightsMap[s_flight_number].uldTypes[s_uld_type]++;
                    const shcs = uldsMap[uld];
                    console.log(uldsMap);
                    if (checkLd3(s_uld_type)) {
                        if (shcs.includes('BUP')) {
                            flightsMap[s_flight_number].i_ld3_bup++;
                        } else {
                            flightsMap[s_flight_number].i_ld3++;
                        }
                    } else {
                        if (shcs.includes('BUP')) {
                            flightsMap[s_flight_number].i_ld7_bup++;
                        } else {
                            flightsMap[s_flight_number].i_ld7++;
                        }
                    }
                }

                let transferCount = 0, transferKg = 0  
                Object.keys(flightsMap[s_flight_number].transferAwbKg).map(s_mawb => {
                    transferCount++;
                    transferKg += flightsMap[s_flight_number].transferAwbKg[s_mawb];
                });
                flightsMap[s_flight_number].f_awb_transfer = transferCount;
                flightsMap[s_flight_number].f_transfer_kg += transferKg;
            }

            return flightsMap;
        };

        const ffmQuery = async () => {
            setLoading(true);

            const body = {
                d_arrival_date: d_flight,
                s_unit: user.s_unit,
                s_type: selectedType
            };

            if (selectedType === 'IMPORT') {
                // @ts-ignore
                body.s_pou = s_pou;
            } else {
                // @ts-ignore
                body.s_pol = s_pou;
            }

            const res = await api(
                'post',
                'selectFfmByFlightArrivalDateAndPou',
                body
            );
            const { data } = res;
            setLoading(false);
            setFfmData(data);
            const flightsMap = resolveUniqueAirlines(data);
            setFlightsMap(flightsMap);

            const airlinesArray: Array<ISelectOption> = [];
            for (let key in flightsMap) {
                airlinesArray.push({
                    label: flightsMap[key].s_flight_number,
                    value: flightsMap[key].s_flight_number,
                });
            }
            setFlightOptions(airlinesArray);
        };
        if (values.d_flight) {
            ffmQuery();
        }
        const emptySelectOption = { label: '', value: '' };
        setSelectedFlight(emptySelectOption);
        handleSelectAirline(emptySelectOption);
        // setFieldValue('s_flight_number', '');
        // setFieldValue('s_airline_code', '');
        // for (const field of fieldsArray) {
        //     setFieldValue(field, '');
        // }
    }, [values.d_flight, user.s_unit, selectedType]);

    useEffect(() => {
        const option = flightOptions.find(
            (o) =>
                o.value === `${values.s_airline_code}${values.s_flight_number}`
        );
        if (option) {
            handleSelectFlight(option);
        } else {
            const airlineOption = airlineOptions.find(
                (o) => o.value === values.s_airline_code
            );
            if (airlineOption) {
                handleSelectAirline(airlineOption);
            }
        }
    }, [values.s_flight_number, values.s_airline_code, flightOptions]);

    const convertToKg = (value: number) => (value * 0.45359237).toFixed(2);

    const convertToLbs = (value: number) => (value * 2.20462262185).toFixed(2);

    useEffect(() => {
        setFieldValue(
            'f_loose_kg',
            (
                parseFloat(values.f_total_kg) - parseFloat(values.f_bup_kg)
            ).toFixed(2)
        );
        setFieldValue(
            'f_loose_lb',
            convertToLbs(
                parseFloat(values.f_total_kg) - parseFloat(values.f_bup_kg)
            )
        );

        setFieldValue(
            'f_flight_kg',
            (
                parseFloat(values.f_total_kg) + parseFloat(values.f_mail_kg)
            ).toFixed(2)
        );
        setFieldValue(
            'f_flight_lb',
            convertToLbs(
                parseFloat(values.f_total_kg) + parseFloat(values.f_mail_kg)
            )
        );
    }, [values.f_total_kg, values.f_bup_kg, values.f_mail_kg]);

    useEffect(() => {
        const setKgsArray = [
            'f_total_kg',
            'f_bup_kg',
            'f_mail_kg',
            'f_courier_kg',
        ];
        const setLbsArray = [
            'f_total_lb',
            'f_bup_lb',
            'f_mail_lb',
            'f_courier_lb',
        ];

        if (selectedType === 'IMPORT') {
            setKgsArray.push('f_awb_transfer', 'f_transfer_kg');
            setLbsArray.push('f_awb_transfer_lb', 'f_transfer_lb');
        } else {
            setKgsArray.push('f_tsa_kg');
            setLbsArray.push('fc_tsa_lb');
        }

        let mapArray = [];

        if (enterInLbs) {
            mapArray = setKgsArray;
        } else {
            mapArray = setLbsArray;
        }

        for (let i = 0; i < mapArray.length; i++) {
            const current = mapArray[i];
            const setValue = enterInLbs
                ? convertToKg(values[setLbsArray[i]])
                : convertToLbs(values[setKgsArray[i]]);
            setFieldValue(current, setValue);
        }
    }, [enterInLbs, selectedType, values]);

    useEffect(() => {
        const setKgsArray = [
            'f_total_kg',
            'f_bup_kg',
            'f_mail_kg',
            'f_courier_kg',
        ];
        const mapArray = setKgsArray;

        for (let i = 0; i < mapArray.length; i++) {
            const current = mapArray[i];

            let setValue = 0;

            if (values[setKgsArray[i]] > 0) {
                setValue = values[setKgsArray[i]];
            }
            setFieldValue(current, setValue);
        }
    }, []);

    const handleSelectFlight = (flightOption: ISelectOption) => {
        setSelectedFlight(flightOption);
        const flightNumber = String(flightOption.value);
        set_s_flight_id(`${flightNumber}/${values.d_flight}`);
        const s_airline_code = flightNumber.substring(0, 2);
        const s_flight_number = flightNumber.substring(2);
        const airlineOption = airlineOptions.find(
            (o) => o.value === s_airline_code
        );
        if (airlineOption) {
            handleSelectAirline(airlineOption);
        }
        setFieldValue('s_flight_number', s_flight_number);
        if (values.s_status) return;

        const flightData = flightsMap[flightNumber];
        for (const field of fieldsArray) {
            // @ts-ignore
            if (flightData[field] !== undefined) {
                // @ts-ignore
                setFieldValue(field, flightData[field]);
                if (field.includes('_kg')) {
                    // @ts-ignore
                    setFieldValue(field, flightData[field].toFixed(2));
                }
            }
        }
    };

    const unique = selectedFlight?.value
        ? `(Unique ${flightsMap[selectedFlight?.value].i_unique})`
        : '';
    const ulds = (flightsMap[selectedFlight?.value || ''] || {}).uldTypes;
    console.log(flightsMap[selectedFlight?.value || '']);
    const uldsArray = ulds
        ? Object.keys(ulds).map((key) => `${key} / ${ulds[key]}`)
        : [];

    useEffect(() => {
        setUldsArray(uldsArray);
    }, [uldsArray]);

    const printStat = () => {
        print(
            <StatsPrint
                stat={values}
                uldsArray={uldsArray}
                userEmail={user.s_email}
            />
        );
    };

    return (
        <Row>
            <Col md={4}>
                <h6 className={`mb-2 ${duplicateWarning && 'bg-warning'}`}>
                    Enter Flight ID {duplicateWarning ? 'Duplicate Exists' : ''}{' '}
                </h6>
                <FormGroup>
                    <Label>
                        Flight Date <FormError message={errors.d_flight} />
                    </Label>
                    <Field
                        name="d_flight"
                        type="date"
                        className={`form-control ${
                            duplicateWarning && 'bg-warning'
                        }`}
                        onChange={(e: any) =>
                            checkDuplicateStat(e, handleChange, values)
                        }
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Select Flight {unique}</Label>
                    <Select
                        value={selectedFlight}
                        options={flightOptions}
                        onChange={(selectedOption: ISelectOption) =>
                            handleSelectFlight(selectedOption)
                        }
                    />
                </FormGroup>
                <UldsContainer>
                    {uldsArray.map((u) => (
                        <Uld>{u}</Uld>
                    ))}
                </UldsContainer>
                <SelectAirline
                    selectedAirline={selectedAirline}
                    handleSelectAirline={handleSelectAirline}
                    airlineOptions={airlineOptions}
                    setFieldValue={setFieldValue}
                />
                <FormGroup>
                    <Label>
                        Flight Number{' '}
                        <FormError message={errors.s_flight_number} />
                    </Label>
                    <Field
                        name="s_flight_number"
                        type="text"
                        className={`form-control ${
                            duplicateWarning && 'bg-warning'
                        }`}
                        onChange={(e: any) =>
                            checkDuplicateStat(e, handleChange, values)
                        }
                    />
                </FormGroup>
                <FormGroup>
                    <FormikCheckbox
                        name={'b_nil'}
                        checked={values.b_nil}
                        label={'NIL'}
                        onClick={() => setFieldValue('b_nil', !values.b_nil)}
                    />
                </FormGroup>
                <FormGroup>
                    <FormikCheckbox
                        name={'b_cancelled'}
                        checked={values.b_cancelled}
                        label={'Cancelled'}
                        onClick={() =>
                            setFieldValue('b_cancelled', !values.b_cancelled)
                        }
                    />
                </FormGroup>
                <FormGroup className="mb-0">
                    <Label>Notes</Label>
                    <Field
                        name="s_notes"
                        component="textarea"
                        className="form-control"
                        style={{ height: '100px' }}
                    />
                </FormGroup>
                <Activity viewOnly={viewOnly} s_activity={values.s_activity} />
            </Col>
            <Col md={4}>
                <h6 className="mb-2">Enter Flight Data</h6>
                <FormGroup>
                    <Label>
                        AWB <FormError message={errors.i_awb} />
                    </Label>
                    <Field
                        name="i_awb"
                        type="number"
                        className="form-control"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>
                        Pieces <FormError message={errors.i_pieces} />
                    </Label>
                    <Field
                        name="i_pieces"
                        type="number"
                        className="form-control"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>
                        DG AWB Count <FormError message={errors.i_awb_dg} />
                    </Label>
                    <Field
                        name="i_awb_dg"
                        type="number"
                        className="form-control"
                    />
                </FormGroup>
                {selectedType === 'EXPORT' && (
                    <FormGroup>
                        <Label>
                            AWB Prepare{' '}
                            <FormError message={errors.i_awb_prepare} />
                        </Label>
                        <Field
                            name="i_awb_prepare"
                            type="number"
                            className="form-control"
                        />
                    </FormGroup>
                )}
                <FormGroup>
                    <Label>
                        LD3 <FormError message={errors.i_ld3} />
                    </Label>
                    <Field
                        name="i_ld3"
                        type="number"
                        className="form-control"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>
                        LD3 BUP <FormError message={errors.i_ld3_bup} />
                    </Label>
                    <Field
                        name="i_ld3_bup"
                        type="number"
                        className="form-control"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>
                        LD7 <FormError message={errors.i_ld7} />
                    </Label>
                    <Field
                        name="i_ld7"
                        type="number"
                        className="form-control"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>
                        LD7 BUP <FormError message={errors.i_ld7_bup} />
                    </Label>
                    <Field
                        name="i_ld7_bup"
                        type="number"
                        className="form-control"
                    />
                </FormGroup>
            </Col>
            <Col md={4}>
                <h6 className="mb-2">
                    Total Flight Weight:{' '}
                    <span className="ml-2">
                        <Switch
                            checked={enterInLbs}
                            onClick={() => setEnterInLbs(!enterInLbs)}
                        />{' '}
                        {enterInLbs ? 'Pounds' : 'Kilos'}
                    </span>
                </h6>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label>Cargo Total Weight KG</Label>
                            <Field
                                name="f_total_kg"
                                type="number"
                                className="form-control"
                                disabled={enterInLbs}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label>LB</Label>
                            <Field
                                name="f_total_lb"
                                type="number"
                                className="form-control"
                                disabled={!enterInLbs}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label>Cargo BUP Weight</Label>
                            <Field
                                name="f_bup_kg"
                                type="number"
                                className="form-control"
                                disabled={enterInLbs}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label>LB</Label>
                            <Field
                                name="f_bup_lb"
                                type="number"
                                className="form-control"
                                disabled={!enterInLbs}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label>Cargo Loose Weight</Label>
                            <Field
                                disabled
                                name="f_loose_kg"
                                type="number"
                                className="form-control"
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label>LB</Label>
                            <Field
                                disabled
                                name="f_loose_lb"
                                type="number"
                                className="form-control"
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label>Mail Weight</Label>
                            <Field
                                name="f_mail_kg"
                                type="number"
                                className="form-control"
                                disabled={enterInLbs}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label>LB</Label>
                            <Field
                                name="f_mail_lb"
                                type="number"
                                className="form-control"
                                disabled={!enterInLbs}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label>Flight Weight</Label>
                            <Field
                                disabled
                                name="f_flight_kg"
                                type="number"
                                className="form-control"
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label>LB</Label>
                            <Field
                                disabled
                                name="f_flight_lb"
                                type="number"
                                className="form-control"
                            />
                        </FormGroup>
                    </Col>
                </Row>

                {selectedType === 'IMPORT' && (
                    <>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Transfer AWB</Label>
                                    <Field
                                        name="f_awb_transfer"
                                        type="number"
                                        className="form-control"
                                        disabled={enterInLbs}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>LB</Label>
                                    <Field
                                        name="f_awb_transfer_lb"
                                        type="number"
                                        className="form-control"
                                        disabled={!enterInLbs}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Transfer Weight</Label>
                                    <Field
                                        name="f_transfer_kg"
                                        type="number"
                                        className="form-control"
                                        disabled={enterInLbs}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>LB</Label>
                                    <Field
                                        name="f_transfer_lb"
                                        type="number"
                                        className="form-control"
                                        disabled={!enterInLbs}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </>
                )}

                {selectedType === 'EXPORT' && (
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label>TSA Weight KG</Label>
                                <Field
                                    name="f_tsa_kg"
                                    type="number"
                                    className="form-control"
                                    disabled={enterInLbs}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label>LB</Label>
                                <Field
                                    name="fc_tsa_lb"
                                    type="number"
                                    className="form-control"
                                    disabled={!enterInLbs}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                )}

                <Row>
                    <Col md={6}>
                        <FormGroup className="mb-0">
                            <Label>Courier Weight</Label>
                            <Field
                                name="f_courier_kg"
                                type="number"
                                className="form-control"
                                disabled={enterInLbs}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup className="mb-0">
                            <Label>LB</Label>
                            <Field
                                name="f_courier_lb"
                                type="number"
                                className="form-control"
                                disabled={!enterInLbs}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <RightDiv>
                    <ActionIcon type="print" onClick={() => printStat()} />
                </RightDiv>
            </Col>
        </Row>
    );
}

const UldsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 100px), 1fr));
    gap: 5px;
    margin-bottom: 5px;
`;

const Uld = styled.div`
    text-align: center;
    background-color: #3860b2;
    color: white;
    border-radius: 5px;
`;

const RightDiv = styled.div`
    position: absolute;
    bottom: -70px;
    right: 400px;
`;
