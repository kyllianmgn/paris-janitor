import Joi from "joi";

export interface Traveler{
    id: number
    userId: number
}

export const TravelerValidator = Joi.object<Traveler>({
    id: Joi.string().required(),
    userId: Joi.string().required(),
})