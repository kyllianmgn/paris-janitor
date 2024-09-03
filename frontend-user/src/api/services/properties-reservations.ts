import {ApiResponse, User, PropertyReservation} from "@/types";
import {PropertyReservationPostReq} from "@/components/properties-reservations/PropertyReservationForm";
import {api} from "@/api/config";
import {authService} from "@/api/services/authService";

export const propertiesReservationsService = {
    createPropertyReservation: async (propertyReservationPostReq: PropertyReservationPostReq): Promise<ApiResponse<PropertyReservation>> => {
        return await api.post('property-reservations', {
            json: propertyReservationPostReq
        }).json();
    },

    getPropertyReservationById: async (id: number) => {
        return await api.get(`property-reservations/${id}`).json<ApiResponse<PropertyReservation>>();
    },

    getPropertyReservationFullById: async (id: number) => {
        return await api.get(`property-reservations/full/${id}`).json<ApiResponse<PropertyReservation>>();
    },

    getPropertiesReservationsFullByUserId: async () => {
        const user: User = await authService.getUserInfo();
        if (user.Traveler?.id) {
            const travelerId: number = user.Traveler.id;
            return await api.get(`property-reservations/traveler/${travelerId}`).json<ApiResponse<PropertyReservation[]>>();
        }
        return new Promise<ApiResponse<PropertyReservation[]>>(() => {});
    },

    getPropertiesReservationsFullByPropertyId: async (id: number) => {
        return api.get(`property-reservations/property/${id}?pageSize=5`).json<ApiResponse<PropertyReservation[]>>();
    },

    getMyFutureReservations: async (): Promise<ApiResponse<PropertyReservation[]>> => {
        return api.get('property-reservations/me/future').json<ApiResponse<PropertyReservation[]>>();
    },

    getMyReservationsAsUser: async (): Promise<ApiResponse<PropertyReservation[]>> => {
        return api.get('property-reservations/me').json<ApiResponse<PropertyReservation[]>>();
    },

    getNextReservationsByLandlordId: async (): Promise<ApiResponse<PropertyReservation[]>> => {
        return api.get('property-reservations/landlord/future').json<ApiResponse<PropertyReservation[]>>();
    }
}
