import ky from "ky";
import {ApiResponse, Landlord} from "@/types";
import {api} from "@/api/config";

export const landlordsService = {
    getLandlordById: async (id: number): Promise<ApiResponse<Landlord>> => {
        return api.get(`landlords/${id}`).json<ApiResponse<Landlord>>();
    }
}
