import {api} from "@/api/config";
import {ApiResponse, Landlord, ServiceProvider, Traveler, User} from "@/types";

export const getUsers = async (query?: string, page?: number, filters?: any): Promise<ApiResponse<User[]>> => {
    let searchParams = new URLSearchParams();
    if (query) {
        searchParams.append("query", query);
    }
    if (page) {
        searchParams.append("page", page.toString());
    }
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (typeof value === 'object') {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    if (subValue) {
                        searchParams.append(`${key}[${subKey}]`, 'true');
                    }
                });
            } else if (value) {
                searchParams.append(key, 'true');
            }
        });
    }
    const url = `users?${searchParams.toString()}`;
    return await api.get(url).json();
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

export const resetPassword = async (id: number): Promise<ApiResponse<User>> => {
    return await api.post(`users/reset-password/${id}`).json();
}