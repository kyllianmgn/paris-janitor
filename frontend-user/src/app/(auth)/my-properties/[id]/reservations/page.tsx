import ReservationList from "@/components/reservation-list/ReservationList";

export default function PropertiesRoute({params}: Readonly<{ params: { id: number } }>) {
    return <ReservationList propertyId={params.id} mode={"property"}></ReservationList>
}
