const IDENTIFICATION = {
    uploaded: false,
    singleUpload: true,
    required: true,
    categories: [
        {
            name: "STATE DRIVER'S LICENSE",
            subcategories: [
                {
                    name: "NEW YORK STATE",
                    modelId: 'e06616a0-3399-4442-a8d4-e168b8728479'
                },
                {
                    name: 'NY YORK STATE ENHANCED',
                    modelId: '2c90038a-7728-4ebf-90d8-57ab51d093e6'
                },
                {
                    name: `NEW JERSEY DRIVER'S LICENSE`,
                    modelId: '85784ec4-dce9-44de-aab4-b65fde3d73bc'
                },
                {
                    name: `VIRGINIA DRIVER'S LICENSE (INCLUDING COMMERCIAL)`,
                    modelId: 'f58c4e29-6c84-47d7-a567-864442efc27e'
                },
                {
                    name: `MARYLAND DRIVER'S LICENSE`,
                    modelId: '281b35bd-8f1f-4775-a184-b03dbe77de11'
                },
                {
                    name: `MASSACHUSETS DRIVER'S LICENSE`,
                    modelId: 'cfe3c615-6d01-48f2-bf5c-7623a1de295d'
                },
                {
                    name: `PENNSYLVANIA DRIVER'S LICENSE`,
                    modelId: '9eb31b50-3861-4075-9283-0428d34279c1'
                }
            ]
        },
        {
            name: 'PASSPORT',
            modelId: null
        },
        {
            name: 'AIRPORT BADGE',
            modelId: null
        },
        {
            name: 'US DEPARTMENT OF DEFENSE ID',
            modelId: null
        },
        {
            name: 'PERMENANT RESIDENT CARD',
            modelId: null
        },
        {
            name: 'TRANSPORTATION WORKER IDENTIFICATION CARD',
            modelId: null
        }
    ]
};

const AWB = {
    uploaded: false,
    // modelId: '0987d8bd-8376-4498-88f4-08762c4f5be7'
    modelId: '22d35e23-8261-4faa-892d-68fcfbb17dda'
};

const EXPORT_AWB = Object.assign({}, AWB);
EXPORT_AWB.required = true;

export const importTypes = {
    'IDENTIFICATION': IDENTIFICATION,
    'PICK UP ORDER': {
        uploaded: false,
        modelId: null,
        required: true
    },
    'AWB': AWB,
    'CONTROL MANIFEST': {
        uploaded: false,
        modelId: null
    },
    'CARRIER CERTIFICATE': {
        uploaded: false,
        modelId: null
    },
}

const IDENTIFICATION2 = Object.assign({}, IDENTIFICATION);
IDENTIFICATION2.required = false;

export const exportTypes = {
    'IDENTIFICATION1': IDENTIFICATION,
    'IDENTIFICATION2': IDENTIFICATION2,
    'AWB': EXPORT_AWB,
    'CONSOLIDATION': {
        uploaded: false,
        modelId: null
    },
    'DGR': {
        uploaded: false,
        modelId: null
    },
    'TSA IAC LETTER': {
        uploaded: false,
        modelId: null
    },
    'CCSF': {
        uploaded: false,
        modelId: null
    },
    'KNOWN SHIPPER': {
        uploaded: false,
        modelId: null
    },
    'SHIPPER SECURITY ENDORSEMENT': {
        uploaded: false,
        modelId: null
    },
    'AIRLINE TRANSFER': {
        uploaded: false,
        modelId: null
    },
    'MANIFEST': {
        uploaded: false,
        modelId: null
    },
    'AIRLINE TRANSFER': {
        uploaded: false,
        modelId: null
    },
    'MANIFEST': {
        uploaded: false,
        modelId: null
    }
}