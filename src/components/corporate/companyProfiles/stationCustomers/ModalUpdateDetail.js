import React, { useState, useEffect, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Table } from 'reactstrap';
import { Formik, Field } from 'formik';
import styled from 'styled-components';
import dayjs from 'dayjs';

import dataSchema from './formikDataSchema';
import updateDetailMapping from './updateDetailMapping';
import SaveButton from '../../../custom/SaveButton';
import ModalFsnLocationCode from './ModalFsnLocationCode';
import BackButton from '../../../custom/BackButton';
import { formatEmail, formatDatetime } from '../../../../utils';
import _ from 'lodash';
import ActionIcon from '../../../custom/ActionIcon';

export default function ModalUpdateDetail ({
    modal,
    setModal,
    user,
    selectedAirlineDetail,
    setSelectedAirlineDetail,
    setSelectedStationCustomers,
    updateStationAirlineDetail
}) {

    const toggle = () => setModal(!modal);
    const [initialValues, setInitialValues] = useState({});
    const [modalFsnLocationCode, setModalFsnLocationCode] = useState(false);
    const [updateFsnLocationCode, setUpdateFsnLocationCode] = useState(false);
    const [selectedFsnLocationCode, setSelectedFsnLocationCode] = useState();

    useEffect(() => {
        const resolveInitialValues = () => {
            const { fields } = dataSchema;
            const values = {};
            for (let key in fields) {
                const val = (selectedAirlineDetail[key] === null) ? '' : selectedAirlineDetail[key];
                values[key] = val;
                if (key === 'd_switch') {   
                    values[key] = dayjs(val).add(1, 'day').format('YYYY-MM-DD');
                }
            }
            return values;
        }

        const values = resolveInitialValues(updateDetailMapping);
        setInitialValues(values);
    }, [selectedAirlineDetail]);

    const handleCreateUpdateFsnLocationCode = (update, selectedItem=null) => {
        setUpdateFsnLocationCode(update);
        setSelectedFsnLocationCode(selectedItem);
        setModalFsnLocationCode(true);
    }

    const fsnLocationCodes = _.get(selectedAirlineDetail, 'fsnLocationCodes', []);

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={dataSchema}
                enableReinitialize={true}
                validateOnMount={true}
            >
                {({ values, setFieldValue, isValid, errors }) => (
                    <Modal isOpen={modal} toggle={toggle} size={'lg'}>
                        <ModalHeader className={'d-flex'}>
                            <FooterHeaderContainer>
                                <div className={'d-flex align-items-center'}>
                                    <BackButton onClick={toggle} />
                                    <h6>Update Station Airline Mapping</h6>
                                </div>
                                <AirlineLogo src={_.get(selectedAirlineDetail, 'AirlineDatum.s_logo', '')} />
                                <div className={'d-flex align-items-center'}>
                                    <h6 className={'pr-2'}>Status</h6>
                                    <CustomField component={'select'} name='s_status' className='form-control' errors={errors}>
                                        <option value=''></option>
                                        <option value='CURRENT'>CURRENT</option>
                                        <option value='TERMINATED'>TERMINATED</option>
                                        <option value='INACTIVE'>INACTIVE</option>
                                    </CustomField>
                                </div>
                            </FooterHeaderContainer>
                        </ModalHeader>
                        <ModalBody className={'d-flex'}>
                            <ImportRulesContainerOuter>
                                <ImportRulesTitle>Import Rules</ImportRulesTitle>
                                <ImportRulesContainerInner>
                                    <FormContainer>
                                        <CustomFormGroup>
                                            <Label>Current Import ISC</Label>
                                            <CustomField type='number' name='f_import_isc_cost' className='form-control' errors={errors} />
                                        </CustomFormGroup>
                                        <CustomFormGroup>
                                            <Label>Current charge per KG</Label>
                                            <CustomField type='number' name='f_import_per_kg' className='form-control' errors={errors} />
                                        </CustomFormGroup>
                                        <CustomFormGroup>
                                            <Label>Current minimum Charge</Label>
                                            <CustomField type='number' name='f_import_min_charge' className='form-control' errors={errors} />
                                        </CustomFormGroup>
                                        <CustomFormGroup>
                                            <Label>Switch Dates for ISC rules</Label>
                                            <CustomField type='date' name='d_switch' className='form-control' errors={errors} />
                                        </CustomFormGroup>
                                        <CustomFormGroup>
                                            <Label>Previous Import ISC</Label>
                                            <CustomField type='number' name='f_import_isc_cost_previous' className='form-control' errors={errors} />
                                        </CustomFormGroup>
                                        <CustomFormGroup>
                                            <Label>Previous charge per KG</Label>
                                            <CustomField type='number' name='f_import_per_kg_previous' className='form-control' errors={errors} />
                                        </CustomFormGroup>
                                        <CustomFormGroup>
                                            <Label>Previous minumum Charge</Label>
                                            <CustomField type='number' name='f_import_min_charge_previous' className='form-control' errors={errors} />
                                        </CustomFormGroup>
                                    </FormContainer>
                                    <FormContainer>
                                        <CustomFormGroup>
                                            <Label>Import Distribution Email</Label>
                                            <CustomField type='text' name='s_import_distribution_email' className='form-control' errors={errors} />
                                        </CustomFormGroup>
                                        <CustomFormGroup>
                                            <Label>Add First Free Day</Label>
                                            <CustomField type='number' name='i_add_first_free_day' className='form-control' errors={errors} />
                                        </CustomFormGroup>
                                        <CustomFormGroup>
                                            <Label>Add Second Free Day</Label>
                                            <CustomField type='number' name='i_add_second_free_day' className='form-control' errors={errors} />
                                        </CustomFormGroup>
                                        <CustomFormGroup>
                                            <Label>Firms Code</Label>
                                            <CustomField type='text' maxLength='5' name='s_firms_code' className='form-control' errors={errors} />
                                        </CustomFormGroup>
                                        {
                                            selectedAirlineDetail &&
                                                <CustomFormGroup className={selectedAirlineDetail.s_status !== 'CURRENT' && 'custom-disabled'}>
                                                    <div className={'d-flex justify-content-between'}>
                                                        <Label>FSN Location Codes</Label>
                                                        <ActionIcon 
                                                            type={'add'}
                                                            size={20}
                                                            onClick={() => handleCreateUpdateFsnLocationCode(false)}
                                                            disabled={fsnLocationCodes.length === 5}
                                                        />
                                                    </div>
                                                    <Table>
                                                        <thead></thead>
                                                        <tbody>
                                                        {
                                                            fsnLocationCodes.map(locationCode => (
                                                                <tr className={'d-flex justify-content-between'}>
                                                                    <td>{locationCode.s_code}</td>
                                                                    <td>
                                                                        <ActionIcon 
                                                                            type={'update'} 
                                                                            size={18} 
                                                                            onClick={() => handleCreateUpdateFsnLocationCode(true, locationCode)}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                        </tbody>
                                                    </Table>
                                                </CustomFormGroup> 
                                        }
                                    </FormContainer>
                                </ImportRulesContainerInner>
                            </ImportRulesContainerOuter>
                            <ServiceLevelAgreementsContainer>
                                <h6 className={'font-weight-bold font-italic'}>Service Level Agreements</h6>
                                <FormContainer>
                                    <CustomFormGroup>
                                        <Label>Import SLA CAO Breakdown Min</Label>
                                        <CustomField type='text' name='i_import_sla_cao_breakdown_min' className='form-control' errors={errors} />
                                    </CustomFormGroup>
                                    <CustomFormGroup>
                                        <Label>Import SLA PAX Breakdown Min</Label>
                                        <CustomField type='text' name='i_import_sla_pax_breakdown_min' className='form-control' errors={errors} />
                                    </CustomFormGroup>
                                    <CustomFormGroup>
                                        <Label>Export SLA CAO Cut-off Min</Label>
                                        <CustomField type='text' name='i_export_sla_cao_cut_off_min' className='form-control' errors={errors} />
                                    </CustomFormGroup>
                                    <CustomFormGroup>
                                        <Label>Export SLA PAX Cut-off Min</Label>
                                        <CustomField type='text' name='i_export_sla_pax_cut_off_min' className='form-control' errors={errors} />
                                    </CustomFormGroup>
                                    <CustomFormGroup>
                                        <Label>Export SLA CAO UWS Min</Label>
                                        <CustomField type='text' name='i_export_sla_cao_uws_min' className='form-control' errors={errors} />
                                    </CustomFormGroup>
                                    <CustomFormGroup>
                                        <Label>Export PAX UWS Min</Label>
                                        <CustomField type='text' name='i_export_pax_uws_min' className='form-control' errors={errors} />
                                    </CustomFormGroup>
                                </FormContainer>
                            </ServiceLevelAgreementsContainer>
                        </ModalBody>
                        <ExpandedFooter>
                            <FooterContentContainer>
                                <Label>Created by {formatEmail(selectedAirlineDetail.s_created_by)} at {formatDatetime(selectedAirlineDetail.t_created)} and modified by {formatEmail(selectedAirlineDetail.s_modified_by)} at {formatDatetime(selectedAirlineDetail.t_modified)}</Label>
                                <SaveButton 
                                    enableSave={isValid}
                                    handleSave={() => updateStationAirlineDetail(values)}
                                />
                            </FooterContentContainer>
                        </ExpandedFooter>
                    </Modal>
                )}
            </Formik>
            <ModalFsnLocationCode 
                modal={modalFsnLocationCode}
                setModal={setModalFsnLocationCode}
                user={user}
                update={updateFsnLocationCode}
                selectedAirlineDetail={selectedAirlineDetail}
                setSelectedAirlineDetail={setSelectedAirlineDetail}
                setSelectedStationCustomers={setSelectedStationCustomers}
                selectedItem={selectedFsnLocationCode}
            />
        </>
    );
}

const FooterHeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const ImportRulesContainerOuter = styled.div`
    width: 64%;

    @media (max-width: 1000px) {
        width: 48%;
    }
`;

const ImportRulesTitle = styled.h6`
    font-weight: bold;
    font-style: italic;
    padding-left: 34px;

    @media (max-width: 1000px) {
        padding-left: 12px;
    }
`;

const ImportRulesContainerInner = styled.div`
    display: flex;
    gap: 5px;
    justify-content: space-evenly;
    flex-wrap: wrap;
`;

const ServiceLevelAgreementsContainer = styled.div``;

const FormContainer = styled.div``;

const CustomFormGroup = styled(FormGroup)`
    flex: 0 0 207px;
`;

const CustomField = styled(Field)`
    border: ${p => (p.errors && p.errors[p.name]) && '2px solid red'};
`;

const AirlineLogo = styled.img`
    width: 200px;
    height: auto;

    @media (max-width: 1000px) {
        display: none;
    }
`;

const ExpandedFooter = styled(ModalFooter)`
    width: 100%;
`;

const FooterContentContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;