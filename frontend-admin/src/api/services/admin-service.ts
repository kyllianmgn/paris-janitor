import {api} from "@/api/config";
import {ApiResponse} from "@/types";

interface DashboardStats {
    activeSubscriptions: number;
    totalRevenue: number;
    newSubscriptions: number;
    canceledSubscriptions: number;
    pendingServiceProviders: number;
    pendingProperties: number;
    travelerSubscriptions: number;
    landlordSubscriptions: number;
}

export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
    return await api.get('admin/dashboard').json();
};