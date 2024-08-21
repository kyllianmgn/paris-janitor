"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { calendarService } from '@/api/services/calendarService';
import { Property, CalendarEvent } from '@/types';

const localizer = momentLocalizer(moment);

const LandlordCalendar: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        const fetchProperties = async () => {
            const fetchedProperties = await calendarService.getLandlordOccupations();
            setProperties(fetchedProperties);
            if (fetchedProperties.length > 0) {
                setSelectedPropertyId(fetchedProperties[0].id);
            }
        };
        fetchProperties();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            if (selectedPropertyId) {
                const fetchedEvents = await calendarService.getPropertyOccupations(selectedPropertyId);
                setEvents(fetchedEvents);
            }
        };
        fetchEvents();
    }, [selectedPropertyId]);

    const handlePropertyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPropertyId(Number(event.target.value));
    };

    const handleSetUnavailable = async ({ start, end }: { start: Date; end: Date }) => {
        if (selectedPropertyId) {
            await calendarService.setPropertyUnavailable(selectedPropertyId, start, end);
            const updatedEvents = await calendarService.getPropertyOccupations(selectedPropertyId);
            setEvents(updatedEvents);
        }
    };

    const eventStyleGetter = (event: CalendarEvent) => {
        let backgroundColor = '#3174ad';
        if (event.reservation) {
            switch (event.reservation.status) {
                case 'CONFIRMED': backgroundColor = '#28a745'; break;
                case 'PENDING': backgroundColor = '#ffc107'; break;
                case 'CANCELLED': backgroundColor = '#dc3545'; break;
            }
        } else {
            backgroundColor = '#6c757d';
        }
        return { style: { backgroundColor } };
    };

    return (
        <div>
            <select onChange={handlePropertyChange} value={selectedPropertyId || ''}>
                {properties.map(property => (
                    <option key={property.id} value={property.id}>
                        {property.address}
                    </option>
                ))}
            </select>
            <div style={{ height: '500px' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="startDate"
                    endAccessor="endDate"
                    selectable
                    onSelectSlot={handleSetUnavailable}
                    eventPropGetter={eventStyleGetter}
                    tooltipAccessor={(event: CalendarEvent) =>
                        event.reservation
                            ? `${event.reservation.status}: Traveler ID ${event.reservation.travelerId}`
                            : 'Unavailable'
                    }
                    style={{ height: '100%' }}
                />
            </div>
        </div>
    );
};

export default LandlordCalendar;