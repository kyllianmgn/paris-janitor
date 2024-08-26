import ky from "ky";
import {ApiResponse} from "@/types";
import {PropertyOccupation} from "@/components/properties-reservations/PropertiesReservations";
import {api} from "@/api/config";

export const propertiesOccupationsService = {
    getPropertyOccupationById: async (id: number) => {
        return await api.get(`property-occupations/${id}`).json<ApiResponse<PropertyOccupation>>();
    }
}
