const data = [
    {
        id: "Portal",
        icon: 'fa-address-card',
        label: "Portal",
        to: "/EOS/Portal",
        subs: [
        {
            id: "MyProfile",
            icon: `icon-my-profile`,
            label: "My Profile",
            to: "/EOS/Portal/Profile"
        },
        {
            id: "Wiki",
            icon: `fal fa-atlas`,
            label: "Wiki",
            to: "/EOS/Portal/Wiki",
        },
        {
            id: "Safety",
            icon: `fal fa-th-list`,
            label: "Safety",
            to: "/EOS/Portal",
            subs: [
            {
                id: "SafetyStatement",
                icon: `icon-safety-statement`,
                label: "Safety Statement",
                to: "/EOS/Portal/SafetyStatement"
            },
            {
                id: "SafetyIncidentReporting",
                icon: `icon-safety-incident-reporting`,
                label: "Safety Incident Reporting",
                to: "/EOS/Portal/SafetyIncidentReporting"
            },
            ]
        },
        ]
    },
    {
        id: "Training",
        icon: "fa-graduation-cap",
        label: "Training",
        to: "/EOS/Training",
        subs: [{
            id: "TrainingModule",
            icon: "fal fa-graduation-cap",
            label: "Training Module",
            to: "/EOS/Training/TrainingModule",
            subs: []
        }
        ]
    },
    {
        id: "Operations",
        icon: 'fa-cogs',
        label: "Operations",
        to: "",
        subs: [
            {
                id: "Counter",
                icon: `fal fa-th-list`,
                label: "Counter",
                to: "/EOS/Operations/Counter/",
                subs: [
                {
                    id: "Queue",
                    icon: `fal fa-chair`,
                    label: "Queue",
                    to: "/EOS/Operations/Counter/Queue",
                    subs: []
                },
                {
                    id: "Delivery",
                    icon: "fal fa-sign-out-alt",
                    label: "Delivery",
                    to: "/EOS/Operations/Counter/Delivery",
                    subs: []
                },
                {
                    id: "Acceptance",
                    icon: "fal fa-sign-in-alt",
                    label: "Acceptance",
                    to: "/EOS/Operations/Counter/Acceptance",
                    subs: []
                },
                {
                    id: "CounterReporting",
                    icon: "fal fa-chart-bar",
                    label: "Counter Reporting",
                    to: "/EOS/Operations/Counter/CounterReporting",
                    subs: []
                }      
                ]
            },
            {
                id: "Export",
                icon: `icon-export`,
                label: "Export",
                to: "/EOS/Operations/Export/",
                subs: [
                    {
                        id: "AcceptanceArchive",
                        icon: `icon-screening`,
                        label: "Acceptance Archive",
                        to: "/EOS/Operations/Export/AcceptanceArchive",
                        subs: []
                    },
                    {
                        id: "UpdateAcceptance",
                        icon: "fal fa-file-edit",
                        label: "Update Acceptance",
                        to: "/EOS/Operations/Export/UpdateAcceptance",
                        subs: []
                    },
                    {
                        id: "ExportRecords",
                        icon: "fal fa-cabinet-filing",
                        label: "Export Records",
                        to: "/EOS/Operations/Export/ExportRecords",
                        subs: []
                    },
                    {
                        id: "Buildup",
                        icon: `fal fa-th-list`,
                        label: "Buildup",
                        to: "/EOS/Operations/Export/Buildup",
                        subs: []
                    },
                    {
                        id: "ExportTransfers",
                        icon: `icon-export-transfers`,
                        label: "Export Transfers",
                        to: "/EOS/Operations/Export/ExportTransfers",
                        subs: []
                    },  
                    {
                        id: "Screening",
                        icon: `icon-screening`,
                        label: "Screening",
                        to: "/EOS/Operations/Export/Screening",
                        subs: []
                    }    
                ]
            },
            {
                id: "Import",
                icon: `icon-import`,
                label: "Import",
                to: "/EOS/Operations/Import",
                subs: [
                {
                    id: "BreakdownInstructions",
                    icon: `fal fa-clipboard-list-check`,
                    label: "Breakdown Instructions",
                    to: "/EOS/Operations/Import/BreakdownInstructions",
                    subs: []
                },
                {
                    id: "ImportTransfers",
                    icon: `icon-import-transfers`,
                    label: "Import Transfers",
                    to: "/EOS/Operations/Import/ImportTransfers",
                    subs: []
                },
                {
                    id: 'Notify',
                    icon: 'fal fa-mail-bulk',
                    label: 'Notify',
                    to: '/EOS/Operations/Import/Notify',
                    subs: []
                },   
                {
                    id: "ProofOfDelivery",
                    icon: `fal fa-file-signature`,
                    label: "Proof of Delivery",
                    to: "/EOS/Operations/Import/ProofOfDelivery",
                    subs: []
                },
                {
                    id: "Rack",
                    icon: `fal fa-inventory`,
                    label: "Rack",
                    to: "/EOS/Operations/Import/Rack",
                    subs: []
                }, 
                {
                    id: "EdiImport",
                    icon: `fal fa-comments-alt`,
                    label: "EDI",
                    to: "/EOS/Operations/Import/EDI",
                    subs: []
                },
                {
                    id: "AcceptTransfers",
                    icon: `fal fa-th-list`,
                    label: "Accept Transfers",
                    to: "/EOS/Operations/Import/AcceptTransfers",
                    subs: []
                },
                {
                    id: "FidsEditor",
                    icon: `fal fa-columns`,
                    label: "Fids Editor",
                    to: "/EOS/Operations/Import/FidsEditor",
                    subs: []
                },   
                {
                    id: "ImportRecords",
                    icon: `fal fa-cabinet-filing`,
                    label: "Import Records",
                    to: "/EOS/Operations/Import/ImportRecords",
                    subs: []
                },
                {
                    id: "ImportCharges",
                    icon: `fal fa-dollar-sign`,
                    label: "Import Charges",
                    to: "/EOS/Operations/Import/ImportCharges",
                    subs: []
                },
                ]
            },
            {
                id: "Transfers",
                icon: `icon-import`,
                label: "Transfers",
                to: "/EOS/Operations/Transfers",
                subs: [
                    {
                        id: "Notify",
                        icon: `fal fa-mail-bulk`,
                        label: "Notify",
                        to: "/EOS/Operations/Transfers/Notify",
                        subs: []
                    }
                ]
            },
            {
                id: 'Reporting',
                icon: 'fal fa-clipboard-check',
                label: 'Reporting',
                to: '/EOS/Operations/Reporting',
                subs: [
                    {
                        id: "Stats",
                        icon: "fal fa-file-edit",
                        label: "Stats",
                        to: "/EOS/Operations/Reporting/Stats",
                        subs: []
                    },
                    {
                        id: 'BreakdownProgress',
                        icon: 'fal fa-ballot-check',
                        label: 'Breakdown Progress',
                        to: '/EOS/Operations/Reporting/BreakdownProgress',
                        subs: []
                    },
                    {
                        id: 'Analytics',
                        icon: 'fal fa-clipboard-check',
                        label: 'Analytics',
                        to: '/EOS/Operations/Reporting/Analytics',
                        subs: []
                    },
                ]
            },
            {
                id: "Warehouse",
                icon: "fal fa-warehouse",
                label: "Warehouse",
                to: "/EOS/Warehouse",
                subs: [
                {
                    id: "DamageReporting",
                    icon: `fal fa-sensor-alert`,
                    label: "Damage Reporting",
                    to: "/EOS/Operations/Warehouse/DamageReporting",
                    subs: []
                },
                {
                    id: "Dock",
                    icon: `fal fa-forklift`,
                    label: "Dock",
                    to: "/EOS/Operations/Warehouse/Dock",
                    subs: []
                },
                {
                    id: "WarehouseImport",
                    icon: "fal fa-plane-arrival",
                    label: "Import",
                    to: "/EOS/Operations/Warehouse/Import",
                    subs: []
                },
                {
                    id: "DockDelivery",
                    icon: "fal fa-person-dolly",
                    label: "Dock Delivery",
                    to: "/EOS/Operations/Warehouse/DockDelivery",
                    subs: []
                }
                ]
            },
            {
                id: "EDI",
                icon: "fal fa-warehouse",
                label: "EDI",
                to: "/EOS/EDI",
                subs: [
                    {
                        id: "EdiFFM",
                        icon: `fal fa-file-alt`,
                        label: "FFM",
                        to: "/EOS/Operations/EDI/EdiFFM",
                        subs: []
                    },
                    {
                        id: "EdiFWB",
                        icon: `fal fa-envelope-open`,
                        label: "FWB",
                        to: "/EOS/Operations/EDI/EdiFWB",
                        subs: []
                    },
                    {
                        id: "EdiFHL",
                        icon: `fal fa-envelope-square`,
                        label: "FHL",
                        to: "/EOS/Operations/EDI/EdiFHL",
                        subs: []
                    }
                ]
            }
        ]
    },
    {
        id: "Leads",
        icon: "fa-user-cog",
        label: "Leads",
        to: "",
        subs: [
            {
                id: 'ImportFlightAudit',
                icon: 'fa-light fa-box-dollar',
                label: 'Import Flight Audit',
                to: '/EOS/Leads/ImportFlightAudit'
            },
            {
                id: 'DestinationReport',
                icon: 'fal fa-clipboard-check',
                label: 'Destination Report',
                to: '/EOS/Leads/DestinationReport',
                subs: []
            },
            {
                id: "ExternalUsers",
                icon: "fal fa-house-user",
                label: "External Users",
                to: "/EOS/Leads/ExternalUsers",
                subs: []
            },
            {
                id: "OverrideCodes",
                icon: "fal fa-house-user",
                label: "Override Codes",
                to: "/EOS/Leads/OverrideCodes",
                subs: []
            },
            {
                id: "BlacklistEmails",
                icon: "fal fa-mail",
                label: "Blacklist Emails",
                to: "/EOS/Leads/BlacklistEmails",
                subs: []
            }
        ]
    },
    {
        id: "Managers",
        icon: "fa-users",
        label: "Managers",
        managers: true,
        to: "",
        subs: [
            {
                id: "QueueAdmin",
                icon: "fal fa-users-class",
                label: "Queue Admin",
                to: "/EOS/Managers/QueueAdmin",
                subs: []
            },
            {
                id: "Invoices",
                icon: "fal fa-file-invoice",
                label: "Invoices",
                to: "/EOS/Managers/Invoices",
                subs: []
            },
            {
                id: "ManageTraining",
                icon: "fal fa-user-graduate",
                label: "Manage Training",
                to: "/EOS/Managers/ManageTraining",
                subs: []
            },
            {
                id: "FlightsSchedule",
                icon: "fal fa-calendar-plus",
                label: "Flights Schedule",
                to: "/EOS/Managers/FlightsSchedule",
                subs: [],
            },
            {
                id: "HealthCheck",
                icon: "fal fa-virus",
                label: "Health Check",
                to: "/EOS/Managers/HealthCheck",
                subs: [],
            },
            {
                id: "ActiveUsers",
                icon: "fal fa-street-view",
                label: "Active Users",
                to: "/EOS/Managers/ActiveUsers",
                subs: [],
            },
            {
                id: "CounterMoney",
                icon: "fal fa-search-dollar",
                label: "Counter Money",
                to: "/EOS/Managers/CounterMoney",
                subs: [],
            },
            {
                id: "ImportOverride",
                icon: "fal fa-money-check-edit-alt",
                label: "Import Override",
                to: "/EOS/Managers/ImportOverride",
                subs: [],
            },
            {
                id: "ImportFlightManager",
                icon: "icon-breakdown-instructions",
                label: "Import Flight Manager",
                to: "/EOS/Managers/ImportFlightManager",
                subs: [],
            },
            {
                id: "ManageReadingSigns",
                icon: "fab fa-readme",
                label: "Read and Signs",
                to: "/EOS/Managers/ManageReadingSigns",
                subs: [],
            },
            {
                id: "RefundRequests",
                icon: "fab fa-readme",
                label: "Refund Requests",
                to: "/EOS/Managers/RefundRequests",
                subs: [],
            },
            {
                id: "SMS",
                icon: "fal fa-book-medical",
                label: "SMS",
                to: "/EOS/Managers/SMS",
                subs: [],
                restricted: true
            }
        ]
    },
    {
        id: "Corporate",
        icon: "fa-chart-network",
        label: "Corporate",
        to: "",
        subs: [
            {
                id: "BusinessIntelligence",
                icon: "fal fa-file-chart-pie",
                label: "Business Intelligence",
                to: "/EOS/Corporate/BusinessIntelligence",
                subs: []
            },
            {
                id: "CompanyProfiles",
                icon: "fal fa-warehouse",
                label: "Company Profiles",
                to: "/EOS/Corporate/CompanyProfiles",
                subs: []
            }
        ]
    },
    {
        id: "HR",
        icon: "fa-id-badge",
        label: "HR",
        to: "/EOS/HR",
        subs: [
            {
                id: "HumanResources",
                icon: "fal fa-user-circle",
                label: "Human Resources",
                to: "/EOS/HR/HumanResources",
                subs: []
            }, 
            {
                id: "VaccineRecords",
                icon: "fal fa-user-circle",
                label: "Vaccine Records",
                to: "/EOS/HR/VaccineRecords",
                subs: []
            }
        ]
    },
    {
        id: "DEV",
        icon: "fa-brain-circuit",
        label: "DEV",
        to: "/EOS/DEV",
        subs: [{
            id: "Main",
            icon: "fal fa-wrench",
            label: "Main",
            to: "/EOS/DEV/Main",
            subs: []
        }
        ]
    }
    // {
    //   id: "Files",
    //   icon: "fal fa-folder",
    //   label: "Files",
    //   to: "/EOS/Files",
    //   subs: [
    //     {
    //       id: "FilesMain",
    //       icon: "",
    //       label: "Main",
    //       to: "/EOS/Files",
    //       subs: []
    //     }
    //   ]
    // },
    // {
    //   id: "VideoTest",
    //   icon: "",
    //   label: "Video Test",
    //   to: "/EOS/Video",
    //   subs: []
    // }
    ];
    export default data;