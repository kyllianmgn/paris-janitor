import Joi from "joi";

export interface Traveler{
    id: number
    userId: number
}

export const travelerValidator = Joi.object<Traveler>({
    id: Joi.string().required(),
    userId: Joi.string().required(),
})