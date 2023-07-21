import { useEffect, useState } from 'react';
import { Label, Button, Input } from 'reactstrap';
import styled from 'styled-components';
import _ from 'lodash';
import classnames from 'classnames';
import ReactTooltip from 'react-tooltip';

import Layout from '../../custom/Layout';
import MawbInput from '../../custom/MawbInput';
import Card from '../../custom/Card';
import { useAppContext } from '../../../context';
import useData from './useData';
import { formatDatetime, validateAwb } from '../../../utils';
import ReactTable from '../../custom/ReactTable';
import ActionIcon from '../../custom/ActionIcon';
import ModalManagePayments from './ModalManagePayments';
import ModalPaymentDetails from './ModalPaymentDetails';
import { ICharge, IPayment, ISelectOption } from '../../../globals/interfaces';
import { dropIn } from '../../animations';

export default function Payments() {
    const {
        user,
        appData: { charges },
    } = useAppContext();
    const [s_awb, set_s_awb] = useState('');
    const [s_hawb, set_s_hawb] = useState('');
    const {
        paymentsData,
        fwb,
        fhl,
        searchComplete,
        setSearchComplete,
        searchPayments,
        createPayment,
        deletePayment,
        searchMissingPayment
    } = useData();
    const [modalManagePayments, setModalManagePayments] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<IPayment>();
    const paymentTypeOptions: Array<ISelectOption> = []; 
    for (let i = 0; i < charges.length; i++) {
        if (
            (charges[i].s_name === 'STORAGE' && user.i_access_level >= 4) ||
            (charges[i].s_name !== 'STORAGE')
        ) {
            paymentTypeOptions.push({
                label: charges[i].s_name,
                value: charges[i].s_name,
            });
        }
    }

    const [modalDetails, setModalDetails] = useState(false);

    const handleSearchPayments = () => {
        searchPayments(s_awb, s_hawb, user.s_unit);
    };

    const handleManagePayment = () => {
        setModalManagePayments(true);
    };

    const handleModalDetails = (payment: IPayment) => {
        setSelectedPayment(payment);
        setModalDetails(true);
    }

    const enableSubmit = validateAwb(s_awb) || s_hawb.length > 2;

    const disableFhlNotFound = s_hawb.length > 0 && !fhl?.s_hawb;

    useEffect(() => {
        setSearchComplete(false);
    }, [s_awb, s_hawb]);

    return (
        <Layout>
            <h4>Payments</h4>
            <ReactTooltip />
            <Container>
                <SearchContainer>
                    <Card dropIn>
                        <SearchFieldsContainer>
                            <div>
                                <Label>MAWB</Label>
                                <MawbInput value={s_awb} onChange={set_s_awb} />
                            </div>
                            <HawbContainer>
                                <Label>HAWB</Label>
                                <Input
                                    value={s_hawb}
                                    onChange={(e: any) =>
                                        set_s_hawb(e.target.value)
                                    }
                                />
                            </HawbContainer>
                        </SearchFieldsContainer>
                        <SearchButtonContainer>
                            <MissingPaymentIcon 
                                className={classnames(
                                    'fa-duotone ',
                                    'fa-magnifying-glass-dollar',
                                    'text-success',
                                    { 'custom-disabled': !validateAwb(s_awb) }
                                )} 
                                data-tip={'Search missing payment / Sync'}
                                onClick={() => searchMissingPayment(s_awb)}
                            />
                            <Button
                                onClick={() => handleSearchPayments()}
                                disabled={!enableSubmit}
                            >
                                Search
                            </Button>
                        </SearchButtonContainer>
                    </Card>
                    {fwb && fwb.t_modified && (
                        <Card dropIn>
                            <div>
                                <p>FWB</p>
                                <p>MAWB: {fwb.s_mawb}</p>
                                <p>Pieces: {fwb.i_total_pieces}</p>
                                <p>Weight: {fwb.f_weight}</p>
                                <p>Commodity: {fwb.s_goods_description}</p>
                                <p>Shipper: {fwb.s_shipper_name1}</p>
                                <p>Consignee: {fwb.s_consignee_name1}</p>
                                <p>
                                    Modified:{' '}
                                    {formatDatetime(fwb.t_modified.toString())}
                                </p>
                            </div>
                        </Card>
                    )}
                    {fhl && fhl.s_hawb && (
                        <Card dropIn>
                            <div>
                                <p>FHL</p>
                                <p>HAWB: {fhl.s_hawb}</p>
                                <p>Pieces: {fhl.i_pieces}</p>
                                <p>Weight: {fhl.f_weight}</p>
                                <p>Commodity: {fhl.s_nature_of_goods}</p>
                                <p>Shipper: {fhl.s_shipper_address_name1}</p>
                                <p>
                                    Consignee: {fhl.s_consignee_address_name1}
                                </p>
                                <p>
                                    Modified:{' '}
                                    {formatDatetime(
                                        _.get(fhl, 't_modified.toString()', '')
                                    )}
                                </p>
                            </div>
                        </Card>
                    )}
                </SearchContainer>
                <TableContainer>
                    <AddPaymentCharge
                        searchComplete={searchComplete}
                        disableFhlNotFound={disableFhlNotFound}
                        s_hawb={s_hawb}
                        handleManagePayment={handleManagePayment}
                        paymentsData={paymentsData}
                        handleModalDetails={handleModalDetails}
                    />
                </TableContainer>
            </Container>
            <ModalManagePayments
                modal={modalManagePayments}
                setModal={setModalManagePayments}
                s_awb={s_awb}
                s_hawb={s_hawb}
                payments={paymentsData}
                charges={charges}
                fwb={fwb}
                fhl={fhl}
                user={user}
                paymentTypeOptions={paymentTypeOptions}
                selectedPayment={selectedPayment}
                createPayment={createPayment}
            />
            <ModalPaymentDetails 
                modal={modalDetails}
                setModal={setModalDetails}
                selectedPayment={selectedPayment}
                deletePayment={deletePayment}
            />
        </Layout>
    );
}

interface AddPaymentChargeProps {
    searchComplete: boolean;
    disableFhlNotFound: boolean;
    s_hawb: string;
    handleManagePayment: () => void;
    paymentsData: Array<IPayment>;
    handleModalDetails: (payment: IPayment) => void;
}

const AddPaymentCharge = ({
    searchComplete,
    disableFhlNotFound,
    s_hawb,
    handleManagePayment,
    paymentsData,
    handleModalDetails
}: AddPaymentChargeProps) => {

    if (!searchComplete) return null;

    if (disableFhlNotFound) {
        return (
            <Card dropIn>
                <TableHeader>
                    <p>No FHL found for HAWB {s_hawb}. You cannot add any payments/charges.</p>
                </TableHeader>
            </Card>
        );
    }

    return (
        <Card dropIn>
            <TableHeader>
                <p>Current Records for this MAWB</p>
                <ActionIcon
                    type={'add'}
                    onClick={handleManagePayment}
                />
            </TableHeader>
            <ReactTable
                data={paymentsData}
                mapping={[
                    {
                        name: 'Status',
                        value: 's_status',
                    },
                    {
                        name: 'HAWB',
                        value: 's_hawb',
                    },
                    {
                        name: 'Date',
                        value: 't_created',
                        datetime: true,
                        utc: true
                    },
                    {
                        name: 'Created by',
                        value: 's_created_by',
                        email: true,
                    },
                    {
                        name: 'Type',
                        value: 's_payment_method',
                    },
                    {
                        name: 'Description',
                        value: 's_payment_type',
                    },
                    {
                        name: 'Amount',
                        value: 'f_amount',
                        money: true,
                    },
                ]}
                index
                numRows={10}
                enableClick
                handleClick={handleModalDetails}
            />
        </Card>
    );
}

const Container = styled.div`
    --gap: 10px;
    display: flex;
    gap: var(--gap);
`;

const SearchContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--gap);

    p {
        margin: 0 0;
    }
`;

const SearchFieldsContainer = styled.div`
    display: flex;
    gap: var(--gap);
    justify-content: space-between;
    margin-bottom: var(--gap);
`;

const HawbContainer = styled.div`
    flex: 1;
`;

const SearchButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
`;

const MissingPaymentIcon = styled.i`
    font-size: 28px;
    &:hover {
        cursor: pointer;
    }
`;


const TableContainer = styled.div`
    flex: 3;
`;

const TableHeader = styled.div`
    display: flex;
    justify-content: space-between;
`;
