import {api} from "@/api/config";
import {ApiResponse, Property, PropertyFormData, Service, ServiceFormData} from "@/types";

export const servicesService = {
    getMyServices: async (): Promise<ApiResponse<Service[]>> => {
        return await api.get('services/me').json()
    },

    getServiceById: async (id: number): Promise<ApiResponse<Service>> => {
        return await api.get(`services/${id}`).json();
    },

    createService: async (serviceData: ServiceFormData): Promise<ApiResponse<Service>> => {
        try {
            return await api.post('services', { json: serviceData }).json<ApiResponse<Service>>();
        } catch (e) {
            console.error('Error creating service:', e);
            throw e;
        }
    }
}