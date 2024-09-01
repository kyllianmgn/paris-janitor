import Joi from "joi";
import {Service, serviceValidator} from "./service-validator";
import {ServiceType} from "@prisma/client";

export interface Payment {
    id: number;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod: string;
    stripePaymentIntentId?: string;
    stripeSessionId?: string;
    propertyReservationId?: number;
    invoiceId?: number;
    services: ServicePayment[];

}

export interface ServicePayment {
    serviceId: number;
    amount: number;
    service: Service;
}

export enum PaymentStatus {
    PENDING = "PENDING",
    SUCCEEDED = "SUCCEEDED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}

export const paymentValidator = Joi.object<Payment>({
    amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).uppercase().required(),
    paymentMethod: Joi.string().required(),
    stripeSessionId: Joi.string().optional(),
    propertyReservationId: Joi.number().positive().required(),
    services: Joi.array().items(Joi.object({
        serviceId: Joi.number().positive().required(),
        amount: Joi.number().positive().required(),
        service: Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
            description: Joi.string().required(),
            basePrice: Joi.number().required(),
            type: Joi.string().valid(...Object.values(ServiceType)).required(),
            isDynamicPricing: Joi.boolean().required(),
            pricingRules: Joi.when('isDynamicPricing', {
                is: true,
                then: Joi.object().required(),
                otherwise: Joi.forbidden()
            })
        }).required()
    })).min(0)
});
export const paymentPatchValidator = Joi.object<Partial<Payment>>({
    status: Joi.string().valid(...Object.values(PaymentStatus)),
});