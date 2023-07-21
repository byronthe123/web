
import { SidebarMap } from "../globals/interfaces";

//Counter:
import Queue from '../components/counter/queue';
import Export from '../views/counter/Export';
import Import from '../views/counter/Import';
import CounterReporting from '../views/counter/CounterReporting';

//Import:
import Rack from '../views/import/Rack';
import ImportTransfers from '../views/import/ImportTransfers';
import Notify from '../views/import/Notify';
import BreakdownInstructions from '../components/import/breakdownInstructions/index';
import AcceptTransfers from '../views/import/AcceptTransfers';
import ImportRecords from '../views/import/ImportRecords';
import Payments from "../components/import/payments";
import ImportCharges from '../views/import/ImportCharges';

//Export
import AcceptanceArchive from '../views/export/AcceptanceArchive';
import ExportRecords from '../views/export/ExportRecords';
import Booking from "../components/export/booking";
import BookingList from "../components/export/bookingList";

//Reporting:
import DestinationReport from '../views/reporting/DestinationReport';
import Stats from '../views/reporting/Stats';
import BreakdownProgress from '../views/reporting/BreakdownProgress';

//Portal:
import Portal from '../views/portal/Portal';
import Wiki from '../views/portal/Wiki';
import SafetyStatement from '../views/portal/SafetyStatement';
import SafetyIncidentReporting from '../views/portal/SafetyIncidentReporting';
import SiteMap from '../views/portal/SiteMap';

//Warehouse:
import DamageReporting from '../views/warehouse/DamageReporting';
import WarehouseImport from '../views/warehouse/WarehouseImport';
import Dock from '../views/warehouse/Dock';
import DockDelivery from '../views/warehouse/DockDelivery';

import EdiFFM from '../views/edi/EdiFFM';
import EdiFWB from '../views/edi/EdiFWB';
import EdiFHL from '../views/edi/EdiFHL';

//Leads:
import ExternalUsers from '../views/leads/ExternalUsers';
import OverrideCodes from '../views/leads/OverrideCodes';
import ImportFlightAudit from '../components/leads/importFlightAudit/index';
import UpdateImportDestination from "../components/leads/updateImportDestination";

//Managers
import QueueAdmin from '../views/managers/QueueAdmin';
import Invoices from '../views/managers/Invoices';
import ManageTraining from '../views/managers/ManageTraining';
import UpdateExportAwbs from '../views/managers/UpdateExportAwbs';
import SMS from '../views/SMS';
import FlightsSchedule from '../views/managers/FlightsSchedule';
import ActiveUsers from '../views/managers/ActiveUsers';
import HealthCheck from '../views/managers/HealthCheck';
import CounterMoney from '../views/managers/CounterMoney';
import ImportOverride from '../views/managers/ImportOverride';
import ManageReadingSigns from '../views/managers/ManageReadingSigns';
import RefundRequests from '../views/managers/RefundRequests';
import DeliverAllLocations from "../components/managers/deliverAllLocations";

//Corporate
import BusinessIntel from '../views/corporate/BusinessIntel';
import CompanyProfiles from '../views/corporate/CompanyProfiles';

//Other
import ManageWiki from '../views/ManageWiki';
import ViewError from '../views/error';

//Training
import Training from '../views/training/Training';

//HR
import HumanResources from '../views/hr/HumanResources';
import VaccineRecords from '../views/hr/VaccineRecords';

//DEV
import Main from '../views/dev/Main';

// Displays
import QueueDisplay from '../views/displays/Queue';
import UpdateExportStatus from "../components/leads/updateExportStatus";
import IacCcsf from "../components/managers/iacCcsf";
import DirectDelivery from "../views/leads/DirectDelivery/index";
import BlacklistEmails from "../views/leads/BlacklistEmails";
import ULD from "../views/warehouse/ULD";
import HrSettings from "../views/hr/HrSettings/index";
import SharedPasswords from "../views/managers/SharedPasswords";
import TasksList from "../views/corporate/TasksList";

export const map: SidebarMap = {
    portal: {
        id: "Portal",
        icon: 'fa-address-card',
        label: "Portal",
        to: "/EOS/Portal",
        access: true,
        subs: {
            profile: {
                id: "MyProfile",
                icon: `icon-my-profile`,
                label: "My Profile",
                to: "/EOS/Portal/Profile",
                subs: {},
                component: Portal,
                access: true,
            },
            wiki: {
                id: "Wiki",
                icon: `fal fa-atlas`,
                label: "Wiki",
                to: "/EOS/Portal/Wiki",
                subs: {},
                component: Wiki
            },
            safety: {
                id: "Safety",
                icon: `fal fa-th-list`,
                label: "Safety",
                to: "",
                subs: {
                    safetyStatement: {
                        id: "SafetyStatement",
                        icon: `icon-safety-statement`,
                        label: "Safety Statement",
                        to: "/EOS/Portal/SafetyStatement",
                        subs: {},
                        component: SafetyStatement,
                    },
                    safetyIncidentReporting: {
                        id: "SafetyIncidentReporting",
                        icon: `icon-safety-incident-reporting`,
                        label: "Safety Incident Reporting",
                        to: "/EOS/Portal/SafetyIncidentReporting",
                        subs: {},
                        component: SafetyIncidentReporting 
                    },
                }
            }
        }
    },
    training: {
        id: "Training",
        icon: "fa-graduation-cap",
        label: "Training",
        to: "any",
        subs: {
            trainingModule: {
                id: "TrainingModule",
                icon: "fal fa-graduation-cap",
                label: "Training Module",
                to: "/EOS/Training/TrainingModule",
                subs: {},
                component: Training
            }
        }
        
    },
    operations: {
        id: "Operations",
        icon: 'fa-cogs',
        label: "Operations",
        to: "/EOS/Operations",
        subs: {
            counter: {
                id: "Counter",
                icon: `fal fa-th-list`,
                label: "Counter",
                to: "/EOS/Operations/Counter",
                subs: {
                    queue: {
                        id: "Queue",
                        icon: `fal fa-chair`,
                        label: "Queue",
                        to: "/EOS/Operations/Counter/Queue",
                        subs: {},
                        component: Queue
                    },
                    delivery: {
                        id: "Delivery",
                        icon: "fal fa-sign-out-alt",
                        label: "Delivery",
                        to: "/EOS/Operations/Counter/Delivery",
                        subs: {},
                        component: Import
                    },
                    acceptance: {
                        id: "Acceptance",
                        icon: "fal fa-sign-in-alt",
                        label: "Acceptance",
                        to: "/EOS/Operations/Counter/Acceptance",
                        subs: {},
                        component: Export
                    },
                    counterReporting: {
                        id: "CounterReporting",
                        icon: "fal fa-chart-bar",
                        label: "Counter Reporting",
                        to: "/EOS/Operations/Counter/CounterReporting",
                        subs: {},
                        component: CounterReporting
                    },
                    kioskOverride: {
                        id: "KioksOverride",
                        icon: "fal fa-house-user",
                        label: "Kiosk Override",
                        to: "/EOS/Operations/Counter/KioskOverride",
                        subs: {},
                        component: OverrideCodes
                    },      
                }
            },
            export: {
                id: "Export",
                icon: `icon-export`,
                label: "Export",
                to: "/EOS/Operations/Export",
                subs: {
                    acceptanceArchive: {
                        id: "AcceptanceArchive",
                        icon: `icon-screening`,
                        label: "Acceptance Archive",
                        to: "/EOS/Operations/Export/AcceptanceArchive",
                        subs: {},
                        component: AcceptanceArchive
                    },
                    updateAcceptance: {
                        id: "UpdateAcceptance",
                        icon: "fal fa-file-edit",
                        label: "Update Acceptance",
                        to: "/EOS/Operations/Export/UpdateAcceptance",
                        subs: {},
                        component: UpdateExportAwbs
                    },
                    exportRecords: {
                        id: "ExportRecords",
                        icon: "fal fa-cabinet-filing",
                        label: "Export Records",
                        to: "/EOS/Operations/Export/ExportRecords",
                        subs: {},
                        component: ExportRecords
                    },
                    booking: {
                        id: "Booking",
                        icon: `fak fa-booking`,
                        label: "Booking",
                        to: "/EOS/Operations/Export/Booking",
                        subs: {},
                        component: Booking
                    },
                    bookingList: {
                        id: "BookingList",
                        icon: `fak fa-booking-list`,
                        label: "Booking List",
                        to: "/EOS/Operations/Export/BookingList",
                        subs: {},
                        component: BookingList
                    },
                    buildup: {
                        id: "Buildup",
                        icon: `fal fa-th-list`,
                        label: "Buildup",
                        to: "/EOS/Operations/Export/Buildup",
                        subs: {},
                        component: null
                    },
                    exportTransfers: {
                        id: "ExportTransfers",
                        icon: `icon-export-transfers`,
                        label: "Export Transfers",
                        to: "/EOS/Operations/Export/ExportTransfers",
                        subs: {},
                        component: null
                    },  
                    screening: {
                        id: "Screening",
                        icon: `icon-screening`,
                        label: "Screening",
                        to: "/EOS/Operations/Export/Screening",
                        subs: {},
                        component: null
                    }    
                }
            },
            import: {
                id: "Import",
                icon: `icon-import`,
                label: "Import",
                to: "/EOS/Operations/Import",
                subs: {
                    breakdownInstructions: {
                        id: "BreakdownInstructions",
                        icon: `fal fa-clipboard-list-check`,
                        label: "Breakdown Instructions",
                        to: "/EOS/Operations/Import/BreakdownInstructions",
                        subs: {},
                        component: BreakdownInstructions
                    },
                    importTransfers: {
                        id: "ImportTransfers",
                        icon: `icon-import-transfers`,
                        label: "Import Transfers",
                        to: "/EOS/Operations/Import/ImportTransfers",
                        subs: {},
                        component: ImportTransfers
                    },
                    notify: {
                        id: 'Notify',
                        icon: 'fal fa-mail-bulk',
                        label: 'Notify',
                        to: '/EOS/Operations/Import/Notify',
                        subs: {},
                        component: Notify
                    },   
                    rack: {
                        id: "Rack",
                        icon: `fal fa-inventory`,
                        label: "Rack",
                        to: "/EOS/Operations/Import/Rack",
                        subs: {},
                        component: Rack
                    }, 
                    ediImport: {
                        id: "EdiImport",
                        icon: `fal fa-comments-alt`,
                        label: "EDI",
                        to: "/EOS/Operations/Import/EDI",
                        subs: {},
                        component: null
                    },
                    acceptTransfers: {
                        id: "AcceptTransfers",
                        icon: `fal fa-th-list`,
                        label: "Accept Transfers",
                        to: "/EOS/Operations/Import/AcceptTransfers",
                        subs: {},
                        component: AcceptTransfers
                    },
                    fidsEditor: {
                        id: "FidsEditor",
                        icon: `fal fa-columns`,
                        label: "Fids Editor",
                        to: "/EOS/Operations/Import/FidsEditor",
                        subs: {},
                        component: FlightsSchedule
                    },   
                    importRecords: {
                        id: "ImportRecords",
                        icon: `fal fa-cabinet-filing`,
                        label: "Import Records",
                        to: "/EOS/Operations/Import/ImportRecords",
                        subs: {},
                        component: ImportRecords
                    },
                    payments: {
                        id: "Payments",
                        icon: `fal fa-dollar-sign`,
                        label: "Payments",
                        to: "/EOS/Operations/Import/Payments",
                        subs: {},
                        component: Payments
                    },
                }
            },
            transfers: {
                id: "Transfers",
                icon: `icon-import`,
                label: "Transfers",
                to: "",
                subs: {
                    notify: {
                        id: "Notify",
                        icon: `fal fa-mail-bulk`,
                        label: "Notify",
                        to: "/EOS/Operations/Transfers/Notify",
                        subs: {},
                        component: Notify
                    }
                }
            },
            reporting: {
                id: 'Reporting',
                icon: 'fal fa-clipboard-check',
                label: 'Reporting',
                to: "",
                subs: {
                    stats: {
                        id: "Stats",
                        icon: "fal fa-file-edit",
                        label: "Stats",
                        to: "/EOS/Operations/Reporting/Stats",
                        subs: {},
                        component: Stats
                    },
                    breakdownProgress: {
                        id: 'BreakdownProgress',
                        icon: 'fal fa-ballot-check',
                        label: 'Breakdown Progress',
                        to: '/EOS/Operations/Reporting/BreakdownProgress',
                        subs: {},
                        component: BreakdownProgress
                    },
                    analytics: {
                        id: 'Analytics',
                        icon: 'fal fa-clipboard-check',
                        label: 'Analytics',
                        to: '/EOS/Operations/Reporting/Analytics',
                        subs: {},
                        component: null
                    },
                }
            },
            warehouse: {
                id: "Warehouse",
                icon: "fal fa-warehouse",
                label: "Warehouse",
                to: "",
                subs: {
                    damageReporting: {
                        id: "DamageReporting",
                        icon: `fal fa-sensor-alert`,
                        label: "Damage Reporting",
                        to: "/EOS/Operations/Warehouse/DamageReporting",
                        subs: {},
                        component: DamageReporting
                    },
                    dock: {
                        id: "Dock",
                        icon: `fal fa-forklift`,
                        label: "Dock",
                        to: "/EOS/Operations/Warehouse/Dock",
                        subs: {},
                        component: Dock
                    },
                    warehouseImport: {
                        id: "WarehouseImport",
                        icon: "fal fa-plane-arrival",
                        label: "Import",
                        to: "/EOS/Operations/Warehouse/Import",
                        subs: {},
                        component: WarehouseImport
                    },
                    dockDelivery: {
                        id: "DockDelivery",
                        icon: "fal fa-person-dolly",
                        label: "Dock Delivery",
                        to: "/EOS/Operations/Warehouse/DockDelivery",
                        subs: {},
                        component: DockDelivery
                    },
                    uld: {
                        id: "uld",
                        icon: "fal fa-person-dolly",
                        label: "ULD",
                        to: "/EOS/Operations/Warehouse/ULD",
                        subs: {},
                        component: ULD
                    }
                }
            },
            edi: {
                id: "EDI",
                icon: "fal fa-warehouse",
                label: "EDI",
                to: "",
                subs: {
                    ediFfm: {
                        id: "EdiFFM",
                        icon: `fal fa-file-alt`,
                        label: "FFM",
                        to: "/EOS/Operations/EDI/EdiFFM",
                        subs: {},
                        component: EdiFFM
                    },
                    ediFwb: {
                        id: "EdiFWB",
                        icon: `fal fa-envelope-open`,
                        label: "FWB",
                        to: "/EOS/Operations/EDI/EdiFWB",
                        subs: {},
                        component: EdiFWB
                    },
                    ediFhl: {
                        id: "EdiFHL",
                        icon: `fal fa-envelope-square`,
                        label: "FHL",
                        to: "/EOS/Operations/EDI/EdiFHL",
                        subs: {},
                        component: EdiFHL
                    }
                }
            }
        }
    },
    leads: {
        id: "Leads",
        icon: "fa-user-cog",
        label: "Leads",
        to: "",
        subs: {
            importFlightAudit: {
                id: 'ImportFlightAudit',
                icon: 'fa-light fa-box-dollar',
                label: 'Import Flight Audit',
                to: '/EOS/Leads/ImportFlightAudit',
                subs: {},
                component: ImportFlightAudit
            },
            destinationReport: {
                id: 'DestinationReport',
                icon: 'fal fa-clipboard-check',
                label: 'Destination Report',
                to: '/EOS/Leads/DestinationReport',
                subs: {},
                component: DestinationReport
            },
            externalUsers: {
                id: "ExternalUsers",
                icon: "fal fa-house-user",
                label: "External Users",
                to: "/EOS/Leads/ExternalUsers",
                subs: {},
                component: ExternalUsers
            },
            updateImportDestination: {
                id: "UpdateImportDestination",
                icon: "fal fa-map-marker-edit",
                label: "Update Import Destination",
                to: "/EOS/Leads/UpdateImportDestination",
                subs: {},
                component: UpdateImportDestination
            },
            updateExportStatus: {
                id: "UpdateExportStatus",
                icon: "fa-light fa-rectangle-xmark",
                label: "Update Export Status",
                to: "/EOS/Leads/UpdateExportStatus",
                subs: {},
                component: UpdateExportStatus
            },
            directDelivery: {
                id: "directDelivery",
                icon: "",
                label: "Direct Delivery",
                to: "/EOS/Leads/DirectDelivery",
                subs: {},
                component: DirectDelivery
            },
            blacklistEmails: {
                id: "blacklistEmails",
                icon: "",
                label: "Blacklist Emails",
                to: "/EOS/Leads/BlacklistEmails",
                subs: {},
                component: BlacklistEmails
            }
        }
    },
    managers: {
        id: "Managers",
        icon: "fa-users",
        label: "Managers",
        manager: true,
        to: "",
        subs: {
            queueAdmin: {
                id: "QueueAdmin",
                icon: "fal fa-users-class",
                label: "Queue Admin",
                to: "/EOS/Managers/QueueAdmin",
                subs: {},
                component: QueueAdmin
            },
            invoices: {
                id: "Invoices",
                icon: "fal fa-file-invoice",
                label: "Invoices",
                to: "/EOS/Managers/Invoices",
                subs: {},
                component: Invoices
            },
            manageTraining: {
                id: "ManageTraining",
                icon: "fal fa-user-graduate",
                label: "Manage Training",
                to: "/EOS/Managers/ManageTraining",
                subs: {},
                component: ManageTraining
            },
            flightsSchedule: {
                id: "FlightsSchedule",
                icon: "fal fa-calendar-plus",
                label: "Flights Schedule",
                to: "/EOS/Managers/FlightsSchedule",
                subs: {},
                component: FlightsSchedule,
                manager: true
            },
            healthCheck: {
                id: "HealthCheck",
                icon: "fal fa-virus",
                label: "Health Check",
                to: "/EOS/Managers/HealthCheck",
                subs: {},
                component: HealthCheck
            },
            activeUsers: {
                id: "ActiveUsers",
                icon: "fal fa-street-view",
                label: "Active Users",
                to: "/EOS/Managers/ActiveUsers",
                component: ActiveUsers,
                subs: {},
            },
            counterMoney: {
                id: "CounterMoney",
                icon: "fal fa-search-dollar",
                label: "Counter Money",
                to: "/EOS/Managers/CounterMoney",
                subs: {},
                component: CounterMoney
            },
            importOverride: {
                id: "ImportOverride",
                icon: "fal fa-money-check-edit-alt",
                label: "Import Override",
                to: "/EOS/Managers/ImportOverride",
                subs: {},
                component: ImportOverride
            },
            importFlightManager: {
                id: "ImportFlightManager",
                icon: "icon-breakdown-instructions",
                label: "Import Flight Manager",
                to: "/EOS/Managers/ImportFlightManager",
                subs: {},
                component: BreakdownInstructions,
                manager: true
            },
            manageReadingSigns: {
                id: "ManageReadingSigns",
                icon: "fab fa-readme",
                label: "Read and Signs",
                to: "/EOS/Managers/ManageReadingSigns",
                subs: {},
                component: ManageReadingSigns
            },
            refundRequests: {
                id: "RefundRequests",
                icon: "fab fa-readme",
                label: "Refund Requests",
                to: "/EOS/Managers/RefundRequests",
                subs: {},
                component: RefundRequests
            },
            deliverAllLocations: {
                id: 'DeliverAllLocations',
                icon: '',
                label: 'Deliver All Locations',
                to: '/EOS/Manageres/DeliverAllLocations',
                subs: {},
                component: DeliverAllLocations
            },
            sharedPasswords: {
                id: 'SharedPasswords',
                icon: 'fas fa-lock',
                label: 'Shared Passwords',
                to: '/EOS/Manageres/SharedPasswords',
                subs: {},
                component: SharedPasswords
            },
            iacCcsf: {
                id: 'IacCcsf',
                icon: '',
                label: 'IAC/CCSF',
                to: '/EOS/Managers/IacCcsf',
                subs: {},
                component: IacCcsf
            },
            sms: {
                id: "SMS",
                icon: "fal fa-book-medical",
                label: "SMS",
                to: "/EOS/Managers/SMS",
                subs: {},
                restricted: true
            }
        }
    },
    corporate: {
        id: "Corporate",
        icon: "fa-chart-network",
        label: "Corporate",
        to: "",
        subs: {
            businessIntelligence: {
                id: "BusinessIntelligence",
                icon: "fal fa-file-chart-pie",
                label: "Business Intelligence",
                to: "/EOS/Corporate/BusinessIntelligence",
                subs: {},
                component: BusinessIntel
            },
            companyProfiles: {
                id: "CompanyProfiles",
                icon: "fal fa-warehouse",
                label: "Company Profiles",
                to: "/EOS/Corporate/CompanyProfiles",
                subs: {},
                component: CompanyProfiles
            },
            taskList: {
                id: "TasksList",
                icon: "fal fa-tasks",
                label: "Tasks List",
                to: "/EOS/Corporate/TasksList",
                subs: {},
                component: TasksList
            }
        }
    },
    humanResources: {
        id: "HR",
        icon: "fa-id-badge",
        label: "HR",
        to: "",
        subs: {
            humanResources: {
                id: "HumanResources",
                icon: "fal fa-user-circle",
                label: "Human Resources",
                to: "/EOS/HR/HumanResources",
                subs: {},
                component: HumanResources
            }, 
            vaccineRecords: {
                id: "VaccineRecords",
                icon: "fal fa-user-circle",
                label: "Vaccine Records",
                to: "/EOS/HR/VaccineRecords",
                subs: {},
                component: VaccineRecords
            },
            hrSettings: {
                id: "HrSettings",
                icon: "fal fa-cog",
                label: "Settings",
                to: "/EOS/HR/Settings",
                subs: {},
                component: HrSettings
            }
        }
    },
    dev: {
        id: "DEV",
        icon: "fa-brain-circuit",
        label: "DEV",
        to: "",
        subs: {
            main: {
                id: "Main",
                icon: "fal fa-wrench",
                label: "Main",
                to: "/EOS/DEV/Main",
                subs: {},
                component: Main
            }
        }
    },
    display: {
        id: "display",
        icon: "",
        label: "Displays",
        to: "",
        subs: {
            queue: {
                id: "queueDisplay",
                icon: "",
                label: "Queue",
                to: "/EOS/Display/Queue",
                subs: {},
                component: QueueDisplay
            }
        }
    },
    dontRender: {
        id: "dontRender",
        icon: "",
        label: "",
        to: "",
        subs: {
            queue: {
                id: "SiteMap",
                icon: "",
                label: "",
                to: "/EOS/Portal/SiteMap",
                subs: {},
                component: SiteMap
            }
        }
    }
}

export default map;