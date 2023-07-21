import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
 
const localizer = momentLocalizer(moment)

const CalendarView = ({
    baseApiUrl,
    headerAuthCode,
    user,
    eightyWindow,
    createSuccessNotification,
    selectedItem, 
    setSelectedItem,
    modalOpen, 
    setModalOpen,
    createNew, 
    setCreateNew,
    selectedDays, 
    setSelectedDays,
    handleEdit,
    handleCreateNewItem,
    handleDayClick,
    addFlightsSchedule,
    deleteFlightSchedule,
    scheduleData,
    setScheduleData,
    selectFlightsSchedule
}) => {

    const [events, setEvents] = useState([]);

    const resolveScheduleToEvents = () => {
        const _events = [];
        if (scheduleData) {
            for (let i = 0; i < scheduleData.length; i++) {
                const item = scheduleData[i];
                _events.push({
                    title: `${item.s_flight_type}: ${item.s_airline_code} ${item.s_flight_number}`,
                    start: new Date(item.t_estimated_departure),
                    end: new Date(item.t_estimated_arrival),
                    eventType: item.s_flight_type,
                    isExport: item.s_flight_type === 'EXPORT',
                    item
                });
            }
            setEvents(_events);       
        }
    }

    useEffect(() => {
        resolveScheduleToEvents();
    }, [scheduleData]);

    return (
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            eventPropGetter={
                (event, start, end, isSelected) => {
                    let newStyle = {
                        backgroundColor: "#51c878",
                        color: 'white',
                        borderRadius: "5px",
                        border: "none"
                    };
            
                    if (event.isExport){
                        newStyle.backgroundColor = "#39B5F3"
                    }
                
                    return {
                        className: "",
                        style: newStyle
                    };
                }
            }
            onSelectEvent={(event) => handleEdit(event.item)}
        />
    );
}

export default CalendarView;