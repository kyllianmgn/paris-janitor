import {api} from "@/api/config";
import {ApiResponse, Intervention, Service, ServiceProvider} from "@/types";

export const getService = async (id: number): Promise<ApiResponse<Service>> => {
    return await api.get(`services/${id}`).json()
}

export const getServices = async (query?: string, page?: number): Promise<ApiResponse<Service[]>> => {
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
    return await api.get(`services${searchParams}`).json()
}

export const updateService = async (service: Service): Promise<ApiResponse<Service>> => {
    return await api.patch(`services/${service.id}`, {json: {...service}}).json();
}

export const getServicesFromProvider = async (providerId: number,query?: string, page?: number): Promise<ApiResponse<Service[]>> => {
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
    return await api.get(`services/provider/${providerId}${searchParams}`).json()
}

export const getServiceCount = async (providerId: number): Promise<ApiResponse<number>> => {
    return await api.get(`services/provider/${providerId}/count`).json()
}

export const getInterventionByServiceId = async (serviceId: number ,query?: string, page?: number): Promise<ApiResponse<Intervention[]>> => {
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
    return await api.get(`interventions/service/${serviceId}${searchParams}`).json()
}