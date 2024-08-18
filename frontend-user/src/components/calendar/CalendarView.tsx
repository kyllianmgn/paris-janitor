
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent } from '@/types';

const localizer = momentLocalizer(moment);

interface CalendarViewProps {
    events: CalendarEvent[];
    onDateChange: (date: Date) => void;
    onSetUnavailable: (start: Date, end: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onDateChange, onSetUnavailable }) => {
    const eventStyleGetter = (event: CalendarEvent) => {
        let style: React.CSSProperties = {
            backgroundColor: '#3174ad',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };

        if (event.reservation) {
            switch (event.reservation.status) {
                case 'CONFIRMED':
                    style.backgroundColor = '#28a745';
                    break;
                case 'PENDING':
                    style.backgroundColor = '#ffc107';
                    break;
                case 'CANCELLED':
                    style.backgroundColor = '#dc3545';
                    break;
            }
        } else {
            // Unavailable dates set by landlord
            style.backgroundColor = '#6c757d';
        }

        return {
            style: style
        };
    };

    return (
        <div style={{ height: '500px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="startDate"
                endAccessor="endDate"
                onNavigate={onDateChange}
                selectable
                onSelectSlot={({ start, end }) => onSetUnavailable(start, end)}
                eventPropGetter={eventStyleGetter}
                tooltipAccessor={(event: CalendarEvent) => {
                    if (event.reservation) {
                        return `${event.reservation.status}: Traveler ID ${event.reservation.travelerId}`;
                    }
                    return 'Unavailable';
                }}
                style={{ height: '100%' }}
            />
        </div>
    );
};

export default CalendarView;