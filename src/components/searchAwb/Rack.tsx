import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col } from 'reactstrap';
import ReactTable from '../custom/ReactTable';

interface IRack {
    [x: string]: any,
    ic_created_day: number,
    s_status: string,
    i_pieces: number,
    s_destination: string,
    s_uld: string,
    s_flight_id: string,
    t_created: Date,
    s_created_by: string,
    t_modified: Date,
    s_modified_by: string
}

type Props = {
    data: Array<IRack>
}

export default function Rack ({ data }: Props) {

    console.log(data);

    const [sortedData, setSortedData] = useState<Array<IRack>>([]);
    const numDelivered = useMemo(() => {
        return (data || []).filter(i => i.s_status === 'DELIVERED').length;
        // return (data || []).reduce((total: number, current: IRack) => {
        //     return total += current.s_status === 'DELIVERED' ? current.i_pieces : 0;
        // }, 0);
    }, [data]);

    useEffect(() => {
        if (data.length > 0) {
            setSortedData(data.sort((a, b) => +new Date(b.t_modified) - +new Date(a.t_modified)));
        }
    }, [data]);

    return  (
        <Row>
            <Col md={12}>
                <h4>Delivered: {numDelivered}</h4>
                <ReactTable 
                    data={sortedData}
                    mapping={[
                        {
                            name: 'Days',
                            value: 'ic_created_day'
                        },
                        {
                            name: 'Status',
                            value: 's_status'
                        },
                        {
                            name: 'Location',
                            value: 's_location'
                        },
                        {
                            name: 'PCs',
                            value: 'i_pieces'
                        },
                        {
                            name: 'Dest',
                            value: 's_destination'
                        },
                        {
                            name: 'ULD',
                            value: 's_uld'
                        },
                        {
                            name: 'flight',
                            value: 's_flight_id'
                        },
                        {
                            name: 'Created',
                            value: 't_created',
                            datetime: true,
                            utc: true
                        },
                        {
                            name: 'Created by',
                            value: 's_created_by',
                            email: true
                        },
                        {
                            name: 'Modified',
                            value: 't_modified',
                            datetime: true,
                            utc: true
                        },
                        {
                            name: 'Modified by',
                            value: 's_modified_by',
                            email: true
                        }
                    ]} 
                    numRows={10}
                    handleClick={undefined} 
                    locked={false} 
                    index={undefined} 
                    enableClick={false} 
                    customHeight={undefined} 
                    defaultFiltered={undefined}
                    reactTableRef={undefined} 
                    className={''} 
                    selectedIds={undefined} 
                    disableGlobalFilter={false}                
                />
            </Col>
        </Row>
    );
}
