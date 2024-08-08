import {PropertyReservationForm} from "@/components/properties-reservations/PropertyReservationForm";
import {PropertiesReservations} from "@/components/properties-reservations/PropertiesReservations";

export default function PropertyReservation() {
    return (
        <>
            <PropertyReservationForm propertyId={1} price={150}></PropertyReservationForm>
            <PropertiesReservations></PropertiesReservations>
        </>
    )
}
