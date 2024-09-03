import {PropertyReservation, User} from "@/types";
import {PropertyReservationList} from "@/components/properties-reservations/PropertyReservationList";
import {useEffect, useState} from "react";
import {propertiesReservationsService} from "@/api/services/properties-reservations";

export interface LandlordDashboardProps {
    user: User
}

export const LandlordDashboard = ({user}: LandlordDashboardProps) => {
    const [propertiesReservations, setPropertiesReservations] = useState<PropertyReservation[]>([]);

    const loadPropertiesReservations = async () => {
        const res = await propertiesReservationsService.getNextReservationsByLandlordId();
        setPropertiesReservations(res.data);
    }

    useEffect(() => {
        loadPropertiesReservations().then();
    });

    return (
        <div>
            <h1>Your next reservations</h1>
            <PropertyReservationList propertiesReservations={propertiesReservations}></PropertyReservationList>
        </div>
    );
}
