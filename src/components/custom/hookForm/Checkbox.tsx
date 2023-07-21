import styled from "styled-components";

export const CheckBoxContainer = styled.div`
    display: flex;
`;

export const CheckFormGroup = styled.div`
    display: flex;
    align-items: center;
`;

export const CustomCheckBox = styled.input.attrs({
    className: 'form-control',
})`
    width: 30px;
`;

{/* <BootstrapFormGroup>
<Label>Weight Unit</Label>
<CheckBoxContainer>
    <CheckFormGroup>
        <CustomCheckBox type={'radio'} value={'KG'} {...register('s_weight_unit')} className={'form-control'} />
        <Label check>   
            KG
        </Label>
    </CheckFormGroup>
    <CheckFormGroup>
        <CustomCheckBox type={'radio'} value={'LB'}  {...register('s_weight_unit')} className={'form-control'} />
        <Label check>   
            LB
        </Label>
    </CheckFormGroup>
</CheckBoxContainer>
</BootstrapFormGroup> */}