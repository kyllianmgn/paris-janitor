import express from "express";
import { prisma } from "../../utils/prisma";
import { isAuthenticated, isSuperAdmin } from "../middlewares/auth-middleware";
import {paymentValidator, paymentPatchValidator, paymentServiceValidator} from "../validators/payment-validator";
import Stripe from 'stripe';
import { filterValidator } from "../validators/filter-validator";
import {Payment, PropertyReservation, ReservationStatus, ServicePayment} from "@prisma/client";
import {Intervention, InterventionStatus} from "../validators/service-validator";

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
            console.log(validation.value);

            if (validation.error) {
                return res.status(400).json({ error: validation.error });
            }

            const paymentRequest = validation.value;

            // Vérifiez que la réservation existe et est en statut PENDING
            const reservation: PropertyReservation | null = await prisma.propertyReservation.findFirst({
                where: { id: paymentRequest.propertyReservationId }
            });

            if (!reservation || reservation.status !== ReservationStatus.PENDING) {


                return res.status(400).json({ error: 'Invalid or already processed reservation' });
            }

            const serviceTotalAmount = paymentRequest.services.reduce((previousValue, currentValue) => {return previousValue + currentValue.amount},0)

            // Créer une session de paiement Stripe
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: paymentRequest.currency,
                            product_data: {
                                name: 'Property Reservation',
                            },
                            unit_amount: Math.round((paymentRequest.amount - serviceTotalAmount) * 100 ),
                        },
                        quantity: 1,
                    },
                    ...paymentRequest.services.map((service) => {
                        return {
                            price_data: {
                                currency: paymentRequest.currency,
                                product_data: {
                                    name: `Service: ${service.name}`,
                                },
                                unit_amount: Math.round(service.amount * 100),
                            },
                            quantity: 1,
                        }
                    })
                ],

                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/payment/success?reservation_id=${reservation.id}`,
                cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
            });

            const payment = await prisma.payment.create({
                data: {
                    amount: paymentRequest.amount,
                    currency: paymentRequest.currency,
                    status: 'PENDING',
                    paymentMethod: 'stripe',
                    stripeSessionId: session.id,
                    propertyReservationId: paymentRequest.propertyReservationId,
                    services: {
                        createMany: {data: paymentRequest.services.map(servicePayment => ({
                                serviceId: servicePayment.serviceId,
                                amount: servicePayment.amount
                            }))}
                    }
                },
                include: {
                    services: true
                }
            });

            await prisma.propertyReservation.update({
                where: {id: reservation.id},
                data: {
                    status: ReservationStatus.CONFIRMED
                }
            })

            res.status(200).json({
                data: payment,
                sessionId: session.id,
                sessionUrl: session.url
            });
        } catch (e) {
            console.error('Error creating payment:', e);
            res.status(500).send({ error: 'An error occurred while processing the payment' });
        }
    });

    app.post("/payments/service", isAuthenticated, async (req, res) => {
        try {
            const validation = paymentServiceValidator.validate(req.body);

            if (validation.error) {
                return res.status(400).json({ error: validation.error });
            }

            const paymentRequest = validation.value;


            const service = await prisma.service.findUnique({
                where: {id: paymentRequest.serviceId}
            })
            if (!service) return res.sendStatus(404);

            const property = await prisma.property.findUnique({
                where: {id: paymentRequest.propertyId}
            })
            if (!property) return res.sendStatus(404);

            // Créer une session de paiement Stripe
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: paymentRequest.currency,
                            product_data: {
                                name: `Service : ${service.name}`,
                            },
                            unit_amount: Math.round(paymentRequest.amount * 100),
                        },
                        quantity: 1,
                    }
                ],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
            });

            let endDate = new Date(paymentRequest.date);
            endDate.setHours(endDate.getHours() + 4)

            const providerOccupation = await prisma.providerOccupation.create({
                data: {
                    providerId: service.providerId,
                    startDate: paymentRequest.date,
                    endDate: endDate
                }
            })

            const propertyOccupation = await prisma.propertyOccupation.create({
                data: {
                    propertyId: property.id,
                    startDate: paymentRequest.date,
                    endDate: endDate,
                }
            })

            const intervention = await prisma.intervention.create({
                data: {
                    status: "PLANNED",
                    serviceId: service.id,
                    additionalPrice: 0,
                    propertyOccupationId: propertyOccupation.id,
                    providerOccupationId: providerOccupation.id
                }
            });

            const payment = await prisma.paymentIntervention.create({
                data: {
                    amount: paymentRequest.amount,
                    currency: paymentRequest.currency,
                    status: 'PENDING',
                    paymentMethod: 'stripe',
                    stripeSessionId: session.id,
                    interventionId: intervention.id,
                }
            });

            res.status(200).json({
                data: payment,
                sessionId: session.id,
                sessionUrl: session.url
            });
        } catch (e) {
            console.error('Error creating payment:', e);
            res.status(500).send({ error: 'An error occurred while processing the payment' });
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

    app.post("/stripe-webhook", express.raw({type: 'application/json'}), async (req, res) => {
        const sig = req.headers['stripe-signature'];

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET!);
        } catch (err: any) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const payment: Payment | null = await prisma.payment.findFirst({
                where: { stripeSessionId: session.id },
                include: { propertyReservation: true }
            });

            if (payment) {
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: 'SUCCEEDED' }
                });

                if (payment.propertyReservationId) {
                    await prisma.propertyReservation.update({
                        where: { id: payment.propertyReservationId },
                        data: { status: ReservationStatus.CONFIRMED }
                    });
                }
            }
        }
        res.json({received: true});
    });
};