import React, { useState, useEffect, useContext, useMemo } from 'react';
import moment from 'moment';
import { asyncHandler, api } from '../../../utils';
import { Button, Row, Col, Card, CardBody, FormGroup, Input } from 'reactstrap';
import ReactTable from '../../custom/ReactTable';
import tableMapping from '../../counter/import/tableMappings';

import AppLayout from '../../AppLayout';
import ModalManageOverride from '../../managers/importOverride/ModalManageOverride';

import { AppContext } from '../../../context';
import _ from 'lodash';

export default function ManagePayments({ s_payment_method, charges }) {
    const { user, setLoading, createSuccessNotification } =
        useContext(AppContext);

    const renderStorage = (s_name) => {
        if (s_name !== 'STORAGE') {
            return true;
        }
        return (
            (s_payment_method !== 'OVERRIDE' && user.i_access_level >= 4) ||
            s_payment_method === 'OVERRIDE'
        );
    };

    useEffect(() => {
        const { payments } = tableMapping;

        for (let i = 0; i < payments.length; i++) {
            const { name } = payments[i];
            if (name === 'Approved') {
                payments.splice(i, 1);
            }
        }

        if (s_payment_method === 'OVERRIDE') {
            tableMapping.payments.push({
                name: 'Approved',
                value: 'b_override_approved',
                boolean: true,
            });
        }
    }, [charges, s_payment_method, user.i_access_level]);

    const [s_awb, set_s_awb] = useState('');
    const [s_hawb, set_s_hawb] = useState('');
    const [paymentsData, setPaymentsData] = useState([]); // Overrides and Charges
    const [f_amount, set_f_amount] = useState(0);
    const [s_payment_type, set_s_payment_type] = useState('');
    const [s_notes, set_s_notes] = useState('');
    const [fwb, setFwb] = useState({});
    const [fhl, setFhl] = useState({});
    const [searchComplete, setSearchComplete] = useState(false);
    const [approvers, setApprovers] = useState({});
    const [overrideAmount, setOverrideAmount] = useState(0);

    const reset = () => {
        setPaymentsData([]);
        set_f_amount(0);
        set_s_notes('');
        set_s_payment_type('');
        setSearchComplete(false);
        set_s_awb('');
        set_s_hawb('');
    };

    useEffect(() => {
        reset();
    }, [user.s_unit]);

    const searchPayments = async () => {
        const data = {
            s_awb,
            s_hawb,
            s_unit: user && user.s_unit,
            s_payment_method:
                s_payment_method === 'CHARGES' ? 'CHARGE' : 'OVERRIDE',
        };

        setLoading(true);
        const res = await api('post', 'searchPayments', { data });
        setLoading(false);

        if (res.status === 200) {
            const { main = [], fwb = {}, fhl = {} } = res.data;
            if (main.length === 0) {
                createSuccessNotification('No records found', 'warning');
            }

            setPaymentsData(main);
            setFwb(fwb);
            setFhl(fhl);
            setSearchComplete(true);
        }
    };

    const createPayment = asyncHandler(async () => {
        setLoading(true);

        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        const formattedAwb = s_awb
            .replace(/\s/g, '')
            .replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
        const data = {
            s_awb: formattedAwb.replace(/-/g, ''),
            s_hawb,
            f_amount: s_payment_method === 'CHARGES' ? -1 * f_amount : f_amount,
            s_payment_type,
            s_payment_method:
                s_payment_method === 'CHARGES' ? 'CHARGE' : 'OVERRIDE',
            b_override_approved: f_amount >= 1001 ? false : true,
            s_notes,
            t_created: now,
            t_created_date: now,
            s_created_by: user.s_email,
            s_unit: user && user.s_unit,
            reportsToEmail: user.managerEmail,
            username: user.displayName,
            fwb: {
                s_awb: formattedAwb,
                pieces: fwb.i_total_pieces || null,
                weight: fwb.f_weight || null,
                commodity: fwb.s_goods_description || null,
                shipper: fwb.s_shipper_name1 || null,
                consignee: fwb.s_consignee_name1 || null,
                modified:
                    fwb && fwb.i_total_pieces
                        ? moment
                              .utc(fwb.t_modified)
                              .format('MM/DD/YYYY HH:mm:ss')
                        : null,
            },
            fhl: {
                s_hawb,
                pieces: fhl.i_pieces || null,
                weight: fhl.f_weight || null,
                commodity: fhl.s_nature_of_goods || null,
                shipper: fhl.s_shipper_address_name1 || null,
                consignee: fhl.s_consignee_address_name1 || null,
                modified: moment
                    .utc(fhl.t_modified)
                    .format('MM/DD/YYYY HH:mm:ss'),
            },
        };

        await api('post', 'createPayment', { data });
        reset();
        setLoading(false);
        createSuccessNotification('Completed');
    });

    const enableCreatePayment = () => {
        let authorized = true;
        if (s_payment_type === 'STORAGE') {
            authorized = user.i_access_level >= 4;
        }
        const validHouseOrAwb = s_awb.length >= 11 || s_hawb.length > 3;
        return (
            authorized &&
            searchComplete &&
            validHouseOrAwb &&
            f_amount > 0 &&
            s_payment_type &&
            s_notes.length > 0
        );
    };

    // ModalDeleteOverrideCharge
    const [modal, setModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});

    const handleModal = (item) => {
        setSelectedItem(item);
        setOverrideAmount(item.f_amount);
        setModal(true);
    };

    const deleteOverrideCharge = asyncHandler(async () => {
        const data = selectedItem;

        data.s_created_by = user.s_email;
        data.username = user.displayName;
        data.reportsToEmail = user.managerEmail;
        data.s_unit = user.s_unit;

        await api('post', 'deletePayment', { data });

        setModal(false);
        const filtered = paymentsData.filter((c) => c.i_id !== data.i_id);
        setPaymentsData(filtered);
    });

    const unprocessPayment = asyncHandler(async () => {
        const data = {
            i_id: selectedItem.i_id,
            b_processed: false,
            t_processed: null,
            s_processed_by: null,
        };

        await api('put', 'unprocessPayment', { data });

        setModal(false);
        createSuccessNotification('Success');
    });

    const approveOverride = async () => {
        const { i_id } = selectedItem;

        const res = await api('put', 'approveOverride', {
            i_id,
            f_amount: overrideAmount,
            b_override_approved: true,
            s_override_approver: user.s_email,
            t_override_approved: moment().local().format('MM/DD/YYYY HH:mm'),
        });

        if (res.status === 200) {
            createSuccessNotification('Override Approved');
            setModal(false);
            setSelectedItem((prev) => {
                const copy = _.cloneDeep(prev);
                copy.b_override_approved = true;
                return copy;
            });

            setPaymentsData((prev) => {
                const copy = _.cloneDeep(prev);
                for (let i = 0; i < copy.length; i++) {
                    if (copy[i].i_id === i_id) {
                        copy[i].b_override_approved = true;
                    }
                }
                return copy;
            });
        }
    };

    useEffect(() => {
        const getApprovers = async () => {
            const res = await api('get', 'approvers');
            setApprovers(res.data);
        };
        if (s_payment_method === 'OVERRIDE') {
            getApprovers();
        }
    }, [s_payment_method]);

    return (
        <AppLayout>
            <div
                className={`card queue-card-container`}
                style={{
                    backgroundColor: '#f8f8f8',
                    height: 'calc(100vh - 120px)',
                    overflowY: 'scroll',
                }}
            >
                <div className="card-body mb-5 px-1 py-1">
                    <Row className="px-3 py-3">
                        <Col md={12}>
                            <Row>
                                <Col md={12}>
                                    <h1>
                                        Import{' '}
                                        {s_payment_method === 'OVERRIDE'
                                            ? 'Override'
                                            : 'Charges'}
                                    </h1>
                                    <h6>
                                        {s_payment_method === 'OVERRIDE'
                                            ? 'Use this tool when trying to offset the amount a customer has to pay before they pick up their cargo. Any override will automatically trigger an email notification to senior staff and your supervisor.'
                                            : 'Use this tool to add Charges to an AWB before they pickup their cargo.'}
                                    </h6>
                                    <h6 className={'mb-4'}>
                                        <i className="fas fa-info-circle mr-2"></i>
                                        Select/Click a record to delete it.
                                    </h6>
                                    <h6>
                                        {s_payment_method} by:{' '}
                                        {user.displayName}, reports to{' '}
                                        {user.manager}
                                    </h6>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={3}>
                                    <FormGroup>
                                        <h6>AWB:</h6>
                                        <Input
                                            type="text"
                                            value={s_awb}
                                            onChange={(e) =>
                                                set_s_awb(e.target.value)
                                            }
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <h6>HAWB:</h6>
                                        <Input
                                            type="text"
                                            value={s_hawb}
                                            onChange={(e) =>
                                                set_s_hawb(e.target.value)
                                            }
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Button
                                            disabled={
                                                s_awb.length < 11 &&
                                                s_hawb.length < 3
                                            }
                                            onClick={() => searchPayments()}
                                        >
                                            Start
                                        </Button>
                                    </FormGroup>
                                    {searchComplete && (
                                        <>
                                            <FormGroup className={'mt-5'}>
                                                <h6>Amount:</h6>
                                                <Input
                                                    type="number"
                                                    value={f_amount}
                                                    onChange={(e) =>
                                                        set_f_amount(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <h6>Type:</h6>
                                                <Input
                                                    type={'select'}
                                                    value={s_payment_type}
                                                    onChange={(e) =>
                                                        set_s_payment_type(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    {charges.map(
                                                        (type, i) =>
                                                            renderStorage(
                                                                type.s_name
                                                            ) && (
                                                                <option
                                                                    value={
                                                                        type.s_name
                                                                    }
                                                                    key={i}
                                                                >
                                                                    {
                                                                        type.s_name
                                                                    }
                                                                </option>
                                                            )
                                                    )}
                                                </Input>
                                            </FormGroup>
                                            <FormGroup className={'mt-5'}>
                                                <h6>Reason:</h6>
                                                <Input
                                                    type="textarea"
                                                    value={s_notes}
                                                    onChange={(e) =>
                                                        set_s_notes(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Button
                                                    disabled={
                                                        !enableCreatePayment()
                                                    }
                                                    onClick={() =>
                                                        createPayment()
                                                    }
                                                >
                                                    Create
                                                </Button>
                                            </FormGroup>
                                        </>
                                    )}
                                </Col>
                                <Col md={9}>
                                    {searchComplete && (
                                        <div>
                                            {(fwb.t_modified ||
                                                fhl.t_modified) && (
                                                <h4>EDI Messages Found:</h4>
                                            )}
                                            <Row>
                                                {fwb && fwb.t_modified && (
                                                    <Col md={6}>
                                                        <Card
                                                            style={{
                                                                borderRadius:
                                                                    '0.75rem',
                                                            }}
                                                        >
                                                            <CardBody>
                                                                <h6>
                                                                    MAWB:{' '}
                                                                    {s_awb}
                                                                </h6>
                                                                <h6>
                                                                    Pieces:{' '}
                                                                    {
                                                                        fwb.i_total_pieces
                                                                    }
                                                                </h6>
                                                                <h6>
                                                                    Weight:{' '}
                                                                    {
                                                                        fwb.f_weight
                                                                    }
                                                                </h6>
                                                                <h6>
                                                                    Commodity:{' '}
                                                                    {
                                                                        fwb.s_goods_description
                                                                    }
                                                                </h6>
                                                                <h6>
                                                                    Shipper:{' '}
                                                                    {
                                                                        fwb.s_shipper_name1
                                                                    }
                                                                </h6>
                                                                <h6>
                                                                    Consignee:{' '}
                                                                    {
                                                                        fwb.s_consignee_name1
                                                                    }
                                                                </h6>
                                                                <h6>
                                                                    Modified:{' '}
                                                                    {moment
                                                                        .utc(
                                                                            fwb.t_modified
                                                                        )
                                                                        .format(
                                                                            'MM/DD/YYYY HH:mm:ss'
                                                                        )}
                                                                </h6>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                )}
                                                {fhl && fhl.t_modified && (
                                                    <Col md={6}>
                                                        <Card
                                                            style={{
                                                                borderRadius:
                                                                    '0.75rem',
                                                            }}
                                                        >
                                                            <CardBody>
                                                                <h6>
                                                                    HAWB:{' '}
                                                                    {s_hawb}
                                                                </h6>
                                                                <h6>
                                                                    Pieces:{' '}
                                                                    {
                                                                        fhl.i_pieces
                                                                    }
                                                                </h6>
                                                                <h6>
                                                                    Weight:{' '}
                                                                    {
                                                                        fhl.f_weight
                                                                    }
                                                                </h6>
                                                                <h6>
                                                                    Commodity:{' '}
                                                                    {
                                                                        fhl.s_nature_of_goods
                                                                    }
                                                                </h6>
                                                                <h6>
                                                                    Shipper:{' '}
                                                                    {
                                                                        fhl.s_shipper_address_name1
                                                                    }
                                                                </h6>
                                                                <h6>
                                                                    Consignee:{' '}
                                                                    {
                                                                        fhl.s_consignee_address_name1
                                                                    }
                                                                </h6>
                                                                <h6>
                                                                    Modified:{' '}
                                                                    {moment
                                                                        .utc(
                                                                            fhl.t_modified
                                                                        )
                                                                        .format(
                                                                            'MM/DD/YYYY HH:mm:ss'
                                                                        )}
                                                                </h6>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                )}
                                            </Row>
                                        </div>
                                    )}
                                    <h4 className={'mt-2'}>
                                        Current{' '}
                                        {s_payment_method === 'OVERRIDE'
                                            ? 'Overrides and Charges '
                                            : 'Charges '}
                                        for this AWB: {paymentsData.length}
                                    </h4>
                                    <ReactTable
                                        data={paymentsData}
                                        mapping={tableMapping.payments}
                                        locked={true}
                                        numRows={5}
                                        index={true}
                                        enableClick={true}
                                        handleClick={(item) =>
                                            handleModal(item)
                                        }
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <ModalManageOverride
                            modal={modal}
                            setModal={setModal}
                            user={user}
                            selectedItem={selectedItem}
                            deleteOverrideCharge={deleteOverrideCharge}
                            unprocessPayment={unprocessPayment}
                            s_payment_method={s_payment_method}
                            approvers={approvers}
                            approveOverride={approveOverride}
                            overrideAmount={overrideAmount}
                            setOverrideAmount={setOverrideAmount}
                        />
                    </Row>
                </div>
            </div>
        </AppLayout>
    );
}
