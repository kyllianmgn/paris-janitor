import {api} from "@/api/config";
import {ApiResponse, Service} from "@/types";

export const getService = async (id: number): Promise<ApiResponse<Service>> => {
    return await api.get(`services/${id}`).json()
}

export const getServices = async (): Promise<ApiResponse<Service[]>> => {
    return await api.get('services/all').json()
}

export const getPendingServices = async (): Promise<ApiResponse<Service[]>> => {
    return await api.get('services/pending').json()
}

export const updateService = async (service: Service): Promise<ApiResponse<any>> => {
    return await api.patch(`services/${service.id}`, {json: {...service}}).json();
}

export const updateServiceStatus = async (service: Service): Promise<ApiResponse<any>> => {
    return await api.patch(`services/${service.id}/status`, {json: {status: service.status}}).json();
}