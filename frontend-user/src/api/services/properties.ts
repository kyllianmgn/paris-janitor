
import {ApiResponse, Property, PropertyFormData, PropertyOccupation, User} from "@/types";
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

    disableProperty: async (id: number): Promise<ApiResponse<Property>> => {
        try {
            return await api.put(`property/${id}/disable`).json<ApiResponse<Property>>();
        } catch (error) {
            console.error('Error disabling property:', error);
            throw error;
        }
    },

    //Occupations
    getPropertyOccupations: async (propertyId: number): Promise<ApiResponse<PropertyOccupation[]>> => {
        return api.get(`property-occupations/property/${propertyId}`).json<ApiResponse<PropertyOccupation[]>>();
    },

    createPropertyOccupation: async (occupationData: Omit<PropertyOccupation, "id">): Promise<ApiResponse<PropertyOccupation>> => {
        return api.post('property-occupations', { json: occupationData }).json<ApiResponse<PropertyOccupation>>();
    },

    updatePropertyOccupation: async (id: number, occupationData: Partial<PropertyOccupation>): Promise<ApiResponse<PropertyOccupation>> => {
        return api.patch(`property-occupations/${id}`, { json: occupationData }).json<ApiResponse<PropertyOccupation>>();
    },

    deletePropertyOccupation: async (id: number): Promise<ApiResponse<PropertyOccupation>> => {
        return api.delete(`property-occupations/${id}`).json<ApiResponse<PropertyOccupation>>();
    },
};