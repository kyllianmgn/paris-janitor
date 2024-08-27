import Joi from "joi";
import {Subscription, SubscriptionPlan, SubscriptionStatus, UserType} from "@prisma/client";


export interface SubscriptionRequest {
    userId: number;
    planId: number;
}

export const subscriptionValidator = Joi.object<SubscriptionRequest>({
    userId: Joi.number().required(),
    planId: Joi.number().required(),
});

export const subscriptionPatchValidator = Joi.object<Partial<Subscription>>({
    planId: Joi.number().optional(),
    status: Joi.string()
        .valid(...Object.values(SubscriptionStatus))
        .optional(),
    endDate: Joi.date().optional().allow(null),
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