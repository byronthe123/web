import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/index';
import { withRouter } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { api } from '../../utils';
import moment from 'moment';
import axios from 'axios';

import { Row, Col } from 'reactstrap';
import Item from './DragDropItem';

export default function DragDrop () {

    const { user } = useContext(AppContext);
    const [items, setItems] = useState([{
        id: 1,
        s_mawb: '00122224444',
        s_hawb: 'HOUSE',
        f_amount: 12.5,
        s_record: 'TEST',
        s_type: 'TYPE',
        s_email: 'BOB@CHOICE.AERO',
        s_airport: 'JFK',
        s_reason: 'WHERES MY MONEY',
        s_status: 'OPEN',
        b_approved: false,
        t_approved: null,
        f_amount_approved: null,
        s_approver: null,
        t_created: new Date(),
        s_created_by: 'BOB@CHOICE.AERO',
        t_modified: new Date(),
        s_modified_by: 'BOB@CHOICE.AERO'
    },
    {
        id: 2,
        s_mawb: '33388889999',
        s_hawb: 'HOUSE123',
        f_amount: 100,
        s_record: 'TEST456',
        s_type: 'TYPE',
        s_email: 'SAM@CHOICE.AERO',
        s_airport: 'JFK',
        s_reason: 'WHERES MY MONEY',
        s_status: 'APPROVED',
        b_approved: true,
        t_approved: new Date(),
        f_amount_approved: 100,
        s_approver: 'TONY@CHOICE.AERO',
        t_created: new Date(),
        s_created_by: 'SAM@CHOICE.AERO',
        t_modified: new Date(),
        s_modified_by: 'TONY@CHOICE.AERO'
    }]);
    const [numOpen, setNumOpen] = useState(0);

    // useEffect(() => {
    //     const getData = async () => {
    //         const res = await api('post', 'getRefundRequests', { s_airport: user.s_unit });
    //         const { data } = res;
    //         setItems(data);
    //     }
    //     if (user && user.s_unit) {
    //         console.log('++++++++++++++++++++++WORKING++++++++++++++++++++');

    //         console.log(user);
    //         getData();
    //     }
    //     console.log(user);
    // }, [user]);

    // useEffect(() => {
    //     if (user && user.s_unit) {
    //         console.log(user);

    //         const open = items.filter(i => i.b_approved);
    //         console.log(items);
    //         setNumOpen(open.length);
    //     }
    // }, [user, items]);

    const onDrageEnd = (item) => {
        console.log(item);
        console.log(item.draggableId);
        const { draggableId, source, destination } = item;
        const updatedIndex = items.findIndex(i => i.id === parseInt(draggableId));

        if (destination) {
            if (source.droppableId === 'open') {
                items[updatedIndex].s_status = destination.droppableId.toUpperCase();
            } else if (source.droppableId === 'approved' || source.droppableId === 'rejected') {
                if (destination.droppableId !== 'open') {
                    items[updatedIndex].s_status = destination.droppableId.toUpperCase();
                }
            }
        }

    }

    const grid = 2;

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: 'none',
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,
        borderRadius: '0.75rem',
    
        // change background colour if dragging
        background: isDragging ? 'lightgreen' : 'grey',
    
        // styles we need to apply on draggables
        ...draggableStyle
    });

    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? 'lightblue' : 'lightgrey',
        padding: grid,
        width: 250
    });

    return (
        <DragDropContext onDragEnd={onDrageEnd}>
            <Row className='px-3 py-3'>
                <Col md={4}>
                    <h4 data-testid={'text-num-open'}>Open Items: {numOpen}</h4>
                    <Droppable droppableId="open">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {
                                    items.filter(i => i.s_status === 'OPEN').map((item, index) => (
                                        <Item 
                                            item={item}
                                            index={index}
                                            grid={grid}
                                            key={index}
                                        />
                                    ))  
                                }
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Col>
                <Col md={4}>
                    <h4 data-testid={'text-num-open'}>Approved Requests</h4>
                    <Droppable droppableId="approved">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {
                                    items.filter(i => i.s_status === 'APPROVED').map((item, index) => (
                                        <Item 
                                            item={item}
                                            index={index}
                                            grid={grid}
                                            key={index}
                                        />
                                    ))  
                                }
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Col>
                <Col md={4}>
                    <h4 data-testid={'text-num-open'}>Rejected Requests</h4>
                    <Droppable droppableId="rejected">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {
                                    items.filter(i => i.s_status === 'REJECTED').map((item, index) => (
                                        <Item 
                                            item={item}
                                            index={index}
                                            grid={grid}
                                            key={index}
                                        />
                                    ))  
                                }
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Col>
            </Row>
        </DragDropContext>
    );
}
