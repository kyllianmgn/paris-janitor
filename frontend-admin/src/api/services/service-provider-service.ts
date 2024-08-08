import {api} from "@/api/config";
import {ApiResponse, Service, ServiceProvider} from "@/types";

export const getServiceProviders = async (): Promise<ApiResponse<ServiceProvider[]>> => {
    return await api.get(`service-providers`).json()
}

export const getPendingServiceProviders = async (): Promise<ApiResponse<ServiceProvider[]>> => {
    return await api.get(`service-providers/pending`).json()
}

export const getPendingServiceProvidersCount = async (): Promise<ApiResponse<{count: number}>> => {
    return await api.get(`service-providers/pending/count`).json()
}

export const getServiceProvider = async (id: number): Promise<ApiResponse<ServiceProvider>> => {
    return await api.get(`service-providers/user/${id}`).json()
}

export const updateServiceProviderStatus = async (serviceProvider: ServiceProvider): Promise<ApiResponse<any>> => {
    return await api.patch(`service-providers/${serviceProvider.id}/status`, {json: {status: serviceProvider.status}}).json();
}