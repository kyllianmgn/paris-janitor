import {api} from "@/api/config";
import {
    ApiResponse,
    Property,
    PropertyFormData,
    PropertyOccupation,
    ProviderOccupation,
    Service,
    ServiceFormData
} from "@/types";

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

    getServicesForPropeties: async (query?: string, page?: number, date?: Date): Promise<ApiResponse<Service[]>> => {
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
        if (date){
            if (searchParams == ""){
                searchParams = `?date=${date.toISOString()}`
            }else{
                searchParams += `&date=${date.toISOString()}`
            }
        }
        return await api.get(`services/available/intervention${searchParams}`).json()
    },

    getServiceById: async (id: number): Promise<ApiResponse<Service>> => {
        return await api.get(`services/${id}`).json();
    },

    createService: async (serviceData: ServiceFormData): Promise<ApiResponse<Service>> => {
        try {
            return await api.post('services', { json: {...serviceData, isDynamicPricing: true, pricingRules: {}} }).json<ApiResponse<Service>>();
        } catch (e) {
            console.error('Error creating service:', e);
            throw e;
        }
    },

    getMyOccupations: async (): Promise<ApiResponse<ProviderOccupation[]>> => {
        return await api.get('provider-occupations/me').json()
    },

    createOccupation: async (occupation: Pick<ProviderOccupation, "startDate" | "endDate">): Promise<ApiResponse<ProviderOccupation>> => {
        return await api.post('provider-occupations/', {json: occupation}).json()
    },

    updateOccupation: async (id: number, occupationData: Partial<ProviderOccupation>): Promise<ApiResponse<ProviderOccupation>> => {
        return api.patch(`provider-occupations/${id}`, { json: occupationData }).json<ApiResponse<ProviderOccupation>>();
    },

    deleteOccupation: async (id: number): Promise<ApiResponse<ProviderOccupation>> => {
        return api.delete(`provider-occupations/${id}`).json<ApiResponse<ProviderOccupation>>();
    },

    getAvailableInterventionServices: async (): Promise<ApiResponse<Service[]>> => {
        return api.get(`services/available/intervention`).json<ApiResponse<Service[]>>();
    },

    getProviderAvailabilityFromService: async (id: number, date: string): Promise<ApiResponse<boolean>> => {
        return api.get(`services/availability/${id}?date=${date}`).json<ApiResponse<boolean>>();
    },
}