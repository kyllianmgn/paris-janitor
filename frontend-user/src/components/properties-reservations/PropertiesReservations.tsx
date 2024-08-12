"use client"
import {useEffect, useState} from "react";
import {propertiesReservationsService} from "@/api/services/properties-reservations";
import {PropertyReservationList} from "@/components/properties-reservations/PropertyReservationList";

export interface PropertyOccupation {
    id: number
    propertyId: number
    startDate: string
    endDate: string
    createdAt: string
    updatedAt: string
}

export interface PropertyReservation {
    id: number
    occupationId: number
    status: ReservationStatus
    totalPrice: number
    createdAt: string
    updatedAt: string
    travelerId: number
}

export interface PropertyReservationFull {
    id: number
    occupationId: number
    status: ReservationStatus
    totalPrice: number
    createdAt: string
    updatedAt: string
    travelerId: number
    occupation: PropertyOccupation
}

export enum ReservationStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
}

export const PropertiesReservations = () => {
    const [propertiesReservationsFullList, setPropertiesReservationsFullList] = useState<PropertyReservationFull[]>([]);

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
                <p className="text-lg text-gray-600">Properties Reservations List</p>
            </div>
            <PropertyReservationList propertiesReservations={propertiesReservationsFullList}></PropertyReservationList>
        </>
    )
}
