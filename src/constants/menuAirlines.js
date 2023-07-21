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
        // {
        //     id: "Wiki",
        //     icon: `fal fa-atlas`,
        //     label: "Wiki",
        //     to: "/EOS/Portal/Wiki",
        // },
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
        // {
        //     id: "Export",
        //     icon: `icon-export`,
        //     label: "Export",
        //     to: "/EOS/Operations/Export/",
        //     subs: [
        //         {
        //             id: "AcceptanceArchive",
        //             icon: `icon-screening`,
        //             label: "Acceptance Archive",
        //             to: "/EOS/Operations/Export/AcceptanceArchive",
        //             subs: []
        //         },
        //         {
        //             id: "UpdateAcceptance",
        //             icon: "fal fa-file-edit",
        //             label: "Update Acceptance",
        //             to: "/EOS/Operations/Export/UpdateAcceptance",
        //             subs: []
        //         },
        //         {
        //             id: "ExportRecords",
        //             icon: "fal fa-cabinet-filing",
        //             label: "Export Records",
        //             to: "/EOS/Operations/Export/ExportRecords",
        //             subs: []
        //         },
        //         {
        //             id: "Buildup",
        //             icon: `fal fa-th-list`,
        //             label: "Buildup",
        //             to: "/EOS/Operations/Export/Buildup",
        //             subs: []
        //         },
        //         {
        //             id: "ExportTransfers",
        //             icon: `icon-export-transfers`,
        //             label: "Export Transfers",
        //             to: "/EOS/Operations/Export/ExportTransfers",
        //             subs: []
        //         },  
        //         {
        //             id: "Screening",
        //             icon: `icon-screening`,
        //             label: "Screening",
        //             to: "/EOS/Operations/Export/Screening",
        //             subs: []
        //         }    
        //     ]
        // },
        // {
        //     id: "Import",
        //     icon: `icon-import`,
        //     label: "Import",
        //     to: "/EOS/Operations/Import",
        //     subs: [
        //     {
        //         id: "BreakdownInstructions",
        //         icon: `fal fa-clipboard-list-check`,
        //         label: "Breakdown Instructions",
        //         to: "/EOS/Operations/Import/BreakdownInstructions",
        //         subs: []
        //     },
        //     {
        //         id: "ImportTransfers",
        //         icon: `icon-import-transfers`,
        //         label: "Import Transfers",
        //         to: "/EOS/Operations/Import/ImportTransfers",
        //         subs: []
        //     },
        //     {
        //         id: 'Notify',
        //         icon: 'fal fa-mail-bulk',
        //         label: 'Notify',
        //         to: '/EOS/Operations/Import/Notify',
        //         subs: []
        //     },   
        //     {
        //         id: "ProofOfDelivery",
        //         icon: `fal fa-file-signature`,
        //         label: "Proof of Delivery",
        //         to: "/EOS/Operations/Import/ProofOfDelivery",
        //         subs: []
        //     },
        //     {
        //         id: "Rack",
        //         icon: `fal fa-inventory`,
        //         label: "Rack",
        //         to: "/EOS/Operations/Import/Rack",
        //         subs: []
        //     }, 
        //     {
        //         id: "EdiImport",
        //         icon: `fal fa-comments-alt`,
        //         label: "EDI",
        //         to: "/EOS/Operations/Import/EDI",
        //         subs: []
        //     },
        //     {
        //         id: "AcceptTransfers",
        //         icon: `fal fa-th-list`,
        //         label: "Accept Transfers",
        //         to: "/EOS/Operations/Import/AcceptTransfers",
        //         subs: []
        //     },
        //     {
        //         id: "FidsEditor",
        //         icon: `fal fa-columns`,
        //         label: "Fids Editor",
        //         to: "/EOS/Operations/Import/FidsEditor",
        //         subs: []
        //     },   
        //     {
        //         id: "ImportRecords",
        //         icon: `fal fa-cabinet-filing`,
        //         label: "Import Records",
        //         to: "/EOS/Operations/Import/ImportRecords",
        //         subs: []
        //     },
        //     ]
        // },
        // {
        //     id: 'Reporting',
        //     icon: 'fal fa-clipboard-check',
        //     label: 'Reporting',
        //     to: '/EOS/Operations/Reporting',
        //     subs: [
        //     {
        //         id: 'Analytics',
        //         icon: 'fal fa-clipboard-check',
        //         label: 'Analytics',
        //         to: '/EOS/Operations/Reporting/Analytics',
        //         subs: []
        //     },
        //     {
        //         id: "Stats",
        //         icon: "fal fa-file-edit",
        //         label: "Stats",
        //         to: "/EOS/Operations/Reporting/Stats",
        //         subs: []
        //     }
        //     ]
        // },
        // {
        //     id: "Warehouse",
        //     icon: "fal fa-warehouse",
        //     label: "Warehouse",
        //     to: "/EOS/Warehouse",
        //     subs: [
        //     {
        //         id: "DamageReporting",
        //         icon: `fal fa-sensor-alert`,
        //         label: "Damage Reporting",
        //         to: "/EOS/Operations/Warehouse/DamageReporting",
        //         subs: []
        //     },
        //     {
        //         id: "Dock",
        //         icon: `fal fa-forklift`,
        //         label: "Dock",
        //         to: "/EOS/Operations/Warehouse/Dock",
        //         subs: []
        //     },
        //     {
        //         id: "WarehouseImport",
        //         icon: "fal fa-plane-arrival",
        //         label: "Import",
        //         to: "/EOS/Operations/Warehouse/Import",
        //         subs: []
        //     },
        //     {
        //         id: "DockDelivery",
        //         icon: "fal fa-person-dolly",
        //         label: "Dock Delivery",
        //         to: "/EOS/Operations/Warehouse/DockDelivery",
        //         subs: []
        //     }
        //     ]
        // }
        ]
    }
];
export default data;