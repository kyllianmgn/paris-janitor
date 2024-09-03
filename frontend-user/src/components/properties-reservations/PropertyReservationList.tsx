import {PropertyReservation} from "@/types";
import {PropertyReservationCard} from "@/components/properties-reservations/PropertyReservationCard";

export interface PropertyReservationListProps {
    propertiesReservations: PropertyReservation[];
}

export const  PropertyReservationList = ({propertiesReservations}: PropertyReservationListProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {propertiesReservations.map(propertyReservation => (
                <PropertyReservationCard key={propertyReservation.id} propertyReservationFull={propertyReservation}></PropertyReservationCard>
            ))}
        </div>
    )
}
