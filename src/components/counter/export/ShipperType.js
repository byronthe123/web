import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup } from 'reactstrap';

export default function ShipperType ({
    shipperType,
    setShipperType
}) {

    const [types, setTypes] = useState([]);

    useEffect(() => {
        const random = Math.floor((Math.random() * 2) + 1);
        const add = 'UNKNOWN SHIPPER ONLY';
        const _types = ['KNOWN AND UNKNOWN SHIPPER'];
        if (random === 1) {
            _types.push(add);
        } else {
            _types.unshift(add);
        }
        setTypes(_types);
    }, []);

    return (
            <ButtonGroup>
            {
                types.map((type, i) =>
                    <Button 
                        onClick={() => setShipperType(type)} 
                        active={shipperType === type}
                        key={i}
                    >
                        {type}
                    </Button>
                )
            }
        </ButtonGroup>
    );
}