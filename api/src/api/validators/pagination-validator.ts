import Joi from "joi";

interface Pagination{
    page?: string,
    pageSize?: string
}

export const paginationValidator = Joi.object<Pagination>({
    page: Joi.string().pattern(/\d+/),
    pageSize: Joi.string().pattern(/\d+/),
})