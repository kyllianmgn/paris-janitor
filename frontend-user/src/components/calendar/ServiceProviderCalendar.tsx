'use client';
import React, {useState, useEffect} from 'react';
import {Calendar as BigCalendar, momentLocalizer, View} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {Property,  ProviderOccupation} from '@/types';
import CalendarActionPanel from './CalendarActionPanel';
import useCalendarActions from '@/hooks/useCalendarActions';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useToast} from "@/components/ui/use-toast";
import PropertySelector from "@/components/properties/PropertySelector";
import ServiceProviderCalendarActionPanel from "@/components/calendar/ServiceProviderCalendarActionPanel";
import useServiceProviderCalendarActions from "@/hooks/useServiceProviderCalendarActions";
import {Provider} from "react-redux";

const localizer = momentLocalizer(moment);

const ServiceProviderCalendar: React.FC = () => {
    const {occupations, actions} = useServiceProviderCalendarActions();
    const [selectedOccupation, setSelectedOccupation] = useState<ProviderOccupation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState(new Date());
    const [isClient, setIsClient] = useState(false);
    const {toast} = useToast();


    useEffect(() => {
        setIsClient(true)
        actions.refreshCalendar();
        setIsLoading(false)
    }, [date, view]);

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
            await actions.createOccupation({
                startDate: slotInfo.start,
                endDate: slotInfo.end,
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

    const handleSelectEvent = (event: ProviderOccupation) => {
        setSelectedOccupation(event);
    };

    if (!isClient) return null;
    if (isLoading) return (<p>Loading...</p>);

    return (
        <>
            {isClient && <div className="p-4 bg-secondary">
                <h1 className="text-2xl font-bold mb-4">Calendar</h1>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-white p-4 rounded-lg shadow-lg">
                        <BigCalendar
                            localizer={localizer}
                            events={occupations.map(occupation => ({
                                ...occupation,
                                title: occupation.intervention ? 'Reservation' : 'Unavailable',
                                start: new Date(occupation.startDate),
                                end: new Date(occupation.endDate),
                            })) as ProviderOccupation[]}
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
                            eventPropGetter={(event: ProviderOccupation) => {
                                let backgroundColor = '#3174ad';
                                if (event.intervention) {
                                    backgroundColor = '#4caf50';
                                } else {
                                    backgroundColor = '#f44336'; // red
                                }
                                return {style: {backgroundColor}};
                            }}
                            min={new Date(new Date().setHours(new Date().getHours() + 1))}
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
                                        title={`${props.event.intervention ? props.event.intervention.service?.name : "Reservation" }\nStart: ${moment(props.event.startDate).format('LLL')}\nEnd: ${moment(props.event.endDate).format('LLL')}`}>
                                        {props.event.intervention ? props.event.intervention.service?.name : "Reservation" }
                                    </div>
                                ),
                            }}
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="col-span-1">
                        <ServiceProviderCalendarActionPanel
                            selectedOccupation={selectedOccupation}
                            onCreateOccupation={async (occupation: Pick<ProviderOccupation, "startDate" | "endDate">) => {
                                await actions.createOccupation(occupation);
                                await actions.refreshCalendar();
                            }}
                            onUpdateOccupation={async (id, occupation: Pick<ProviderOccupation, "startDate" | "endDate">) => {
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
                {error && <div className="text-red-500">{error}</div>}
            </div>}
        </>
    );
};

export default ServiceProviderCalendar;