"use client"
import {useEffect, useState} from "react";
import {propertiesReservationsService} from "@/api/services/properties-reservations";
import {PropertyReservationList} from "@/components/properties-reservations/PropertyReservationList";
import {Property, PropertyReservation} from "@/types";

export interface PropertyOccupation {
    id: number
    propertyId: number
    startDate: string
    endDate: string
    createdAt: string
    updatedAt: string
    property?: Property
}

export enum ReservationStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
}

export const PropertiesReservations = () => {
    const [propertiesReservationsFullList, setPropertiesReservationsFullList] = useState<PropertyReservation[]>([]);

    const loadPropertiesReservationsFull = async () => {
        const res = await propertiesReservationsService.getPropertiesReservationsFullByUserId();
        setPropertiesReservationsFullList(res.data);
    }

    useEffect(() => {
        loadPropertiesReservationsFull().then();
    }, []);

    return (
        <>
            <div className="text-center my-8">
                <h1 className="text-4xl font-bold mb-4">Properties Reservations</h1>
            </div>
            <PropertyReservationList propertiesReservations={propertiesReservationsFullList}></PropertyReservationList>
        </>
    )
}
