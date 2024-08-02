import Joi from "joi";

export interface ServiceProvider{
    id: number
    userId: number
}

export const serviceProviderValidator = Joi.object<ServiceProvider>({
    id: Joi.string().required(),
    userId: Joi.string().required(),
})