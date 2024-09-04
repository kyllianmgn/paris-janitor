import {
    ApiResponse,
    Filter,
    Property,
    PropertyFormData,
    PropertyOccupation,
    PropertyReservation,
    PropertyReview,
    User
} from "@/types";
import { api, getUserFromToken } from "@/api/config";

export const propertiesService = {
    getPublicProperties: async (filter?: Partial<Filter>): Promise<ApiResponse<Property[]>> => {
        return api.get('properties/public', { searchParams: filter }).json<ApiResponse<Property[]>>();
    },

    getPropertyById: async (id: number): Promise<ApiResponse<Property>> => {
        return api.get(`properties/${id}`).json<ApiResponse<Property>>();
    },

    getMyPropertyById: async (id: number): Promise<ApiResponse<Property>> => {
        return api.get(`properties/me/${id}`).json<ApiResponse<Property>>();
    },

    getPropertyImageById: async (id: number): Promise<ApiResponse<string[]>> => {
        return api.get(`properties/${id}/image`).json<ApiResponse<string[]>>();
    },

    getMyPropertyImageById: async (id: number): Promise<ApiResponse<string[]>> => {
        return api.get(`properties/me/${id}/image`).json<ApiResponse<string[]>>();
    },

    getProperties: async (): Promise<ApiResponse<Property[]>> => {
        return api.get('properties').json<ApiResponse<Property[]>>();
    },


    getMyProperties: async (): Promise<ApiResponse<Property[]>> => {
        return api.get('properties/me').json<ApiResponse<Property[]>>();
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

    getApprovedPropertiesByLandlord: async (landlordId: number): Promise<ApiResponse<Property[]>> => {
        return api.get(`properties/landlord/${landlordId}/approved`).json<ApiResponse<Property[]>>();
    },


    createProperty: async (propertyData: PropertyFormData): Promise<ApiResponse<Property>> => {
        try {
            const base64Files = await filesToBase64(propertyData.files);
            const fileToUpload = {...propertyData, files: base64Files};
            return await api.post('properties', { json: fileToUpload}).json<ApiResponse<Property>>();
        } catch (e) {
            console.error('Error creating property:', e);
            throw e;
        }
    },

    updateProperty: async (id: number, propertyData: Partial<PropertyFormData>): Promise<ApiResponse<Property>> => {
        try {
            return await api.patch(`properties/${id}`, { json: propertyData }).json<ApiResponse<Property>>();
        } catch (e) {
            console.error('Error updating property:', e);
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

    // Occupations
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

    getPropertyAvailability: async (id: number, date: string): Promise<ApiResponse<boolean>> => {
        return api.get(`properties/availability/${id}?date=${date}`).json<ApiResponse<boolean>>();
    },

    createPropertyReview: async (propertyId: number, note: number, comment: string): Promise<ApiResponse<PropertyReview>> => {
        return api.post(`property-reviews/${propertyId}`, {json: {note: note, comment: comment}}).json<ApiResponse<PropertyReview>>();
    },

    getMyReviewOnProperty: async (propertyId: number): Promise<ApiResponse<PropertyReview>> => {
        return api.get(`property-reviews/me/${propertyId}`).json<ApiResponse<PropertyReview>>();
    },

    getLandlordPropertyOccupations: async (): Promise<ApiResponse<PropertyOccupation[]>> => {
        return api.get('property-occupations/landlord').json<ApiResponse<PropertyOccupation[]>>();
    },
};

const convertToBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        if (reader.result) resolve(String(reader.result));
    };
    reader.onerror = function (error) {
        reject(error);
    };
});

const filesToBase64 = async (files: File[]): Promise<string[]> => {
    const result = await Promise.all(files.map(async (file) => {
        return await convertToBase64(file);
    }));
    return result;
};