import { SidebarMap } from "../../../globals/interfaces";

const map: SidebarMap = {
    portal: {
        id: "Portal",
        icon: 'fa-address-card',
        label: "Portal",
        to: "/EOS/Portal",
        subs: {
            profile: {
                id: "MyProfile",
                icon: `icon-my-profile`,
                label: "My Profile",
                to: "/EOS/Portal/Profile",
                subs: {}
            },
            wiki: {
                id: "Wiki",
                icon: `fal fa-atlas`,
                label: "Wiki",
                to: "/EOS/Portal/Wiki",
                subs: {}
            },
            safety: {
                id: "Safety",
                icon: `fal fa-th-list`,
                label: "Safety",
                to: "/EOS/Portal",
                subs: {
                    safetyStatement: {
                        id: "SafetyStatement",
                        icon: `icon-safety-statement`,
                        label: "Safety Statement",
                        to: "/EOS/Portal/SafetyStatement",
                        subs: {}
                    },
                    safetyIncidentReporting: {
                        id: "SafetyIncidentReporting",
                        icon: `icon-safety-incident-reporting`,
                        label: "Safety Incident Reporting",
                        to: "/EOS/Portal/SafetyIncidentReporting",
                        subs: {}
                    },
                }
            }
        }
    },
    training: {
        id: "Training",
        icon: "fa-graduation-cap",
        label: "Training",
        to: "/EOS/Training",
        subs: {
            trainingModule: {
                id: "TrainingModule",
                icon: "fal fa-graduation-cap",
                label: "Training Module",
                to: "/EOS/Training/TrainingModule",
                subs: {}
            }
        }
        
    },
    operations: {
        id: "Operations",
        icon: 'fa-cogs',
        label: "Operations",
        to: "",
        subs: {
            counter: {
                id: "Counter",
                icon: `fal fa-th-list`,
                label: "Counter",
                to: "/EOS/Operations/Counter/",
                subs: {
                    queue: {
                        id: "Queue",
                        icon: `fal fa-chair`,
                        label: "Queue",
                        to: "/EOS/Operations/Counter/Queue",
                        subs: {}
                    },
                    delivery: {
                        id: "Delivery",
                        icon: "fal fa-sign-out-alt",
                        label: "Delivery",
                        to: "/EOS/Operations/Counter/Delivery",
                        subs: {}
                    },
                    acceptance: {
                        id: "Acceptance",
                        icon: "fal fa-sign-in-alt",
                        label: "Acceptance",
                        to: "/EOS/Operations/Counter/Acceptance",
                        subs: {}
                    },
                    counterReporting: {
                        id: "CounterReporting",
                        icon: "fal fa-chart-bar",
                        label: "Counter Reporting",
                        to: "/EOS/Operations/Counter/CounterReporting",
                        subs: {}
                    }      
                }
            },
            export: {
                id: "Export",
                icon: `icon-export`,
                label: "Export",
                to: "/EOS/Operations/Export/",
                subs: {
                    acceptanceArchive: {
                        id: "AcceptanceArchive",
                        icon: `icon-screening`,
                        label: "Acceptance Archive",
                        to: "/EOS/Operations/Export/AcceptanceArchive",
                        subs: {}
                    },
                    updateAcceptance: {
                        id: "UpdateAcceptance",
                        icon: "fal fa-file-edit",
                        label: "Update Acceptance",
                        to: "/EOS/Operations/Export/UpdateAcceptance",
                        subs: {}
                    },
                    exportRecords: {
                        id: "ExportRecords",
                        icon: "fal fa-cabinet-filing",
                        label: "Export Records",
                        to: "/EOS/Operations/Export/ExportRecords",
                        subs: {}
                    },
                    buildup: {
                        id: "Buildup",
                        icon: `fal fa-th-list`,
                        label: "Buildup",
                        to: "/EOS/Operations/Export/Buildup",
                        subs: {}
                    },
                    exportTransfers: {
                        id: "ExportTransfers",
                        icon: `icon-export-transfers`,
                        label: "Export Transfers",
                        to: "/EOS/Operations/Export/ExportTransfers",
                        subs: {}
                    },  
                    screening: {
                        id: "Screening",
                        icon: `icon-screening`,
                        label: "Screening",
                        to: "/EOS/Operations/Export/Screening",
                        subs: {}
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
                        subs: {}
                    },
                    importTransfers: {
                        id: "ImportTransfers",
                        icon: `icon-import-transfers`,
                        label: "Import Transfers",
                        to: "/EOS/Operations/Import/ImportTransfers",
                        subs: {}
                    },
                    notify: {
                        id: 'Notify',
                        icon: 'fal fa-mail-bulk',
                        label: 'Notify',
                        to: '/EOS/Operations/Import/Notify',
                        subs: {}
                    },   
                    proofOfDelivery: {
                        id: "ProofOfDelivery",
                        icon: `fal fa-file-signature`,
                        label: "Proof of Delivery",
                        to: "/EOS/Operations/Import/ProofOfDelivery",
                        subs: {}
                    },
                    rack: {
                        id: "Rack",
                        icon: `fal fa-inventory`,
                        label: "Rack",
                        to: "/EOS/Operations/Import/Rack",
                        subs: {}
                    }, 
                    ediImport: {
                        id: "EdiImport",
                        icon: `fal fa-comments-alt`,
                        label: "EDI",
                        to: "/EOS/Operations/Import/EDI",
                        subs: {}
                    },
                    acceptTransfers: {
                        id: "AcceptTransfers",
                        icon: `fal fa-th-list`,
                        label: "Accept Transfers",
                        to: "/EOS/Operations/Import/AcceptTransfers",
                        subs: {}
                    },
                    fidsEditor: {
                        id: "FidsEditor",
                        icon: `fal fa-columns`,
                        label: "Fids Editor",
                        to: "/EOS/Operations/Import/FidsEditor",
                        subs: {}
                    },   
                    importRecords: {
                        id: "ImportRecords",
                        icon: `fal fa-cabinet-filing`,
                        label: "Import Records",
                        to: "/EOS/Operations/Import/ImportRecords",
                        subs: {}
                    },
                    importCharges: {
                        id: "ImportCharges",
                        icon: `fal fa-dollar-sign`,
                        label: "Import Charges",
                        to: "/EOS/Operations/Import/ImportCharges",
                        subs: {}
                    },
                }
            },
            transfers: {
                id: "Transfers",
                icon: `icon-import`,
                label: "Transfers",
                to: "/EOS/Operations/Transfers",
                subs: {
                    notify: {
                        id: "Notify",
                        icon: `fal fa-mail-bulk`,
                        label: "Notify",
                        to: "/EOS/Operations/Transfers/Notify",
                        subs: {}
                    }
                }
            },
            reporting: {
                id: 'Reporting',
                icon: 'fal fa-clipboard-check',
                label: 'Reporting',
                to: '/EOS/Operations/Reporting',
                subs: {
                    stats: {
                        id: "Stats",
                        icon: "fal fa-file-edit",
                        label: "Stats",
                        to: "/EOS/Operations/Reporting/Stats",
                        subs: {}
                    },
                    breakdownProgress: {
                        id: 'BreakdownProgress',
                        icon: 'fal fa-ballot-check',
                        label: 'Breakdown Progress',
                        to: '/EOS/Operations/Reporting/BreakdownProgress',
                        subs: {}
                    },
                    analytics: {
                        id: 'Analytics',
                        icon: 'fal fa-clipboard-check',
                        label: 'Analytics',
                        to: '/EOS/Operations/Reporting/Analytics',
                        subs: {}
                    },
                }
            },
            warehouse: {
                id: "Warehouse",
                icon: "fal fa-warehouse",
                label: "Warehouse",
                to: "/EOS/Warehouse",
                subs: {
                    damageReporting: {
                        id: "DamageReporting",
                        icon: `fal fa-sensor-alert`,
                        label: "Damage Reporting",
                        to: "/EOS/Operations/Warehouse/DamageReporting",
                        subs: {}
                    },
                    dock: {
                        id: "Dock",
                        icon: `fal fa-forklift`,
                        label: "Dock",
                        to: "/EOS/Operations/Warehouse/Dock",
                        subs: {}
                    },
                    warehouseImport: {
                        id: "WarehouseImport",
                        icon: "fal fa-plane-arrival",
                        label: "Import",
                        to: "/EOS/Operations/Warehouse/Import",
                        subs: {}
                    },
                    dockDelivery: {
                        id: "DockDelivery",
                        icon: "fal fa-person-dolly",
                        label: "Dock Delivery",
                        to: "/EOS/Operations/Warehouse/DockDelivery",
                        subs: {}
                    }
                }
            },
            edi: {
                id: "EDI",
                icon: "fal fa-warehouse",
                label: "EDI",
                to: "/EOS/EDI",
                subs: {
                    ediFfm: {
                        id: "EdiFFM",
                        icon: `fal fa-file-alt`,
                        label: "FFM",
                        to: "/EOS/Operations/EDI/EdiFFM",
                        subs: {}
                    },
                    ediFwb: {
                        id: "EdiFWB",
                        icon: `fal fa-envelope-open`,
                        label: "FWB",
                        to: "/EOS/Operations/EDI/EdiFWB",
                        subs: {}
                    },
                    ediFhl: {
                        id: "EdiFHL",
                        icon: `fal fa-envelope-square`,
                        label: "FHL",
                        to: "/EOS/Operations/EDI/EdiFHL",
                        subs: {}
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
                subs: {}
            },
            destinationReport: {
                id: 'DestinationReport',
                icon: 'fal fa-clipboard-check',
                label: 'Destination Report',
                to: '/EOS/Leads/DestinationReport',
                subs: {}
            },
            externalUsers: {
                id: "ExternalUsers",
                icon: "fal fa-house-user",
                label: "External Users",
                to: "/EOS/Leads/ExternalUsers",
                subs: {}
            },
            overrideCodes: {
                id: "OverrideCodes",
                icon: "fal fa-house-user",
                label: "Override Codes",
                to: "/EOS/Leads/OverrideCodes",
                subs: {}
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
                subs: {}
            },
            invoices: {
                id: "Invoices",
                icon: "fal fa-file-invoice",
                label: "Invoices",
                to: "/EOS/Managers/Invoices",
                subs: {}
            },
            manageTraining: {
                id: "ManageTraining",
                icon: "fal fa-user-graduate",
                label: "Manage Training",
                to: "/EOS/Managers/ManageTraining",
                subs: {}
            },
            flightsSchedule: {
                id: "FlightsSchedule",
                icon: "fal fa-calendar-plus",
                label: "Flights Schedule",
                to: "/EOS/Managers/FlightsSchedule",
                subs: {},
            },
            healthCheck: {
                id: "HealthCheck",
                icon: "fal fa-virus",
                label: "Health Check",
                to: "/EOS/Managers/HealthCheck",
                subs: {},
            },
            activeUsers: {
                id: "ActiveUsers",
                icon: "fal fa-street-view",
                label: "Active Users",
                to: "/EOS/Managers/ActiveUsers",
                subs: {},
            },
            counterMoney: {
                id: "CounterMoney",
                icon: "fal fa-search-dollar",
                label: "Counter Money",
                to: "/EOS/Managers/CounterMoney",
                subs: {},
            },
            importOverride: {
                id: "ImportOverride",
                icon: "fal fa-money-check-edit-alt",
                label: "Import Override",
                to: "/EOS/Managers/ImportOverride",
                subs: {},
            },
            importFlightManager: {
                id: "ImportFlightManager",
                icon: "icon-breakdown-instructions",
                label: "Import Flight Manager",
                to: "/EOS/Managers/ImportFlightManager",
                subs: {},
            },
            manageReadingSigns: {
                id: "ManageReadingSigns",
                icon: "fab fa-readme",
                label: "Read and Signs",
                to: "/EOS/Managers/ManageReadingSigns",
                subs: {},
            },
            refundRequests: {
                id: "RefundRequests",
                icon: "fab fa-readme",
                label: "Refund Requests",
                to: "/EOS/Managers/RefundRequests",
                subs: {},
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
                subs: {}
            },
            companyProfiles: {
                id: "CompanyProfiles",
                icon: "fal fa-warehouse",
                label: "Company Profiles",
                to: "/EOS/Corporate/CompanyProfiles",
                subs: {}
            }
        }
    },
    humanResources: {
        id: "HR",
        icon: "fa-id-badge",
        label: "HR",
        to: "/EOS/HR",
        subs: {
            humanResources: {
                id: "HumanResources",
                icon: "fal fa-user-circle",
                label: "Human Resources",
                to: "/EOS/HR/HumanResources",
                subs: {}
            }, 
            vaccineRecords: {
                id: "VaccineRecords",
                icon: "fal fa-user-circle",
                label: "Vaccine Records",
                to: "/EOS/HR/VaccineRecords",
                subs: {}
            }
        }
    },
    dev: {
        id: "DEV",
        icon: "fa-brain-circuit",
        label: "DEV",
        to: "/EOS/DEV",
        subs: {
            main: {
                id: "Main",
                icon: "fal fa-wrench",
                label: "Main",
                to: "/EOS/DEV/Main",
                subs: {}
            }
        }
    }
}

export default map;