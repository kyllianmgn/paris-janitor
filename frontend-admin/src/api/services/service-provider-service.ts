import {api} from "@/api/config";
import {ApiResponse, Service, ServiceProvider} from "@/types";

export const getServiceProviders = async (query?: string, page?: number): Promise<ApiResponse<ServiceProvider[]>> => {
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
    return await api.get(`service-providers${searchParams}`).json()
}

export const getPendingServiceProviders = async (query?: string, page?: number): Promise<ApiResponse<ServiceProvider[]>> => {
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
    return await api.get(`service-providers/pending${searchParams}`).json()
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