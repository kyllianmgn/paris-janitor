import {api} from "@/api/config";
import {ApiResponse, Property} from "@/types";

export const getProperty = async (id: number): Promise<ApiResponse<Property>> => {
    return await api.get(`properties/admin/${id}`).json()
}

export const getProperties = async (query?: string, page?: number): Promise<ApiResponse<Property[]>> => {
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
    return await api.get(`properties/all${searchParams}`).json()
}

export const getPropertiesByLandlordId = async (id: number): Promise<ApiResponse<Property[]>> => {
    return await api.get(`properties/landlord/${id}`).json()
}

export const getPendingProperties = async (): Promise<ApiResponse<Property[]>> => {
    return await api.get('properties/pending').json()
}

export const getPendingPropertiesCount = async (): Promise<ApiResponse<{ count: number }>> => {
    return await api.get('properties/pending/count').json()
}

export const updateProperty = async (property: Property): Promise<ApiResponse<any>> => {
    return await api.patch(`properties/admin/${property.id}`, {json: {...property}}).json();
}

export const updatePropertyStatus = async (property: Property): Promise<ApiResponse<any>> => {
    return await api.patch(`properties/${property.id}/status`, {json: {status: property.status}}).json();
}