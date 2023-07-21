import React, { useState, useMemo, useEffect, useContext } from 'react';
import { Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import { Formik, Field } from 'formik';
import { AppContext, useAppContext } from '../../context';
import { IMap, ISelectOption, IUser } from '../../globals/interfaces';
import moment from 'moment';
import _ from 'lodash';
import * as yup from 'yup';
import { api, formatMawb, validateAwb, getStorageDates } from '../../utils';
import { validateManualEntryBase } from './validateManualEntry';
import SpecialHandlingCodes from '../custom/SpecialHandlingCodes';
import useSelection from '../../customHooks/useSelection';
import styled from 'styled-components';
import Card from '../custom/Card';

interface IFormProps {
    user: IUser;
    initialValues: IMap<any>;
    values: IMap<any>;
    setFieldValue: (field: string, value: any) => void;
    resetForm: (initialValues: IMap<any>) => void;
    manulEntryFfm: (
        values: IMap<any>,
        resetForm: (initialValues: IMap<any>) => void,
        initialValues: IMap<any>
    ) => Promise<void>;
    errors: IMap<string>;
    isValid: boolean;
}

const ErrorMessage = ({ message }: { message: string }) => (
    <span className={'ml-2 text-danger'}>{message}</span>
);

const Form = ({
    user,
    values,
    setFieldValue,
    resetForm,
    manulEntryFfm,
    initialValues,
    errors,
    isValid,
}: IFormProps) => {
    console.log(values);
    const [resolvingStorageDates, setResolvingStorageDates] = useState(false);
    const { appData: { shcs } } = useAppContext();
    const { selected, setSelected, selectedString } = useSelection('');

    useEffect(() => {
        setFieldValue('s_special_handling_code', selectedString);
    }, [selectedString]);

    useEffect(() => {
        const process = async () => {
            setResolvingStorageDates(true);
            const {
                d_storage_first_free,
                d_storage_second_free,
                d_storage_start,
            } = await getStorageDates(
                values.d_arrival_date,
                '',
                values.s_pou,
                values.s_mawb.substring(0, 3),
                user.s_unit
            );

            setFieldValue(
                'd_storage_first_free',
                moment(d_storage_first_free).format('YYYY-MM-DD')
            );
            setFieldValue(
                'd_storage_second_free',
                moment(d_storage_second_free).format('YYYY-MM-DD')
            );
            setFieldValue(
                'd_storage_start',
                moment(d_storage_start).format('YYYY-MM-DD')
            );
            setResolvingStorageDates(false);
        };
        if (
            _.get(values, 'd_arrival_date.length', 0) > 0 &&
            moment(values.d_arrival_date).isValid() &&
            _.get(values, 's_pou.length', 0) >= 3 &&
            validateAwb(_.get(values, 's_mawb', '').replace(/-/g, ''))
        ) {
            process();
        }
    }, [values.d_arrival_date, values.s_pou, values.s_mawb, user.s_unit]);

    useEffect(() => {
        if (_.get(values, 's_mawb.length', 0) === 11) {
            setFieldValue('s_mawb', formatMawb(values.s_mawb));
        }
    }, [values.s_mawb]);

    const enableSubmit = useMemo(() => {
        if (Object.keys(values).length !== 16) {
            return false;
        }

        const validMawb = values.s_mawb.length === 13;

        for (let key in values) {
            const parsed = parseInt(values[key]);
            const validNum = !isNaN(parsed);

            if (!validNum && _.get(values[key], 'length', 0) === 0) {
                //console.log(key, values[key]);
                return false;
            }
        }

        return validMawb;
    }, [values]);

    return (
        <Card>
            <FlexContainer>
                <HalfColumn>
                    <h6>MAWB Details</h6>
                    <FlexContainer>
                        <Column>
                            <FormGroup>
                                <Label>
                                    MAWB{' '}
                                    <ErrorMessage message={errors.s_mawb} />
                                </Label>
                                <Field
                                    className={'form-control'}
                                    name={'s_mawb'}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    MAWB Pieces{' '}
                                    <ErrorMessage
                                        message={errors.i_pieces_total}
                                    />
                                </Label>
                                <Field
                                    className={'form-control'}
                                    name={'i_pieces_total'}
                                    type={'number'}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    Piece Type{' '}
                                    <ErrorMessage
                                        message={errors.s_pieces_type}
                                    />
                                </Label>
                                <Input
                                    type={'select'}
                                    value={values.s_pieces_type}
                                    onChange={(e: any) =>
                                        setFieldValue(
                                            's_pieces_type',
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value={''}></option>
                                    <option value={'TOTAL_CONSIGNMENT'}>
                                        TOTAL_CONSIGNMENT
                                    </option>
                                    <option value={'SPLIT_CONSIGNMENT'}>
                                        SPLIT_CONSIGNMENT
                                    </option>
                                    <option value={'PARTIAL_CONSIGNMENT'}>
                                        PARTIAL_CONSIGNMENT
                                    </option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    Weight{' '}
                                    <ErrorMessage message={errors.f_weight} />
                                </Label>
                                <Field
                                    name={'f_weight'}
                                    className={'form-control'}
                                    type={'number'}
                                />
                            </FormGroup>
                        </Column>
                        <Column>
                            <FormGroup>
                                <Label>
                                    Commodity{' '}
                                    <ErrorMessage
                                        message={errors.s_commodity}
                                    />
                                </Label>
                                <Field
                                    name={'s_commodity'}
                                    className={'form-control'}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    SHC{' '}
                                    <ErrorMessage
                                        message={errors.s_special_handling_code}
                                    />
                                </Label>
                                <SpecialHandlingCodes
                                    shcs={shcs}
                                    selectedShcs={selected}
                                    setSelectedShcs={setSelected}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    Volume{' '}
                                    <ErrorMessage message={errors.s_volume} />
                                </Label>
                                <Field
                                    name={'s_volume'}
                                    className={'form-control'}
                                    type={'number'}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    Pieces in this Flight
                                    <ErrorMessage
                                        message={errors.i_actual_piece_count}
                                    />
                                </Label>
                                <Field
                                    name={'i_actual_piece_count'}
                                    className={'form-control'}
                                    type={'number'}
                                />
                            </FormGroup>
                        </Column>
                    </FlexContainer>
                </HalfColumn>
                <HalfColumn>
                    <h6>Flight Details</h6>
                    <FlexContainer>
                        <Column>
                            <FormGroup>
                                <Label>
                                    Origin{' '}
                                    <ErrorMessage message={errors.s_origin} />
                                </Label>
                                <Field
                                    name={'s_origin'}
                                    className={'form-control'}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    POL <ErrorMessage message={errors.s_pol} />
                                </Label>
                                <Field
                                    name={'s_pol'}
                                    className={'form-control'}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    POU <ErrorMessage message={errors.s_pou} />
                                </Label>
                                <Field
                                    name={'s_pou'}
                                    className={'form-control'}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    Destination{' '}
                                    <ErrorMessage
                                        message={errors.s_destination}
                                    />
                                </Label>
                                <Field
                                    name={'s_destination'}
                                    className={'form-control'}
                                />
                            </FormGroup>
                        </Column>
                        <Column>
                            <FormGroup>
                                <Label>
                                    Arrival Date{' '}
                                    <ErrorMessage
                                        message={errors.d_arrival_date}
                                    />
                                </Label>
                                <Field
                                    name={'d_arrival_date'}
                                    className={'form-control'}
                                    type={'date'}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label>First Free Day</Label>
                                <Field
                                    name={'d_storage_first_free'}
                                    className={'form-control'}
                                    type={'date'}
                                    disabled
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Second Free Day</Label>
                                <Field
                                    name={'d_storage_second_free'}
                                    className={'form-control'}
                                    type={'date'}
                                    disabled
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Storage Start</Label>
                                <Field
                                    name={'d_storage_start'}
                                    className={'form-control'}
                                    type={'date'}
                                    disabled
                                />
                            </FormGroup>
                        </Column>
                    </FlexContainer>
                </HalfColumn>
            </FlexContainer>
            <LastRow>
                <Button
                    disabled={!isValid}
                    onClick={() =>
                        manulEntryFfm(values, resetForm, initialValues)
                    }
                >
                    Submit
                </Button>
            </LastRow>
        </Card>
    );
};

export default function FfmManualEntry() {
    const fields = [
        's_mawb',
        'i_pieces_total',
        's_pieces_type',
        'f_weight',
        's_commodity',
        's_special_handling_code',
        's_volume',
        's_origin',
        's_destination',
        'd_arrival_date',
        's_pol',
        's_pou',
        'i_actual_piece_count',
        'd_storage_first_free',
        'd_storage_second_free',
        'd_storage_start',
    ];

    const { user, createSuccessNotification } = useContext(AppContext);
    const [valuesSet, setValuesSet] = useState(0);
    const [initialValues, setInitialValues] = useState({});

    useEffect(() => {
        const values: IMap<any> = {};
        for (let i = 0; i < fields.length; i++) {
            values[fields[i]] = '';
        }
        values.s_destination = user.s_unit.substring(1, 4);
        setInitialValues(values);
        setValuesSet(valuesSet + 1);
    }, [user.s_unit]);

    const manulEntryFfm = async (
        values: IMap<any>,
        resetForm: (initialValues: IMap<any>) => void,
        initialValues: IMap<any>
    ) => {
        const now = moment().local().format('MM/DD/YYYY HH:mm');

        values.i_total_consignment_pieces = 1;
        values.i_arrived_date = moment(values.d_arrival_date).format('YYMMDD');
        values.i_arrived_week = moment(values.d_arrival_date).week();
        values.i_arrived_year = moment(values.d_arrival_date).year();
        values.i_message_sequence = 1;
        values.b_message_complete = true;
        values.b_has_continuation = false;
        values.i_unique = 1;
        values.s_airline_code = '';
        values.s_arrived_month = moment(values.d_arrival_date)
            .format('MMMM')
            .toUpperCase();
        values.s_arrived_weekday = moment(values.d_arrival_date)
            .format('dddd')
            .toUpperCase();
        values.s_created_by = user.s_email;
        //values.s_flight_id = `0000/${values.d_arrival_date}`;
        values.s_flight_number = '0000';
        values.s_flight_serial = '0000';
        values.s_message_type = 'TRANSFER MANIFEST';
        values.s_modified_by = user.s_email;
        values.s_status = 'MESSAGED';
        values.s_uld = 'TRUCK';
        values.s_uld_code = '00';
        values.s_uld_number = '1';
        values.s_uld_type = 'TRK';
        values.s_volume_unit = 'CUBIC_METER';
        values.t_created = now;
        values.t_modified = now;
        values.s_mawb = values.s_mawb.replace(/-/g, '');
        values.s_weight_type = 'KG';

        const validData = await validateManualEntryBase(values);

        if (validData) {
            const res = await api('post', 'manulEntryFfm', values);

            if (res.status === 200) {
                createSuccessNotification('Success');
                resetForm(initialValues);
                setValuesSet(valuesSet + 1);
            }
        }
    };

    console.log(initialValues);

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={() => {}}
            key={valuesSet}
            validationSchema={yup.object().shape({
                s_mawb: yup
                    .string()
                    .required('Please enter a valid AWB')
                    .length(13, 'AWB must be 11 characters')
                    .test(
                        'valid awb',
                        'Invalid AWB number',
                        function (value: string) {
                            return validateAwb(value);
                        }
                    ),
                i_pieces_total: yup
                    .number()
                    .integer('Must a whole number')
                    .required('Please enter total number of total pieces')
                    .min(0, 'Must be a positive number'),
                s_pieces_type: yup
                    .string()
                    .required('Please select the pieces type'),
                f_weight: yup.number().required('Please enter the weight'),
                s_commodity: yup
                    .string()
                    .required('Please enter the commodity')
                    .max(14, 'Commodity cannot be more than 14 characters'),
                s_special_handling_code: yup.string().notRequired().nullable(),
                s_volume: yup.number().required('Volume is required'),
                s_origin: yup
                    .string()
                    .required('Origin is required')
                    .length(3, 'Must be 3 characters'),
                s_destination: yup
                    .string()
                    .required('Destination is required')
                    .length(3, 'Must be 3 characters'),
                d_arrival_date: yup.date().required('Arrival date is required'),
                s_pol: yup
                    .string()
                    .required('POL is required')
                    .length(3, 'Must be 3 characters'),
                s_pou: yup
                    .string()
                    .required('POU is required')
                    .length(3, 'Must be 3 characters'),
                i_actual_piece_count: yup
                    .number()
                    .integer('Must a whole number')
                    .required('Actual piece count is required')
                    .min(0, 'Must be a positive number'),
                d_storage_first_free: yup.date().required(),
                d_storage_second_free: yup.date().required(),
                d_storage_start: yup.date().required(),
            })}
        >
            {({ values, setFieldValue, resetForm, errors, isValid }) => (
                <Form
                    user={user}
                    initialValues={initialValues}
                    values={values}
                    setFieldValue={setFieldValue}
                    resetForm={resetForm}
                    manulEntryFfm={manulEntryFfm}
                    errors={errors}
                    isValid={isValid}
                />
            )}
        </Formik>
    );
}

const FlexContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const HalfColumn = styled.div`
    width: 45%;
`;

const Column = styled.div`
    min-width: 300px;
`;

const LastRow = styled.div`
    display: flex;
    justify-content: flex-end;
`;
