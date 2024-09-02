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
    name: string;
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
        name: Joi.string().required(),
    })).min(0)
});
export const paymentPatchValidator = Joi.object<Partial<Payment>>({
    status: Joi.string().valid(...Object.values(PaymentStatus)),
});

export interface PaymentIntervention {
    id: number;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod: string;
    date: Date;
    stripePaymentIntentId?: string;
    stripeSessionId?: string;
    serviceId?: number;
    propertyId?: number;
    invoiceId?: number;
}

export const paymentServiceValidator = Joi.object<PaymentIntervention>({
    amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).uppercase().required(),
    date: Joi.date().required(),
    paymentMethod: Joi.string().required(),
    stripeSessionId: Joi.string().optional(),
    serviceId: Joi.number().positive().required(),
    propertyId: Joi.number().positive().required()
});