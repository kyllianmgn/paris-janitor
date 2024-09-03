"use client";
import Calendar from '@/components/calendar/Calendar';
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import ServiceProviderCalendar from "@/components/calendar/ServiceProviderCalendar";

export default function CalendarPage() {
    const role = useSelector((state: RootState) => state.auth.role);

    if (role == "SERVICE_PROVIDER"){
        return <ServiceProviderCalendar />;
    }

    return <Calendar />;
}