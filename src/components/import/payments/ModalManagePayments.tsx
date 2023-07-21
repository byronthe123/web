import React, { useEffect, useMemo, useState } from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup as BtFormGroup } from 'reactstrap';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import classnames from 'classnames';
import { yupResolver } from '@hookform/resolvers/yup';

import BackButton from '../../custom/BackButton';
import ActionIcon from '../../custom/ActionIcon';
import { formatMawb, getTsDate } from '../../../utils';
import { ICharge, IFHL, IFWB, IMap, IPayment, ISelectOption, IUser } from '../../../globals/interfaces';
import FormGroup from '../../custom/hookForm/FormGroup';
import FormError from '../../custom/FormError2';
import { createSchema } from './utils';
import PaymentForm from './PaymentForm';
import { PaymentMethod } from './interfaces';
import useTotals from './useTotals';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    s_awb: string;
    s_hawb: string;
    payments: Array<IPayment>;
    charges: Array<ICharge>;
    fwb: IFWB | undefined,
    fhl: IFHL | undefined,
    user: IUser;
    paymentTypeOptions: Array<ISelectOption>;
    selectedPayment: IPayment | undefined;
    createPayment: (data: any) => Promise<boolean>;
}

export default function ModalManagePayments ({
    modal,
    setModal,
    s_awb,
    s_hawb,
    payments,
    charges,
    fwb,
    fhl,
    user,
    paymentTypeOptions,
    createPayment
}: Props) {

    const [loading, setLoading] = useState(false);

    const paymentMethods: Array<PaymentMethod> = useMemo(() => {
        const types: Array<PaymentMethod> = ['CHARGE', 'PAYMENT'];
        if (user.i_access_level >= 3) {
            types.push('OVERRIDE');
        }
        return types;
    }, [user.i_access_level]);
    const totals = useTotals(payments, charges);

    const {
        handleSubmit,
        trigger,
        reset,
        control,
        register,
        watch,
        setValue,
        formState: { isValid, isDirty, errors }
    } = useForm({
        mode: 'all',
        resolver: yupResolver(createSchema)
    });

    const s_payment_method = watch('s_payment_method');
    const f_amount = watch('f_amount');

    useEffect(() => {
        const now = getTsDate();
        reset({
            s_awb,
            s_hawb,
            s_payment_method: 'CHARGE',
            s_status: 'ACTIVE',
            s_unit: user.s_unit,
            s_cs_id: 'EOS',
            t_created: now,
            t_created_date: now,
            s_created_by: user.s_email,
            t_modified: now,
            s_modified_by: user.s_email,
            other: {
                username: user.displayName,
                fhl,
                fwb
            }          
        });
        trigger();
    }, [
        modal, 
        reset, 
        trigger, 
        user.s_email, 
        s_awb, 
        s_hawb, 
        user.s_unit, 
        user.displayName, 
        fhl, 
        fwb
    ]);

    useEffect(() => {
        if (s_payment_method === 'OVERRIDE') {
            setValue('b_override_approved', f_amount < 1001);
        } else {
            setValue('b_override_approved', null);
        }
    }, [s_payment_method, f_amount, setValue]);

    const handleSelectPaymentMethod = (type: PaymentMethod, onChange: any) => {
        onChange(type);
        if (type === 'PAYMENT') {
            setValue('s_payment_type', 'COUNTER', {
                shouldValidate: true
            });
            setValue('f_amount', totals.due, {
                shouldValidate: true
            });

            const now = getTsDate();
            const counterMoney: IMap<any> = {
                s_mawb: s_awb,
                s_hawb,
                s_unit: user.s_unit,
                f_amount: totals.due,
                b_received: false,
                s_status: 'PROCESSED',
                s_created_by: user.s_email,
                t_created: now,
                s_modified_by: user.s_email,
                t_modified: now,
                d_payment_date: now
            }
            for (const key in counterMoney) {
                setValue(`counterMoney.${key}`, counterMoney[key], {
                    shouldValidate: true
                });
            }

            const counterFee = charges.find(c => c.s_name === 'COUNTER FEE');
            setValue('counterFee.f_amount', (counterFee?.f_multiplier || 20) * -1, {
                shouldValidate: true
            });
            setValue('counterFee.s_payment_method', 'CHARGE', {
                shouldValidate: true
            });
            setValue('counterFee.s_payment_type', 'COUNTER FEE', {
                shouldValidate: true
            });
        } else {
            setValue('s_payment_type', '', {
                shouldValidate: true
            });
            setValue('f_amount', '', {
                shouldValidate: true
            });
        }
    }

    const handleSelectOnChange = (
        option: ISelectOption, 
        formChange: (value: any) => void
    ) => {
        formChange(option.value);
    }

    const handleCreatePayment = async (data: any) => {
        setLoading(true);
        const result = await createPayment(data);
        if (result) {
            setModal(false);
        }
        setLoading(false);
    }

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>Create Record: MAWB {formatMawb(s_awb)}, HAWB {s_hawb}</h4>
                </HeaderContainer>
            </ModalHeader>
            <ModalBody>
                <Container>
                    <DataContainer>
                        <PaymentTypesContainer>
                            <Controller 
                                control={control}
                                name={'s_payment_method'}
                                render={({ field: { value, onChange } }) => (
                                    <>
                                        {
                                            paymentMethods.map((type, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleSelectPaymentMethod(type, onChange)}
                                                    className={classnames(
                                                        'btn', 
                                                        value === type ? 
                                                            'btn-primary' : 
                                                            'btn-grey'
                                                    )}
                                                >
                                                    {type}
                                                </button>
                                            ))
                                        }
                                    </>
                                )}      
                            />
                        </PaymentTypesContainer>
                    </DataContainer>
                    <FormContainer>
                        {
                            s_payment_method === 'PAYMENT' ? 
                            <PaymentForm 
                                totals={totals}
                                register={register}
                                errors={errors}
                                watch={watch}
                            /> :
                            <>
                                <BtFormGroup>
                                    <Label>Type <FormError name={'s_payment_type'} errors={errors} /></Label>
                                    <Controller 
                                        control={control}
                                        name={'s_payment_type'}
                                        render={({ field: { value: formValue, onChange: formChange } }) => (
                                            <Select 
                                                value={{
                                                    label: formValue,
                                                    value: formValue
                                                }}
                                                options={paymentTypeOptions}
                                                onChange={(option: ISelectOption) => handleSelectOnChange(option, formChange)}
                                            />
                                        )}
                                    />
                                </BtFormGroup>
                                <AmountContainer>
                                    <FormGroup 
                                        label={'Amount'}
                                        name={'f_amount'}
                                        register={register}
                                        type={'number'}
                                        errors={errors}
                                    />
                                </AmountContainer>
                                <FormGroup 
                                    label={'Reason'}
                                    name={'s_notes'}
                                    register={register}
                                    type={'textarea'}
                                    errors={errors}
                                />
                            </>
                        }
                    </FormContainer>
                </Container>
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    <FooterButtonsContainer>
                        <ActionIcon 
                            type={'save'} 
                            disabled={!isValid || !isDirty} 
                            onClick={handleSubmit(handleCreatePayment)}
                            loading={loading}
                        />
                    </FooterButtonsContainer>
                </FooterContentContainer>
            </ExpandedFooter>
        </Modal>
    );
}

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const ExpandedFooter = styled(ModalFooter)`
    width: 100%;
`;

const FooterContentContainer = styled.div`
    width: 100%;
`;

const FooterButtonsContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
`;

const Container = styled.div`
    --gap: 10px;
    display: flex;
    gap: 30px;
`;

const DataContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const PaymentTypesContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--gap);
`;

const FormContainer = styled.div`
    flex: 3;
`;

const AmountContainer = styled.div`
    width: 200px;
`;