import express from "express";
import {prisma} from "../../utils/prisma";
import {
    subscriptionPatchValidator,
    SubscriptionRequest,
    subscriptionValidator, TravelerSubscriptionRequest,
    travelerSubscriptionValidator,
} from "../validators/subscription-validator";
import {isAuthenticated, isRole, isSuperAdmin, UserRole} from "../middlewares/auth-middleware";
import Stripe from "stripe";
import {Subscription, SubscriptionPlan, SubscriptionStatus, TravelerSubscription, User} from "@prisma/client";
import {v4 as uuidv4} from "uuid";
import {generateTokens} from "../../utils/token";
import {addRefreshTokenToWhitelist} from "../services/auth-services";
import {LandlordStatus} from "../validators/landlord-validator";


const stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
});

export const initSubscriptions = (app: express.Express) => {
    // Create a new subscription
    app.post("/subscriptions/landlord", isAuthenticated, async (req, res) => {
        try {
            const validation = subscriptionValidator.validate(req.body);

            if (validation.error) {
                return res.status(400).json({ error: "Invalid input data", details: validation.error.details });
            }

            const subscriptionData: SubscriptionRequest = validation.value;

            const user:User | null = await prisma.user.findUnique({
                where: { id: subscriptionData.userId },
                include: { Landlord: true }
            });

            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

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

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: "price_1PuGAEH84D9JafENhpuh7FIl",
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
                customer: stripeCustomerId,
                metadata: {
                    userId: user.id.toString()
                }
            });

            res.status(200).json({ sessionUrl: session.url });
        } catch (error) {
            console.error("Error in /subscriptions/landlord:", error);
            res.status(500).json({ error: "An error occurred while creating the subscription." });
        }
    });

    app.post("/subscriptions/traveler", isAuthenticated, isRole(UserRole.TRAVELER), async (req, res) => {
        try {
            const validation = travelerSubscriptionValidator.validate(req.query);

            if (validation.error) {
                return res.status(400).json({ error: "Invalid input data", details: validation.error.details });
            }
            const subscriptionRequest = validation.value;
            if (!req.user?.userId) return res.sendStatus(401)

            const user:User | null = await prisma.user.findUnique({
                where: {id: +req.user?.userId}
            })
            if (!user) return res.sendStatus(401)

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

            let planId : string = "";
            switch (subscriptionRequest.plan){
                case "explorator":
                    if (subscriptionRequest.type == "monthly"){
                        planId = "price_1Ps9NSH84D9JafENPwY1rmUh"
                    }else if(subscriptionRequest.type == "annually"){
                        planId = "price_1Ps9NTH84D9JafENE4OJ7J0y"
                    }
                    break;
                case "bag-packer":
                    if (subscriptionRequest.type == "monthly"){
                        planId = "price_1Ps9NLH84D9JafENRwsoy7an"
                    }else if(subscriptionRequest.type == "annually"){
                        planId = "price_1Ps9NLH84D9JafENBhPTep5U"
                    }
                    break;
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: planId,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `${process.env.FRONTEND_URL}/subscription/traveler/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/`,
                customer: stripeCustomerId,
                metadata: {
                    userId: String(req.user?.userId),
                    planId: planId,
                    planInformation: JSON.stringify(subscriptionRequest)
                }
            });

            res.status(200).json({ sessionUrl: session.url });
        } catch (error) {
            console.error("Error in /subscriptions/landlord:", error);
            res.status(500).json({ error: "An error occurred while creating the subscription." });
        }
    });

    app.get("/subscriptions/success", isAuthenticated, async (req, res) => {
        try {
            const sessionId = req.query.session_id as string;
            if (!sessionId) {
                return res.status(400).json({ error: "Missing session_id parameter" });
            }

            const session = await stripe.checkout.sessions.retrieve(sessionId);

            if (session.payment_status !== 'paid') {
                return res.status(400).json({ error: "Payment not completed" });
            }

            const userId = session.metadata?.userId;
            const planId = session.metadata?.planId;

            if (!userId) {
                return res.status(400).json({ error: "Invalid session metadata" });
            }

            /*const subscription = await prisma.subscription.create({
                data: {
                    userId: parseInt(userId),
                    planId: 0,
                    stripeSubscriptionId: session.subscription as string,
                    status: 'ACTIVE',
                    startDate: new Date(),
                    endDate: new Date(session.expires_at! * 1000),
                },
            });*/

            if (!req.user?.landlordId) return res.sendStatus(401)

            await prisma.landlord.update({
                where: { userId: req.user?.landlordId },
                data: { status: LandlordStatus.ACTIVE },
            });

            const user:User | null = await prisma.user.findUnique({
                where: { id: parseInt(userId) },
            });

            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }

            const jti = uuidv4();
            const { accessToken, refreshToken } = generateTokens(user, jti);
            await addRefreshTokenToWhitelist({
                jti,
                refreshToken,
                userId: user.id,
            });

            res.json({
                accessToken,
                refreshToken
            });
        } catch (error) {
            console.error("Error in /subscriptions/success:", error);
            res.status(500).json({ error: "An error occurred while processing the subscription" });
        }
    });

    app.get("/subscriptions/traveler/success", isAuthenticated, async (req, res) => {
        try {

            const sessionId = req.query.session_id as string;
            if (!sessionId) {
                return res.status(400).json({ error: "Missing session_id parameter" });
            }

            const session = await stripe.checkout.sessions.retrieve(sessionId);

            if (session.payment_status !== 'paid') {
                return res.status(400).json({ error: "Payment not completed" });
            }

            const userId = session.metadata?.userId;
            const planId = session.metadata?.planId;
            const planInfo = JSON.parse(String(session.metadata?.planInformation)) as TravelerSubscriptionRequest;

            if (!userId || !planId || !planInfo) {
                return res.status(400).json({ error: "Invalid session metadata" });
            }

            /*const subscription = await prisma.subscription.create({
                data: {
                    userId: +userId,
                    planId: 0,
                    stripeSubscriptionId: session.subscription as string,
                    status: 'ACTIVE',
                    startDate: new Date(),
                    endDate: new Date(session.expires_at! * 1000),
                },
            });*/

            let travelerSubscription: TravelerSubscription|undefined = undefined;
            switch (planInfo.plan){
                case "bag-packer":
                    travelerSubscription = TravelerSubscription.BAG_PACKER
                    break;
                case "explorator":
                    travelerSubscription = TravelerSubscription.EXPLORATOR
                    break;
            }

            await prisma.traveler.update({
                where: { userId: +userId },
                data: { subscriptionType: travelerSubscription },
            });

            const user:User | null = await prisma.user.findUnique({
                where: { id: +userId },
            });

            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }

            const jti = uuidv4();
            const { accessToken, refreshToken } = generateTokens(user, jti);
            await addRefreshTokenToWhitelist({
                jti,
                refreshToken,
                userId: user.id,
            });

            res.json({
                accessToken,
                refreshToken
            });
        } catch (error) {
            console.error("Error in /subscriptions/success:", error);
            res.status(500).json({ error: "An error occurred while processing the subscription" });
        }
    });


    // Get all subscriptions (admin only)
    app.get("/subscriptions", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const subscriptions = await prisma.subscription.findMany();
            res.status(200).json({ data: subscriptions });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching subscriptions." });
        }
    });

    // Get a specific subscription
    app.get("/subscriptions/:id(\\d+)", isAuthenticated, async (req: any, res) => {
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