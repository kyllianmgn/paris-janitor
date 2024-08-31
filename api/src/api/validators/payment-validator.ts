import Joi from "joi";

export interface Payment {
    id: number;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod: string;
    stripePaymentIntentId?: string;
    propertyReservationId?: number;
    invoiceId?: number;
    services: ServicePayment[];
}

export interface ServicePayment {
    serviceId: number;
    amount: number;
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
    propertyReservationId: Joi.number().positive().required(),
    services: Joi.array().items(Joi.object({
        serviceId: Joi.number().positive().required(),
        amount: Joi.number().positive().required()
    })).min(0)
});

export const paymentPatchValidator = Joi.object<Partial<Payment>>({
    status: Joi.string().valid(...Object.values(PaymentStatus)),
});