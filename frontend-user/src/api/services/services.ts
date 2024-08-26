import {api} from "@/api/config";
import {ApiResponse, Property, PropertyFormData, Service, ServiceFormData} from "@/types";

export const servicesService = {
    getMyServices: async (): Promise<ApiResponse<Service[]>> => {
        return await api.get('services/me').json()
    },

    getServices: async (query?: string, page?: number): Promise<ApiResponse<Service[]>> => {
        let searchParams = ""
        if (query){
            searchParams = `?query=${query}`
        }
        if (page){
            if (searchParams == ""){
                searchParams = `?page=${page}`
            }else{
                searchParams += `&page=${page}`
            }
        }
        return await api.get(`services${searchParams}`).json()
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