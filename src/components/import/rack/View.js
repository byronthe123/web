import React, { useState, useEffect  } from 'react';
import {withRouter} from 'react-router-dom';

import { Row, Col } from 'reactstrap';

import TableLayoutter from './TableLayoutter';
import SpecialLocations from './SpecialLocations';

const View = ({
    schema,
    specialLocations,
    rackItems,   
    handleAddUpdate  
}) => {

    console.log(schema);

    const [rackData, setRackData] = useState([]);
    const [rackLocations, setRackLocations] = useState({});

    useEffect(() => {
        const filtered = rackItems.filter(item => !item.b_delivered);
        setRackData(filtered);

        const locations = {};
        for (let i = 0; i < filtered.length; i++) {
            const current = filtered[i];
            if (locations[current.s_location] === undefined) {
                locations[current.s_location] = true;
            }
        }

        console.log(locations);
        setRackLocations(locations);

    }, [rackItems]);

    return (
        <Row className='px-2'>
            <Col md='12' lg='12'>
                <Row>
                    {
                        Object.keys(schema).map((key, i) => (
                            <TableLayoutter 
                                tower={key}
                                levels={schema[key]}
                                rackData={rackData}
                                rackLocations={rackLocations}
                                handleAddUpdate={handleAddUpdate}
                                key={i}
                            />
                        ))
                    }
                    <SpecialLocations 
                        specialLocations={specialLocations}
                        rackData={rackData}
                        rackLocations={rackLocations}
                        handleAddUpdate={handleAddUpdate}
                    />
                </Row>
            </Col>
        </Row>
    );
}

export default withRouter(View);