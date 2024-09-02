import {ServiceInterventionPostReq} from "@/components/services/ServiceInterventionForm";
import {api} from "@/api/config";
import {ApiResponse, Intervention} from "@/types";

export interface InterventionForm{
    id: number,
    interventionId: number,
    createdAt: Date,
    updatedAt: Date,
    comment: string
}

export const serviceInterventionsService = {
    createServiceInterventionAsTraveler: async (propertyReservationPostReq: ServiceInterventionPostReq) => {
        return await api.post('interventions', {
            json: propertyReservationPostReq
        }).json();
    },

    createServiceInterventionAsLandlord: async (propertyReservationPostReq: ServiceInterventionPostReq) => {
        return await api.post('interventions/property', {
            json: propertyReservationPostReq
        }).json();
    },

    getIntervention: async (id: number): Promise<ApiResponse<Intervention>> => {
        return await api.get(`interventions/${id}`).json()
    },

    updateIntervention: async (id: number, intervention: Intervention): Promise<ApiResponse<Intervention>> => {
        return await api.patch(`interventions/${id}`, {json: intervention}).json()
    },

    getMyInterventions: async (): Promise<ApiResponse<Intervention[]>> => {
        return await api.get(`interventions/sp/me`).json()
    },

    createInterventionForm: async (id: number, comment: string): Promise<ApiResponse<InterventionForm>>  => {
        return await api.post(`intervention-forms/${id}`, {json: {comment: comment}}).json()
    },

    getInterventionForm: async (id: number): Promise<ApiResponse<InterventionForm>> => {
        return await api.get(`intervention-forms/${id}`, {}).json()
    }
}