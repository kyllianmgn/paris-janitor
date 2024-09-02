import {api} from "@/api/config";
import {ApiResponse, PropertyReview, ServiceReview} from "@/types";

export const reviewService = {
    getReviewByPropertyId: async (propertyId: number) => {
        return await api.get(`property-reviews/property/${propertyId}`).json<ApiResponse<PropertyReview[]>>();
    },

    getReviewByServiceId: async (serviceId: number) => {
        return await api.get(`service-reviews/service/${serviceId}`).json<ApiResponse<ServiceReview[]>>();
    }
}
