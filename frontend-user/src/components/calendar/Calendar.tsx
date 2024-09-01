'use client';
import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Property, PropertyOccupation } from '@/types';
import CalendarActionPanel from './CalendarActionPanel';
import useCalendarActions from '@/hooks/useCalendarActions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import PropertySelector from "@/components/properties/PropertySelector";

const localizer = momentLocalizer(moment);

const Calendar: React.FC = () => {
    const { properties, occupations, selectedProperty, actions } = useCalendarActions();
    const [selectedOccupation, setSelectedOccupation] = useState<PropertyOccupation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState(new Date());
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
        const initializeCalendar = async () => {
            try {
                if (properties.length > 0 && !selectedProperty) {
                    await actions.selectProperty(properties[0]);
                }
            } catch (err) {
                setError("Failed to load properties or occupations");
            } finally {
                setIsLoading(false);
            }
        };

        initializeCalendar().then();
    }, [actions, properties, selectedProperty]);

    useEffect(() => {
        if (selectedProperty) {
            actions.refreshCalendar().then();
        }
    }, [selectedProperty, date, view]);

    const handleSelectSlot = async (slotInfo: { start: Date; end: Date }) => {
        const now = new Date();
        now.setHours(now.getHours() + 1);

        if (slotInfo.start < now) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Cannot set unavailability in the past or within the next hour",
            });
            return;
        }

        const isOverlapping = occupations.some(occupation =>
            (slotInfo.start < new Date(occupation.endDate) && slotInfo.end > new Date(occupation.startDate))
        );

        if (isOverlapping) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "This period overlaps with an existing occupation",
            });
            return;
        }

        try {
            if (!selectedProperty?.id) return;
            await actions.createOccupation({
                propertyId: selectedProperty.id,
                startDate: slotInfo.start.toISOString(),
                endDate: slotInfo.end.toISOString(),
            });
            await actions.refreshCalendar();
            toast({
                title: "Success",
                description: "Unavailability created successfully",
            });
        } catch (err) {
            setError("Failed to create occupation");
        }
    };

    const handleSelectEvent = (event: PropertyOccupation) => {
        setSelectedOccupation(event);
    };

    if (!isClient) return null;
    if (isLoading) return (<p>Loading...</p>);

    return (
        <>
            {isClient && <div className="p-4 bg-secondary">
                <h1 className="text-2xl font-bold mb-4">Calendar</h1>
                <div className="mb-4">
                    <PropertySelector
                        properties={properties}
                        selectedProperty={selectedProperty}
                        onSelectProperty={(property) => actions.selectProperty(property)}
                    />
                </div>
                {selectedProperty && (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 bg-white p-4 rounded-lg shadow-lg">
                            <BigCalendar
                                localizer={localizer}
                                events={occupations.map(occupation => ({
                                    ...occupation,
                                    title: occupation.reservation ? 'Reservation' : 'Unavailable',
                                    start: new Date(occupation.startDate),
                                    end: new Date(occupation.endDate),
                                }))}
                                dayPropGetter={(date) => {
                                    const now = new Date();
                                    now.setHours(now.getHours() + 1);
                                    if (date < now) {
                                        return {
                                            style: {
                                                backgroundColor: '#f0f0f0',
                                                color: '#999',
                                            },
                                        };
                                    }
                                    return {};
                                }}
                                eventPropGetter={(event: PropertyOccupation) => {
                                    let backgroundColor = '#3174ad';
                                    if (event.reservation) {
                                        backgroundColor = '#4caf50';
                                    } else {
                                        backgroundColor = '#f44336'; // red
                                    }
                                    return {style: {backgroundColor}};
                                }}
                                startAccessor="start"
                                min={new Date(new Date().setHours(new Date().getHours() + 1))}
                                endAccessor="end"
                                style={{height: 500}}
                                onSelectSlot={handleSelectSlot}
                                onSelectEvent={handleSelectEvent}
                                selectable
                                view={view}
                                onView={(newView) => setView(newView)}
                                date={date}
                                onNavigate={(newDate) => setDate(newDate)}
                                components={{
                                    event: (props) => (
                                        <div
                                            title={`${props.event.title}\nStart: ${moment(props.event.start).format('LLL')}\nEnd: ${moment(props.event.end).format('LLL')}`}>
                                            {props.event.title}
                                        </div>
                                    ),
                                }}
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                        <div className="col-span-1">
                            <CalendarActionPanel
                                selectedProperty={selectedProperty.id as number}
                                selectedOccupation={selectedOccupation}
                                onCreateOccupation={async (occupation) => {
                                    await actions.createOccupation(occupation);
                                    await actions.refreshCalendar();
                                }}
                                onUpdateOccupation={async (id, occupation) => {
                                    await actions.updateOccupation(id, occupation);
                                    await actions.refreshCalendar();
                                }}
                                onDeleteOccupation={async (id) => {
                                    await actions.deleteOccupation(id);
                                    await actions.refreshCalendar();
                                }}
                                occupations={occupations}
                            />
                        </div>
                    </div>
                )}
                {error && <div className="text-red-500">{error}</div>}
            </div>}
        </>
    );
};

export default Calendar;