import ky from "ky";
import {ApiResponse} from "@/types";
import {
    PropertyReservation,
    PropertyReservationFull
} from "@/components/properties-reservations/PropertiesReservations";
import {PropertyReservationPostReq} from "@/components/properties-reservations/PropertyReservationForm";
import {api} from "@/api/config";

export const propertiesReservationsService = {
    createPropertyReservation: async (propertyReservationPostReq: PropertyReservationPostReq) => {
        return await ky.post('http://localhost:3000/property-reservations', {
            json: propertyReservationPostReq
        }).json();
    },

    getPropertyReservationById: async (id: number) => {
        return await ky.get(`http://localhost:3000/property-reservations/${id}`).json<ApiResponse<PropertyReservation>>();
    },

    getPropertyReservationFullById: async (id: number) => {
        return await ky.get(`http://localhost:3000/property-reservations/full/${id}`).json<ApiResponse<PropertyReservationFull>>();
    },

    getPropertiesReservationsFullByUserId: async (travelerId: number) => {
        return await api.get(`property-reservations/traveler/${travelerId}`).json<ApiResponse<PropertyReservationFull[]>>();
    }
}
