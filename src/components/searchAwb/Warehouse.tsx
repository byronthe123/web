import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import dayjs from 'dayjs';

import { IMap, IRack } from '../../globals/interfaces';
import ReactTable from '../custom/ReactTable';
import { formatEmail } from '../../utils';
import Header from './Header';

interface Props {
    data: Array<IRack>;
    toggle: () => void;
}

interface IEnhancedData extends IRack {
    days: number;
    created: string;
    modified: string;
}

export default function Warehouse ({
    data,
    toggle
}: Props) {

    const [enhancedData, setEnhancedData] = useState<Array<IEnhancedData>>([]);
    const [locatedPieces, setLocatedPieces] = useState(0);
    const [locations, setLocations] = useState(0);
    const [deliveredPcs, setDeliverdPcs] = useState(0);
    const [deletedPcs, setDeletedPcs] = useState(0);

    useEffect(() => {
        let located = 0, delivered = 0, deleted = 0;
        const locationsMap: IMap<boolean> = {};

        for (let i = 0; i < data.length; i++) {
            const current = data[i];
            const { t_created, t_modified, s_status, s_created_by, s_modified_by, i_pieces, s_location } = current;
           
            const next = s_status === 'LOCATED' ? dayjs() : dayjs(t_modified).format('MM/DD/YYYY HH:mm');
            // @ts-ignore
            current.days = dayjs.utc(next).diff(dayjs(t_created), 'days');
            
            // @ts-ignore
            current.created = `${dayjs.utc(t_created).format('MM/DD/YYYY HH:mm')} ${formatEmail(s_created_by)}`;

            // @ts-ignore
            current.modified = `${dayjs.utc(t_modified).format('MM/DD/YYYY HH:mm')} ${formatEmail(s_modified_by)}`;

            const usePieces = Number(i_pieces);;

            console.log(`${s_status} = ${i_pieces}`);

            if (s_status === 'LOCATED') {
                located += usePieces;
                if (locationsMap[s_location] === undefined) {
                    locationsMap[s_location] = true;
                }
            } else if (s_status === 'DELIVERED') {
                delivered += usePieces;
            } else if (s_status === 'DELETED') {
                deleted += usePieces;
            }

            console.log(delivered);

            setLocatedPieces(located);
            setDeliverdPcs(delivered);
            setDeletedPcs(deleted);
            setLocations(Object.keys(locationsMap).length);
        }

        console.log(data);

        // @ts-ignore
        setEnhancedData(data);
    }, [data]);

    return (
        <Row>
            <Col md={12}>
                <Header 
                    title={`Warehouse Rack History: ${locatedPieces} pcs in ${locations} locations. ${deliveredPcs} pcs delivered. ${deletedPcs} deleted.`}
                    navigation={{
                        path: '/EOS/Operations/Import/Rack',
                        toggle: () => toggle()
                    }}
                />
            </Col>
            <Col md={12}>
                <ReactTable 
                    data={enhancedData}
                    mapping={[{
                        name: 'Days',
                        value: 'days',
                        number: true,
                        customWidth: 50
                    }, {
                        name: 'Status',
                        value: 's_status'
                    }, {
                        name: 'HAWB',
                        value: 's_hawb'
                    }, {
                        name: 'Location',
                        value: 's_location',
                        customWidth: 100
                    }, {
                        name: 'Pcs',
                        value: 'i_pieces',
                        number: true,
                        customWidth: 75
                    }, {
                        name: 'Dest',
                        value: 's_destination',
                        customWidth: 75
                    }, {
                        name: 'ULD',
                        value: 's_flight_uld'
                    }, {
                        name: 'Flight',
                        value: 's_flight_id'
                    }, {
                        name: 'Unit',
                        value: 's_unit',
                        customWidth: 75
                    }, {
                        name: 'Located',
                        value: 't_created',
                        utc: true,
                        datetime: true
                    }, {
                        name: 'Located by',
                        value: 's_created_by',
                        email: true
                    }, {
                        name: 'Modified',
                        value: 't_modified',
                        utc: true,
                        datetime: true
                    }, {
                        name: 'Modified by',
                        value: 's_modified_by',
                        email: true
                    }]}
                    numRows={10}
                />
            </Col>
        </Row>
    );
}