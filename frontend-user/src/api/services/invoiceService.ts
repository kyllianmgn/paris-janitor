import ky from "ky";
import {ApiResponse, Landlord} from "@/types";
import {api} from "@/api/config";

export const invoiceService = {
    getMyInvoices: async (): Promise<ApiResponse<any>> => {
        return api.get(`invoices/me`).json<ApiResponse<any>>();
    }
}
