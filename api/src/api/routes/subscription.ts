import express from "express";
import { prisma } from "../../utils/prisma";
import {
    subscriptionValidator,
    subscriptionPatchValidator,
    SubscriptionRequest,
} from "../validators/subscription-validator";
import { isAuthenticated, isRoleOrAdmin, isSuperAdmin } from "../middlewares/auth-middleware";
import Stripe from "stripe";
import { Subscription, SubscriptionPlan, SubscriptionStatus, User } from "@prisma/client";

const stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
});

export const initSubscriptions = (app: express.Express) => {
    // Create a new subscription
    app.post("/api/subscriptions", isAuthenticated, async (req, res) => {
        const validation = subscriptionValidator.validate(req.body);

        if (validation.error) {
            return res.status(400).json({ error: validation.error.details });
        }

        const subscriptionData: SubscriptionRequest = validation.value;

        try {
            const user: User | null = await prisma.user.findUnique({ where: { id: subscriptionData.userId } });
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            const plan: SubscriptionPlan | null = await prisma.subscriptionPlan.findUnique({ where: { id: subscriptionData.planId } });
            if (!plan) {
                return res.status(404).json({ error: "Subscription plan not found." });
            }

            // Create or retrieve Stripe customer
            let stripeCustomerId = user.stripeCustomerId;
            if (!stripeCustomerId) {
                const customer = await stripe.customers.create({
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                });
                stripeCustomerId = customer.id;
                await prisma.user.update({
                    where: { id: user.id },
                    data: { stripeCustomerId },
                });
            }

            // Create Stripe subscription
            const stripeSubscription = await stripe.subscriptions.create({
                customer: stripeCustomerId,
                items: [{ price: plan.stripePriceIdMonthly }],
            });

            // Create subscription in database
            const subscription = await prisma.subscription.create({
                data: {
                    userId: subscriptionData.userId,
                    planId: subscriptionData.planId,
                    status: SubscriptionStatus.ACTIVE,
                    startDate: new Date(),
                    stripeSubscriptionId: stripeSubscription.id,
                },
            });

            res.status(201).json({ data: subscription });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while creating the subscription." });
        }
    });

    // Get all subscriptions (admin only)
    app.get("/api/subscriptions", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const subscriptions = await prisma.subscription.findMany();
            res.status(200).json({ data: subscriptions });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching subscriptions." });
        }
    });

    // Get a specific subscription
    app.get("/api/subscriptions/:id", isAuthenticated, async (req: any, res) => {
        try {
            const subscription: Subscription | null = await prisma.subscription.findUnique({
                where: { id: parseInt(req.params.id) },
            });

            if (!subscription) {
                return res.status(404).json({ error: "Subscription not found." });
            }

            // Check if the user is authorized to view this subscription
            if (!req.user.adminId && subscription.userId !== req.userId) {

                return res.status(403).json({ error: "Not authorized to view this subscription." });
            }

            res.status(200).json({ data: subscription });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching the subscription." });
        }
    });

    // Update a subscription (change plan)
    app.put("/api/subscriptions/:id", isAuthenticated, async (req: any, res) => {
        const validation = subscriptionPatchValidator.validate(req.body);

        if (validation.error) {
            return res.status(400).json({ error: validation.error.details });
        }

        const updateData: any = validation.value;

        try {
            const subscription: Subscription | null = await prisma.subscription.findUnique({
                where: { id: parseInt(req.params.id) },
                include: { user: true, plan: true },
            });

            if (!subscription) {
                return res.status(404).json({ error: "Subscription not found." });
            }

            // Check if the user is authorized to update this subscription
            if (!req.user.adminId  && subscription.userId !== req.userId) {

                return res.status(403).json({ error: "Not authorized to view this subscription." });
            }

            if (updateData.planId) {
                const newPlan: SubscriptionPlan | null = await prisma.subscriptionPlan.findUnique({ where: { id: updateData.planId } });
                if (!newPlan) {
                    return res.status(404).json({ error: "New subscription plan not found." });
                }

                // Update Stripe subscription
                if (subscription.stripeSubscriptionId) {
                    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
                        items: [
                            {
                                id: subscription.stripeSubscriptionId,
                                price: newPlan.stripePriceIdMonthly,
                            },
                        ],
                    });
                }
            }

            // Update subscription in database
            const updatedSubscription = await prisma.subscription.update({
                where: { id: parseInt(req.params.id) },
                data: updateData,
            });

            res.status(200).json({ data: updatedSubscription });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while updating the subscription." });
        }
    });

    // Cancel a subscription
    app.delete("/api/subscriptions/:id", isAuthenticated, async (req: any, res) => {
        try {
            const subscription: Subscription | null = await prisma.subscription.findUnique({
                where: { id: parseInt(req.params.id) },
            });

            if (!subscription) {
                return res.status(404).json({ error: "Subscription not found." });
            }

            // Check if the user is authorized to cancel this subscription
            if (!req.user.adminId  && subscription.userId !== req.userId) {
                console.log(req.user.admin);
                console.log(subscription.userId);
                return res.status(403).json({ error: "Not authorized to view this subscription." });
            }

            // Cancel Stripe subscription
            if (subscription.stripeSubscriptionId) {
                await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
            }

            // Update subscription status in database
            await prisma.subscription.update({
                where: { id: parseInt(req.params.id) },
                data: {
                    status: SubscriptionStatus.CANCELED,
                    endDate: new Date()
                },
            });

            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while canceling the subscription." });
        }
    });
};