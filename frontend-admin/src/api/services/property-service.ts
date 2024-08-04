import {api} from "@/api/config";
import {ApiResponse, Property} from "@/types";

export const getProperties = async (): Promise<ApiResponse<Property[]>> => {
    return await api.get('properties/all').json()
}

export const getPendingProperties = async (): Promise<ApiResponse<Property[]>> => {
    return await api.get('properties/pending').json()
}