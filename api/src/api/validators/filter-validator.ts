import Joi from "joi";

export interface Filter{
    page?: string,
    pageSize?: string,
    query?: string
    role?: {
        landlord?: boolean,
        serviceProvider?: boolean,
        traveler?: boolean
    },
    subscription?: {
        active?: boolean
    },
    banned?: boolean
}

export const filterValidator = Joi.object<Filter>({
    page: Joi.string().pattern(/\d+/),
    pageSize: Joi.string().pattern(/\d+/),
    query: Joi.string(),
    role: Joi.object({
        landlord: Joi.boolean(),
        serviceProvider: Joi.boolean(),
        traveler: Joi.boolean()
    }),
    subscription: Joi.object({
        active: Joi.boolean()
    }),
    banned: Joi.boolean()
})

export const dateValidator = Joi.object({
    date: Joi.string().isoDate().required(),
})