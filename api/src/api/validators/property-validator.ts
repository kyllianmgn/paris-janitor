import Joi from "joi";

export enum PropertyStatus {
    PENDING="PENDING",
    APPROVED="APPROVED",
    REJECTED="REJECTED"
}

export interface Property {
    id: number,
    landlordId: number,
    address: string,
    description: string,
    status: PropertyStatus
}

export const propertyValidator = Joi.object<Omit<Property, "status" | "id">>({
    landlordId: Joi.number().required(),
    address: Joi.string().required(),
    description: Joi.string().required()
})

export const propertyPatchValidator = Joi.object<Partial<Property>>({
    address: Joi.string().optional(),
    description: Joi.string().optional()
})

export const propertyPatchStatusValidator = Joi.object<Pick<Property, "status">>({
    status: Joi.string().required().valid("PENDING", "APPROVED", "REJECTED")
})

export interface PropertyReview {
    id: number
    travelerId: number
    propertyId: number
    note: number
    comment: string
}

export const propertyReviewValidator = Joi.object<PropertyReview>({
    travelerId: Joi.number().required(),
    propertyId: Joi.number().required(),
    note: Joi.number().required(),
    comment: Joi.string().required()
})

export interface PropertyOccupation {
    id: number
    propertyId: number
    startDate: Date
    endDate: Date
}

export const propertyOccupationValidator = Joi.object<Omit<PropertyOccupation, "id">>({
    propertyId: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
})

export const propertyOccupationPatchValidator = Joi.object<Partial<PropertyOccupation>>({
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
})

export enum ReservationStatus {
    PENDING="PENDING",
    CONFIRMED="CONFIRMED",
    CANCELLED="CANCELLED",
}

export interface PropertyReservation {
    id: number
    travelerId: number
    occupationId: number
    status: ReservationStatus
    totalPrice: number
}

export const propertyReservationValidator = Joi.object<PropertyReservation>({
    travelerId: Joi.number().required(),
    occupationId: Joi.number().required(),
    status: Joi.string().required().valid("PENDING", "CONFIRMED", "CANCELLED"),
    totalPrice: Joi.number().required()
})

export const propertyReservationPatchValidator = Joi.object<PropertyReservation>({
    travelerId: Joi.number().optional(),
    occupationId: Joi.number().optional(),
    status: Joi.string().optional().valid("PENDING", "CONFIRMED", "CANCELLED"),
    totalPrice: Joi.number().optional()
})