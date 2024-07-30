import Joi from "joi";

export interface Landlord{
    id: number
    userId: number
}

export const LandlordValidator = Joi.object<Landlord>({
    id: Joi.string().required(),
    userId: Joi.string().required(),
})