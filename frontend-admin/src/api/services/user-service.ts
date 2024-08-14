import {api} from "@/api/config";
import {ApiResponse, Landlord, ServiceProvider, Traveler, User} from "@/types";

export const getUsers = async (query?: string, page?: number): Promise<ApiResponse<User[]>> => {
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
    return await api.get(`users${searchParams}`).json();
}

export const editUser = async (id: number, user: Pick<User, "firstName" | "lastName" | "email">): Promise<ApiResponse<User>> => {
    return await api.patch(`users/${id}`, {json: {firstName: user.firstName, lastName: user.lastName, email: user.email}}).json();
}

export const getUserById = async (id: number): Promise<ApiResponse<User>> => {
    return await api.get(`users/${id}`).json();
}

export const banUser = async (id: number, date: Date): Promise<ApiResponse<User>> => {
    return await api.patch(`users/${id}/ban`, {json: {date: date}}).json();
}