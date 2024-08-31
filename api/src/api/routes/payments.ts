import express from "express";
import { prisma } from "../../utils/prisma";
import { isAuthenticated, isSuperAdmin } from "../middlewares/auth-middleware";
import { paymentValidator, paymentPatchValidator } from "../validators/payment-validator";
import Stripe from 'stripe';
import { filterValidator } from "../validators/filter-validator";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});

export const initPayments = (app: express.Express) => {
    app.get("/payments", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const validation = filterValidator.validate(req.query);
            if (validation.error) {
                return res.status(400).json({ error: validation.error });
            }
            const filter = validation.value;

            const allPayments = await prisma.payment.findMany({
                take: filter.pageSize ? +filter.pageSize : 10,
                skip: filter.page ? (filter.pageSize ? +filter.page * +filter.pageSize : (+filter.page-1) * 10) : 0,
                include: {
                    propertyReservation: true,
                    invoice: true,
                    services: {
                        include: {
                            service: true
                        }
                    }
                }
            });
            const count = await prisma.payment.count();
            res.status(200).json({data: allPayments, count});
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });

    app.get("/payments/:id(\\d+)", isAuthenticated, async (req, res) => {
        try {
            const payment = await prisma.payment.findUnique({
                where: { id: Number(req.params.id) },
                include: {
                    propertyReservation: true,
                    invoice: true,
                    services: {
                        include: {
                            service: true
                        }
                    }
                }
            });
            res.status(200).json({data: payment});
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });

    app.post("/payments", isAuthenticated, async (req, res) => {
        try {
            const validation = paymentValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const paymentRequest = validation.value;

            // Créer un PaymentIntent avec Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(paymentRequest.amount * 100), // Stripe utilise les centimes
                currency: paymentRequest.currency,
                payment_method_types: ['card'],
            });

            const payment = await prisma.payment.create({
                data: {
                    amount: paymentRequest.amount,
                    currency: paymentRequest.currency,
                    status: 'PENDING',
                    paymentMethod: paymentRequest.paymentMethod,
                    stripePaymentIntentId: paymentIntent.id,
                    propertyReservationId: paymentRequest.propertyReservationId,
                    services: {
                        create: paymentRequest.services.map(service => ({
                            serviceId: service.serviceId,
                            amount: service.amount
                        }))
                    }
                },
                include: {
                    services: true
                }
            });

            res.status(200).json({
                data: payment,
                clientSecret: paymentIntent.client_secret
            });
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });

    app.patch("/payments/:id(\\d+)/status", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = paymentPatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const paymentPatch = validation.value;
        try {
            const payment = await prisma.payment.update({
                where: { id: Number(req.params.id) },
                data: { status: paymentPatch.status },
            });
            res.status(200).json({data: payment});
        } catch (e) {
            res.status(500).json({ error: e });
        }
    });
};