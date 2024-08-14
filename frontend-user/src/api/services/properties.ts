
import { ApiResponse, Property, PropertyFormData, User } from "@/types";
import { api, getUserFromToken } from "@/api/config";

export const propertiesService = {
    getPropertyById: async (id: number): Promise<ApiResponse<Property>> => {
        return api.get(`properties/${id}`).json<ApiResponse<Property>>();
    },

    getProperties: async (): Promise<ApiResponse<Property[]>> => {
        return api.get('properties').json<ApiResponse<Property[]>>();
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

    //deleteProperty: async (id: number): Promise<void> => {
    //    return api.delete(`properties/${id}`).json<ApiResponse<Property>>();
    //}
};