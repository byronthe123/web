import React, { useEffect, useState } from 'react';
import { Formik, Field } from 'formik';
import {
    Button,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";
import styled from 'styled-components';

import ActionIcon from '../../../custom/ActionIcon';
import dataSchema from './dataSchema';
import BackButton from '../../../custom/BackButton';


const ModalEditStations = ({
    open, 
    handleModal,
    item,
    updateStationsInfo,
    createCorpStation,
    modalTypeNew,
    deleteCorpStation,
    doors,
    s_dock_door,
    set_s_dock_door,
    addCorpDockDoor,
    removeCorpDockDoor
}) => {

    const [initialValues, setInitialValues] = useState({});
    const toggle = () => handleModal(false);

    useEffect(() => {
        const values = {};
        for (let key in dataSchema.fields) {
            values[key] = modalTypeNew ? '' : item && item[key];
        }
        console.log(values);
        setInitialValues(values);
    }, [open, item, modalTypeNew]);

    const handleSubmit = (values) => {
        if (modalTypeNew) {
            createCorpStation(values);
        } else {
            updateStationsInfo(values);
        }
    }

    return (
        <CustomModal
            isOpen={open}
            toggle={toggle}
        >
            <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={dataSchema}
                validateOnMount={true}
            >
                {({ values, isValid, errors }) => (
                    <>
                        <ModalHeader className={'d-flex'}>
                            <BackButton 
                                classNames='pr-2' 
                                onClick={toggle}
                            />
                            <h1>{modalTypeNew ? 'Create New Station' : 'Update Station Info.'}</h1>
                        </ModalHeader>
                        <ModalBody>
                            <FormContainer>
                                <CustomFormGroup>
                                    <Label className='mr-2'>Unit</Label>
                                    <CustomField type="text" name="s_unit" className="form-control" errors={errors} />
                                </CustomFormGroup>
                                <CustomFormGroup>
                                    <Label className='mr-2'>Phone</Label>
                                    <CustomField type="text" name="s_phone" className="form-control" errors={errors} />
                                </CustomFormGroup>
                                <CustomFormGroup>
                                    <Label className='mr-2'>Firms Code</Label>
                                    <CustomField type="text" name="s_firms_code" className="form-control" errors={errors} />
                                </CustomFormGroup>
                                <CustomFormGroup>
                                    <Label className='mr-2'>Weekday Hours</Label>
                                    <CustomField type="text" name="s_weekday_hours" className="form-control" errors={errors} />
                                </CustomFormGroup>
                                <CustomFormGroup>
                                    <Label className='mr-2'>Weekend Hours</Label>
                                    <CustomField type="text" name="s_weekend_hours" className="form-control" errors={errors} />
                                </CustomFormGroup>
                                <CustomFormGroup>
                                    <Label className='mr-2'>Airport</Label>
                                    <CustomField type="text" name="s_airport" className="form-control" errors={errors} />
                                </CustomFormGroup>
                                <CustomFormGroup>
                                    <Label className='mr-2'>Airport Code</Label>
                                    <CustomField type="text" name="s_airport_code" className="form-control" errors={errors} />
                                </CustomFormGroup>
                                <CustomFormGroup>
                                    <Label className='mr-2'>Import ISC</Label>
                                    <CustomField type="number" name="f_import_isc_cost" className="form-control" errors={errors} />
                                </CustomFormGroup>
                                <CustomFormGroup>
                                    <Label className='mr-2'>Import per KG</Label>
                                    <CustomField type="number" name="f_import_per_kg" className="form-control" errors={errors} />
                                </CustomFormGroup>
                                <CustomFormGroup>
                                    <Label className='mr-2'>Import min Charge</Label>
                                    <CustomField type="number" name="f_import_min_charge" className="form-control" errors={errors} />
                                </CustomFormGroup>
                                <CustomFormGroup>
                                    <Label className='mr-2'>Add Storage First Free Day</Label>
                                    <CustomField type="number" name="i_add_first_free_day" className="form-control" errors={errors} />
                                </CustomFormGroup>
                                <CustomFormGroup>
                                    <Label className='mr-2'>Add Storage Second Free Day</Label>
                                    <CustomField type="number" name="i_add_second_free_day" className="form-control" errors={errors} />
                                </CustomFormGroup>
                                <CustomFormGroup>
                                    <Label className='mr-2'>Address</Label>
                                    <CustomField component="textarea" name="s_address" className="form-control" errors={errors} />
                                </CustomFormGroup>
                                <CustomFormGroup>
                                    <Label className='mr-2'>Map Link</Label>
                                    <CustomField component="textarea" name="s_map_link" className="form-control" errors={errors} />
                                </CustomFormGroup>
                            </FormContainer>
                            {
                                !modalTypeNew &&
                                <div>
                                    <AddDoorContainer>
                                        <Label className='mr-2' style={{display: 'inline'}}>Dock Doors:</Label>
                                        <Input value={s_dock_door} onChange={(e) => set_s_dock_door(e.target.value)} type='text'  style={{display: 'inline', width: '200px'}} />
                                        <Button color='info' style={{display: 'inline'}} className='ml-2' onClick={() => addCorpDockDoor()} disabled={s_dock_door.length < 1}>Add Door</Button>
                                    </AddDoorContainer>
                                    <DoorsContainer>
                                        {
                                                doors.map((d, i) => d.s_unit === item.s_unit && 
                                                <Button color='danger' className='my-2 mx-2' key={i}>
                                                    {d.s_dock_door}
                                                    <i onClick={(e) => removeCorpDockDoor(e, d.id)} style={{fontSize: '20px'}} className='pl-2 far fa-times-circle'/>
                                                </Button>
                                            )
                                        }
                                    </DoorsContainer>
                                </div>
                            }
                        </ModalBody>
                        <ModalFooter className={'w-100'}>
                            <div className={'w-100 d-flex justify-content-between'}>
                                <ActionIcon 
                                    type={'delete'}
                                    onClick={() => deleteCorpStation(item.id)}
                                />
                                <ActionIcon 
                                    type={'save'} 
                                    onClick={() => handleSubmit(values)}
                                    disabled={!isValid}
                                />
                            </div>
                        </ModalFooter>
                    </>
                )}
            </Formik>
        </CustomModal>
    );
}

const CustomModal = styled(Modal)`
    max-width: 1000px !important;
`;

const AddDoorContainer = styled.div`
    display: flex;
    align-items: center;
`;

const DoorsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    max-height: 172px;
    overflow-y: scroll;
`;

const FormContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const CustomFormGroup = styled(FormGroup)`
    flex: 1 1 300px;
`;

const CustomField = styled(Field)`
    /* border: ${({ meta }) => console.log(meta)}; */
    border: ${p => (p.errors && p.errors[p.name]) && '1px solid red'};
`;

export default ModalEditStations;