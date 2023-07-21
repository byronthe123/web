import styled from "styled-components";
import { FormGroup as BtFormGroup, Label, Input, Table } from 'reactstrap';
import {
    UseFormReturn,
    UseFormSetValue
  } from "react-hook-form";
  
import FormGroup from "../../custom/hookForm/FormGroup";
import { ICharge, IPayment } from "../../../globals/interfaces";
import { useEffect, useMemo } from "react";
import { formatCost } from "../../../utils";
import { CheckFormGroup, CustomCheckBox } from '../../custom/hookForm/Checkbox';
import { PaymentMethod, Totals } from './interfaces';
import FormError from "../../custom/FormError2";


interface Props {
    totals: Totals;
    register: any;
    errors: any;
    watch: (name: string) => any;
}

export default function PaymentForm ({
    totals,
    register,
    errors,
    watch
}: Props) {

    const s_type = watch('counterMoney.s_type');

    return (
        <div>
            <TypeContainer className={totals.due < 1 ? 'custom-disabled' : ''}>
                <Label>Type: <FormError name={'counterMoney.s_type'} errors={errors} /></Label>
                <RadioButtonsContainer>
                    <BtFormGroup>
                        <CheckFormGroup>
                            <CustomCheckBox 
                                {...register('counterMoney.s_type')}
                                type={'radio'}
                                value={'CASH'}
                            />
                            <Label check>Cash</Label>
                        </CheckFormGroup>
                    </BtFormGroup>
                    <BtFormGroup>
                        <CheckFormGroup>
                            <CustomCheckBox 
                                {...register('counterMoney.s_type')}
                                type={'radio'}
                                value={'CHECK'}
                            />
                            <Label check>Check</Label>
                        </CheckFormGroup>
                    </BtFormGroup>
                    {
                        s_type === 'CHECK' &&
                        <FormGroup 
                            label={'Check Number'}
                            name={'counterMoney.s_payment_reference'}
                            register={register}
                            errors={errors}
                        />
                    }
                </RadioButtonsContainer>
            </TypeContainer>
            <CustomTable>
                <thead></thead>
                <tbody>
                    <tr>
                        <td>Charges</td>
                        <td className={'text-danger'}>{formatCost(totals.charged)}</td>
                    </tr>
                    <tr>
                        <td>Counter Fee</td>
                        <td className={'text-danger'}>{formatCost(totals.counterFee)}</td>
                    </tr>
                    <tr>
                        <td>Payments</td>
                        <td className={'text-success'}>({formatCost(totals.paid)})</td>
                    </tr>
                    <tr>
                        <td>Overrides</td>
                        <td className={'text-success'}>({formatCost(totals.overrides)})</td>
                    </tr>
                    <tr>
                        <td>Amount Due (I am collecting this)</td>
                        <td>{formatCost(totals.due)}</td>
                    </tr>
                </tbody>
            </CustomTable>
        </div>
    );
}

const TypeContainer = styled.div`
`;

const RadioButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 50px;
`;

const CustomTable = styled(Table)`
    tr td:nth-child(2) {
        text-align: right;
    }
`;