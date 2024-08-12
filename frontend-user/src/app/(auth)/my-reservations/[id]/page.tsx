import {PropertyReservationDetail} from "@/components/properties-reservations/PropertyReservationDetail";

export default function PropertiesReservationsRoute({params}: Readonly<{ params: { id: number } }>) {
    return <PropertyReservationDetail propertyReservationId={params.id}></PropertyReservationDetail>
}
