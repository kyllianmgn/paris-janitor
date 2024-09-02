import ky from "ky";
import {ApiResponse} from "@/types";
import {PropertyOccupation} from "@/components/properties-reservations/PropertiesReservations";
import {api} from "@/api/config";

export const propertiesOccupationsService = {
    getPropertyOccupationById: async (id: number) => {
        return await api.get(`property-occupations/${id}`).json<ApiResponse<PropertyOccupation>>();
    },

    getPropertyOccupationByPropertyId: async (id: number): Promise<ApiResponse<PropertyOccupation[]>> => {
        return await api.get(`property-occupations/property/${id}`).json<ApiResponse<PropertyOccupation[]>>();
    }
}
