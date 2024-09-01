import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { propertiesService } from "@/api/services/properties";
import { DateRange } from 'react-day-picker';

interface PropertyCalendarProps {
    propertyId: number;
    selectedDates: { start: Date | null; end: Date | null };
    setSelectedDates: React.Dispatch<React.SetStateAction<{ start: Date | null; end: Date | null }>>;
}

const PropertyCalendar: React.FC<PropertyCalendarProps> = ({ propertyId, selectedDates, setSelectedDates }) => {
    const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);

    useEffect(() => {
        const fetchOccupiedDates = async () => {
            const res = await propertiesService.getPropertyOccupations(propertyId);
            const dates = res.data.flatMap(occupation =>
                getDatesInRange(new Date(occupation.startDate), new Date(occupation.endDate))
            );
            setOccupiedDates(dates);
        };
        fetchOccupiedDates();
    }, [propertyId]);

    const disabledDays = [
        ...occupiedDates,
        { before: new Date() }
    ];

    const handleSelect = (range: DateRange | undefined) => {
        if (range) {
            setSelectedDates({ start: range.from || null, end: range.to || null });
        }
    };

    return (
        <Calendar
            mode="range"
            selected={{ from: selectedDates.start!, to: selectedDates.end! }}
            onSelect={handleSelect}
            disabled={disabledDays}
            numberOfMonths={2}
            className="rounded-md border"
        />
    );
};

function getDatesInRange(startDate: Date, endDate: Date) {
    const date = new Date(startDate.getTime());
    const dates = [];
    while (date <= endDate) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return dates;
}

export default PropertyCalendar;