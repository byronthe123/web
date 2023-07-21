import React, { useState, useEffect, Fragment, useMemo } from 'react';
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy';
import { Row, Col, Button } from 'reactstrap';
import moment from 'moment';
import { formatMawb } from '../../../utils';
import _ from 'lodash';

const RackItemButtons = ({ items, handleAddUpdate, setToolTipOpen }) => {

    const handleViewItem= (item) => {
        setToolTipOpen(false);
        handleAddUpdate && handleAddUpdate(false, item)
    }
    
    return (
        <Row>
            <Col md={12}>
            {
                items.map((item, i) => (item && item.s_mawb) && (
                    <Button 
                        key={i} 
                        className={'mr-1 mb-1'} 
                        onClick={() => handleViewItem(item)}
                    >
                        {formatMawb(item.s_mawb)}
                    </Button>
                ))
            }
            </Col>
        </Row>
    );
}

const Td = ({
    location,
    number,
    rackData,
    rackLocations,
    handleAddUpdate
}) => {

    const [useItem, setUseItem] = useState(null);
    const [itemsInRack, setItemsInRack] = useState([]);
    const [toolTipOpen, setToolTipOpen] = useState(false);
    const [haveData, setHaveData] = useState(false);

    useEffect(() => {
        if (rackLocations[location] !== undefined) {
            setHaveData(true);
            const items = rackData.filter(d => d.s_location === location);
            if (items.length > 0) {
                setItemsInRack(items);
                setUseItem(items[0]);    
            }
        }
    }, [location, rackData, rackLocations]);

    const bgColor = useMemo(() => {
        if (haveData && useItem !== null) {
            const now = moment(new Date()); //todays date
            const end = moment(useItem.t_created); // another date
            const duration = moment.duration(now.diff(end));
            const days = duration.asDays();
            if (useItem.b_general_order) {
                return 'purple';
            } else {
                if (days < 3) {
                    return '#6fb327';
                } else if (days > 3 && days < 14) {
                    return 'orange';
                } else {
                    return 'red';
                }
            }
        } else if (haveData) {
            return '#3db264';
        } else {
            return '#d3d3d3';
        }
    }, [haveData, useItem]);


    const textColor = _.get(useItem, 'b_comat', false) ? 'blue' : 'white';

    return (
        <Fragment>
            <td 
                style={{
                    backgroundColor: bgColor, 
                    color: `${haveData ? 'white' : 'black'}`, 
                    fontWeight: `${haveData ? 'bolder' : 'normal'}`
                }} 
                className='text-center' 
            >
                {
                    haveData ? 
                        <Tooltip 
                            open={toolTipOpen}
                            trigger={'click'}
                            theme={'light'}
                            interactive
                            hideOnClick={true}
                            html={(
                                <RackItemButtons 
                                    items={itemsInRack} 
                                    handleAddUpdate={handleAddUpdate} 
                                    setToolTipOpen={setToolTipOpen}
                                />
                            )}
                            onRequestClose={() => setToolTipOpen(false)}
                        >
                            <span 
                                onClick={() => setToolTipOpen(true)} 
                                style={{
                                    color: textColor, 
                                    fontWeight: 'bold', 
                                    textDecoration: `${useItem && useItem.b_comat ? 'underline' : ''}`
                                }}
                            >
                                {number}
                            </span>
                        </Tooltip> 
                        :
                        <span>{number}</span> 
                } 
            </td>
        </Fragment>
    );
}

export default Td;