import Joi from "joi";
import {SubscriptionPlan} from "@prisma/client";

export enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    PAST_DUE = "PAST_DUE",
    CANCELED = "CANCELED",
    UNPAID = "UNPAID",
}

export enum UserType {
    TRAVELER = "TRAVELER",
    LANDLORD = "LANDLORD",
}

export interface Subscription {
    id: number;
    userId: number;
    planId: number;
    status: SubscriptionStatus;
    startDate: Date;
    endDate?: Date;
    stripeSubscriptionId?: string;
}

export const subscriptionValidator = Joi.object<Omit<Subscription, "id">>({
    userId: Joi.number().required(),
    planId: Joi.number().required(),
    status: Joi.string()
        .valid(...Object.values(SubscriptionStatus))
        .required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().optional(),
    stripeSubscriptionId: Joi.string().optional(),
});

export const subscriptionPatchValidator = Joi.object<Partial<Subscription>>({
    userId: Joi.number().optional(),
    planId: Joi.number().optional(),
    status: Joi.string()
        .valid(...Object.values(SubscriptionStatus))
        .optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    stripeSubscriptionId: Joi.string().optional(),
});





export interface SubscriptionPlanRequest {
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    userType: UserType;
    features: Record<string, any>;
    stripeProductId?: string;
    stripePriceIdMonthly?: string;
    stripePriceIdYearly?: string;
}

export const subscriptionPlanValidation = Joi.object<SubscriptionPlanRequest>({
    name: Joi.string().required(),
    description: Joi.string().required(),
    monthlyPrice: Joi.number().min(0).required(),
    yearlyPrice: Joi.number().min(0).required(),
    userType: Joi.string().valid(...Object.values(UserType)).required(),
    features: Joi.object().required(),
    stripeProductId: Joi.string(),
    stripePriceIdMonthly: Joi.string(),
    stripePriceIdYearly: Joi.string()
}).options({ abortEarly: true });

export const subscriptionPlanPatchValidation = Joi.object<Partial<SubscriptionPlanRequest>>({
    name: Joi.string(),
    description: Joi.string(),
    monthlyPrice: Joi.number().min(0),
    yearlyPrice: Joi.number().min(0),
    userType: Joi.string().valid(...Object.values(UserType)),
    features: Joi.object(),
    stripeProductId: Joi.string(),
    stripePriceIdMonthly: Joi.string(),
    stripePriceIdYearly: Joi.string()
}).options({ abortEarly: true });

export type SubscriptionPlanUpdateData = Partial<SubscriptionPlanRequest>;