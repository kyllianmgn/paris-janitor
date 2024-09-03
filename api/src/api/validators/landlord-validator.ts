import Joi from "joi";

export interface Landlord{
    id: number
    userId: number
    status?: string
}

export enum LandlordStatus{
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    PAST_DUE = "PAST_DUE",
    CANCELED = "CANCELED"
}

export const landlordValidator = Joi.object<Landlord>({
    id: Joi.string().required(),
    userId: Joi.string().required(),
    status: Joi.string().optional()
})