import { api } from "@/api/config";
import {ApiResponse, Subscription, SubscriptionPlan, SubscriptionRequest} from "@/types";
// Subscriptions

export const getSubscriptions = async (): Promise<ApiResponse<Subscription[]>> => {
    return await api.get('subscriptions').json();
};