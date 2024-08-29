import express from 'express';
import Stripe from 'stripe';
import { prisma } from '../../utils/prisma';
import { SubscriptionStatus } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});

export const initStripeWebhook = (app: express.Express) => {
    app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
        const sig = req.headers['stripe-signature'];

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET!);
        } catch (err: any) {
            console.error('Webhook Error:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionChange(subscription);
                break;
            case 'invoice.payment_succeeded':
            case 'invoice.payment_failed':
                const invoice = event.data.object as Stripe.Invoice;
                await handleInvoicePayment(invoice);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({received: true});
    });
};

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
    const dbSubscription = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: subscription.id }
    });

    if (!dbSubscription) {
        console.error(`Subscription not found: ${subscription.id}`);
        return;
    }

    let status: SubscriptionStatus;
    switch (subscription.status) {
        case 'active':
            status = SubscriptionStatus.ACTIVE;
            break;
        case 'past_due':
            status = SubscriptionStatus.PAST_DUE;
            break;
        case 'canceled':
            status = SubscriptionStatus.CANCELED;
            break;
        case 'unpaid':
            status = SubscriptionStatus.UNPAID;
            break;
        default:
            console.error(`Unknown subscription status: ${subscription.status}`);
            return;
    }

    await prisma.subscription.update({
        where: { id: dbSubscription.id },
        data: {
            status: status,
            endDate: new Date(subscription.current_period_end * 1000)
        }
    });
}

async function handleInvoicePayment(invoice: Stripe.Invoice) {
    if (!invoice.subscription) return;

    const dbSubscription = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: invoice.subscription as string }
    });

    if (!dbSubscription) {
        console.error(`Subscription not found: ${invoice.subscription}`);
        return;
    }

    if (invoice.status === 'paid') {
        await prisma.subscription.update({
            where: { id: dbSubscription.id },
            data: {
                status: SubscriptionStatus.ACTIVE
            }
        });
    } else if (invoice.status === 'open') {
        await prisma.subscription.update({
            where: { id: dbSubscription.id },
            data: {
                status: SubscriptionStatus.PAST_DUE
            }
        });
    }
}