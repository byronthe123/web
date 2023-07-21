import { IReactTableMappingProps } from "../../../../globals/interfaces";

const mapping: Array<IReactTableMappingProps> = [
    {
        name: 'AWB',
        value: 's_mawb'
    },
    {
        name: 'Dest',
        value: 's_destination'
    },
    {
        name: 'Notes',
        value: 's_notes'
    },
    {
        name: 'Located',
        value: 'locatedCount'
    },
    {
        name: 'This ULD',
        value: 'uldSum'
    },
    {
        name: 'This FLT',
        value: 'flightSum'
    },
    {
        name: 'Total',
        value: 'fwbPieces'
    },
    {
        name: 'SHC',
        value: 's_special_handling_code'
    }
]

export default mapping;