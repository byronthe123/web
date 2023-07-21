import React, {useState, useEffect, useRef} from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button, Table, Row, Col } from "reactstrap";
import {WithWizard} from 'react-albus';
import axios from 'axios';
import moment from 'moment';

import Step8Card from './Step8Card';
import Step8TableRows from './Step8TableRows'

const Step8Wizard = ({
    i_id,
    user,
    handleInput,
    handleCheckBoxes,
    b_task_knowledge_inadequate,
    s_task_knowledge_inadequate,
    b_training_inadequate,
    s_training_inadequate,
    b_technical_skills_inadequate,
    s_technical_skills_inadequate,
    b_language_proficiency,
    s_language_proficiency,
    b_teamwork_skills,
    s_teamwork_skills,
    b_other_knowledge_skill,
    s_other_knowledge_skill,
    b_physical_health,
    s_physical_health,
    b_complacency_carelessness,
    s_complacency_carelessness,
    b_distraction_awareness,
    s_distraction_awareness,
    b_disregard_safety_rules_procedures,
    s_disregard_safety_rules_procedures,
    b_unaware_safety_rules_procedures,
    s_unaware_safety_rules_procedures,
    b_failure_use_ppe,
    s_failure_use_ppe,
    b_other_individual,
    s_other_individual,
    b_equipment_not_suitable,
    s_equipment_not_suitable,
    b_equipment_not_maintained,
    s_equipment_not_maintained,
    b_equipment_unsafe_unexpected_running,
    s_equipment_unsafe_unexpected_running,
    b_equipment_other,
    s_equipment_other,
    b_no_standard_operation_procedure,
    s_no_standard_operation_procedure,
    b_unclear_insufficient_operating_procedure,
    s_unclear_insufficient_operating_procedure,
    b_lack_clear_understanding,
    s_lack_clear_understanding,
    b_communication_between_us_customer,
    s_communication_between_us_customer,
    b_communication_information_other,
    s_communication_information_other,
    b_lack_of_training,
    s_lack_of_training,
    b_lack_of_staffing,
    s_lack_of_staffing,
    b_ppe_unavailable,
    s_ppe_unavailable,
    b_required_maintenance_not_performed,
    s_required_maintenance_not_performed,
    b_directed_to_not_follow_procedure,
    s_directed_to_not_follow_procedure,
    b_organizational_norms,
    s_organizational_norms,
    b_no_formal_procedure_in_place,
    s_no_formal_procedure_in_place,
    b_other_management_organization,
    s_other_management_organization
}) => {

    const knowledgeSkillFactors = {
        title: 'Knowledge and Skill Factors',
        array: [
            {
                bool: b_task_knowledge_inadequate,
                boolId: 'b_task_knowledge_inadequate',
                string: s_task_knowledge_inadequate,
                stringId: 's_task_knowledge_inadequate',
                label: "Task Knowledge Inadequate"
            },
            {
                bool: b_training_inadequate,
                boolId: 'b_training_inadequate',
                string: s_training_inadequate,
                stringId: 's_training_inadequate',
                label: "Training Inadequate"
            },
            {
                bool: b_technical_skills_inadequate,
                boolId: 'b_technical_skills_inadequate',
                string: s_technical_skills_inadequate,
                sringId: 's_technical_skills_inadequate',
                label: "Technical Skills Inadequate"
            },
            {
                bool: b_language_proficiency,
                boolId: 'b_language_proficiency',
                sringId: s_language_proficiency,
                id: 's_language_proficiency',
                label: "Language Proficiency"
            },
            {
                bool: b_teamwork_skills,
                boolId: 'b_teamwork_skills',
                stringId: s_teamwork_skills,
                id: 's_teamwork_skills',
                label: "Teamwork Skills"
            },
            {
                bool: b_other_knowledge_skill,
                boolId: 'b_other_knowledge_skill',
                stringId: s_other_knowledge_skill,
                id: 's_other_knowledge_skill',
                label: "Other"
            }
        ]
    };

    const individualFactors = {
        title: 'Individual',
        array: [
            {
                bool: b_physical_health,
                boolId: 'b_physical_health',
                string: s_physical_health,
                stringId: 's_physical_health',
                label: "Phyiscal Health"
            },
            {
                bool: b_complacency_carelessness,
                boolId: 'b_complacency_carelessness',
                string: s_complacency_carelessness,
                stringId: 's_complacency_carelessness',
                label: "Complacency Carelessness"
            },
            {
                bool: b_distraction_awareness,
                boolId: 'b_distraction_awareness',
                string: s_distraction_awareness,
                stringId: 's_distraction_awareness',
                label: "Distraction/Awareness"
            },
            {
                bool: b_disregard_safety_rules_procedures,
                boolId: 'b_disregard_safety_rules_procedures',
                string: s_disregard_safety_rules_procedures,
                stringId: 's_disregard_safety_rules_procedures',
                label: "Disregard of Safety Rules/Procedures"
            },
            {
                bool: b_unaware_safety_rules_procedures,
                boolId: 'b_unaware_safety_rules_procedures',
                string: s_unaware_safety_rules_procedures,
                stringId: 's_unaware_safety_rules_procedures',
                label: "Unaware of Safety Rules/Procedures"
            },
            {
                bool: b_failure_use_ppe,
                boolId: 'b_failure_use_ppe',
                string: s_failure_use_ppe,
                stringId: 's_failure_use_ppe',
                label: "Failure to use PPE"
            },
            {
                bool: b_other_individual,
                boolId: 'b_other_individual',
                string: s_other_individual,
                stringId: 's_other_individual',
                label: "Other"
            }
        ]
    };

    const equipmentFactors = {
        title: 'Equipment',
        array: [
            {
                bool: b_equipment_not_suitable,
                boolId: 'b_equipment_not_suitable',
                string: s_equipment_not_suitable,
                stringId: 's_equipment_not_suitable',
                label: "Equipment not suitable"
            },
            {
                bool: b_equipment_not_maintained,
                boolId: 'b_equipment_not_maintained',
                string: s_equipment_not_maintained,
                stringId: 's_equipment_not_maintained',
                label: "Equipment not maintained"
            },
            {
                bool: b_equipment_unsafe_unexpected_running,
                boolId: 'b_equipment_unsafe_unexpected_running',
                string: s_equipment_unsafe_unexpected_running,
                stringId: 's_equipment_unsafe_unexpected_running',
                label: "Equipment unsafe/unexpected running"
            },
            {
                bool: b_equipment_other,
                boolId: 'b_equipment_other',
                string: s_equipment_other,
                stringId: 's_equipment_other',
                label: "Other"
            },
        ]
    };
    
    const communicationInformationFactors = {
        title: 'Communication/Information',
        array: [
            {
                bool: b_no_standard_operation_procedure,
                boolId: 'b_no_standard_operation_procedure',
                string: s_no_standard_operation_procedure,
                stringId: 's_no_standard_operation_procedure',
                label: "No standard operating procedure"
            },
            {
                bool: b_unclear_insufficient_operating_procedure,
                boolId: 'b_unclear_insufficient_operating_procedure',
                string: s_unclear_insufficient_operating_procedure,
                stringId: 's_unclear_insufficient_operating_procedure',
                label: "Unclear/insufficient operating procedure"
            },
            {
                bool: b_lack_clear_understanding,
                boolId: 'b_lack_clear_understanding',
                string: s_lack_clear_understanding,
                stringId: 's_lack_clear_understanding',
                label: "Lack of clear understanding"
            },
            {
                bool: b_communication_between_us_customer,
                boolId: 'b_communication_between_us_customer',
                string: s_communication_between_us_customer,
                stringId: 's_communication_between_us_customer',
                label: "Communication between US/Customer"
            },
            {
                bool: b_communication_information_other,
                boolId: 'b_communication_information_other',
                string: s_communication_information_other,
                stringId: 's_communication_information_other',
                label: "Other"
            },
        ]
    };
    
    const managementOrganizationFactors = {
        title: 'Management/Organization',
        array: [
            {
                bool: b_lack_of_training,
                boolId: 'b_lack_of_training',
                string: s_lack_of_training,
                stringId: 's_lack_of_training',
                label: "Lack of Training"
            },
            {
                bool: b_lack_of_staffing,
                boolId: 'b_lack_of_staffing',
                string: s_lack_of_staffing,
                stringId: 's_lack_of_staffing',
                label: "Lack of Staffing"
            },
            {
                bool: b_ppe_unavailable,
                boolId: 'b_ppe_unavailable',
                string: s_ppe_unavailable,
                stringId: 's_ppe_unavailable',
                label: "PPE not Available"
            },
            {
                bool: b_required_maintenance_not_performed,
                boolId: 'b_required_maintenance_not_performed',
                string: s_required_maintenance_not_performed,
                stringId: 's_required_maintenance_not_performed',
                label: "Required Maintenance not Performed"
            },
            {
                bool: b_directed_to_not_follow_procedure,
                boolId: 'b_directed_to_not_follow_procedure',
                string: s_directed_to_not_follow_procedure,
                stringId: 's_directed_to_not_follow_procedure',
                label: "Directed to not Follow Procedure"
            },
            {
                bool: b_organizational_norms,
                boolId: 'b_organizational_norms',
                string: s_organizational_norms,
                stringId: 's_organizational_norms',
                label: "Organizational Norms"
            },
            {
                bool: b_no_formal_procedure_in_place,
                boolId: 'b_no_formal_procedure_in_place',
                string: s_no_formal_procedure_in_place,
                stringId: 's_no_formal_procedure_in_place',
                label: "No Formal Procedure in Place"
            },
            {
                bool: b_other_management_organization,
                boolId: 'b_other_management_organization',
                string: s_other_management_organization,
                stringId: 's_other_management_organization',
                label: "Other"
            },
        ]
    };    

    const cardsMappingArray = [knowledgeSkillFactors, individualFactors, equipmentFactors, communicationInformationFactors, managementOrganizationFactors];

    return (
        <WithWizard render={({ next }) => (
            <div className="wizard-basic-step">
                <Form>
                    <div className='text-center'>
                    <h3 className='mb-0 pb-0'>Incident Investigation Report: Incident Factors</h3>
                        <hr></hr>
                    </div>
                    <FormGroup style={{height: '480px', overflowY: 'scroll', overflowX: 'hidden'}}>
                        <div className="form-group position-relative align-left mb-0">
                            <Row>
                                {
                                    cardsMappingArray.map((c, i) =>
                                        <Step8Card 
                                            title={c.title}
                                            factorsArray={c.array}
                                            key={i}
                                            handleCheckBoxes={handleCheckBoxes}
                                            handleInput={handleInput}
                                        />
                                    )
                                }
                            </Row>
                        </div>
                    </FormGroup>
                </Form>
            </div>
        )} />
    );
}

export default Step8Wizard;