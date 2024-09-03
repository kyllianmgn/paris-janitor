import express from "express";
import { prisma } from "../../utils/prisma";
import {
    subscriptionPlanValidation,
    subscriptionPlanPatchValidation,
    SubscriptionPlanRequest, SubscriptionPlanUpdateData
} from "../validators/subscription-validator";
import { isAuthenticated, isSuperAdmin } from "../middlewares/auth-middleware";
import Stripe from "stripe";
import {SubscriptionPlan, UserType} from "@prisma/client";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
});

export const initSubscriptionPlans = (app: express.Express) => {
    // Create a new subscription plan
    app.post("/subscription-plans", isAuthenticated, isSuperAdmin, async (req, res) => {

        const validation = subscriptionPlanValidation.validate(req.body);

        if (validation.error) {
            return res.status(400).json({ error: validation.error.details });
        }

        const planData: Omit<SubscriptionPlanRequest, 'id'> = validation.value;

        try {
            // Create the plan in Stripe
            const stripeProduct = await stripe.products.create({
                name: planData.name,
                description: planData.description,
            });

            const stripePriceMonthly = await stripe.prices.create({
                product: stripeProduct.id,
                unit_amount: Math.round(planData.monthlyPrice * 100),
                currency: "eur",
                recurring: { interval: "month" },
            });

            const stripePriceYearly = await stripe.prices.create({
                product: stripeProduct.id,
                unit_amount: Math.round(planData.yearlyPrice * 100),
                currency: "eur",
                recurring: { interval: "year" },
            });

            // Create the plan in the database
            const plan = await prisma.subscriptionPlan.create({
                data: {
                    ...planData,
                    stripeProductId: stripeProduct.id,
                    stripePriceIdMonthly: stripePriceMonthly.id,
                    stripePriceIdYearly: stripePriceYearly.id,
                },
            });

            res.status(201).json({ data: plan });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while creating the subscription plan." });
        }
    });

    // Get all subscription plans
    app.get("/subscription-plans", async (req, res) => {
        try {
            const plans = await prisma.subscriptionPlan.findMany();
            res.status(200).json({ data: plans });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching subscription plans." });
        }
    });

    // Get a specific subscription plan
    app.get("/subscription-plans/:id", async (req, res) => {
        try {
            const plan = await prisma.subscriptionPlan.findUnique({
                where: { id: parseInt(req.params.id) },
            });
            if (!plan) {
                return res.status(404).json({ error: "Subscription plan not found." });
            }
            res.status(200).json({ data: plan });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching the subscription plan." });
        }
    });

    app.get("/subscription-plans/traveler", isAuthenticated, async (req, res) => {
        try {
            const travelerPlans = await prisma.subscriptionPlan.findMany({
                where: {
                    userType: UserType.TRAVELER,
                },
                orderBy: {
                    monthlyPrice: 'asc',
                },
            });

            res.status(200).json({ data: travelerPlans });
        } catch (error) {
            console.error("Error fetching traveler subscription plans:", error);
            res.status(500).json({ error: "An error occurred while fetching subscription plans." });
        }
    });


    // Update a subscription plan
    app.patch("/subscription-plans/:id", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = subscriptionPlanPatchValidation.validate(req.body);
        console.log("je suis dans le patch");
        console.log("VALIDATION", validation);
        console.log("REQ BODY", req.body);

        if (validation.error) {
            return res.status(400).json({ error: validation.error.details });
        }

        const planData: SubscriptionPlanUpdateData = validation.value;

        try {
            const existingPlan: SubscriptionPlan | null = await prisma.subscriptionPlan.findUnique({
                where: { id: parseInt(req.params.id) },
            });

            if (!existingPlan) {
                return res.status(404).json({ error: "Subscription plan not found." });
            }

            // Update the plan in Stripe
            await stripe.products.update(existingPlan.stripeProductId, {
                name: planData.name || existingPlan.name,
                description: planData.description || existingPlan.description,
            });

            if (planData.monthlyPrice) {
                await stripe.prices.update(existingPlan.stripePriceIdMonthly, {
                    active: false,
                });
                const newMonthlyPrice = await stripe.prices.create({
                    product: existingPlan.stripeProductId,
                    unit_amount: Math.round(planData.monthlyPrice * 100),
                    currency: "eur",
                    recurring: { interval: "month" },
                });
                planData.stripePriceIdMonthly = newMonthlyPrice.id;
            }

            if (planData.yearlyPrice) {
                await stripe.prices.update(existingPlan.stripePriceIdYearly, {
                    active: false,
                });
                const newYearlyPrice = await stripe.prices.create({
                    product: existingPlan.stripeProductId,
                    unit_amount: Math.round(planData.yearlyPrice * 100),
                    currency: "eur",
                    recurring: { interval: "year" },
                });
                planData.stripePriceIdYearly = newYearlyPrice.id;
            }

            // Update the plan in the database
            const updatedPlan = await prisma.subscriptionPlan.update({
                where: { id: parseInt(req.params.id) },
                data: planData,
            });

            res.status(200).json({ data: updatedPlan });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while updating the subscription plan." });
        }
    });


    // Delete a subscription plan
    app.delete("/subscription-plans/:id", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const plan: SubscriptionPlan | null = await prisma.subscriptionPlan.findUnique({
                where: { id: parseInt(req.params.id) },
            });

            if (!plan) {
                return res.status(404).json({ error: "Subscription plan not found." });
            }

            // Deactivate the product in Stripe
            await stripe.products.update(plan.stripeProductId, { active: false });

            // Delete the plan from the database
            await prisma.subscriptionPlan.delete({
                where: { id: parseInt(req.params.id) },
            });

            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while deleting the subscription plan." });
        }
    });
};