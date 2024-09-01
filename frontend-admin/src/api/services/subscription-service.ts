import { api } from "@/api/config";
import {ApiResponse, Subscription, SubscriptionPlan, SubscriptionRequest} from "@/types";
// Subscriptions

export const getSubscriptions = async (): Promise<ApiResponse<Subscription[]>> => {
    return await api.get('subscriptions').json();
};

export const getSubscription = async (id: number): Promise<ApiResponse<Subscription>> => {
    return await api.get(`subscriptions/${id}`).json();
};

export const createSubscription = async (subscription: SubscriptionRequest): Promise<ApiResponse<Subscription>> => {
    return await api.post('subscriptions', { json: subscription }).json();
};

export const updateSubscription = async (id: number, subscription: Partial<Subscription>): Promise<ApiResponse<Subscription>> => {
    return await api.put(`subscriptions/${id}`, { json: subscription }).json();
};

export const cancelSubscription = async (id: number): Promise<void> => {
    await api.delete(`subscriptions/${id}`);
};



// Subscription plans
export const getSubscriptionPlans = async (): Promise<ApiResponse<SubscriptionPlan[]>> => {
    return await api.get('subscription-plans').json();
};

export const getSubscriptionPlan = async (id: number): Promise<ApiResponse<SubscriptionPlan>> => {
    return await api.get(`subscription-plans/${id}`).json();
};

export const createSubscriptionPlan = async (plan: Partial<SubscriptionPlan>): Promise<ApiResponse<SubscriptionPlan>> => {
    console.log("PLAN", plan);
    return await api.post('subscription-plans', { json: plan }).json();
};

export const updateSubscriptionPlan = async (id: number, plan: Partial<SubscriptionPlan>): Promise<ApiResponse<SubscriptionPlan>> => {
    return await api.patch(`subscription-plans/${id}`, { json: plan }).json();
};

export const deleteSubscriptionPlan = async (id: number): Promise<void> => {
    await api.delete(`subscription-plans/${id}`);
};