"use client";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {useEffect, useState} from "react";
import {Property} from "@/types";
import {propertiesService} from "@/api/services/properties";
import ReservationList from "@/components/reservation-list/ReservationList";

export default function MyPropertiesReservationsReservations(){
    const user = useSelector((state: RootState) => state.auth.user)
    const [properties, setProperties] = useState<Property[]>([])

    const loadProperties = async () => {
        const response = await propertiesService.getMyProperties();
        setProperties(response.data)
    }

    useEffect(() => {
        loadProperties().then();
    }, []);

    return (
        <div>
            <h1>Properties Reservations</h1>
            {properties.map((property: Property, index: number) => (
                <div key={index}>
                    <h1 className={"font-bold"}>{property.address}</h1>
                    {property.status == "APPROVED" && <ReservationList mode={"property"} propertyId={property.id} />}
                    {property.status !== "APPROVED" && <h1>Propriétés pas éligible à une reservation</h1>}
                </div>
            ))}
        </div>
    )
}