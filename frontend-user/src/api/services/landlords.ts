import ky from "ky";
import {ApiResponse, Landlord} from "@/types";
import {api} from "@/api/config";

export const landlordsService = {
    getDashboardStats: async () => {
        return await api.get('dashboard/landlord').json();
    },

    getLandlordById: async (id: number): Promise<ApiResponse<Landlord>> => {
        return api.get(`landlords/${id}`).json<ApiResponse<Landlord>>();
    }

}
export const serviceProviderService = {
    getDashboardStats: async () => {
        return await api.get('dashboard/service-provider').json();
    },
}
