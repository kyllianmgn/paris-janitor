import { api } from "@/api/config";
import {ApiResponse, SubscriptionPlan} from "@/types";
// Subscriptions

export const getSubscriptions = async (): Promise<ApiResponse<any[]>> => {
    return await api.get('subscriptions').json();
};

/*export const landLordSubscribe = async (us): any => {
    return await api.post('subscriptions/landlord', subscriptionRequest).json();
};*/

export const travelerSubscriptions = async (plan: string, type: string): Promise<ApiResponse<any>> => {
    return await api.post(`subscriptions/traveler?plan=${plan}&type=${type}`).json();
};

// Subscription Plans
export const getTravelerSubscriptionPlans = async (): Promise<ApiResponse<any>> => {
    return await api.get('subscription-plans/traveler').json();
};