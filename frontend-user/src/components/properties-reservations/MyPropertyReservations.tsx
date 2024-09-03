"use client"
import {PropertyReservationList} from "@/components/properties-reservations/PropertyReservationList";
import {useEffect, useState} from "react";
import {propertiesReservationsService} from "@/api/services/properties-reservations";
import {PropertyReservation} from "@/types";

interface MyPropertyReservationsProps {
    propertyId: number
}

export const MyPropertyReservations = ({ propertyId }: MyPropertyReservationsProps) => {
    const [propertiesReservationsFullList, setPropertiesReservationsFullList] = useState<PropertyReservation[]>([]);

    const loadPropertiesReservationsFull = async () => {
        const res = await propertiesReservationsService.getPropertiesReservationsFullByPropertyId(propertyId);
        setPropertiesReservationsFullList(res.data);
    }

    useEffect(() => {
        loadPropertiesReservationsFull().then();
    }, [loadPropertiesReservationsFull]);

    return (
        <>
            <div className="text-center my-8">
                <h1 className="text-4xl font-bold mb-4">Properties Reservations for property {propertyId}</h1>
                <p className="text-lg text-gray-600">Properties Reservations List</p>
            </div>
            <PropertyReservationList propertiesReservations={propertiesReservationsFullList}></PropertyReservationList>
        </>
    )
}
