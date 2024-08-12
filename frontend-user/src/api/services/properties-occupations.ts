import ky from "ky";
import {ApiResponse} from "@/types";
import {PropertyOccupation} from "@/components/properties-reservations/PropertiesReservations";

export const propertiesOccupationsService = {
    getPropertyOccupationById: async (id: number) => {
        return await ky.get(`http://localhost:3000/property-occupations/${id}`).json<ApiResponse<PropertyOccupation>>();
    }
}
