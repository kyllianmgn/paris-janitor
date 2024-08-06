import ky from "ky";
import {PropertyReservation} from "@/components/properties-reservations/from/PropertiesReservationsForm";

export const createPropertyReservation = async (propertyReservation: PropertyReservation) => {
    return await ky.post('http://localhost:3000/property-reservations', {
        json: propertyReservation
    }).json();
}
