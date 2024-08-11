import ky from "ky";
import {ApiResponse, User} from "@/types";
import {Property} from "@/components/properties/Properties";
import {authService} from "@/api/services/authService";
import {api} from "@/api/config";

export const propertiesService = {
    getPropertyById: async (id: number): Promise<ApiResponse<Property>> => {
        return ky.get(`http://localhost:3000/properties/${id}`).json<ApiResponse<Property>>();
    },

    getProperties: async (): Promise<ApiResponse<Property[]>> => {
        return ky.get(`http://localhost:3000/properties`).json<ApiResponse<Property[]>>();
    },

    getPropertiesByUserId: async () => {
        const user: User = await authService.getUserInfo();
        if (user.Landlord?.id) {
            const landlordId: number = user.Landlord.id;
            return await api.get(`properties/landlord/${landlordId}`).json<ApiResponse<Property[]>>();
        }
        return new Promise<ApiResponse<Property[]>>(() => {});
    }
}
