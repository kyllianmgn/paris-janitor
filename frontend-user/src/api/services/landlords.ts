import ky from "ky";
import {ApiResponse, Landlord} from "@/types";

export const getLandlordById = async (id: string): Promise<ApiResponse<Landlord>> => {
    return ky.get(`http://localhost:3000/landlords/${id}`).json<ApiResponse<Landlord>>();
}
