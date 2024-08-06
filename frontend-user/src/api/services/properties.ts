import ky from "ky";
import {ApiResponse} from "@/types";
import {Property} from "@/components/properties/Properties";

export const getPropertyById = async (id: string): Promise<ApiResponse<Property>> => {
    return ky.get(`http://localhost:3000/properties/${id}`).json<ApiResponse<Property>>();
}

export const getProperties = async (): Promise<ApiResponse<Property[]>> => {
    return ky.get(`http://localhost:3000/properties`).json<ApiResponse<Property[]>>();
}
