import {ApiResponse, Payment, PaymentIntervention, PaymentStatus, ServicePayment} from "@/types";
import { api } from "@/api/config";

export const paymentService = {
    createPayment: async (paymentData: Omit<Payment, "id" | "status" | "stripePaymentIntentId">): Promise<ApiResponse<Payment>> => {
        return api.post('payments', { json: paymentData }).json<ApiResponse<Payment & { sessionUrl: string }>>();
    },

    createServicePayment: async (paymentData: Omit<PaymentIntervention, "id" | "status" | "stripePaymentIntentId">): Promise<ApiResponse<Payment>> => {
        return api.post('payments/service', { json: paymentData }).json<ApiResponse<Payment & { sessionUrl: string }>>();
    },

    getPaymentById: async (id: number): Promise<ApiResponse<Payment>> => {
        return api.get(`payments/${id}`).json<ApiResponse<Payment>>();
    },

    updatePaymentStatus: async (id: number, status: PaymentStatus): Promise<ApiResponse<Payment>> => {
        return api.patch(`payments/${id}/status`, { json: { status } }).json<ApiResponse<Payment>>();
    },

    getPaymentsByReservation: async (reservationId: number): Promise<ApiResponse<Payment[]>> => {
        return api.get(`payments/reservation/${reservationId}`).json<ApiResponse<Payment[]>>();
    },
};