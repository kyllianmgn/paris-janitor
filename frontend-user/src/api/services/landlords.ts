import ky from "ky";
import {ApiResponse, Landlord} from "@/types";

export const landlordsService = {
    getLandlordById: async (id: number): Promise<ApiResponse<Landlord>> => {
        return ky.get(`http://localhost:3000/landlords/${id}`).json<ApiResponse<Landlord>>();
    }
}
