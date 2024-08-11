import {PropertyReservationForm} from "@/components/properties-reservations/PropertyReservationForm";
import {PropertiesReservations} from "@/components/properties-reservations/PropertiesReservations";

export default function PropertyReservation() {
    return (
        <>
            <PropertiesReservations></PropertiesReservations>
            <div className="text-center my-8">
                <h1 className="text-4xl font-bold mb-4">Example form</h1>
                <p className="text-lg text-gray-600">Props used: propertyId={1} price={150}</p>
                <div className=" flex items-center justify-center">
                    <PropertyReservationForm propertyId={1} price={150}></PropertyReservationForm>
                </div>
            </div>
        </>
    )
}
