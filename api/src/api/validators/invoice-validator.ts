import Joi from "joi";

export interface Invoice {
    id: number,
    amount: number,
    description: string,
    status: InvoiceStatus
}

export enum InvoiceStatus {
    PENDING="PENDING",
    PAID="PAID",
    CANCELLED="CANCELLED"
}

export const InvoiceValidator = Joi.object<Invoice>({
    amount: Joi.number().required(),
    description: Joi.string().required()
})

export const InvoicePatchValidator = Joi.object<Partial<Invoice>>({
    amount: Joi.number().optional(),
    description: Joi.string().optional(),
    status: Joi.string().optional().valid("PENDING", "PAID", "CANCELLED")
})