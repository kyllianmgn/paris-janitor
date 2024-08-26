import {ServiceInterventionPostReq} from "@/components/services/ServiceInterventionForm";
import {api} from "@/api/config";

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
}