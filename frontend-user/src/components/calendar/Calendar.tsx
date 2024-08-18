"use client";
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import LandlordCalendar from '@/components/Calendar/LandlordCalendar';
import ServiceProviderCalendar from '@/components/Calendar/ServiceProviderCalendar';

const Calendar: React.FC = () => {
    const { role } = useSelector((state: RootState) => state.auth);

    return (
        <div>
            <h1>Calendar</h1>
            {role === 'LANDLORD' && <LandlordCalendar />}
            {role === 'SERVICE_PROVIDER' && <ServiceProviderCalendar />}
        </div>
    );
};

export default Calendar;