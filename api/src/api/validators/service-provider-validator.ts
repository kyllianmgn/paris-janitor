import Joi from "joi";

export interface ServiceProvider{
    id: number
    userId: number
    status: ServiceProviderStatus
}

enum ServiceProviderStatus{
    PENDING="PENDING",
    ACCEPTED="ACCEPTED",
    REFUSED="REFUSED"
}

export const serviceProviderValidator = Joi.object<ServiceProvider>({
    id: Joi.string().required(),
    userId: Joi.string().required(),
})

export const serviceProviderStatusPatchValidator = Joi.object<ServiceProvider>({
    status: Joi.string().valid("PENDING","ACCEPTED","REFUSED")
})