import React, { Component } from "react";
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput } from "reactstrap";
import { Wizard, WithWizard, Steps, Step } from 'react-albus';
import {TopNavigation} from './TopNavigation';
import {BottomNavigation} from './BottomNavigation';
import { NotificationContainer } from 'react-notifications';

import AllReports from './AllReports';
import Step1Wizard from './Step1Wizard';
import Step2Wizard from './Step2Wizard';
import Step3Wizard from './Step3Wizard';
import Step4Wizard from './Step4Wizard';
import Step5Wizard from './Step5Wizard';
import Step6Wizard from './Step6Wizard';
import Step7Wizard from './Step7Wizard';
import Step8Wizard from './Step8Wizard';
import Step9Wizard from './Step9Wizard';
import Step10Wizard from './Step10Wizard';
import Step11Wizard from './Step11Wizard';

class SmsWizard extends Component {
    constructor(props) {
      super(props);
      this.onClickNext = this.onClickNext.bind(this);
      this.onClickPrev = this.onClickPrev.bind(this);
      this.topNavClick = this.topNavClick.bind(this);
    };
  
    topNavClick(stepItem, push) {
        console.log(stepItem);
        //console.log(this.state.screened);
        if(this.props.resolveReportStartComplete()) {
            if(stepItem.id === 'step2') {
                if(this.props.b_screened !== null) {
                    push(stepItem.id);
                }
            } else if(stepItem.id === 'step3') {
                if(this.props.screeningType !== null) {
                    push(stepItem.id);
                }
            } else {
                push(stepItem.id);
            }
        }
    };
  
    onClickNext(goToNext, steps, step) {
        console.log('clicked');
        console.log(step);
      step.isDone = true;
      if (steps.length - 1 <= steps.indexOf(step)) {
        return;
      }
      goToNext();
    //   if(step.id === 'step5') {
    //     alert('TESTING');
    //   }
    };
  
    onClickPrev(goToPrev, steps, step) {
      if (steps.indexOf(step) <= 0) {
        return;
      }
      goToPrev();
    };

    render() {
        const {
            displaySubmenu,
            saveReady,
            i_id,
            user,
            reports,
            employees,
            baseReportEmployeesInfo,
            handleSelectEmployee,
            handleSelectEmployeeWithId,
            selectedEmloyee,
            selectReport,
            selectedReportId,
            startNewReport,
            fileInputKey, 
            getFiles, 
            saveSmsMedia, 
            deleteSmsMedia,
            updateComments, 
            handleInput, 
            handleCheckBoxes, 
            s_station, 
            s_customer, 
            t_incident, 
            s_incident_location,
            s_investigation_conducted_by, 
            s_investigation_conducted_by_title, 
            d_investigation_conducted, 
            s_investigation_approved_by, 
            s_investigation_approved_by_title, 
            d_investigation_approved,
            b_evidence_witness_statements,
            b_evidence_training_records,
            b_evidence_drug_alcohol_testing_docs,
            b_evidence_external_reports,
            b_evidence_photos,
            b_evidence_cctv_footage,
            b_evidence_other, 
            s_incident_reference,
            s_incident_type,
            d_incident_date,
            s_incident_station,
            s_employee_shift_start,
            i_employee_hours_on_duty,
            i_employee_hours_worked_in_72,
            s_employee_regular_days_off,
            s_employee_injury_type,
            s_aircraft_damage_type,
            s_airline,
            s_airline_registration,
            s_third_party_incident,
            s_environmental_incident,
            s_vehicle_accident,
            s_incident_summary,
            s_post_incident_actions,
            resolveReportStartComplete,
            handleEmployeeInjury,
            handleAircraftDamage,
            saveReport,
            saveReportWithNotification,
            s_name,
            s_job_title,
            s_department,
            d_date_of_hire,
            newUserModal,
            handleNewUserModal,
            editUserModal,
            handleEditUserModal,
            launchModalCreateUser,
            handleDateOfHire,
            enableCreateUser,
            handleCreateUser,
            handleUpdateUser,
            handleDeleteUser,
            mediaArray,
            s_training_element,
            d_date_of_training,
            d_next_training_date,
            checkEnableSavingTrainingRecord,
            createEmployeeTrainingRecord,
            editTrainingRecordModal,
            edit_s_training_element,
            edit_d_date_of_training,
            edit_d_next_training_date,
            handleEditTrainingRecordModal,
            editEmployeeTrainingRecord,
            deleteTrainingRecord,
            deleteTrainingRecordModalOpen,
            handleDeleteTrainingRecordModal,
            add_s_incident_title,
            add_s_incident_description,
            add_t_incident,
            add_s_incident_location,
            add_s_corrective_disciplinary_action,
            add_s_modified_by,
            add_t_modified,
            createSafetyRecord,
            editSafetyRecordModalOpen,
            handleEditSafetyRecordModal,
            edit_s_incident_title,
            edit_s_incident_description,
            edit_t_incident,
            edit_s_incident_location,
            edit_s_corrective_disciplinary_action,
            saveSafetyRecordEdits,
            deleteSafetyRecordModalOpen,
            handleDeleteSafetyRecordModal,
            deleteSafetyRecord,
            addReportEmployee,
            removeReportEmployee,
            updateBaseReportEmployeesInfo,
            baseApiUrl,
            headerAuthCode,
            createSuccessNotification,
            //Step7
            s_weather_environment_description,
            s_weather_similar_incidents_description,
            //Step8
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
            s_other_management_organization,
            manageIncidentFactors,
            //Step 9
            rcaFindingsArray,
            updateRcaFindingsArray,
            addRcaFindingsArray,
            deleteRcaFindingsArray,
            manageRootCauseAnalysisFindings,
            //Step 10
            s_incident_cause,
            s_investigation_conclusion,
            whyFactorsArray,
            updateWhyFactorsArray,
            addWhyFactorsArray,
            deleteWhyFactorsArray,
            manageSmsWhyMethodologyFactors
        } = this.props;
        return (
            <Card>
                <CardBody className="wizard wizard-default pb-3">
                    <Wizard>
                        <TopNavigation 
                            className='justify-content-center mb-3' 
                            disableNav={false} 
                            topNavClick={this.topNavClick} 
                            saveReport={saveReport} 
                            manageIncidentFactors={manageIncidentFactors}
                            manageRootCauseAnalysisFindings={manageRootCauseAnalysisFindings}
                            manageSmsWhyMethodologyFactors={manageSmsWhyMethodologyFactors}
                            selectedReportId={selectedReportId}
                            saveReady={saveReady}
                        />
                        <NotificationContainer/>
                        <Steps>
                            <Step id='step0' name={'All Reports'} desc={'All Reports'}>
                                <AllReports 
                                    reports={reports}
                                    selectReport={selectReport}
                                    selectedReportId={selectedReportId}
                                    onClickNext={this.onClickNext}
                                    startNewReport={startNewReport}
                                />
                            </Step>
                            <Step id="step1" name={'Step 1'} desc={'Start'}>
                                <Step1Wizard 
                                    handleInput={handleInput} 
                                    handleCheckBoxes={handleCheckBoxes}
                                    s_station ={s_station}
                                    s_customer ={s_customer}
                                    t_incident ={t_incident}
                                    s_incident_location={s_incident_location}
                                    s_investigation_conducted_by ={s_investigation_conducted_by}
                                    s_investigation_conducted_by_title ={s_investigation_conducted_by_title}
                                    d_investigation_conducted ={d_investigation_conducted}
                                    s_investigation_approved_by ={s_investigation_approved_by}
                                    s_investigation_approved_by_title ={s_investigation_approved_by_title}
                                    d_investigation_approved={d_investigation_approved}
                                    b_evidence_witness_statements={b_evidence_witness_statements}
                                    b_evidence_training_records={b_evidence_training_records}
                                    b_evidence_drug_alcohol_testing_docs={b_evidence_drug_alcohol_testing_docs}
                                    b_evidence_external_reports={b_evidence_external_reports}
                                    b_evidence_photos={b_evidence_photos}
                                    b_evidence_cctv_footage={b_evidence_cctv_footage}
                                    b_evidence_other={b_evidence_other}
                                    resolveReportStartComplete={resolveReportStartComplete}
                                    saveReport={saveReport} 
                                />
                            </Step>

                            <Step id='step2' name={'Step 2'} desc={'Incident Details'}>
                                <Step2Wizard 
                                    employees={employees}
                                    handleSelectEmployee={handleSelectEmployee}
                                    selectedEmloyee={selectedEmloyee}
                                    handleInput={handleInput}
                                    saveReport={saveReport} 
                                    saveReportWithNotification={saveReportWithNotification}
                                    handleEmployeeInjury={handleEmployeeInjury}
                                    handleAircraftDamage={handleAircraftDamage}
                                    s_incident_reference={s_incident_reference}
                                    s_incident_type={s_incident_type}
                                    d_incident_date={d_incident_date}
                                    s_station={s_station}
                                    s_incident_station={s_incident_station}
                                    s_employee_shift_start={s_employee_shift_start}
                                    i_employee_hours_on_duty={i_employee_hours_on_duty}
                                    i_employee_hours_worked_in_72={i_employee_hours_worked_in_72}
                                    s_employee_regular_days_off={s_employee_regular_days_off}
                                    s_employee_injury_type={s_employee_injury_type}
                                    s_aircraft_damage_type={s_aircraft_damage_type}
                                    s_airline={s_airline}
                                    s_airline_registration={s_airline_registration}
                                    s_third_party_incident={s_third_party_incident}
                                    s_environmental_incident={s_environmental_incident}
                                    s_vehicle_accident={s_vehicle_accident}
                                    s_incident_summary={s_incident_summary}
                                    s_post_incident_actions={s_post_incident_actions}
                                    s_name={s_name}
                                    s_job_title={s_job_title}
                                    s_department={s_department}
                                    d_date_of_hire={d_date_of_hire}
                                    newUserModal={newUserModal}
                                    handleNewUserModal={handleNewUserModal}
                                    editUserModal={editUserModal}
                                    handleEditUserModal={handleEditUserModal}
                                    launchModalCreateUser={launchModalCreateUser}
                                    handleDateOfHire={handleDateOfHire}
                                    enableCreateUser={enableCreateUser}
                                    handleCreateUser={handleCreateUser}
                                    handleUpdateUser={handleUpdateUser}
                                />
                            </Step>

                            <Step id="step3" name={"Step 3"} desc={"Media"}>
                                <Step3Wizard 
                                    getFiles={getFiles} 
                                    fileInputKey={fileInputKey} 
                                    saveSmsMedia={saveSmsMedia} 
                                    deleteSmsMedia={deleteSmsMedia}
                                    updateComments={updateComments} 
                                    saveReport={saveReport}
                                    mediaArray={mediaArray}
                                />
                            </Step>

                            <Step id='step4' name={'Step 4'} desc={'Employee Details'}>
                                <Step4Wizard 
                                    employees={employees}
                                    baseReportEmployeesInfo={baseReportEmployeesInfo}
                                    handleSelectEmployee={handleSelectEmployee}
                                    selectedEmloyee={selectedEmloyee}
                                    handleInput={handleInput}
                                    saveReport={saveReport} 
                                    saveReportWithNotification={saveReportWithNotification}
                                    handleEmployeeInjury={handleEmployeeInjury}
                                    handleAircraftDamage={handleAircraftDamage}
                                    s_incident_reference={s_incident_reference}
                                    s_incident_type={s_incident_type}
                                    d_incident_date={d_incident_date}
                                    s_station={s_station}
                                    s_incident_station={s_incident_station}
                                    s_employee_shift_start={s_employee_shift_start}
                                    i_employee_hours_on_duty={i_employee_hours_on_duty}
                                    i_employee_hours_worked_in_72={i_employee_hours_worked_in_72}
                                    s_employee_regular_days_off={s_employee_regular_days_off}
                                    s_employee_injury_type={s_employee_injury_type}
                                    s_aircraft_damage_type={s_aircraft_damage_type}
                                    s_airline={s_airline}
                                    s_airline_registration={s_airline_registration}
                                    s_third_party_incident={s_third_party_incident}
                                    s_environmental_incident={s_environmental_incident}
                                    s_vehicle_accident={s_vehicle_accident}
                                    s_incident_summary={s_incident_summary}
                                    s_post_incident_actions={s_post_incident_actions}
                                    s_name={s_name}
                                    s_job_title={s_job_title}
                                    s_department={s_department}
                                    d_date_of_hire={d_date_of_hire}
                                    newUserModal={newUserModal}
                                    handleNewUserModal={handleNewUserModal}
                                    editUserModal={editUserModal}
                                    handleEditUserModal={handleEditUserModal}
                                    launchModalCreateUser={launchModalCreateUser}
                                    handleDateOfHire={handleDateOfHire}
                                    enableCreateUser={enableCreateUser}
                                    handleCreateUser={handleCreateUser}
                                    handleUpdateUser={handleUpdateUser}
                                    handleDeleteUser={handleDeleteUser}
                                    addReportEmployee={addReportEmployee}
                                    removeReportEmployee={removeReportEmployee}
                                    updateBaseReportEmployeesInfo={updateBaseReportEmployeesInfo}
                                />
                            </Step>

                            <Step id='step5' name={'Step 5'} desc={'Employee Training'}>
                                <Step5Wizard 
                                    saveReportWithNotification={saveReportWithNotification}
                                    handleInput={handleInput}
                                    selectedEmloyee={selectedEmloyee}
                                    checkEnableSavingTrainingRecord={checkEnableSavingTrainingRecord}
                                    s_training_element={s_training_element}
                                    d_date_of_training={d_date_of_training}
                                    d_next_training_date={d_next_training_date}
                                    createEmployeeTrainingRecord={createEmployeeTrainingRecord}
                                    editTrainingRecordModal={editTrainingRecordModal}
                                    edit_s_training_element={edit_s_training_element}
                                    edit_d_date_of_training={edit_d_date_of_training}
                                    edit_d_next_training_date={edit_d_next_training_date}
                                    handleEditTrainingRecordModal={handleEditTrainingRecordModal}
                                    editEmployeeTrainingRecord={editEmployeeTrainingRecord}
                                    deleteTrainingRecord={deleteTrainingRecord}
                                    deleteTrainingRecordModalOpen={deleteTrainingRecordModalOpen}
                                    handleDeleteTrainingRecordModal={handleDeleteTrainingRecordModal}
                                    baseReportEmployeesInfo={baseReportEmployeesInfo}
                                    handleSelectEmployee={handleSelectEmployee}
                                    handleSelectEmployeeWithId={handleSelectEmployeeWithId}
                                />
                            </Step>

                            <Step id='step6' name={'Step 6'} desc={'Employee Safety History'}>
                                <Step6Wizard 
                                    saveReportWithNotification={saveReportWithNotification}
                                    handleInput={handleInput}
                                    selectedEmloyee={selectedEmloyee}
                                    checkEnableSavingTrainingRecord={checkEnableSavingTrainingRecord}
                                    s_training_element={s_training_element}
                                    d_date_of_training={d_date_of_training}
                                    d_next_training_date={d_next_training_date}
                                    createEmployeeTrainingRecord={createEmployeeTrainingRecord}
                                    editTrainingRecordModal={editTrainingRecordModal}
                                    edit_s_training_element={edit_s_training_element}
                                    edit_d_date_of_training={edit_d_date_of_training}
                                    edit_d_next_training_date={edit_d_next_training_date}
                                    handleEditTrainingRecordModal={handleEditTrainingRecordModal}
                                    editEmployeeTrainingRecord={editEmployeeTrainingRecord}
                                    deleteTrainingRecord={deleteTrainingRecord}
                                    deleteTrainingRecordModalOpen={deleteTrainingRecordModalOpen}
                                    handleDeleteTrainingRecordModal={handleDeleteTrainingRecordModal} 
                                    add_s_incident_title={add_s_incident_title}
                                    add_s_incident_description={add_s_incident_description}
                                    add_t_incident={add_t_incident}
                                    add_s_incident_location={add_s_incident_location}
                                    add_s_corrective_disciplinary_action={add_s_corrective_disciplinary_action}
                                    add_s_modified_by={add_s_modified_by}
                                    add_t_modified={add_t_modified}
                                    createSafetyRecord={createSafetyRecord}
                                    editSafetyRecordModalOpen={editSafetyRecordModalOpen}
                                    handleEditSafetyRecordModal={handleEditSafetyRecordModal}
                                    edit_s_incident_title={edit_s_incident_title}
                                    edit_s_incident_description={edit_s_incident_description}
                                    edit_t_incident={edit_t_incident}
                                    edit_s_incident_location={edit_s_incident_location}
                                    edit_s_corrective_disciplinary_action={edit_s_corrective_disciplinary_action}
                                    saveSafetyRecordEdits={saveSafetyRecordEdits}
                                    deleteSafetyRecordModalOpen={deleteSafetyRecordModalOpen}
                                    handleDeleteSafetyRecordModal={handleDeleteSafetyRecordModal}
                                    deleteSafetyRecord={deleteSafetyRecord}
                                    handleSelectEmployeeWithId={handleSelectEmployeeWithId}
                                    baseReportEmployeesInfo={baseReportEmployeesInfo}
                                />
                            </Step>

                            <Step id={'step7'} name={'Step 7'} desc={'Equipment/Vehicle Involved'}>
                                <Step7Wizard
                                    i_id={i_id}
                                    user={user}
                                    handleInput={handleInput}
                                    saveReportWithNotification={saveReportWithNotification}
                                    selectedEmloyee={selectedEmloyee}
                                    baseApiUrl={baseApiUrl}
                                    headerAuthCode={headerAuthCode}
                                    createSuccessNotification={createSuccessNotification}
                                    s_weather_environment_description={s_weather_environment_description}
                                    s_weather_similar_incidents_description={s_weather_similar_incidents_description}
                                />
                            </Step>

                            <Step id={'step8'} name={'Step 8'} desc={'Incident Factors'}>
                                <Step8Wizard
                                    i_id={i_id}
                                    user={user}
                                    handleInput={handleInput}
                                    handleCheckBoxes={handleCheckBoxes}
                                    saveReportWithNotification={saveReportWithNotification}
                                    baseApiUrl={baseApiUrl}
                                    headerAuthCode={headerAuthCode}
                                    createSuccessNotification={createSuccessNotification}
                                    b_task_knowledge_inadequate={b_task_knowledge_inadequate}
                                    s_task_knowledge_inadequate={s_task_knowledge_inadequate}
                                    b_training_inadequate={b_training_inadequate}
                                    s_training_inadequate={s_training_inadequate}
                                    b_technical_skills_inadequate={b_technical_skills_inadequate}
                                    s_technical_skills_inadequate={s_technical_skills_inadequate}
                                    b_language_proficiency={b_language_proficiency}
                                    s_language_proficiency={s_language_proficiency}
                                    b_teamwork_skills={b_teamwork_skills}
                                    s_teamwork_skills={s_teamwork_skills}
                                    b_other_knowledge_skill={b_other_knowledge_skill}
                                    s_other_knowledge_skill={s_other_knowledge_skill}
                                    b_physical_health={b_physical_health}
                                    s_physical_health={s_physical_health}
                                    b_complacency_carelessness={b_complacency_carelessness}
                                    s_complacency_carelessness={s_complacency_carelessness}
                                    b_distraction_awareness={b_distraction_awareness}
                                    s_distraction_awareness={s_distraction_awareness}
                                    b_disregard_safety_rules_procedures={b_disregard_safety_rules_procedures}
                                    s_disregard_safety_rules_procedures={s_disregard_safety_rules_procedures}
                                    b_unaware_safety_rules_procedures={b_unaware_safety_rules_procedures}
                                    s_unaware_safety_rules_procedures={s_unaware_safety_rules_procedures}
                                    b_failure_use_ppe={b_failure_use_ppe}
                                    s_failure_use_ppe={s_failure_use_ppe}
                                    b_other_individual={b_other_individual}
                                    s_other_individual={s_other_individual}
                                    b_equipment_not_suitable={b_equipment_not_suitable}
                                    s_equipment_not_suitable={s_equipment_not_suitable}
                                    b_equipment_not_maintained={b_equipment_not_maintained}
                                    s_equipment_not_maintained={s_equipment_not_maintained}
                                    b_equipment_unsafe_unexpected_running={b_equipment_unsafe_unexpected_running}
                                    s_equipment_unsafe_unexpected_running={s_equipment_unsafe_unexpected_running}
                                    b_equipment_other={b_equipment_other}
                                    s_equipment_other={s_equipment_other}
                                    b_no_standard_operation_procedure={b_no_standard_operation_procedure}
                                    s_no_standard_operation_procedure={s_no_standard_operation_procedure}
                                    b_unclear_insufficient_operating_procedure={b_unclear_insufficient_operating_procedure}
                                    s_unclear_insufficient_operating_procedure={s_unclear_insufficient_operating_procedure}
                                    b_lack_clear_understanding={b_lack_clear_understanding}
                                    s_lack_clear_understanding={s_lack_clear_understanding}
                                    b_communication_between_us_customer={b_communication_between_us_customer}
                                    s_communication_between_us_customer={s_communication_between_us_customer}
                                    b_communication_information_other={b_communication_information_other}
                                    s_communication_information_other={s_communication_information_other}
                                    b_lack_of_training={b_lack_of_training}
                                    s_lack_of_training={s_lack_of_training}
                                    b_lack_of_staffing={b_lack_of_staffing}
                                    s_lack_of_staffing={s_lack_of_staffing}
                                    b_ppe_unavailable={b_ppe_unavailable}
                                    s_ppe_unavailable={s_ppe_unavailable}
                                    b_required_maintenance_not_performed={b_required_maintenance_not_performed}
                                    s_required_maintenance_not_performed={s_required_maintenance_not_performed}
                                    b_directed_to_not_follow_procedure={b_directed_to_not_follow_procedure}
                                    s_directed_to_not_follow_procedure={s_directed_to_not_follow_procedure}
                                    b_organizational_norms={b_organizational_norms}
                                    s_organizational_norms={s_organizational_norms}
                                    b_no_formal_procedure_in_place={b_no_formal_procedure_in_place}
                                    s_no_formal_procedure_in_place={s_no_formal_procedure_in_place}
                                    b_other_management_organization={b_other_management_organization}
                                    s_other_management_organization={s_other_management_organization}
                                />
                            </Step>
                            <Step id={'step9'} name={'Step 9'} desc={'Root Cause Analysis Findings'}>
                                <Step9Wizard
                                    rcaFindingsArray={rcaFindingsArray}
                                    updateRcaFindingsArray={updateRcaFindingsArray}
                                    addRcaFindingsArray={addRcaFindingsArray}
                                    deleteRcaFindingsArray={deleteRcaFindingsArray}
                                />
                            </Step>
                            <Step id={'step10'} name={'Step 10'} desc={'Why Methodology Factors'}>
                                <Step10Wizard
                                    handleInput={handleInput}
                                    s_incident_cause={s_incident_cause}
                                    s_investigation_conclusion={s_investigation_conclusion}            
                                    whyFactorsArray={whyFactorsArray}
                                    updateWhyFactorsArray={updateWhyFactorsArray}
                                    addWhyFactorsArray={addWhyFactorsArray}
                                    deleteWhyFactorsArray={deleteWhyFactorsArray}
                                />
                            </Step>
                            <Step id={'step11'} name={'Step 11'} desc={'Corrective and Preventative Actions'}>
                                <Step11Wizard
                                    i_id={i_id}
                                    user={user}
                                    handleInput={handleInput}
                                    saveReportWithNotification={saveReportWithNotification}
                                    baseApiUrl={baseApiUrl}
                                    headerAuthCode={headerAuthCode}
                                    createSuccessNotification={createSuccessNotification}
                                />
                            </Step>
                        </Steps>
                        <BottomNavigation 
                            selectedReportId={selectedReportId} 
                            resolveReportStartComplete={resolveReportStartComplete} 
                            saveReport={saveReport} 
                            onClickNext={this.onClickNext} 
                            onClickPrev={this.onClickPrev} 
                            className="justify-content-center" 
                            prevLabel={'Previous'} 
                            nextLabel={'Next'} 
                            manageIncidentFactors={manageIncidentFactors}
                            manageRootCauseAnalysisFindings={manageRootCauseAnalysisFindings}
                            manageSmsWhyMethodologyFactors={manageSmsWhyMethodologyFactors}
                            saveReady={saveReady}
                        />
                    </Wizard>
                </CardBody>
            </Card>
        );
    }
  }
  export default SmsWizard;