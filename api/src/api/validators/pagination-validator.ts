import Joi from "joi";

interface Pagination{
    page?: number,
    pageSize?: number
}

export const paginationValidator = Joi.object<Pagination>({
    page: Joi.number().min(0),
    pageSize: Joi.number().min(10),
})