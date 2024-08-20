
import { ApiResponse, Property, PropertyFormData, User } from "@/types";
import { api, getUserFromToken } from "@/api/config";

export const propertiesService = {
    getPropertyById: async (id: number): Promise<ApiResponse<Property>> => {
        return api.get(`properties/${id}`).json<ApiResponse<Property>>();
    },

    getProperties: async (): Promise<ApiResponse<Property[]>> => {
        return api.get('properties').json<ApiResponse<Property[]>>();
    },

    getAvailableProperties: async (query?: string, page?: number): Promise<ApiResponse<Property[]>> => {
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
        return api.get(`properties/available${searchParams}`).json<ApiResponse<Property[]>>();
    },

    getPropertiesByUserId: async (): Promise<ApiResponse<Property[]>> => {
        const user = getUserFromToken();
        if (user?.Landlord?.id) {
            return api.get(`properties/landlord/${user.Landlord.id}`).json<ApiResponse<Property[]>>();
        }
        throw new Error("User is not a landlord");
    },

    createProperty: async (propertyData: PropertyFormData): Promise<ApiResponse<Property>> => {
        try {
            return await api.post('properties', { json: propertyData }).json<ApiResponse<Property>>();
        } catch (e) {
            console.error('Error creating property:', e);
            throw e;
        }
    },

    disableProperty: async (id: number): Promise<ApiResponse<Property>> => {
        try {
            return await api.put(`property/${id}/disable`).json<ApiResponse<Property>>();
        } catch (error) {
            console.error('Error disabling property:', error);
            throw error;
        }
    }
};