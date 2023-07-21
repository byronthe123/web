// import React, {Component} from 'react';
// import {withRouter} from 'react-router-dom';
// import moment from 'moment';
// import axios from 'axios';
// import AppLayout from '../../components/AppLayout';
// import uuidv4 from 'uuid/v4';

// import { Table, Button, Input, Card, CardBody, Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
// import { NavLink } from "react-router-dom";
// import classnames from "classnames";

// import ImportExportStatsPage from '../../components/reporting/stats/ImportExportStatsPage';
// 
// import ValidatePage from '../../components/reporting/stats/ValidatePage';
// import RampPage from '../../components/reporting/stats/RampPage';
// import MiscPage from '../../components/reporting/stats/MiscPage';
// import NewMisc from '../../components/reporting/stats/NewMisc';
// import StatsReport from '../../components/reporting/stats/StatsReport';


// class Stats extends Component {
//     constructor(props){
//         super(props);
//         this.state = {
//             activeFirstTab: "1",
//             homeMenuButtons: [
//                 {
//                     name: 'Import Flight',
//                     id: 'import',
//                     color: 'primary',
//                     value: 'import'
//                 },
//                 {
//                     name: 'Export Flight',
//                     id: 'export',
//                     color: 'info',
//                     value: 'export'
//                 },
//                 {
//                     name: 'Ramp',
//                     id: 'ramp',
//                     color: 'success',
//                     value: 'ramp'
//                 },
//                 {
//                     name: 'Misc',
//                     id: 'misc',
//                     color: 'secondary',
//                     value: 'misc',
//                     small: true
//                 },
//                 {
//                     name: 'Validate',
//                     id: 'validate',
//                     color: 'danger',
//                     value: 'validate',
//                     admin: true,
//                     small: true
//                 }
//             ],
//             page: 'import',
//             s_type: 'import',
//             user: null,
//             //creating stat fields:
//             s_airline_code: '',
//             s_flight_number: '',
//             d_flight: '',
//             i_awb: 0,
//             i_pieces: 0,
//             i_awb_dg: 0,
//             i_awb_prepare: 0,
//             i_ld3: 0,
//             i_ld3_bup: 0,
//             i_ld7: 0,
//             i_ld7_bup: 0,
//             f_bup_kg: 0,
//             f_loose_kg: 0,
//             f_mail_kg: 0,
//             f_total_kg: 0,
//             f_flight_kg: 0,
//             f_transfer_kg: 0,
//             f_awb_transfer: 0,
//             f_courier_kg: 0,
//             b_nil: false,
//             b_cancelled: false,
//             s_notes: '',
//             b_validated:false,
//             b_final:false,
//             b_paid:false,
//             b_invoiced:false,
//             f_tsa_kg: 0,
//             //ramp only:
//             f_aircraft_handling: '',
//             f_aircraft_parking: '',
//             i_lavatory: '',
//             i_water: '',
//             i_cabin_cleaning: '',
//             i_waste_removal: '',
//             s_aircraft_type: '',
//             f_flight_watch: '',
//             f_gpu: '',
//             f_asu: '',
//             f_deicing: '',
//             f_weight_balance: '',
//             f_customs: '',
//             f_gen_dec: '',
//             //misc only:
//             f_drayage: 0,
//             f_uld_overage: 0,
//             f_transfer_skid: 0,
//             f_security_labor: 0,
//             f_security_space: 0,
//             f_misc: 0,
//             s_misc_uom: 'USD',
//             s_misc_type: 'ULD OVERAGE',
//             s_misc_other_value: '',
//             //other
//             f_office_rent: '',
//             //stats table and details:
//             stats: [],
//             filteredStats: [],
//             displayFilteredStats: false,
//             airlineLogo: null,
//             selectedStatId: null,
//             selectedStat: null,
//             filterAirlineCode: '',
//             filterFlightNum: '',
//             filterAirlineDate: null,
//             filterValidated: null,
//             selectionBoxFlightCode: null,
//             //misc:
//             enterWeightLbs: false
//         }
//         this.toggleTab = this.toggleTab.bind(this);
//     }

//     toggleTab(tab) {
//         if (this.state.activeTab !== tab) {
//           this.setState({
//             activeFirstTab: tab
//           }, () => {
//               this.selectPageWithTabs(tab);
//           });
//         }
//     }

//     resolveTabPage = (tab) => {
//         switch(tab) {
//             case '1':
//                 return 'import';
//             case '2':
//                 return 'export';
//             case '3':
//                 return 'ramp';
//             case '4':
//                 return 'misc';
//             case '5':
//                 return 'validate';

//         }
//     }

//     selectPageWithTabs = (tab) => {
//         const property = 'page';
//         const value = this.resolveTabPage(tab);

//         this.setState({
//             [property]: value,
//             filterAirlineCode: '',
//             filterFlightNum: '',
//             filterAirlineDate: null,
//             filterValidated: null,
//             selectionBoxFlightCode: null
//         }, () => {
//             if (property === 'page' || property === 's_type') {
//                 if (value === 'import' || value === 'export' || value === 'ramp' || value === 'misc') {
//                     this.setState({
//                         s_type: value
//                     }, () => {
//                         this.resetFields(() => {
//                             if (this.state.displayFilteredStats) {
//                                 this.selectFilteredStats();
//                             } else {
//                                 this.selectStats();
//                             }                        
//                         }, true);
//                     });
//                 } else if (value === 'validate') {
//                     this.setState({
//                         s_type: 'export'
//                     }, () => {
//                         if (this.state.displayFilteredStats) {
//                             this.selectFilteredStats();
//                         } else {
//                             this.selectStats();
//                         }                    
//                     });
//                 }
//             }    
//         })

//     }

//     componentDidMount() {
//         this.selectStats();
//     }

//     static getDerivedStateFromProps(nextProps, prevState) {
//         if (prevState.user !== nextProps.user) {
//             return  {
//                 user: nextProps.user
//             }
//         }
//         return null
//     }

//     componentDidUpdate(prevProps) {
//         if (this.props.user !== prevProps.user) {
//             this.selectStats();
//         }
//     } 
    
//     runFilterStats = (property) => {
//         const filterPropertiesArray = ['filterAirlineDate'];
//         if (filterPropertiesArray.indexOf(property) !== -1) {
//             this.runSelectFilteredStats();
//         }
//     }

//     handleInput = (e) => {
//         const property = e.target.id;
//         const value = e.target.value;

//         console.log(property);
//         console.log(value);

//         this.setState({
//             [property]: value
//         }, () => {
//             if (property === 'f_total_kg' || property === 'f_bup_kg' || property === 'f_mail_kg') {
//                 this.reCalcTotals();
//             } 
//         });
//     }

//     handleFilterInput = (e) => {
//         const property = e.target.id;
//         const value = e.target.value;

//         this.setState({
//             [property]: value
//         }, () => {
//             this.runFilterStats(property);
//         });
//     }

//     selectStatId = (id, validate=false) => {
//         this.setState({
//             selectedStatId: id
//         }, () => {
//             this.selectStat(validate);
//         });
//     }

//     resolveValue = (value) => {
//         if (value) {
//             return value;
//         }
//         return '';
//     }

//     selectStat = (validate) => {
//         const {stats, filteredStats, selectedStatId} = this.state;
//         const searchStats = [...stats, ...filteredStats];
//         const _selectedStat = searchStats.filter(s => s.i_id === selectedStatId)[0];
//         console.log(_selectedStat);
//         this.setState({
//             selectedStat: _selectedStat
//         }, () => {
//             validate ? this.setValidateFields() : this.resetFields(null);
//         });
//     }

//     setValidateFields = () => {
//         const { selectedStat } = this.state;

//         this.setState({
//             s_airline_code: this.resolveValue(selectedStat.s_airline_code),
//             s_flight_number: this.resolveValue(selectedStat.s_flight_number),
//             s_aircraft_type: this.resolveValue(selectedStat.s_aircraft_type),
//             d_flight: this.resolveValue(selectedStat.d_flight),
//             i_awb: this.resolveValue(selectedStat.i_awb),
//             i_pieces: this.resolveValue(selectedStat.i_pieces),
//             i_awb_dg: this.resolveValue(selectedStat.i_awb_dg),
//             i_awb_prepare: this.resolveValue(selectedStat.i_awb_prepare),
//             i_ld3: this.resolveValue(selectedStat.i_ld3),
//             i_ld3_bup: this.resolveValue(selectedStat.i_ld3_bup),
//             i_ld7: this.resolveValue(selectedStat.i_ld7),
//             i_ld7_bup: this.resolveValue(selectedStat.i_ld7_bup),
//             f_bup_kg: this.resolveValue(selectedStat.f_bup_kg),
//             f_loose_kg: this.resolveValue(selectedStat.f_loose_kg),
//             f_mail_kg: this.resolveValue(selectedStat.f_mail_kg),
//             f_total_kg: this.resolveValue(selectedStat.f_total_kg),
//             f_flight_kg: this.resolveValue(selectedStat.f_flight_kg),
//             f_transfer_kg: this.resolveValue(selectedStat.f_transfer_kg),
//             f_awb_transfer: this.resolveValue(selectedStat.f_awb_transfer),
//             f_courier_kg: this.resolveValue(selectedStat.f_courier_kg),
//             b_nil: selectedStat.b_nil,
//             b_cancelled: selectedStat.b_cancelled,
//             s_notes: '',
//             b_validated: selectedStat.b_validated,
//             b_final: selectedStat.b_final,
//             b_paid: selectedStat.b_paid,
//             b_invoiced: selectedStat.b_invoiced,
//             f_tsa_kg: selectedStat.f_tsa_kg ? selectedStat.f_tsa_kg : '',
//             f_aircraft_handling: selectedStat.f_aircraft_handling,
//             f_aircraft_parking: selectedStat.f_aircraft_parking,
//             i_lavatory: selectedStat.i_lavatory ? selectedStat.i_lavatory : '',
//             i_water: selectedStat.i_water ? selectedStat.i_water : '',
//             i_cabin_cleaning: selectedStat.i_cabin_cleaning ? selectedStat.i_cabin_cleaning : '',
//             i_waste_removal: selectedStat.i_waste_removal ? selectedStat.i_waste_removal : '',
//             f_drayage: selectedStat.f_drayage ? selectedStat.f_drayage : '',
//             f_uld_overage: selectedStat.f_uld_overage ? selectedStat.f_uld_overage : '',
//             f_transfer_skid: selectedStat.f_transfer_skid ? selectedStat.f_transfer_skid : '',
//             f_security_labor: selectedStat.f_security_labor ? selectedStat.f_security_labor : '',
//             f_security_space: selectedStat.f_security_space ? selectedStat.f_security_space : '',
//             f_misc: selectedStat.f_misc ? selectedStat.f_misc : '',
//             s_misc_uom: selectedStat.s_misc_uom,
//             s_misc_type: selectedStat.s_misc_type ? selectedStat.s_misc_type : '',
//             f_flight_watch: selectedStat.f_flight_watch ? selectedStat.f_flight_watch : '',
//             f_gpu: selectedStat.f_gpu ? selectedStat.f_gpu : '',
//             f_asu: selectedStat.f_asu ? selectedStat.f_asu : '',
//             f_deicing: selectedStat.f_deicing ? selectedStat.f_deicing : '',
//             f_weight_balance: selectedStat.f_weight_balance ? selectedStat.f_weight_balance : '',
//             f_customs: selectedStat.f_customs ? selectedStat.f_customs : '',
//             f_gen_dec: selectedStat.f_gen_dec ? selectedStat.f_gen_dec : ''
//         });
//     }

//     resetFields = (callback, hard=false) => {
//         this.setState({
//             s_airline_code: '',
//             s_flight_number: '',
//             s_aircraft_type: '',
//             d_flight: '',
//             i_awb: 0,
//             i_pieces: 0,
//             i_awb_dg: 0,
//             i_awb_prepare: 0,
//             i_ld3: 0,
//             i_ld3_bup: 0,
//             i_ld7: 0,
//             i_ld7_bup: 0,
//             f_bup_kg: 0,
//             f_loose_kg: 0,
//             f_mail_kg: 0,
//             f_total_kg: 0,
//             f_flight_kg: 0,
//             f_transfer_kg: 0,
//             f_awb_transfer: 0,
//             f_courier_kg: 0,
//             f_tsa_kg: 0,
//             f_aircraft_handling: '',
//             f_aircraft_parking: '',
//             i_lavatory: '',
//             i_water: '',
//             i_cabin_cleaning: '',
//             i_waste_removal: '',
//             f_drayage: '',
//             f_uld_overage: '',
//             f_transfer_skid: '',
//             f_security_labor: '',
//             f_security_space: '',
//             b_nil: false,
//             b_cancelled: false,
//             s_notes: '',
//             b_validated:false,
//             b_final:false,
//             b_paid:false,
//             b_invoiced:false,
//             selectedStat: hard ? null : this.state.selectedStat,
//             selectionBoxFlightCode: null,
//             //ramp
//             f_flight_watch: '',
//             f_gpu: '',
//             f_asu: '',
//             f_deicing: '',
//             f_weight_balance: '',
//             f_customs: '',
//             f_gen_dec: ''
//         }, () => {
//             if (callback && callback !== null) {
//                 return callback();
//             }
//         });
//     }

//     selectPage = (e) => {
//         const property = e.target.id;
//         const value = e.target.value;

//         this.setState({
//             [property]: value,
//             filterAirlineCode: '',
//             filterFlightNum: '',
//             filterAirlineDate: null,
//             filterValidated: null,
//             selectionBoxFlightCode: null
//         }, () => {
//             if (property === 'page' || property === 's_type') {
//                 if (value === 'import' || value === 'export' || value === 'ramp' || value === 'misc') {
//                     this.setState({
//                         s_type: value
//                     }, () => {
//                         this.resetFields(() => {
//                             if (this.state.displayFilteredStats) {
//                                 this.selectFilteredStats();
//                             } else {
//                                 this.selectStats();
//                             }                        
//                         }, true);
//                     });
//                 } else if (value === 'validate') {
//                     this.setState({
//                         s_type: 'export'
//                     }, () => {
//                         if (this.state.displayFilteredStats) {
//                             this.selectFilteredStats();
//                         } else {
//                             this.selectStats();
//                         }                    
//                     });
//                 }
//             }    
//         })

//     }

//     reCalcTotals = () => {
//         //let setZero = false
//         // const setZeroArray = ['f_total_kg', 'f_bup_kg', 'f_mail_kg'];

//         // for (let i = 0; i < setZeroArray.length; i++) {
//         //     if (this.state[setZeroArray[i]] < 0 || this.state[setZeroArray[i]] === '') {
//         //         this.setState({
//         //             [setZeroArray[i]]: 0
//         //         });
//         //     }
//         //     if (i === setZeroArray.length - 1) {
//         //         setZero = true;
//         //     }   
//         // }

//         this.setState({
//             f_loose_kg: this.state.f_total_kg - this.state.f_bup_kg,
//             //f_flight_kg: !isNaN(parseFloat(this.state.f_total_kg)) ? parseFloat(this.state.f_total_kg) : 0 + !isNaN(parseFloat(this.state.f_mail_kg)) ? parseFloat(this.state.f_mail_kg) : 0
//         }, () => {
//             const set_f_flight_kg = !isNaN(parseFloat(this.state.f_total_kg)) && !isNaN(parseFloat(this.state.f_mail_kg)) ? parseFloat(this.state.f_total_kg) + parseFloat(this.state.f_mail_kg) : 0;
//             this.setState({
//                 f_flight_kg: set_f_flight_kg
//             });
            
//         });
//     }
    
//     handleSwitchNil = () => {
//         this.setState(prevState => ({
//             b_nil: !prevState.b_nil
//         }));
//     }

//     handleSwitchFilterValidated = () => {
//         this.setState(prevState => ({
//             filterValidated: !prevState.filterValidated
//         }), () => {
//             this.runFilterStats('filterValidated');
//         });
//     }

//     handleSwitchCancelled = () => {
//         this.setState(prevState => ({
//             b_cancelled: !prevState.b_cancelled
//         }));
//     }

//     handleSwitchWeightType = () => {
//         this.setState(prevState => ({
//             enterWeightLbs: !prevState.enterWeightLbs,
//             f_courier_kg: 0,
//             f_total_kg: 0,
//             f_bup_kg: 0,
//             f_loose_kg: 0,
//             f_mail_kg: 0,
//             f_awb_transfer: 0,
//             f_transfer_kg: 0,
//             f_courier_kg: 0,
//             f_flight_kg: 0
//         }));
//     }

//     resolveWeightKgs = (lbs) => {
//         return (lbs * 0.45359237).toFixed(2);
//     }

//     handleCreateStatRecord = (type) => {
//         if (this.state.enterWeightLbs) {

//             this.setState(prevState => ({
//                 f_transfer_kg: this.resolveWeightKgs(prevState.f_transfer_kg),
//                 f_courier_kg: this.resolveWeightKgs(prevState.f_courier_kg),
//                 f_awb_transfer: this.resolveWeightKgs(prevState.f_awb_transfer),
//                 f_flight_kg: this.resolveWeightKgs(prevState.f_flight_kg),
//                 f_mail_kg: this.resolveWeightKgs(prevState.f_mail_kg),
//                 f_loose_kg: this.resolveWeightKgs(prevState.f_loose_kg),
//                 f_bup_kg: this.resolveWeightKgs(prevState.f_bup_kg),
//                 f_total_kg: this.resolveWeightKgs(prevState.f_total_kg),
//             }), () => {
//                 this.createStatRecord(type);
//             });
//         } else {
//             this.createStatRecord(type);
//         }
//     }

//     createStatRecord = (type) => {

//         const {
//             s_airline_code,
//             s_flight_number,
//             s_aircraft_type,
//             d_flight,
//             i_awb,
//             i_pieces,
//             i_awb_dg,
//             i_awb_prepare,
//             i_ld3,
//             i_ld3_bup,
//             i_ld7,
//             i_ld7_bup,
//             f_bup_kg,
//             f_loose_kg,
//             f_mail_kg,
//             f_flight_kg,
//             f_total_kg,
//             f_transfer_kg,
//             f_awb_transfer,
//             f_courier_kg,
//             b_nil,
//             b_cancelled,
//             b_final,
//             b_paid,
//             b_invoiced,
//             f_tsa_kg,
//             f_aircraft_handling,
//             f_aircraft_parking,
//             i_lavatory,
//             i_water,
//             i_cabin_cleaning,
//             i_waste_removal,
//             f_drayage,
//             f_uld_overage,
//             f_office_rent,
//             f_transfer_skid,
//             f_security_labor,
//             f_security_space,
//             s_type,
//             f_misc,
//             s_misc_uom,
//             s_misc_type,
//             s_misc_other_value,
//             f_flight_watch,
//             f_gpu,
//             f_asu,
//             f_deicing,
//             f_weight_balance,
//             f_customs,
//             f_gen_dec  
//         } = this.state;
    
//         //fields to set conditionally:
//         let s_notes, s_activity, b_validated, s_status, url, s_guid, successMessage;

//         s_notes = null;
//         const previousNotes = this.state.selectedStat && this.state.selectedStat.s_notes !== null ? this.state.selectedStat.s_notes : '';
//         const _s_notes = this.state.s_notes;
//         const newNotes = `${_s_notes}`;
//         const setMiscType = s_misc_type === 'OTHER' ? s_misc_other_value : s_misc_type;

//         if (type === 'validate') {
//             const previousActivity = this.state.selectedStat && this.state.selectedStat.s_activity;
//             s_activity = `${previousActivity}${moment().format('MM/DD/YYYY hh:mm A')} | VALIDATED | BY ${this.props.user.displayName}.`;    
            
//             if (_s_notes.length > 0) {
//                 s_notes = `${previousNotes}. ${newNotes}`;
//             }
    
//             b_validated = true;
    
//             s_status = 'VALIDATED';
    
//             url = 'validateStat';
    
//             s_guid = this.state.selectedStat && this.state.selectedStat.s_guid; 
            
//             successMessage = 'Stat Validated';
//         } else {
//             s_activity = `${moment().format('MM/DD/YYYY hh:mm A')} | CREATED | BY ${this.props.user.displayName}.`;
    
//             if (_s_notes.length > 0) {
//                 s_notes = `${newNotes}`;
//             }
    
//             b_validated = false;
    
//             s_status = 'ENTERED';
    
//             url = 'createStatRecord';
    
//             s_guid = uuidv4();

//             successMessage = 'Stat Created';
//         }
    
//         const agent = this.props.user && this.props.user.s_email;
//         const now = moment().local().format('MM/DD/YYYY hh:mm A');
    
//         //const s_guid = uuidv4();
//         const s_unit = this.props.user.s_unit;
//         const t_created = now;
//         const s_created_by = agent;
//         const t_modified = now;
//         const s_modified_by = agent;
//         const t_validated = now;
//         const s_validated_by = agent;
//         const s_category = s_type;
    
//         let data;
    
//         if (type === 'validate') {
//             data = {
//                 s_guid,
//                 s_status,
//                 s_airline_code,
//                 s_flight_number,
//                 s_aircraft_type,
//                 d_flight,
//                 i_awb,
//                 i_pieces,
//                 i_awb_dg,
//                 i_awb_prepare,
//                 i_ld3,
//                 i_ld3_bup,
//                 i_ld7,
//                 i_ld7_bup,
//                 f_bup_kg,
//                 f_loose_kg,
//                 f_mail_kg,
//                 f_flight_kg,
//                 f_total_kg,
//                 f_transfer_kg,
//                 f_awb_transfer,
//                 f_courier_kg,
//                 f_tsa_kg,
//                 b_nil,
//                 b_cancelled,
//                 s_notes,
//                 b_validated,
//                 t_validated,
//                 s_validated_by,
//                 f_aircraft_handling,
//                 f_aircraft_parking,
//                 i_lavatory,
//                 i_water,
//                 i_cabin_cleaning,
//                 i_waste_removal,
//                 f_drayage,
//                 f_uld_overage,
//                 f_transfer_skid,
//                 f_security_labor,
//                 f_security_space,
//                 t_modified,
//                 s_modified_by,
//                 s_activity,
//                 f_flight_watch,
//                 f_gpu,
//                 f_asu,
//                 f_deicing,
//                 f_weight_balance,
//                 f_customs,
//                 f_gen_dec,
//                 f_misc,
//                 s_misc_uom,
//                 s_misc_type: setMiscType
//             }
//         } else if (type === 'importExport') {
//             data = {
//                 s_guid,
//                 s_unit,
//                 s_type,
//                 s_status,
//                 s_airline_code,
//                 s_flight_number,
//                 s_aircraft_type,
//                 d_flight,
//                 i_awb,
//                 i_pieces,
//                 i_awb_dg,
//                 i_awb_prepare,
//                 i_ld3,
//                 i_ld3_bup,
//                 i_ld7,
//                 i_ld7_bup,
//                 f_tsa_kg,
//                 f_bup_kg,
//                 f_loose_kg,
//                 f_mail_kg,
//                 f_flight_kg,
//                 f_total_kg,
//                 f_transfer_kg,
//                 f_awb_transfer,
//                 f_courier_kg,
//                 f_aircraft_handling,
//                 f_aircraft_parking,
//                 i_lavatory,
//                 i_water,
//                 i_cabin_cleaning,
//                 i_waste_removal,
//                 f_drayage,
//                 f_uld_overage,
//                 f_office_rent,
//                 f_transfer_skid,
//                 f_security_labor,
//                 f_security_space,
//                 b_nil,
//                 b_cancelled,
//                 s_notes,
//                 b_final,
//                 b_paid,
//                 b_invoiced,
//                 b_validated,
//                 t_created,
//                 s_created_by,
//                 t_modified,
//                 s_modified_by,
//                 s_category,
//                 s_activity
//             }
//         } else if (type === 'ramp') {
//             data = {
//                 s_guid,
//                 s_unit,
//                 s_type,
//                 s_status,
//                 s_airline_code,
//                 s_flight_number,
//                 s_aircraft_type,
//                 d_flight,
//                 i_awb: null,
//                 i_pieces: null,
//                 i_awb_dg: null,
//                 i_awb_prepare: null,
//                 i_ld3: null,
//                 i_ld3_bup: null,
//                 i_ld7: null,
//                 i_ld7_bup: null,
//                 f_bup_kg: null,
//                 f_loose_kg,
//                 f_mail_kg: null,
//                 f_flight_kg,
//                 f_total_kg: null,
//                 f_transfer_kg: null,
//                 f_awb_transfer: null,
//                 f_courier_kg: null,
//                 f_aircraft_handling,
//                 f_aircraft_parking,
//                 i_lavatory,
//                 i_water,
//                 i_cabin_cleaning,
//                 i_waste_removal,
//                 f_drayage,
//                 f_uld_overage: null,
//                 f_office_rent: null,
//                 f_transfer_skid: null,
//                 f_security_labor: null,
//                 f_security_space: null,
//                 b_nil,
//                 b_cancelled,
//                 s_notes,
//                 b_final,
//                 b_paid,
//                 b_invoiced,
//                 b_validated,
//                 t_created,
//                 s_created_by,
//                 t_modified,
//                 s_modified_by,
//                 s_category,
//                 s_activity,
//                 f_flight_watch,
//                 f_gpu,
//                 f_asu,
//                 f_deicing,
//                 f_weight_balance,
//                 f_customs,
//                 f_gen_dec,
//                 //unused:
//                 f_tsa_kg: null
//             }
//         } else if (type === 'misc') {
//             data = {
//                 s_guid,
//                 s_unit,
//                 s_type,
//                 s_status,
//                 s_airline_code,
//                 s_flight_number,
//                 s_aircraft_type,
//                 d_flight,
//                 i_awb: null,
//                 i_pieces: null,
//                 i_awb_dg: null,
//                 i_awb_prepare: null,
//                 i_ld3: null,
//                 i_ld3_bup: null,
//                 i_ld7: null,
//                 i_ld7_bup: null,
//                 f_bup_kg: null,
//                 f_loose_kg,
//                 f_mail_kg: null,
//                 f_flight_kg,
//                 f_total_kg: null,
//                 f_transfer_kg: null,
//                 f_awb_transfer: null,
//                 f_courier_kg: null,
//                 f_aircraft_handling: null,
//                 f_aircraft_parking: null,
//                 i_lavatory,
//                 i_water,
//                 i_cabin_cleaning,
//                 i_waste_removal,
//                 f_drayage: null,
//                 f_uld_overage,
//                 f_office_rent,
//                 f_transfer_skid,
//                 f_security_labor,
//                 f_security_space,
//                 b_nil,
//                 b_cancelled,
//                 s_notes,
//                 b_final,
//                 b_paid,
//                 b_invoiced,
//                 b_validated,
//                 t_created,
//                 s_created_by,
//                 t_modified,
//                 s_modified_by,
//                 s_category,
//                 s_activity,
//                 //unused:
//                 f_tsa_kg: null,
//                 f_misc,
//                 s_misc_uom,
//                 s_misc_type: setMiscType
//             }
//         }
    
//         axios.post(`${this.props.baseApiUrl}/${url}`, {
//             data
//         }, {
//             headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
//         }).then(response => {
//             this.props.createSuccessNotification(successMessage);
//             this.resetFields(() => {
//                 if (this.state.displayFilteredStats) {
//                     this.selectFilteredStats(() => {
//                         this.selectStat(type === 'validate');
//                     });
//                 } else {
//                     this.selectStats();
//                 }
//             }, true);
//         }).catch(error => {
//             alert(error);
//         });
//     }

//     enableDeleteStatRecord = () => this.state.selectedStat && this.state.selectedStat.s_guid !== null;

//     deleteStatRecord = () => {
//         const s_guid = this.state.selectedStat && this.state.selectedStat.s_guid;
//         axios.post(`${this.props.baseApiUrl}/deleteStat`, {
//             s_guid
//         }, {
//             headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
//         }).then(response => {
//             this.props.createSuccessNotification(`Stat Deleted`);
//             this.resetFields(() => {
//                 if (this.state.displayFilteredStats) {
//                     this.selectFilteredStats();
//                 } else {
//                     this.selectStats();
//                 }
//             }, true);
//         }).catch(error => {

//         });
//     }
    
//     resolveAmountValues = () => {
//         const updateArray = [
//             'i_awb',
//             'i_pieces',
//             'i_awb_dg',
//             'i_ld3',
//             'i_ld3_bup',
//             'i_ld7',
//             'i_ld7_bup',
//             'f_bup_kg',
//             'f_loose_kg',
//             'f_mail_kg',
//             'f_total_kg',
//             'f_transfer_kg',
//             'f_awb_transfer',
//             'f_courier_kg',
//             'f_flight_kg'
//         ];

//         for(let i = 0; i < updateArray.length; i++) {
//             if (this.state[updateArray[i]] < 0) {
//                 this.setState({
//                     [updateArray[i]]: 0
//                 }, () => {
//                     this.reCalcTotals();
//                 });
//             }
//         }
//     }

//     enableSubmitStat = () => {
//         const {
//             s_airline_code,
//             s_flight_number,
//             s_aircraft_type,
//             d_flight,
//             i_awb,
//             i_pieces,
//             i_awb_dg,
//             i_awb_prepare,
//             i_ld3,
//             i_ld3_bup,
//             i_ld7,
//             i_ld7_bup,
//             f_bup_kg,
//             f_loose_kg,
//             f_mail_kg,
//             f_flight_kg,
//             f_total_kg,
//             f_transfer_kg,
//             f_awb_transfer,
//             f_courier_kg,
//             f_tsa_kg,
//             b_nil,
//             b_cancelled,
//             s_notes,
//             b_final,
//             b_paid,
//             b_invoiced,
//             s_misc_type,
//             s_misc_other_value
//         } = this.state;

//         const checkArray = [
//             i_awb,
//             i_pieces,
//             i_awb_dg,
//             i_awb_prepare,
//             i_ld3,
//             i_ld3_bup,
//             i_ld7,
//             i_ld7_bup,
//             f_bup_kg,
//             f_loose_kg,
//             f_mail_kg,
//             f_total_kg,
//             f_transfer_kg,
//             f_awb_transfer,
//             f_courier_kg,
//             f_tsa_kg,
//             f_flight_kg
//         ];

//         let validAmounts = true;

//         for (let i = 0; i < checkArray.length; i++) {
//             if (checkArray[i] < 0 || isNaN(checkArray[i])) {
//                 validAmounts = false;
//             }
//         }

//         const miscOtherValueValid = s_misc_type !== 'OTHER' ?
//             true :
//             s_misc_type === 'OTHER' && s_misc_other_value.length > 0 ?
//             true :
//             false;

//         const baseValid = validAmounts && s_airline_code.length >= 2 && d_flight.length > 0 && moment(d_flight).isValid() && miscOtherValueValid;

//         if (this.state.page === 'misc') {
//             return baseValid;
//         } else if (this.state.page === 'ramp') {
//             return baseValid && s_flight_number && s_flight_number !== null && s_flight_number.length > 0 && s_aircraft_type.length > 0;
//         } else {
//             return baseValid && s_flight_number && s_flight_number !== null && s_flight_number.length > 0;
//         }

//     }

//     resovleType = () => {
//         const {page} = this.state;
//         if (page === 'import') {
//             return 'IMPORT';
//         } else if (page === 'exportState') {
//             return 'EXPORT';
//         } else if (page === 'validate') {

//         }
//     }

//     selectStats = () => {
//         const s_unit = this.props.user && this.props.user.s_unit;
//         const {s_type} = this.state;
//         console.log(`running selectStats - type: ${s_type} and unit: ${s_unit}`);
//         s_unit && s_type && 
//         axios.post(`${this.props.baseApiUrl}/selectStats`, {
//             s_unit,
//             s_type
//         }, {
//             headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
//         }).then(response => {
//             console.log(response.data);
//             this.setState({
//                 stats: response.data
//             });
//         }).catch(error => {

//         });
//     }

//     displayLogo = () => {
//         const s_airline_code = this.state.filterAirlineCode;
//         const s_flight_number = this.state.filterFlightNum;

//         return (s_airline_code.length === 2) || (s_flight_number.length >= 2 && s_flight_number.length <= 6);
//     }

//     runSelectFilteredStats = () => {
//         const s_airline_code = this.state.filterAirlineCode;
//         const s_flight_number = this.state.filterFlightNum;
//         const d_flight = this.state.filterAirlineDate;
//         const b_validated = this.state.filterValidated;

//         const validAirlineCode = s_airline_code.length === 2;
//         const validFlightNumber = s_flight_number.length >= 2 && s_flight_number.length <= 6;
//         const validDate = moment(d_flight).isValid();

//         if (s_airline_code.length > 0 || s_flight_number.length > 0 || validDate || b_validated || !b_validated) {
//             this.setState({
//                 displayFilteredStats: true
//             }, () => {
//                 if (validAirlineCode || validFlightNumber || validDate || b_validated || !b_validated) {
//                     this.selectFilteredStats();
//                 }
//             });
//         } else if (s_airline_code.length === 0 && s_flight_number.length === 0 && !validDate && b_validated === null) {
//             this.setState({
//                 displayFilteredStats: false
//             });
//         }
//     }

//     selectFilteredStats = (callback) => {
//         const s_unit = this.props.user && this.props.user.s_unit;
//         const {s_type} = this.state;
//         const s_airline_code = this.state.filterAirlineCode;
//         const s_flight_number = this.state.filterFlightNum;
//         const d_flight = this.state.filterAirlineDate;
//         const b_validated = this.state.filterValidated;

//         console.log(`running selectFilteredStats: unit: ${s_unit}, type: ${s_type}, airlinCode: ${s_airline_code}, flightNumber: ${s_flight_number}, d_flight: ${d_flight}, b_validated: ${b_validated}`);

//         s_unit && s_type && 
//         axios.post(`${this.props.baseApiUrl}/selectFilteredStats`, {
//             s_unit,
//             s_type,
//             s_airline_code,
//             s_flight_number,
//             d_flight,
//             b_validated
//         }, {
//             headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
//         }).then(response => {
//             console.log(this.state.displayFilteredStats);
//             console.log(response.data);
//             this.setState({
//                 filteredStats: response.data,
//                 airlineLogo: response.data && response.data.length > 0 && response.data[0].logo_url ? response.data[0].logo_url : ''
//             }, () => {
//                 console.log(this.state.filteredStats);
//                 if (callback && callback !== null) {
//                     return callback();
//                 }
//             });
//         }).catch(error => {
//             console.log(error);
//         });
//     }

//     setSelectionBoxFlightCode = (code) => {
//         this.setState({
//             selectionBoxFlightCode: code,
//             s_airline_code: code
//         });
//     }

    
//     getSelectionBoxFlights = () => {
//         return [
//             {
//                 name: 'SAS-Scandinavian Airlines System',
//                 code: 'SK'
//             },
//             {
//                 name: 'Air China',
//                 code: 'CA'
//             },
//             {
//                 name: 'Air Canada',
//                 code: 'AC'
//             },
//             {
//                 name: 'El Al Israel Airlines',
//                 code: 'LY'
//             },
//             {
//                 name: 'CargoJet Airways',
//                 code: 'W8'
//             },
//             {
//                 name: 'Singapore Airlines Cargo',
//                 code: 'SQ'
//             },
//             {
//                 name: 'Icelandair Cargo',
//                 code: 'FI'
//             },
//             {
//                 name: 'Ethiopian Airlines',
//                 code: 'ET'
//             },
//             {
//                 name: 'Swiss WorldCargo',
//                 code: 'LX'
//             },
//             {
//                 name: 'LOT Polish Airlines',
//                 code: 'LO'
//             },
//             {
//                 name: 'TAP-Air Portugal',
//                 code: 'TP'
//             },
//             {
//                 name: 'British Airways',
//                 code: 'BA'
//             },
//             {
//                 name: 'Aer Lingus Cargo',
//                 code: 'EL'
//             }            
//         ];
//     }

//     statsReport = () => {
//         const email = this.props.user && this.props.user.s_email;
//         axios.post(`${this.props.baseApiUrl}/statsReport`, {
//             email
//         }, {
//             headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
//         }).then(response => {
//             this.props.createSuccessNotification('You will receive an email shortly');
//         }).catch(error => {

//         });
//     }

//     enableStatsReport = () => {
//         const email = this.props.user && this.props.user.s_email && this.props.user.s_email.toLowerCase();
//         const accessEmails = ['byron@choice.aero', 'mozart@choice.aero', 'hdq@choice.aero', 'kwang@choice.aero', 'yleong@choice.aero'];
//         return accessEmails.indexOf(email) !== -1;
//     }

//     render() {
//         const {user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, halfWindow, eightyWindow, width, displaySubmenu, handleDisplaySubmenu} = this.props;
//         const {
//             homeMenuButtons, 
//             page, 
//             s_airline_code,
//             s_flight_number,
//             s_aircraft_type,
//             d_flight,
//             i_awb,
//             i_pieces,
//             i_awb_dg,
//             i_awb_prepare,
//             i_ld3,
//             i_ld3_bup,
//             i_ld7,
//             i_ld7_bup,
//             f_total_kg,
//             f_bup_kg,
//             f_loose_kg,
//             f_mail_kg,
//             f_flight_kg,
//             f_transfer_kg,
//             f_awb_transfer,
//             f_courier_kg,
//             f_tsa_kg,
//             f_aircraft_handling,
//             f_aircraft_parking,
//             i_lavatory,
//             i_water,
//             i_cabin_cleaning,
//             i_waste_removal,
//             f_drayage,
//             f_uld_overage,
//             f_office_rent,
//             f_transfer_skid,
//             f_security_labor,
//             f_security_space,
//             b_nil,
//             b_cancelled,
//             s_notes,
//             stats,
//             filteredStats,
//             displayFilteredStats,
//             airlineLogo,
//             selectedStatId,
//             selectedStat,
//             filterAirlineCode,
//             filterFlightNum,
//             filterAirlineDate,
//             filterValidated,
//             s_type,
//             selectionBoxFlightCode,
//             enterWeightLbs,
//             f_misc,
//             s_misc_uom,
//             s_misc_type,
//             s_misc_other_value,
//             f_flight_watch,
//             f_gpu,
//             f_asu,
//             f_deicing,
//             f_weight_balance,
//             f_customs,
//             f_gen_dec
//         } = this.state;

//         return (
//             <AppLayout>
//                 <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
//                     <div className="card-body px-2 py-3">
//                         <Row>
//                             <Col md={12} lg={12}>
//                                 <h1 className='mb-0 pb-0 d-inline'>Station Stats Reporting Tool</h1>
//                                 <Input id={'filterAirlineDate'} value={filterAirlineDate} onChange={(e) => this.handleFilterInput(e)} type='date' className='d-inline ml-3' style={{ width: '200px' }} />
//                             </Col>
//                         </Row>
//                         <Row>
//                             <Col mg='12' lg='12'>
//                                 <Nav tabs className="separator-tabs ml-0 mb-1">
//                                     <NavItem>
//                                         <NavLink
//                                         className={classnames({
//                                             active: this.state.activeFirstTab === "1",
//                                             "nav-link": true
//                                         })}
//                                         location={{}}
//                                         to="#"
//                                         onClick={() => {
//                                             this.toggleTab("1");
//                                         }}
//                                         >
//                                         Import
//                                         </NavLink>
//                                     </NavItem>
//                                     <NavItem>
//                                         <NavLink
//                                         location={{}}
//                                         to="#"
//                                         className={classnames({
//                                             active: this.state.activeFirstTab === "2",
//                                             "nav-link": true
//                                         })}
//                                         onClick={() => {
//                                             this.toggleTab("2");
//                                         }}
//                                         >
//                                         Export
//                                         </NavLink>
//                                     </NavItem>
//                                     <NavItem>
//                                         <NavLink
//                                         location={{}}
//                                         to="#"
//                                         className={classnames({
//                                             active: this.state.activeFirstTab === "3",
//                                             "nav-link": true
//                                         })}
//                                         onClick={() => {
//                                             this.toggleTab("3");
//                                         }}
//                                         >
//                                         Ramp
//                                         </NavLink>
//                                     </NavItem>
//                                     <NavItem>
//                                         <NavLink
//                                         location={{}}
//                                         to="#"
//                                         className={classnames({
//                                             active: this.state.activeFirstTab === "4",
//                                             "nav-link": true
//                                         })}
//                                         onClick={() => {
//                                             this.toggleTab("4");
//                                         }}
//                                         >
//                                         Misc
//                                         </NavLink>
//                                     </NavItem>
//                                     {
//                                         user && user.accessLevel && user.accessLevel >= 4 && 
//                                         <NavItem>
//                                             <NavLink
//                                             location={{}}
//                                             to="#"
//                                             className={classnames({
//                                                 active: this.state.activeFirstTab === "5",
//                                                 "nav-link": true
//                                             })}
//                                             onClick={() => {
//                                                 this.toggleTab("5");
//                                             }}
//                                             >
//                                             Validate
//                                             </NavLink>
//                                         </NavItem>
//                                     }
//                                 </Nav>
//                             </Col>
//                         </Row>

//                         <TabContent activeTab={this.state.activeFirstTab} className='mt-2'>
//                             <TabPane tabId="1">
//                                 <ImportExportStatsPage 
//                                     page={page}
//                                     handleInput={this.handleInput}
//                                     handleSwitchNil={this.handleSwitchNil}
//                                     handleSwitchCancelled={this.handleSwitchCancelled}
//                                     s_airline_code={s_airline_code}
//                                     s_flight_number={s_flight_number}
//                                     d_flight={d_flight}
//                                     i_awb={i_awb}
//                                     i_pieces={i_pieces}
//                                     i_awb_dg={i_awb_dg}
//                                     i_awb_prepare={i_awb_prepare}
//                                     i_ld3={i_ld3}
//                                     i_ld3_bup={i_ld3_bup}
//                                     i_ld7={i_ld7}
//                                     i_ld7_bup={i_ld7_bup}
//                                     f_total_kg={f_total_kg}
//                                     f_tsa_kg={f_tsa_kg}
//                                     f_bup_kg={f_bup_kg}
//                                     f_loose_kg={f_loose_kg}
//                                     f_mail_kg={f_mail_kg}
//                                     f_flight_kg={f_flight_kg}
//                                     f_transfer_kg={f_transfer_kg}
//                                     f_awb_transfer={f_awb_transfer}
//                                     f_courier_kg={f_courier_kg}
//                                     b_nil={b_nil}
//                                     b_cancelled={b_cancelled}
//                                     s_notes={s_notes}
//                                     s_notes={s_notes}
//                                     enableSubmitStat={this.enableSubmitStat}
//                                     resolveAmountValues={this.resolveAmountValues}
//                                     createStatRecord={this.createStatRecord}
//                                     stats={stats}
//                                     filteredStats={filteredStats}
//                                     displayFilteredStats={displayFilteredStats}
//                                     airlineLogo={airlineLogo}
//                                     selectedStatId={selectedStatId}
//                                     selectStatId={this.selectStatId}
//                                     selectedStat={selectedStat}
//                                     filterAirlineCode={filterAirlineCode}
//                                     filterFlightNum={filterFlightNum}
//                                     filterAirlineDate={filterAirlineDate}
//                                     filterValidated={filterValidated}
//                                     handleSwitchFilterValidated={this.handleSwitchFilterValidated}
//                                     displayLogo={this.displayLogo}
//                                     handleFilterInput={this.handleFilterInput}
//                                     halfWindow={halfWindow}
//                                     eightyWindow={eightyWindow}
//                                     width={width}
//                                     handleSwitchWeightType={this.handleSwitchWeightType}
//                                     enterWeightLbs={enterWeightLbs}
//                                     handleCreateStatRecord={this.handleCreateStatRecord}
//                                     resolveWeightKgs={this.resolveWeightKgs}
//                                 />
//                             </TabPane>
//                             <TabPane tabId="2">
//                                 <ImportExportStatsPage 
//                                     page={page}
//                                     handleInput={this.handleInput}
//                                     handleSwitchNil={this.handleSwitchNil}
//                                     handleSwitchCancelled={this.handleSwitchCancelled}
//                                     s_airline_code={s_airline_code}
//                                     s_flight_number={s_flight_number}
//                                     d_flight={d_flight}
//                                     i_awb={i_awb}
//                                     i_pieces={i_pieces}
//                                     i_awb_dg={i_awb_dg}
//                                     i_awb_prepare={i_awb_prepare}
//                                     i_ld3={i_ld3}
//                                     i_ld3_bup={i_ld3_bup}
//                                     i_ld7={i_ld7}
//                                     i_ld7_bup={i_ld7_bup}
//                                     f_total_kg={f_total_kg}
//                                     f_tsa_kg={f_tsa_kg}
//                                     f_bup_kg={f_bup_kg}
//                                     f_loose_kg={f_loose_kg}
//                                     f_mail_kg={f_mail_kg}
//                                     f_flight_kg={f_flight_kg}
//                                     f_transfer_kg={f_transfer_kg}
//                                     f_awb_transfer={f_awb_transfer}
//                                     f_courier_kg={f_courier_kg}
//                                     b_nil={b_nil}
//                                     b_cancelled={b_cancelled}
//                                     s_notes={s_notes}
//                                     s_notes={s_notes}
//                                     enableSubmitStat={this.enableSubmitStat}
//                                     resolveAmountValues={this.resolveAmountValues}
//                                     createStatRecord={this.createStatRecord}
//                                     stats={stats}
//                                     filteredStats={filteredStats}
//                                     displayFilteredStats={displayFilteredStats}
//                                     airlineLogo={airlineLogo}
//                                     selectedStatId={selectedStatId}
//                                     selectStatId={this.selectStatId}
//                                     selectedStat={selectedStat}
//                                     filterAirlineCode={filterAirlineCode}
//                                     filterFlightNum={filterFlightNum}
//                                     filterAirlineDate={filterAirlineDate}
//                                     filterValidated={filterValidated}
//                                     handleSwitchFilterValidated={this.handleSwitchFilterValidated}
//                                     displayLogo={this.displayLogo}
//                                     handleFilterInput={this.handleFilterInput}
//                                     halfWindow={halfWindow}
//                                     eightyWindow={eightyWindow}
//                                     width={width}
//                                     handleSwitchWeightType={this.handleSwitchWeightType}
//                                     enterWeightLbs={enterWeightLbs}
//                                     handleCreateStatRecord={this.handleCreateStatRecord}
//                                     resolveWeightKgs={this.resolveWeightKgs}
//                                 />
//                             </TabPane>
//                             <TabPane tabId="3">
//                                 <RampPage
//                                     handleInput={this.handleInput}
//                                     handleSwitchNil={this.handleSwitchNil}
//                                     handleSwitchCancelled={this.handleSwitchCancelled}
//                                     s_airline_code={s_airline_code}
//                                     s_flight_number={s_flight_number}
//                                     s_aircraft_type={s_aircraft_type}
//                                     d_flight={d_flight}
//                                     f_aircraft_handling={f_aircraft_handling}
//                                     f_aircraft_parking={f_aircraft_parking}
//                                     i_lavatory={i_lavatory}
//                                     i_water={i_water}
//                                     i_cabin_cleaning={i_cabin_cleaning}
//                                     i_waste_removal={i_waste_removal}
//                                     f_drayage={f_drayage}
//                                     i_awb={i_awb}
//                                     i_pieces={i_pieces}
//                                     i_awb_dg={i_awb_dg}
//                                     b_nil={b_nil}
//                                     b_cancelled={b_cancelled}
//                                     s_notes={s_notes}
//                                     s_notes={s_notes}
//                                     enableSubmitStat={this.enableSubmitStat}
//                                     resolveAmountValues={this.resolveAmountValues}
//                                     createStatRecord={this.createStatRecord}
//                                     stats={stats}
//                                     filteredStats={filteredStats}
//                                     displayFilteredStats={displayFilteredStats}
//                                     airlineLogo={airlineLogo}
//                                     selectedStatId={selectedStatId}
//                                     selectStatId={this.selectStatId}
//                                     selectedStat={selectedStat}
//                                     filterAirlineCode={filterAirlineCode}
//                                     filterFlightNum={filterFlightNum}
//                                     filterAirlineDate={filterAirlineDate}
//                                     filterValidated={filterValidated}
//                                     handleSwitchFilterValidated={this.handleSwitchFilterValidated}
//                                     displayLogo={this.displayLogo}
//                                     handleFilterInput={this.handleFilterInput}
//                                     selectionBoxFlightCode={selectionBoxFlightCode}
//                                     getSelectionBoxFlights={this.getSelectionBoxFlights}
//                                     setSelectionBoxFlightCode={this.setSelectionBoxFlightCode}
//                                     halfWindow={halfWindow}
//                                     eightyWindow={eightyWindow}
//                                     width={width}
//                                     f_flight_watch={f_flight_watch}
//                                     f_gpu={f_gpu}
//                                     f_asu={f_asu}
//                                     f_deicing={f_deicing}
//                                     f_weight_balance={f_weight_balance}
//                                     f_customs={f_customs}
//                                     f_gen_dec={f_gen_dec}
//                                 />
//                             </TabPane>
//                             <TabPane tabId="4">
//                                 <NewMisc 
//                                     handleInput={this.handleInput}
//                                     handleSwitchNil={this.handleSwitchNil}
//                                     handleSwitchCancelled={this.handleSwitchCancelled}
//                                     s_airline_code={s_airline_code}
//                                     s_flight_number={s_flight_number}
//                                     d_flight={d_flight}
//                                     f_aircraft_handling={f_aircraft_handling}
//                                     f_aircraft_parking={f_aircraft_parking}
//                                     f_drayage={f_drayage}
//                                     i_awb={i_awb}
//                                     i_pieces={i_pieces}
//                                     i_awb_dg={i_awb_dg}
//                                     f_uld_overage={f_uld_overage}
//                                     f_transfer_skid={f_transfer_skid}
//                                     f_security_labor={f_security_labor}
//                                     f_security_space={f_security_space}
//                                     b_nil={b_nil}
//                                     b_cancelled={b_cancelled}
//                                     s_notes={s_notes}
//                                     s_notes={s_notes}
//                                     enableSubmitStat={this.enableSubmitStat}
//                                     resolveAmountValues={this.resolveAmountValues}
//                                     createStatRecord={this.createStatRecord}
//                                     stats={stats}
//                                     filteredStats={filteredStats}
//                                     displayFilteredStats={displayFilteredStats}
//                                     airlineLogo={airlineLogo}
//                                     selectedStatId={selectedStatId}
//                                     selectStatId={this.selectStatId}
//                                     selectedStat={selectedStat}
//                                     filterAirlineCode={filterAirlineCode}
//                                     filterFlightNum={filterFlightNum}
//                                     filterAirlineDate={filterAirlineDate}
//                                     filterValidated={filterValidated}
//                                     handleSwitchFilterValidated={this.handleSwitchFilterValidated}
//                                     displayLogo={this.displayLogo}
//                                     handleFilterInput={this.handleFilterInput}
//                                     selectionBoxFlightCode={selectionBoxFlightCode}
//                                     getSelectionBoxFlights={this.getSelectionBoxFlights}
//                                     setSelectionBoxFlightCode={this.setSelectionBoxFlightCode}
//                                     f_misc={f_misc}
//                                     s_misc_uom={s_misc_uom}
//                                     s_misc_type={s_misc_type}
//                                     s_misc_other_value={s_misc_other_value}
//                                     halfWindow={halfWindow}
//                                     eightyWindow={eightyWindow}
//                                     width={width}
//                                 />
//                             </TabPane>          
//                             <TabPane tabId="5">
//                                 <ValidatePage 
//                                     handleInput={this.handleInput}
//                                     handleSwitchNil={this.handleSwitchNil}
//                                     handleSwitchCancelled={this.handleSwitchCancelled}
//                                     s_airline_code={s_airline_code}
//                                     s_flight_number={s_flight_number}
//                                     s_aircraft_type={s_aircraft_type}
//                                     d_flight={d_flight}
//                                     i_awb={i_awb}
//                                     i_pieces={i_pieces}
//                                     i_awb_dg={i_awb_dg}
//                                     i_awb_prepare={i_awb_prepare}
//                                     i_ld3={i_ld3}
//                                     i_ld3_bup={i_ld3_bup}
//                                     i_ld7={i_ld7}
//                                     i_ld7_bup={i_ld7_bup}
//                                     f_total_kg={f_total_kg}
//                                     f_bup_kg={f_bup_kg}
//                                     f_loose_kg={f_loose_kg}
//                                     f_mail_kg={f_mail_kg}
//                                     f_flight_kg={f_flight_kg}
//                                     f_transfer_kg={f_transfer_kg}
//                                     f_awb_transfer={f_awb_transfer}
//                                     f_courier_kg={f_courier_kg}
//                                     f_tsa_kg={f_tsa_kg}
//                                     f_aircraft_handling={f_aircraft_handling}
//                                     f_aircraft_parking={f_aircraft_parking}
//                                     i_lavatory={i_lavatory}
//                                     i_water={i_water}
//                                     i_cabin_cleaning={i_cabin_cleaning}
//                                     i_waste_removal={i_waste_removal}
//                                     f_drayage={f_drayage}
//                                     f_uld_overage={f_uld_overage}
//                                     f_transfer_skid={f_transfer_skid}
//                                     f_security_labor={f_security_labor}
//                                     f_security_space={f_security_space}
//                                     b_nil={b_nil}
//                                     b_cancelled={b_cancelled}
//                                     s_notes={s_notes}
//                                     enableSubmitStat={this.enableSubmitStat}
//                                     resolveAmountValues={this.resolveAmountValues}
//                                     createStatRecord={this.createStatRecord}
//                                     stats={stats}
//                                     filteredStats={filteredStats}
//                                     displayFilteredStats={displayFilteredStats}
//                                     airlineLogo={airlineLogo}
//                                     selectedStatId={selectedStatId}
//                                     selectStatId={this.selectStatId}
//                                     selectedStat={selectedStat}
//                                     filterAirlineCode={filterAirlineCode}
//                                     filterFlightNum={filterFlightNum}
//                                     filterAirlineDate={filterAirlineDate}
//                                     filterValidated={filterValidated}
//                                     handleSwitchFilterValidated={this.handleSwitchFilterValidated}
//                                     displayLogo={this.displayLogo}
//                                     s_type={s_type}
//                                     selectPage={this.selectPage}
//                                     handleFilterInput={this.handleFilterInput}
//                                     f_misc={f_misc}
//                                     s_misc_uom={s_misc_uom}
//                                     s_misc_type={s_misc_type}
//                                     halfWindow={halfWindow}
//                                     eightyWindow={eightyWindow}
//                                     width={width}
//                                     enableDeleteStatRecord={this.enableDeleteStatRecord}
//                                     deleteStatRecord={this.deleteStatRecord}
//                                     f_flight_watch={f_flight_watch}
//                                     f_gpu={f_gpu}
//                                     f_asu={f_asu}
//                                     f_deicing={f_deicing}
//                                     f_weight_balance={f_weight_balance}
//                                     f_customs={f_customs}
//                                     f_gen_dec={f_gen_dec}
//                                 />
//                             </TabPane>
//                         </TabContent>
//                     </div>
//                 </div>
//                 <ModalConfirmLocation
//                     open={promptUserLocation}
//                     setUserLocation={setUserLocation}
//                     selectUserLocation={selectUserLocation}
//                     saveUserLocation={saveUserLocation}
//                 />
//             </AppLayout>
//         );
//     }
// }

// export default withRouter(Stats);