import ky from "ky";
import {ApiResponse} from "@/types";
import {Property} from "@/components/properties/Properties";

export const propertiesService = {
    getPropertyById: async (id: number): Promise<ApiResponse<Property>> => {
        return ky.get(`http://localhost:3000/properties/${id}`).json<ApiResponse<Property>>();
    },

    getProperties: async (): Promise<ApiResponse<Property[]>> => {
        return ky.get(`http://localhost:3000/properties`).json<ApiResponse<Property[]>>();
    }
}
