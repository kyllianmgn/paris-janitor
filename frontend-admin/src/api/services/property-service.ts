import {api} from "@/api/config";
import {ApiResponse, Property} from "@/types";

export const getProperty = async (id: number): Promise<ApiResponse<Property>> => {
    return await api.get(`properties/${id}`).json()
}

export const getProperties = async (): Promise<ApiResponse<Property[]>> => {
    return await api.get('properties/all').json()
}

export const getPendingProperties = async (): Promise<ApiResponse<Property[]>> => {
    return await api.get('properties/pending').json()
}

export const updateProperty = async (property: Property): Promise<ApiResponse<any>> => {
    return await api.patch(`properties/${property.id}`, {json: {...property}}).json();
}

export const updatePropertyStatus = async (property: Property): Promise<ApiResponse<any>> => {
    return await api.patch(`properties/${property.id}/status`, {json: {status: property.status}}).json();
}