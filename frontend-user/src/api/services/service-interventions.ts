import {ServiceInterventionPostReq} from "@/components/services/ServiceInterventionForm";
import {api} from "@/api/config";
import {ApiResponse, Intervention} from "@/types";

interface InterventionForm{

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

    getMyInterventions: async (): Promise<ApiResponse<Intervention[]>> => {
        return await api.get(`interventions/sp/me`).json()
    },

    createInterventionForm: async () => {
        return await api.post('intervention-forms/', {})
    }
}