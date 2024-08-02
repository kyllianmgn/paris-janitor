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

export const invoiceValidator = Joi.object<Invoice>({
    amount: Joi.number().required(),
    description: Joi.string().required()
})

export const invoicePatchValidator = Joi.object<Partial<Invoice>>({
    amount: Joi.number().optional(),
    description: Joi.string().optional(),
    status: Joi.string().optional().valid("PENDING", "PAID", "CANCELLED")
})