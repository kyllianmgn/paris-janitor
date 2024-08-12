import {ApiResponse, PropertyReservation} from "@/types";
import {api} from "@/api/config";

export const getReservationsByUser = async (id: number, query?: string, page?: number): Promise<ApiResponse<PropertyReservation[]>> => {
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
    return await api.get(`property-reservations/traveler/${id}${searchParams}`).json()
}

export const getReservationsByProperty = async (id: number, query?: string, page?: number): Promise<ApiResponse<PropertyReservation[]>> => {
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
    console.log(`properties/all${searchParams}`)
    return await api.get(`property-reservations/property/${id}${searchParams}`).json()
}