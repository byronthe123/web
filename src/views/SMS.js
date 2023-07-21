import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import axios from 'axios';
import moment from 'moment';
import { NavLink } from "react-router-dom";

import SmsWizard from '../components/sms/SmsWizard';

class SMS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveReady: false,
            files: [],
            fileInputKey: 0,
            i_id: '',
            s_created_by: this.props && this.props.user && this.props.user.s_email,
            s_station: '',
            s_customer: '',
            t_incident: '',
            s_incident_location: '',
            s_investigation_conducted_by: '',
            s_investigation_conducted_by_title: '',
            d_investigation_conducted: '',
            s_investigation_approved_by: '',
            s_investigation_approved_by_title: '',
            d_investigation_approved: '',
            b_evidence_witness_statements: false,
            b_evidence_training_records: false,
            b_evidence_drug_alcohol_testing_docs: false,
            b_evidence_external_reports: false,
            b_evidence_photos: false,
            b_evidence_cctv_footage: false,
            b_evidence_other: false,
            s_incident_reference: '',
            s_incident_type: '',
            d_incident_date: '',
            s_incident_station: '',
            s_employee_name: '',
            s_employee_job_title: '',
            s_employee_department: '',
            d_employee_employment_date: '',
            s_employee_shift_start: '',
            i_employee_hours_on_duty: '',
            i_employee_hours_worked_in_72: '',
            s_employee_regular_days_off: '',
            s_employee_injury_type: '',
            s_aircraft_damage_type: '',
            s_airline: '',
            s_airline_registration: '',
            s_third_party_incident: '',
            s_environmental_incident: '',
            s_vehicle_accident: '',
            s_incident_summary: '',
            s_post_incident_actions: '',
            b_completed: false,
            //non-essentail:
            reports: [],
            employees: [],
            reportEmployees: [],
            baseReportEmployeesInfo: [],
            selectedEmloyee: null,
            selectedReportId: null,
            user: null,
            s_name: null,
            s_job_title: null,
            s_department: null,
            d_date_of_hire: null,
            t_modified: null,
            s_modified_by: null,
            newUserModal: false,
            editUserModal: false,
            mediaArray: [],
            contextSelectedEmployee: null,
            //-------- Training
            s_training_element: '',
            d_date_of_training: '',
            d_next_training_date: '',
            editTrainingRecord: null,
            edit_s_training_element: null,
            edit_d_date_of_training: null,
            edit_d_next_training_date: null,
            editTrainingRecordModal: false,
            deleteTrainingRecordModalOpen: false,
            //-------- Safety History
            add_s_incident_title: '',
            add_s_incident_description: '',
            add_t_incident: '',
            add_s_incident_location: '',
            add_s_corrective_disciplinary_action: '',
            add_s_modified_by: '',
            add_t_modified: '',
            editSafetyRecordModalOpen: false,
            editSafetyRecordId: '',
            edit_s_incident_title: '',
            edit_s_incident_description: '',
            edit_t_incident: '',
            edit_s_incident_location: '',
            edit_s_corrective_disciplinary_action: '',
            deleteSafetyRecordModalOpen: false,
            //Step7:
            s_weather_environment_description: '',
            s_weather_similar_incidents_description: '',
            //Step8: Incident Factors:
                //Knowledge,Skill
                b_task_knowledge_inadequate: false,
                s_task_knowledge_inadequate: '',
                b_training_inadequate: false,
                s_training_inadequate: '',
                b_technical_skills_inadequate: false,
                s_technical_skills_inadequate: '',
                b_language_proficiency: false,
                s_language_proficiency: '',
                b_teamwork_skills: false,
                s_teamwork_skills: '',
                b_other_knowledge_skill: false,
                s_other_knowledge_skill: '',
                //INDIVIDUAL
                b_physical_health: false,
                s_physical_health: '',
                b_complacency_carelessness: false,
                s_complacency_carelessness: '',
                b_distraction_awareness: false,
                s_distraction_awareness: '',
                b_disregard_safety_rules_procedures: false,
                s_disregard_safety_rules_procedures: '',
                b_unaware_safety_rules_procedures: false,
                s_unaware_safety_rules_procedures: '',
                b_failure_use_ppe: false,
                s_failure_use_ppe: '',
                b_other_individual: false,
                s_other_individual: '',
                //Equipment
                b_equipment_not_suitable: false,
                s_equipment_not_suitable: '',
                b_equipment_not_maintained: false,
                s_equipment_not_maintained: '',
                b_equipment_unsafe_unexpected_running: false,
                s_equipment_unsafe_unexpected_running: '',
                b_equipment_other: false,
                s_equipment_other: '',
                //Communication/Information
                b_no_standard_operation_procedure: false,
                s_no_standard_operation_procedure: '',
                b_unclear_insufficient_operating_procedure: false,
                s_unclear_insufficient_operating_procedure: '',
                b_lack_clear_understanding: false,
                s_lack_clear_understanding: '',
                b_communication_between_us_customer: false,
                s_communication_between_us_customer: '',
                b_communication_information_other: false,
                s_communication_information_other: '',
                //Management/Organization
                b_lack_of_training: false,
                s_lack_of_training: '',
                b_lack_of_staffing: false,
                s_lack_of_staffing: '',
                b_ppe_unavailable: false,
                s_ppe_unavailable: '',
                b_required_maintenance_not_performed: false,
                s_required_maintenance_not_performed: '',
                b_directed_to_not_follow_procedure: false,
                s_directed_to_not_follow_procedure: '',
                b_organizational_norms: false,
                s_organizational_norms: '',
                b_no_formal_procedure_in_place: false,
                s_no_formal_procedure_in_place: '',
                b_other_management_organization: false,
                s_other_management_organization: '',
            //Step 9: Root Cause Analysis Findings:
            rcaFindingsArray: [],
            //Step 10: Why Factors:
            whyFactorsArray: []
        }
    }

    updateRcaFindingsArray = (index, value) => {
        //issue is that onload, empty valuesa are being assigned to the array, going to need to either add
        const updateArray = Object.assign([], this.state.rcaFindingsArray);
        updateArray[index].s_finding = value;
        this.setState({
            rcaFindingsArray: updateArray
        });
    }

    addRcaFindingsArray = (e) => {
        e.preventDefault();
        const updateArray = Object.assign([], this.state.rcaFindingsArray);
        updateArray.push({
            i_report_id: this.state.i_id,
            s_finding: ''
        });
        this.setState({
            rcaFindingsArray: updateArray
        });
    }

    deleteRcaFindingsArray = (index) => {
        const updateArray = Object.assign([], this.state.rcaFindingsArray);
        const setArray = updateArray.filter((a, i) => i !== index);
        this.setState({
            rcaFindingsArray: setArray
        });
    }   

    updateWhyFactorsArray = (index, value) => {
        //issue is that onload, empty valuesa are being assigned to the array, going to need to either add
        const updateArray = Object.assign([], this.state.whyFactorsArray);
        updateArray[index].s_why_factor = value;
        this.setState({
            whyFactorsArray: updateArray
        });
    }

    addWhyFactorsArray = (e) => {
        e.preventDefault();
        const updateArray = Object.assign([], this.state.whyFactorsArray);
        updateArray.push({
            i_report_id: this.state.i_id,
            s_why_factor: ''
        });
        this.setState({
            whyFactorsArray: updateArray
        });
    }

    deleteWhyFactorsArray = (index) => {
        const updateArray = Object.assign([], this.state.whyFactorsArray);
        const setArray = updateArray.filter((a, i) => i !== index);
        this.setState({
            whyFactorsArray: setArray
        });
    }   

    resolveMediaType = (link) => {
        if(link.includes('jpg') || link.includes('png')) {
            return 'image';
        } else if(link.includes('pdf')) {
            return 'pdf';
        } else if(link.includes('xls')) {
            return 'excel';
        } else if(link.includes('doc')) {
            return 'word';
        } else if(link.includes('mp4') || link.includes('webm') || link.includes('avi')) {
            return 'video';
        }
    }

    resolveMediaExtension = (link) => {
        if(link.includes('jpg')) {
            return 'jpg';
        } else if (link.includes('png')) {
            return 'png';
        } else if(link.includes('pdf')) {
            return 'pdf';
        } else if(link.includes('xls')) {
            return 'excel';
        } else if(link.includes('doc')) {
            return 'word';
        } else if(link.includes('mp4')) {
            return 'mp4';
        } else if(link.includes('webm')) {
            return 'webm';
        } else if(link.includes('avi')) {
            return 'avi';
        }
    }

    resolveMediaArray = (dataArray) => {
        const mediaArray = [];
        for(let i = 0; i < dataArray.length; i++) {
            dataArray[i].s_file_name !== null &&
            mediaArray.push({
                s_file_name: dataArray[i].s_file_name,
                s_comments: dataArray[i].s_comments,
                sc_file_link: dataArray[i].sc_file_link,
                type: this.resolveMediaType(dataArray[i].sc_file_link),
                extension: this.resolveMediaExtension(dataArray[i].sc_file_link)
            });
        }
        console.log(mediaArray);
        return mediaArray;
    }

    selectAllSmsReports = (refreshSelectedEmployee=false, id=null) => {
        axios.get(`${this.props.baseApiUrl}/selectAllSmsReportsAndEmployees`, {
            headers: {Authorization: `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {
            console.log(response);
            this.setState({
                reports: response.data.reports,
                employees: response.data.employees
            }, () => {
                console.log(this.state.employees);
                if(refreshSelectedEmployee) {
                    this.handleSelectEmployeeWithId(id);
                }
            });
        }).catch(error => {
            console.log(error);
        });
    }

    selectReport = (reportId) => {
        console.log(`Selecting report: ${reportId}`);
        this.setState({
            selectedReportId: reportId
        }, () => {
            console.log(`updated reportId = ${this.state.selectedReportId}`);
            this.findReportQuery();
        });
    }

    startNewReport = (callback) => {
        this.setState({
            saveReady: true,
            files: [],
            fileInputKey: 0,
            i_id: '',
            s_created_by: this.props && this.props.user && this.props.user.s_email,
            s_station: '',
            s_customer: '',
            t_incident: '',
            s_incident_location: '',
            s_investigation_conducted_by: '',
            s_investigation_conducted_by_title: '',
            d_investigation_conducted: '',
            s_investigation_approved_by: '',
            s_investigation_approved_by_title: '',
            d_investigation_approved: '',
            b_evidence_witness_statements: false,
            b_evidence_training_records: false,
            b_evidence_drug_alcohol_testing_docs: false,
            b_evidence_external_reports: false,
            b_evidence_photos: false,
            b_evidence_cctv_footage: false,
            b_evidence_other: false,
            s_incident_reference: '',
            s_incident_type: '',
            d_incident_date: null,
            s_incident_station: '',
            s_employee_name: '',
            s_employee_job_title: '',
            s_employee_department: '',
            d_employee_employment_date: null,
            s_employee_shift_start: '',
            i_employee_hours_on_duty: '',
            i_employee_hours_worked_in_72: '',
            s_employee_regular_days_off: '',
            s_employee_injury_type: '',
            s_aircraft_damage_type: '',
            s_airline: '',
            s_airline_registration: '',
            s_third_party_incident: '',
            s_environmental_incident: '',
            s_vehicle_accident: '',
            s_incident_summary: '',
            s_post_incident_actions: '',
            b_completed: false,
            //non-essentail:
            // reports: [],
            selectedReportId: null,
            saveNewReport: true,
            user: null,
            mediaArray: []
        }, () => {
            return callback();
        });
    }

    findReportQuery = (email) => {
        const i_id = this.state.selectedReportId;
        console.log(i_id);
        i_id &&
        axios.post(`${this.props.baseApiUrl}/findSmsReport`, {
            i_id
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {
            const {dataArray} = response.data;
            const {reportEmployeesArray} = response.data;
            const {rcaFindingsArray} = response.data;
            const {whyFactorsArray} = response.data;

            const reportEmployeesIds = reportEmployeesArray.map(r => r.i_employee_id);

            console.log(reportEmployeesArray);

            // const baseReportEmployeesInfo = reportEmployeesArray.filter(r => this.state.employees.indexOf(r.i_employee_id) !== -1);
            const setBaseReportEmployeesInfo = this.state.employees.filter(e => reportEmployeesIds.indexOf(e.id) !== -1);

            console.log(setBaseReportEmployeesInfo);

            console.log(response.data);
            if(dataArray.length > 0) {
                const data = dataArray[0];
                this.setState(prevState => ({
                    saveReady: true,
                    i_id: data.i_id,
                    s_station: data.s_station,
                    s_customer: data.s_customer,
                    s_incident_location: data.s_incident_location,
                    t_incident: moment(data.t_incident).format('YYYY-MM-DDTHH:mm:ss'),
                    s_investigation_conducted_by: data.s_investigation_conducted_by,
                    s_investigation_conducted_by_title: data.s_investigation_conducted_by_title,
                    d_investigation_conducted: moment(data.d_investigation_conducted).format('YYYY-MM-DD'),
                    s_investigation_approved_by: data.s_investigation_approved_by,
                    s_investigation_approved_by_title: data.s_investigation_approved_by_title,
                    d_investigation_approved: moment(data.d_investigation_approved).format('YYYY-MM-DD'),
                    b_evidence_witness_statements: data.b_evidence_witness_statements,
                    b_evidence_training_records: data.b_evidence_training_records,
                    b_evidence_drug_alcohol_testing_docs: data.b_evidence_drug_alcohol_testing_docs,
                    b_evidence_external_reports: data.b_evidence_external_reports,
                    b_evidence_photos: data.b_evidence_photos,
                    b_evidence_cctv_footage: data.b_evidence_cctv_footage,
                    b_evidence_other: data.b_evidence_other,
                    s_incident_reference: data.s_incident_reference,
                    s_incident_type: data.s_incident_type,
                    d_incident_date: moment(data.d_incident_date).format('YYYY-MM-DD'),
                    s_incident_station: data.s_incident_station,
                    s_employee_name: data.s_employee_name,
                    i_employee_id: data.i_employee_id,
                    s_employee_shift_start: data.s_employee_shift_start,
                    i_employee_hours_on_duty: data.i_employee_hours_on_duty,
                    i_employee_hours_worked_in_72: data.i_employee_hours_worked_in_72,
                    s_employee_regular_days_off: data.s_employee_regular_days_off,
                    s_employee_injury_type: data.s_employee_injury_type,
                    s_aircraft_damage_type: data.s_aircraft_damage_type,
                    s_airline: data.s_airline,
                    s_airline_registration: data.s_airline_registration,
                    s_third_party_incident: data.s_third_party_incident,
                    s_environmental_incident: data.s_environmental_incident,
                    s_vehicle_accident: data.s_vehicle_accident,
                    s_incident_summary: data.s_incident_summary,
                    s_post_incident_actions: data.s_post_incident_actions,
                    b_completed: data.b_completed,
                    mediaArray: this.resolveMediaArray(dataArray),
                    fileInputKey: prevState.fileInputKey += 1,
                    reportEmployees: reportEmployeesArray,
                    baseReportEmployeesInfo: setBaseReportEmployeesInfo,
                    s_weather_environment_description: data.s_weather_environment_description,
                    s_weather_similar_incidents_description: data.s_weather_similar_incidents_description,
                    //Incident factors:
                    b_task_knowledge_inadequate: data.b_task_knowledge_inadequate,
                    s_task_knowledge_inadequate: data.s_task_knowledge_inadequate,
                    b_training_inadequate: data.b_training_inadequate,
                    s_training_inadequate: data.s_training_inadequate,
                    b_technical_skills_inadequate: data.b_technical_skills_inadequate,
                    s_technical_skills_inadequate: data.s_technical_skills_inadequate,
                    b_language_proficiency: data.b_language_proficiency,
                    s_language_proficiency: data.s_language_proficiency,
                    b_teamwork_skills: data.b_teamwork_skills,
                    s_teamwork_skills: data.s_teamwork_skills,
                    b_other_knowledge_skill: data.b_other_knowledge_skill,
                    s_other_knowledge_skill: data.s_other_knowledge_skill,
                    b_physical_health: data.b_physical_health,
                    s_physical_health: data.s_physical_health,
                    b_complacency_carelessness: data.b_complacency_carelessness,
                    s_complacency_carelessness: data.s_complacency_carelessness,
                    b_distraction_awareness: data.b_distraction_awareness,
                    s_distraction_awareness: data.s_distraction_awareness,
                    b_disregard_safety_rules_procedures: data.b_disregard_safety_rules_procedures,
                    s_disregard_safety_rules_procedures: data.s_disregard_safety_rules_procedures,
                    b_unaware_safety_rules_procedures: data.b_unaware_safety_rules_procedures,
                    s_unaware_safety_rules_procedures: data.s_unaware_safety_rules_procedures,
                    b_failure_use_ppe: data.b_failure_use_ppe,
                    s_failure_use_ppe: data.s_failure_use_ppe,
                    b_other_individual: data.b_other_individual,
                    s_other_individual: data.s_other_individual,
                    b_equipment_not_suitable: data.b_equipment_not_suitable,
                    s_equipment_not_suitable: data.s_equipment_not_suitable,
                    b_equipment_not_maintained: data.b_equipment_not_maintained,
                    s_equipment_not_maintained: data.s_equipment_not_maintained,
                    b_equipment_unsafe_unexpected_running: data.b_equipment_unsafe_unexpected_running,
                    s_equipment_unsafe_unexpected_running: data.s_equipment_unsafe_unexpected_running,
                    b_equipment_other: data.b_equipment_other,
                    s_equipment_other: data.s_equipment_other,
                    b_no_standard_operation_procedure: data.b_no_standard_operation_procedure,
                    s_no_standard_operation_procedure: data.s_no_standard_operation_procedure,
                    b_unclear_insufficient_operating_procedure: data.b_unclear_insufficient_operating_procedure,
                    s_unclear_insufficient_operating_procedure: data.s_unclear_insufficient_operating_procedure,
                    b_lack_clear_understanding: data.b_lack_clear_understanding,
                    s_lack_clear_understanding: data.s_lack_clear_understanding,
                    b_communication_between_us_customer: data.b_communication_between_us_customer,
                    s_communication_between_us_customer: data.s_communication_between_us_customer,
                    b_communication_information_other: data.b_communication_information_other,
                    s_communication_information_other: data.s_communication_information_other,
                    b_lack_of_training: data.b_lack_of_training,
                    s_lack_of_training: data.s_lack_of_training,
                    b_lack_of_staffing: data.b_lack_of_staffing,
                    s_lack_of_staffing: data.s_lack_of_staffing,
                    b_ppe_unavailable: data.b_ppe_unavailable,
                    s_ppe_unavailable: data.s_ppe_unavailable,
                    b_required_maintenance_not_performed: data.b_required_maintenance_not_performed,
                    s_required_maintenance_not_performed: data.s_required_maintenance_not_performed,
                    b_directed_to_not_follow_procedure: data.b_directed_to_not_follow_procedure,
                    s_directed_to_not_follow_procedure: data.s_directed_to_not_follow_procedure,
                    b_organizational_norms: data.b_organizational_norms,
                    s_organizational_norms: data.s_organizational_norms,
                    b_no_formal_procedure_in_place: data.b_no_formal_procedure_in_place,
                    s_no_formal_procedure_in_place: data.s_no_formal_procedure_in_place,
                    b_other_management_organization: data.b_other_management_organization,
                    s_other_management_organization: data.s_other_management_organization,
                    //Step9: RCA
                    rcaFindingsArray: rcaFindingsArray,
                    //Step10: Why Methodology, Incident Cause and Conclusion
                    s_incident_cause: data.s_incident_cause,
                    s_investigation_conclusion: data.s_investigation_conclusion,
                    whyFactorsArray: whyFactorsArray
                }), () => {
                    console.log(data);
                    setBaseReportEmployeesInfo.length > 0 && this.handleSelectEmployeeWithId(setBaseReportEmployeesInfo[0].id);
                });
            }
        }).catch(error => {
            console.log(error);
        })
    }

    componentDidMount() {
        //this.findReportQuery(this.props.user.s_email);
        this.selectAllSmsReports();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(prevState.user !== nextProps.user) {
            return {
                user: nextProps.user
            }
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        if(this.props.user !== prevProps.user) {
            this.selectAllSmsReports();
        }
    }

    saveReportWithNotification = () => {
        this.props.createSuccessNotification('Report Saved!');
        this.saveReport();
    }

    saveReport = () => {
        console.log(`tyring to save report`);
        const s_created_by = this.props && this.props.user && this.props.user.s_email;
        const t_created = moment().local().format('MM/DD/YYYY hh:mm A');
        const s_modified_by = this.props && this.props.user && this.props.user.s_email;
        const t_modified = moment().local().format('MM/DD/YYYY hh:mm A');
        const i_employee_id = this.state.selectedEmloyee ? this.state.selectedEmloyee.id : null;
        const {
            // s_created_by,
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
            b_completed,
            s_weather_environment_description,
            s_weather_similar_incidents_description,
            s_incident_cause,
            s_investigation_conclusion
        } = this.state;

        const i_id = this.state.selectedReportId;

        // const url = i_id !== null && i_id !== undefined ? `${this.props.baseApiUrl}/saveSmsReport` : `${this.props.baseApiUrl}/saveNewSmsReport`;

        const url = this.state.saveNewReport ? `${this.props.baseApiUrl}/saveNewSmsReport` :  `${this.props.baseApiUrl}/saveSmsReport`;

        const data = {
            s_created_by,
            t_created,
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
            b_evidence_other
        }

        if(this.state.saveNewReport) {
            axios.post(url, {
                data
            }, {
                headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
            }).then(response => {
                console.log(`report saved`);
                if(i_id === null || i_id === undefined) {
                    console.log(response.data);
                    const insertedId = response.data[0].insertedId;
                    this.setState({
                        i_id: insertedId,
                        saveNewReport: false
                    }, () => {
                        console.log(this.state.i_id);
                    });
                }
            }).catch(error => {
                console.log(error);
            });
        } else {
            const data = {
                report: {
                    t_modified,
                    s_modified_by,
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
                    i_employee_id,
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
                    b_completed,
                    i_id,
                    s_weather_environment_description,
                    s_weather_similar_incidents_description,
                    s_incident_cause,
                    s_investigation_conclusion
                },
                employee: this.state.baseReportEmployeesInfo
            }

            axios.post(url, {
                data
            }, {
                headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
            }).then(response => {
                //console.log(`report saved`);
                // this.props.createSuccessNotification('Report Saved!');
                if(i_id === null || i_id === undefined) {
                    console.log(response.data);
                    const insertedId = response.data[0].insertedId;
                    this.setState({
                        i_id: insertedId,
                        saveNewReport: false
                    }, () => {
                        console.log(this.state.i_id);
                    });
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }

    removeFileAtId = (id, callback) => {
        this.setState(prevState => ({
            files: prevState.files.filter(file => file.id !== id)
        }), () => {
            console.log(this.state.files);
            callback();
        });
    }

    updateComments = (e, id) => {
        const comment = e.target.value;
        // console.log(id);
        const updateFiles = this.state.files;

        for(let i = 0; i < updateFiles.length; i++) {
            if(updateFiles[i].id === id) {
                updateFiles[i].comment = comment;
            }
        }

        this.setState(prevState => ({
            files: updateFiles
        }), () => {
            console.log(this.state.files);
        });
    }

    getFiles = (_files, id) => {
        const filesArray = [];
        _files.id = id;
        filesArray.push(_files);

        this.removeFileAtId(id, () => {
            if(this.state.files.length > 0) {
                console.log(`appending to files using spread`);
                this.setState(prevState => ({
                    files: [...prevState.files, _files]
                }), () => {
                    console.log(this.state.files);
                });
            } else {
                this.setState({
                    files: filesArray
                }, () => {
                    console.log(this.state.files);
                });
            }
        });
    }

    deleteSmsMedia = (e) => {
        const s_file_name = e.target.id;
        console.log(e.target);
        console.log(e.target.id);
        console.log(s_file_name);
        axios.put(`${this.props.baseApiUrl}/deleteSmsMedia`, {
            s_file_name
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {
            this.findReportQuery(this.props.user.s_email);
        }).catch(error => {
            console.log(error);
        });
    }

    handleInput = (e) => {
        const property = e.target.id;
        const value = e.target.value;
        this.setState({
            [property]: value
        }, () => {
            // console.log(`${property} = ${this.state[property]}`);
            console.log(this.state);
        });
    }

    handleCheckBoxes = (e) => {
        const property = e.target.id;
        //const value = e.target.value;
        this.setState(prevState => ({
            [property]: !prevState[property]
        }), () => {
            console.log(`${property} = ${this.state[property]}`);
        });
    }

    resolveReportStartComplete = () => {

        let complete = true;

        const checkProperties = [
            "s_station",
            "s_customer",
            "t_incident",
            "s_investigation_conducted_by",
            "s_investigation_conducted_by_title",
            "d_investigation_conducted",
            "s_investigation_approved_by",
            "s_investigation_approved_by_title",
            "d_investigation_approved"
        ];

        for(let i = 0; i < checkProperties.length; i++) {
            if(this.state[checkProperties[i]] && this.state[checkProperties[i]].length < 1) {
                complete = false;
            }
        }

        return complete;
    }

    saveSmsMedia = (e) => {
        console.log('running saveSmsMedia');
        // e.preventDefault();
        const filesArray = JSON.stringify(this.state.files);
        const {files} = this.state;
        const report_id = this.state.i_id;
        axios.post(`${this.props.baseApiUrl}/saveSmsMedia`, {
            files,
            report_id
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {
            console.log(response);
            this.findReportQuery(this.props.user.s_email);
        }).catch(error => {
            console.log(error);
        })
    }

    handleEmployeeInjury = (e) => {
        const { value } = e.target && e.target;
        console.log(value);
        this.setState({
            s_employee_injury_type: value
        });
    }

    handleAircraftDamage = (e) => {
        this.setState({
            s_aircraft_damage_type: e.target.value
        });
    }

    // handleSelectEmployee = (e) => {
    //     console.log(`selected emloyee value: ${e.target.value}`);
    //     const selectedEmployeeId = e.target.value;
    //     const setSelectedEmployee = this.state.employees.filter(e => e.id == selectedEmployeeId)[0];
    //     console.log(setSelectedEmployee);
    //     this.setState({
    //         selectedEmloyee: setSelectedEmployee
    //     }, () => {
    //         console.log(this.state.selectedEmloyee);
    //     });
    // }

    handleSelectEmployee = (e, currentId, index) => {
        //Issue with indexing: when changing an employee in the second Select Employee
        //component, the information of the employee  in the first component got changed.
        //
        const newEmployeeId = e.target.value;
        const setSelectedEmployee = this.state.employees.filter(e => e.id == newEmployeeId)[0];
        console.log(`Current id: ${currentId}`);
        console.log(`New Employee id: ${newEmployeeId}`);
        // const setBaseReportEmployeesInfo = this.state.baseReportEmployeesInfo;
        const setBaseReportEmployeesInfo = Object.assign([],this.state.baseReportEmployeesInfo)

        // for (let i = 0; i < setBaseReportEmployeesInfo.length; i++) {
        //     if (setBaseReportEmployeesInfo[i].id === currentId) {
        //         console.log(`Replacing employeee at index: ${i}`)
        //         console.log(`i: ${i} - baseReportEmployeesInfo id ${setBaseReportEmployeesInfo[i].id} === currentId ${currentId}`);
        //         setBaseReportEmployeesInfo[i] = setSelectedEmployee;
        //         break;
        //     }
        // }

        setBaseReportEmployeesInfo[index] = setSelectedEmployee;

        console.log(setBaseReportEmployeesInfo);

        this.setState({
            baseReportEmployeesInfo: setBaseReportEmployeesInfo
        }, () => {
            console.log(this.state.baseReportEmployeesInfo);
        });
    }

    handleSelectEmployeeWithId = (id) => {
        // alert('handleSelectEmployeeWithId');
        //console.log(`selected emloyee value: ${e.target.value}`);
        console.log(id);
        const selectedEmployeeId = id;
        const setSelectedEmployee = this.state.employees.filter(e => e.id == selectedEmployeeId)[0];

        axios.post(`${this.props.baseApiUrl}/selectSingleEmployeeInfo`, {
            id
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {
            const {data} = response;

            setSelectedEmployee.trainingRecords = data.trainingData;
            setSelectedEmployee.safetyHistory = data.safetyData;

            this.setState({
                selectedEmloyee: setSelectedEmployee,
                s_training_element: '',
                d_date_of_training: '',
                d_next_training_date: '',
                add_s_incident_title: '',
                add_s_incident_description: '',
                add_t_incident: '',
                add_s_incident_location: '',
                add_s_corrective_disciplinary_action: '',
                add_s_modified_by: '',
                add_t_modified: ''
            }, () => {
                console.log(`SELECTED EMPLOYEE IN STATE: ${this.state.selectedEmloyee}`);
            });
        }).catch(error => {

        });
    }

    handleNewUserModal = () => {
        this.setState(prevState => ({
            newUserModal: !prevState.newUserModal
        }), () => {
            console.log(`newUserModal: ${this.state.newUserModal}`);
        });
    }

    // handleEditUserModal = () => {
    //     this.setState(prevState => ({
    //         editUserModal: !prevState.editUserModal
    //     }));
    // }

    handleEditUserModal = (employee) => {
        // alert(employee.s_name);
        this.setState(prevState => ({
            s_name: employee.s_name,
            s_job_title: employee.s_job_title,
            s_department: employee.s_department,
            d_date_of_hire: employee.d_date_of_hire,
            editUserModal: !prevState.editUserModal,
            contextSelectedEmployee: employee
        }));
    }

    handleDateOfHire = (e) => {
        const date = e.target.value;
        this.setState({
            d_date_of_hire: moment(date).format('MM/DD/YYYY')
        }, () => {
            //console.log(this.state.d_company_driver_id_expiration_1);
        });
    };

    enableCreateUser = () => {
        const {s_name, s_job_title, s_department, d_date_of_hire} = this.state;
        const checkArray = [s_name, s_job_title, s_department, d_date_of_hire];

        let enable = true;

        for(let i = 0; i < checkArray.length; i++) {
            if(checkArray[i] === null || checkArray[i] && checkArray[i].length < 1) {
                enable = false;
            }
        }

        return enable;
    }

    handleCreateUser = () => {
        const {s_name, s_job_title, s_department, d_date_of_hire} = this.state;
        const email = this.props.user && this.props.user.s_email;
        const now = moment().local().format('MM/DD/YYYY hh:mm A');
        const t_modified = now;
        const t_created = now;
        const s_modified_by = email;
        const s_created_by = email;

        const url = `${this.props.baseApiUrl}/addNewEmployee`;

        axios.post(url, {
            s_name,
            s_job_title,
            s_department,
            d_date_of_hire,
            t_modified,
            s_modified_by,
            s_created_by,
            t_created
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {
            // console.log(`------------------USER CREATED------------------`);
            this.setState({
                s_name: null,
                s_job_title: null,
                s_department: null,
                d_date_of_hire: null,
                newUserModal: false
            }, () => {
                this.selectAllSmsReports();
            });
        }).catch(error => {
            console.log(error);
        });
    }


    handleUpdateUser = (refreshSelectedEmployeeId) => {
        const {s_name, s_job_title, s_department, d_date_of_hire} = this.state;
        const email = this.props.user && this.props.user.s_email;
        const now = moment().local().format('MM/DD/YYYY hh:mm A');
        const t_modified = now;
        const s_modified_by = email;
        //contextSelectedEmployee
        const id = this.state.contextSelectedEmployee.id;
        // const id = this.state.selectedEmloyee.id && this.state.selectedEmloyee.id;
        
        const url = `${this.props.baseApiUrl}/updateEmployee`;

        axios.post(url, {
            id,
            s_name,
            s_job_title,
            s_department,
            d_date_of_hire,
            t_modified,
            s_modified_by
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {
            this.setState({
                s_name: null,
                s_job_title: null,
                s_department: null,
                d_date_of_hire: null,
                editUserModal: false
            }, () => {
                this.selectAllSmsReports(true, refreshSelectedEmployeeId);
            });
        }).catch(error => {
            console.log(error);
        });
    }

    handleDeleteUser = () => {
        const i_report_id = this.state.i_id;
        const i_employee_id = this.state.contextSelectedEmployee.id;

        axios.post(`${this.props.baseApiUrl}/deleteEmployee`, {
            i_report_id,
            i_employee_id
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {
            // this.selectAllSmsReports(true, refreshSelectedEmployeeId);
            const updatedEmployees = this.state.employees.filter(e => e.id !== i_employee_id);
            this.setState({
                employees: updatedEmployees,
                editUserModal: false
            });
        }).catch(error => {

        });
    }

    launchModalCreateUser = () => {
        this.setState({
            editUserModal: false,
            newUserModal: true,
            s_name: null,
            s_job_title: null,
            s_department: null,
            d_date_of_hire: null
        });
    }

    checkEnableSavingTrainingRecord = () => {

        const {s_training_element, d_date_of_training, d_next_training_date} = this.state;
        const checkArray = [s_training_element, d_date_of_training, d_next_training_date];

        let proceed = !this.state.editTrainingRecordModal;

        for(let i = 0; i < checkArray.length; i++) {
            if(checkArray[i] === null || checkArray[i].length < 1) {
                proceed = false;
            }
        }

        return proceed;
    }

    createEmployeeTrainingRecord = () => {
        const i_employee_id = this.state.selectedEmloyee && this.state.selectedEmloyee.id;
        const {s_training_element, d_date_of_training, d_next_training_date} = this.state;
        const t_modified = moment().local().format('MM/DD/YYYY hh:mm A');
        const s_modified_by = this.props.user && this.props.user.s_email;

        axios.post(`${this.props.baseApiUrl}/createEmployeeTrainingRecord`, {
            i_employee_id,
            s_training_element,
            d_date_of_training,
            d_next_training_date,
            t_modified,
            s_modified_by
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {
            this.handleSelectEmployeeWithId(i_employee_id);
        }).catch(error => {

        });
    }

    handleEditTrainingRecordModal = (trainingRecord) => {
        console.log(trainingRecord);
        console.log(this.state.editTrainingRecordModal);
        this.setState(prevState => ({
            editTrainingRecordModal: !prevState.editTrainingRecordModal
        }), () => {
            if (this.state.editTrainingRecordModal) {
                this.setTrainingRecord(trainingRecord);
            }
        });
    }

    setTrainingRecord = (trainingRecord) => {
        console.log(trainingRecord);
        this.setState({
            editTrainingRecord: trainingRecord,
            edit_s_training_element: trainingRecord.s_training_element,
            edit_d_date_of_training: trainingRecord.d_date_of_training,
            edit_d_next_training_date: trainingRecord.d_next_training_date
        });
    }

    editEmployeeTrainingRecord = () => {
        const {editTrainingRecord, edit_s_training_element, edit_d_date_of_training, edit_d_next_training_date} = this.state;
        const id = editTrainingRecord.id;
        const s_training_element = edit_s_training_element;
        const d_date_of_training = edit_d_date_of_training;
        const d_next_training_date = edit_d_next_training_date;
        const t_modified = moment().local().format('MM/DD/YYYY hh:mm A');
        const s_modified_by = this.props.user && this.props.user.s_email;

        axios.post(`${this.props.baseApiUrl}/editTrainingRecord`, {
            id,
            s_training_element,
            d_date_of_training,
            d_next_training_date,
            t_modified,
            s_modified_by
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {
            //this.handleSelectEmployeeWithId(i_employee_id);
            this.setState({
                editTrainingRecordModal: false
            }, () => {
                this.handleSelectEmployeeWithId(editTrainingRecord.i_employee_id);
            });
        }).catch(error => {
            console.log(error);
        });
    }

    handleDeleteTrainingRecordModal = () => {
        this.setState(prevState => ({
            editTrainingRecordModal: false,
            deleteTrainingRecordModalOpen: !prevState.deleteTrainingRecordModalOpen
        }));
    }

    deleteTrainingRecord = () => {
        const id = this.state.editTrainingRecord.id;
        axios.post(`${this.props.baseApiUrl}/deleteTrainingRecord`, {
            id
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {
            this.setState({
                deleteTrainingRecordModalOpen: false
            }, () => {
                this.props.createSuccessNotification('Training record deleted!');
                this.findReportQuery();
            });
        }).catch(error => {
            console.log(error);
        });
    }

    createSafetyRecord = () => {
        const s_incident_title = this.state.add_s_incident_title;
        const s_incident_description = this.state.add_s_incident_description;
        const t_incident = this.state.add_t_incident;
        const s_incident_location = this.state.add_s_incident_location;
        const s_corrective_disciplinary_action = this.state.add_s_corrective_disciplinary_action;
        const s_modified_by = this.state.add_s_modified_by;
        const t_modified = moment().local().format('MM/DD/YYYY hh:mm A');
        const i_employee_id = this.state.selectedEmloyee && this.state.selectedEmloyee.id;

        axios.post(`${this.props.baseApiUrl}/createSafetyRecord`, {
            i_employee_id,
            s_incident_title,
            s_incident_description,
            t_incident,
            s_incident_location,
            s_corrective_disciplinary_action,
            s_modified_by,
            t_modified
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {
            this.handleSelectEmployeeWithId(i_employee_id);
        }).catch(error => {
            console.log(error);
        });
    }

    handleEditSafetyRecordModal = (e) => {
        const {id} = e.target;
        this.setState(prevState => ({
            editSafetyRecordModalOpen: !prevState.editSafetyRecordModalOpen
        }), () => {
            if (this.state.editSafetyRecordModalOpen) {
                this.setEditSafetyRecordValues(id);
            }
        });
    }

    setEditSafetyRecordValues = (id) => {
        const selectedSafetyRecord = this.state.selectedEmloyee.safetyHistory.filter(r => r.id.toString() === id.toString())[0];
        this.setState({
            editSafetyRecordId: id,
            edit_s_incident_title: selectedSafetyRecord.s_incident_title,
            edit_s_incident_description: selectedSafetyRecord.s_incident_description,
            edit_t_incident: selectedSafetyRecord.t_incident,
            edit_s_incident_location: selectedSafetyRecord.s_incident_location,
            edit_s_corrective_disciplinary_action: selectedSafetyRecord.s_corrective_disciplinary_action,
        });
    }

    saveSafetyRecordEdits = () => {
        const id = this.state.editSafetyRecordId;
        const s_incident_title = this.state.edit_s_incident_title;
        const s_incident_description = this.state.edit_s_incident_description;
        const t_incident = this.state.edit_t_incident;
        const s_incident_location = this.state.edit_s_incident_location;
        const s_corrective_disciplinary_action = this.state.edit_s_corrective_disciplinary_action;
        const i_employee_id = this.state.selectedEmloyee && this.state.selectedEmloyee.id;
        const s_modified_by = this.state.add_s_modified_by;
        const t_modified = moment().local().format('MM/DD/YYYY hh:mm A');

        axios.post(`${this.props.baseApiUrl}/editSafetyRecord`, {
            id,
            s_incident_title,
            s_incident_description,
            t_incident,
            s_incident_location,
            s_corrective_disciplinary_action,
            s_modified_by,
            t_modified
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {
            this.setState({
                editSafetyRecordModalOpen: false
            }, () => {
                this.handleSelectEmployeeWithId(i_employee_id);
            });
            this.props.createSuccessNotification('Record updated');
        }).catch(error => {

        });
    }

    deleteSafetyRecord = () => {
        const id = this.state.editSafetyRecordId;
        const i_employee_id = this.state.selectedEmloyee && this.state.selectedEmloyee.id;

        axios.post(`${this.props.baseApiUrl}/deleteSafetyRecord`, {
            id
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {
            this.setState({
                deleteSafetyRecordModalOpen: false
            }, () => {
                this.handleSelectEmployeeWithId(i_employee_id);
            });
            this.props.createSuccessNotification('Record deleted');
        }).catch(error => {

        });
    }

    handleDeleteSafetyRecordModal = () => {
        this.setState(prevState => ({
            editSafetyRecordModalOpen: false,
            deleteSafetyRecordModalOpen: !prevState.deleteSafetyRecordModalOpen
        }), () => {
            console.log(this.state.editSafetyRecordModalOpen);
        });
    }

    // updateBaseReportEmployeesInfo = (e, id) => {
    //     //get e.id and e.value, use id to filter through and update the correct employee in baseReportEmployeesInfo

    //     const {baseReportEmployeesInfo} = this.state;
    //     const updateEmployee = baseReportEmployeesInfo.filter(employee => employee.id === id)[0];
    //     const property = e.target.id;
    //     const {value} = e.target;
    //     console.log(updateEmployee);
    //     console.log(property);
    //     console.log(value);
    //     updateEmployee[property] = value;
    //     const newEmployeesArray = baseReportEmployeesInfo.filter(employee => employee.id !== id);
    //     newEmployeesArray.push(updateEmployee);
    //     console.log(updateEmployee);
    //     console.log(newEmployeesArray);
    //     this.setState({
    //         baseReportEmployeesInfo: newEmployeesArray
    //     }, () => {
    //         console.log(this.state.baseReportEmployeesInfo);
    //     });
    // }

    updateBaseReportEmployeesInfo = (e, id) => {
        //get e.id and e.value, use id to filter through and update the correct employee in baseReportEmployeesInfo

        const {baseReportEmployeesInfo} = this.state;
        const property = e.target.id;
        const {value} = e.target;

        for (let i = 0; i < baseReportEmployeesInfo.length; i++) {
            if (baseReportEmployeesInfo[i].id === id) {
                baseReportEmployeesInfo[i][property] = value;
            }
        }

        console.log(property);
        console.log(value);

        this.setState({
            baseReportEmployeesInfo: baseReportEmployeesInfo
        }, () => {
            console.log(this.state.baseReportEmployeesInfo);
        });
    }

    addReportEmployee = () => {

        const email = this.props.user && this.props.user.s_email;
        const now = moment().local().format('MM/DD/YYYY hh:mm A');

        const newBaseReportEmployee = {
            id: '',
            s_name: '',
            s_job_title: '',
            s_department: '',
            d_date_of_hire: '',
            t_modified: now,
            s_modified_by: email,
            s_created_by: email,
            t_created: now
        }
        const setBaseReportEmployeesInfo = this.state.baseReportEmployeesInfo;
        setBaseReportEmployeesInfo.push(newBaseReportEmployee);
        console.log(setBaseReportEmployeesInfo);
        this.setState({
            baseReportEmployeesInfo: setBaseReportEmployeesInfo
        }, () => {
            console.log(this.state.baseReportEmployeesInfo)
        });
    }

    removeReportEmployee = (id) => {
        const setReportEmployees = this.state.baseReportEmployeesInfo.filter(e => e.id !== id);
        this.setState({
            baseReportEmployeesInfo: setReportEmployees
        });
    }

    manageIncidentFactors = () => {
        const {
            i_id,
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
        } = this.state;

        axios.post(`${this.props.baseApiUrl}/manageIncidentFactors`, {
            i_report_id: i_id,
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
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {

        }).catch(error => {

        });   
    }

    manageRootCauseAnalysisFindings = () => {
        const findingsArray = this.state.rcaFindingsArray;
        const i_report_id = this.state.i_id;
        axios.post(`${this.props.baseApiUrl}/manageRootCauseAnalysisFindings`, {
            i_report_id,
            findingsArray
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {

        }).catch(error => {

        });
    }

    manageSmsWhyMethodologyFactors = () => {
        const whyFactorsArray = this.state.whyFactorsArray;
        const i_report_id = this.state.i_id;
        axios.post(`${this.props.baseApiUrl}/manageSmsWhyMethodologyFactors`, {
            i_report_id,
            whyFactorsArray
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {

        }).catch(error => {

        });
    }

    render() {
        const {user, authButtonMethod, baseApiUrl, headerAuthCode, createSuccessNotification, halfWindow, width, displaySubmenu, handleDisplaySubmenu} = this.props;
        const {
            saveReady,
            i_id,
            reports,
            employees,
            selectedEmloyee,
            selectedReportId,
            fileInputKey,
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
            mediaArray,
            s_name,
            s_job_title,
            s_department,
            d_date_of_hire,
            newUserModal,
            editUserModal,
            s_training_element,
            d_date_of_training,
            d_next_training_date,
            editTrainingRecordModal,
            edit_s_training_element,
            edit_d_date_of_training,
            edit_d_next_training_date,
            deleteTrainingRecordModalOpen,
            // safety history:
            add_s_incident_title,
            add_s_incident_description,
            add_t_incident,
            add_s_incident_location,
            add_s_corrective_disciplinary_action,
            add_s_modified_by,
            add_t_modified,
            editSafetyRecordModalOpen,
            edit_s_incident_title,
            edit_s_incident_description,
            edit_t_incident,
            edit_s_incident_location,
            edit_s_corrective_disciplinary_action,
            deleteSafetyRecordModalOpen,
            baseReportEmployeesInfo,
            //Step7
            s_weather_environment_description,
            s_weather_similar_incidents_description,
            //Step8: Incident Factors:
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
            //Step 9
            rcaFindingsArray,
            //Step 10
            s_incident_cause,
            s_investigation_conclusion,
            whyFactorsArray             
        } = this.state;

        return(
            <Fragment>
                <AppLayout user={user} authButtonMethod={authButtonMethod} baseApiUrl={baseApiUrl} headerAuthCode={headerAuthCode}handleDisplaySubmenu={handleDisplaySubmenu}>
                    <SmsWizard
                        saveReady={saveReady}
                        displaySubmenu={displaySubmenu}
                        i_id={i_id}
                        user={user}
                        authButtonMethod={authButtonMethod}
                        baseApiUrl={baseApiUrl}
                        headerAuthCode={headerAuthCode}
                        handleInput={this.handleInput}
                        handleCheckBoxes={this.handleCheckBoxes}
                        getFiles={this.getFiles}
                        fileInputKey={fileInputKey}
                        reports={reports}
                        employees={employees}
                        baseReportEmployeesInfo={baseReportEmployeesInfo}
                        handleSelectEmployee={this.handleSelectEmployee}
                        handleSelectEmployeeWithId={this.handleSelectEmployeeWithId}
                        selectedEmloyee={selectedEmloyee}
                        selectedReportId={selectedReportId}
                        selectReport={this.selectReport}
                        startNewReport={this.startNewReport}
                        saveSmsMedia={this.saveSmsMedia}
                        deleteSmsMedia={this.deleteSmsMedia}
                        updateComments={this.updateComments}
                        s_station={s_station}
                        s_customer={s_customer}
                        t_incident={t_incident}
                        s_incident_location={s_incident_location}
                        s_investigation_conducted_by={s_investigation_conducted_by}
                        s_investigation_conducted_by_title={s_investigation_conducted_by_title}
                        d_investigation_conducted={d_investigation_conducted}
                        s_investigation_approved_by={s_investigation_approved_by}
                        s_investigation_approved_by_title={s_investigation_approved_by_title}
                        d_investigation_approved={d_investigation_approved}
                        b_evidence_witness_statements={b_evidence_witness_statements}
                        b_evidence_training_records={b_evidence_training_records}
                        b_evidence_drug_alcohol_testing_docs={b_evidence_drug_alcohol_testing_docs}
                        b_evidence_external_reports={b_evidence_external_reports}
                        b_evidence_photos={b_evidence_photos}
                        b_evidence_cctv_footage={b_evidence_cctv_footage}
                        b_evidence_other={b_evidence_other}
                        s_incident_reference={s_incident_reference}
                        s_incident_type={s_incident_type}
                        d_incident_date={d_incident_date}
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
                        resolveReportStartComplete={this.resolveReportStartComplete}
                        handleEmployeeInjury={this.handleEmployeeInjury}
                        handleAircraftDamage={this.handleAircraftDamage}
                        saveReport={this.saveReport}
                        saveReportWithNotification={this.saveReportWithNotification}
                        mediaArray={mediaArray}
                        s_name={s_name}
                        s_job_title={s_job_title}
                        s_department={s_department}
                        d_date_of_hire={d_date_of_hire}
                        newUserModal={newUserModal}
                        editUserModal={editUserModal}
                        handleNewUserModal={this.handleNewUserModal}
                        handleEditUserModal={this.handleEditUserModal}
                        launchModalCreateUser={this.launchModalCreateUser}
                        handleDateOfHire={this.handleDateOfHire}
                        enableCreateUser={this.enableCreateUser}
                        handleCreateUser={this.handleCreateUser}
                        handleUpdateUser={this.handleUpdateUser}
                        handleDeleteUser={this.handleDeleteUser}
                        s_training_element={s_training_element}
                        d_date_of_training={d_date_of_training}
                        d_next_training_date={d_next_training_date}
                        checkEnableSavingTrainingRecord={this.checkEnableSavingTrainingRecord}
                        createEmployeeTrainingRecord={this.createEmployeeTrainingRecord}
                        editTrainingRecordModal={editTrainingRecordModal}
                        handleEditTrainingRecordModal={this.handleEditTrainingRecordModal}
                        editEmployeeTrainingRecord={this.editEmployeeTrainingRecord}
                        deleteTrainingRecord={this.deleteTrainingRecord}
                        edit_s_training_element={edit_s_training_element}
                        edit_d_date_of_training={edit_d_date_of_training}
                        edit_d_next_training_date={edit_d_next_training_date}
                        deleteTrainingRecordModalOpen={deleteTrainingRecordModalOpen}
                        handleDeleteTrainingRecordModal={this.handleDeleteTrainingRecordModal}
                        //report employee:
                        addReportEmployee={this.addReportEmployee}
                        removeReportEmployee={this.removeReportEmployee}
                        updateBaseReportEmployeesInfo={this.updateBaseReportEmployeesInfo}
                        //safety:
                        add_s_incident_title={add_s_incident_title}
                        add_s_incident_description={add_s_incident_description}
                        add_t_incident={add_t_incident}
                        add_s_incident_location={add_s_incident_location}
                        add_s_corrective_disciplinary_action={add_s_corrective_disciplinary_action}
                        add_s_modified_by={add_s_modified_by}
                        add_t_modified={add_t_modified}
                        createSafetyRecord={this.createSafetyRecord}
                        editSafetyRecordModalOpen={editSafetyRecordModalOpen}
                        handleEditSafetyRecordModal={this.handleEditSafetyRecordModal}
                        edit_s_incident_title={edit_s_incident_title}
                        edit_s_incident_description={edit_s_incident_description}
                        edit_t_incident={edit_t_incident}
                        edit_s_incident_location={edit_s_incident_location}
                        edit_s_corrective_disciplinary_action={edit_s_corrective_disciplinary_action}
                        saveSafetyRecordEdits={this.saveSafetyRecordEdits}
                        deleteSafetyRecordModalOpen={deleteSafetyRecordModalOpen}
                        handleDeleteSafetyRecordModal={this.handleDeleteSafetyRecordModal}
                        deleteSafetyRecord={this.deleteSafetyRecord}
                        createSuccessNotification={createSuccessNotification}
                        //Step7
                        s_weather_environment_description={s_weather_environment_description}
                        s_weather_similar_incidents_description={s_weather_similar_incidents_description}
                        //Step8: Incident Factors:
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
                        manageIncidentFactors={this.manageIncidentFactors}
                        //Step 9: RCA Findings
                        rcaFindingsArray={rcaFindingsArray}
                        updateRcaFindingsArray={this.updateRcaFindingsArray}
                        addRcaFindingsArray={this.addRcaFindingsArray}
                        deleteRcaFindingsArray={this.deleteRcaFindingsArray}
                        manageRootCauseAnalysisFindings={this.manageRootCauseAnalysisFindings}
                        //Step 10: Why Methodology Factors:
                        s_incident_cause={s_incident_cause}
                        s_investigation_conclusion={s_investigation_conclusion}
                        whyFactorsArray={whyFactorsArray}
                        updateWhyFactorsArray={this.updateWhyFactorsArray}
                        addWhyFactorsArray={this.addWhyFactorsArray}
                        deleteWhyFactorsArray={this.deleteWhyFactorsArray}
                        manageSmsWhyMethodologyFactors={this.manageSmsWhyMethodologyFactors}
                    />
                </AppLayout>
            </Fragment>
        );
    }
}

export default withRouter(SMS);