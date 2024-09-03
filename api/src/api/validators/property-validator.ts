import Joi from "joi";

export enum PropertyStatus {
    PENDING="PENDING",
    APPROVED="APPROVED",
    REJECTED="REJECTED",
    DISABLED="DISABLED"
}

export interface Property {
    id: number,
    landlordId: number,
    address: string,
    postalCode: string,
    city: string,
    country: string,
    description: string,
    roomCount: number,
    instruction: string,
    propertyType: PropertyType,
    files: string[],
    pricePerNight: number,
    status: PropertyStatus
}

export enum PropertyType{
    HOUSE="HOUSE",
    APARTMENT="APARTMENT"
}

export const propertyValidator = Joi.object<Omit<Property, "status" | "id">>({
    roomCount: Joi.number().required(),
    instruction: Joi.string().required(),
    propertyType: Joi.string().valid("HOUSE","APARTMENT").required(),
    address: Joi.string().required(),
    postalCode: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    description: Joi.string().required(),
    files: Joi.array().items(Joi.string()),
    pricePerNight: Joi.number().required(),
})

export const propertyAdminValidator = Joi.object<Omit<Property, "id">>({
    landlordId: Joi.number().required(),
    address: Joi.string().required(),
    postalCode: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    description: Joi.string().required(),
    pricePerNight: Joi.number().required(),
    status: Joi.string().valid("PENDING", "APPROVED", "REJECTED", "DISABLED").required()
})

export const propertyPatchValidator = Joi.object<Partial<Property>>({
    address: Joi.string().optional(),
    postalCode: Joi.string().optional(),
    city: Joi.string().optional(),
    country: Joi.string().optional(),
    description: Joi.string().optional(),
    pricePerNight: Joi.number().optional()
})

export const propertyPatchStatusValidator = Joi.object<Pick<Property, "status">>({
    status: Joi.string().required().valid("PENDING", "APPROVED", "REJECTED" , "DISABLED")
})

export interface PropertyReview {
    id: number
    travelerId: number
    propertyId: number
    note: number
    comment: string
}

export const propertyReviewValidator = Joi.object<PropertyReview>({
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
    DISABLED="DISABLED"
}

export interface PropertyReservation {
    id: number;
    travelerId: number;
    occupationId: number;
    status: ReservationStatus;
    totalPrice: number;
    propertyOccupation?: PropertyOccupation
}


export const propertyReservationWithOccupationValidator = Joi.object<PropertyReservation & PropertyOccupation>({
    totalPrice: Joi.number().required(),
    propertyId: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
})

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

export interface ServicePayment {
    serviceId: number;
    amount: number;
}

export const servicePaymentValidator = Joi.object<ServicePayment>({
    serviceId: Joi.number().positive().required(),
    amount: Joi.number().positive().required()
});