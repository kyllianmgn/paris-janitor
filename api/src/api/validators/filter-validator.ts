import Joi from "joi";

export interface Filter{
    page?: string,
    pageSize?: string,
    query?: string
}

export const filterValidator = Joi.object<Filter>({
    page: Joi.string().pattern(/\d+/),
    pageSize: Joi.string().pattern(/\d+/),
    query: Joi.string()
})