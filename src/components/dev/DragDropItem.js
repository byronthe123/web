import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardBody } from 'reactstrap';

export default function Item ({ item, index, grid }) {

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

    return (
        <Draggable
            key={index}
            draggableId={item.id.toString()}
            index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                    )}
                >
                    <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                        <CardBody className='custom-card-transparent'>
                            Drag
                        </CardBody>
                    </Card>
                </div>
            )}
        </Draggable>
    );
}