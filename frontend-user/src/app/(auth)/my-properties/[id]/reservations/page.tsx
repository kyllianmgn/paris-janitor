import {MyPropertyReservations} from "@/components/properties-reservations/MyPropertyReservations";

export default function PropertiesRoute({params}: Readonly<{ params: { id: number } }>) {
    return <MyPropertyReservations propertyId={params.id}></MyPropertyReservations>
}
