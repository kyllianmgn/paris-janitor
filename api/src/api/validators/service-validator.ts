import Joi from "joi";

export interface Service{
    id: number,
    providerId: number,
    name: string,
    description: string,
    basePrice: number
}

export const serviceValidator = Joi.object<Service>({
    name: Joi.string().required(),
    description: Joi.string().required(),
    basePrice: Joi.number().required()
})

export const servicePatchValidator = Joi.object<Partial<Service>>({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    basePrice: Joi.number().optional()
})

export interface ServiceReview {
    id: number
    travelerId: number
    landlordId: number
    serviceId: number
    note: number
    comment: string
}

export const serviceReviewValidator = Joi.object<ServiceReview>({
    travelerId: Joi.number().optional(),
    landlordId: Joi.number().optional(),
    serviceId: Joi.number().required(),
    note: Joi.number().required().max(5).min(0),
    comment: Joi.string().required()
}).xor("travelerId","landlordId")

export const serviceReviewPatchValidator = Joi.object<Partial<ServiceReview>>({
    travelerId: Joi.number().optional(),
    landlordId: Joi.number().optional(),
    serviceId: Joi.number().optional(),
    note: Joi.number().optional(),
    comment: Joi.string().optional()
}).xor("travelerId","landlordId")

export enum InterventionStatus {
    PLANNED="PLANNED",
    IN_PROGRESS="IN_PROGRESS",
    COMPLETED="COMPLETED",
    CANCELLED="CANCELLED",
}

export interface Intervention {
    id: number,
    serviceId: number,
    propertyOccupationId?: number
    propertyId?: number
    providerOccupationId: number
    additionalPrice: number
    status: InterventionStatus
}

export const InterventionWithOccupationValidator = Joi.object<Intervention & ProviderOccupation>({
    serviceId: Joi.number().required(),
    propertyId: Joi.number().optional(),
    additionalPrice: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
})

export interface InterventionInProperty {
    id: number,
    serviceId: number,
    propertyId: number
    providerOccupationId: number
    additionalPrice: number
    status: InterventionStatus
}

export const InterventionInPropertyValidator = Joi.object<InterventionInProperty & ProviderOccupation>({
    serviceId: Joi.number().required(),
    propertyId: Joi.number().required(),
    additionalPrice: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
})

export const interventionValidator = Joi.object<Intervention>({
    serviceId: Joi.number().required(),
    propertyOccupationId: Joi.number().optional(),
    providerOccupationId: Joi.number().required(),
    additionalPrice: Joi.number().required(),
    status: Joi.string().required()
})

export const interventionPatchValidator = Joi.object<Intervention>({
    serviceId: Joi.number().optional(),
    propertyOccupationId: Joi.number().optional(),
    providerOccupationId: Joi.number().optional(),
    additionalPrice: Joi.number().optional(),
    status: Joi.string().optional()
})

export interface InterventionForm {
    id: number,
    interventionId: number
}

export const interventionFormValidator = Joi.object<InterventionForm>({
    interventionId: Joi.number().optional()
})

export interface ProviderOccupation{
    id: number
    providerId: number
    startDate: Date
    endDate: Date
}

export const providerOccupationValidator = Joi.object<ProviderOccupation>({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
})

export const providerOccupationPatchValidator = Joi.object<ProviderOccupation>({
    id: Joi.number().optional(),
    providerId: Joi.number().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
})