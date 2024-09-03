import express from "express";
import { invalidPath } from "./errors/invalid-path";
import { initUsers } from "./routes/users";
import {initAuth} from "./routes/auth";
import {initLandlords} from "./routes/landlords";
import {initInterventions} from "./routes/interventions";
import {initInterventionForms} from "./routes/intervention-forms";
import {initInvoices} from "./routes/invoices";
import {initServices} from "./routes/services";
import {initServiceProviders} from "./routes/service-providers";
import {initServiceReviews} from "./routes/service-reviews";
import {initProperties} from "./routes/properties";
import {initPropertyReservations} from "./routes/property-reservations";
import {initPropertyOccupations} from "./routes/property-occupations";
import {initPropertyReviews} from "./routes/property-reviews";
import {initTravelers} from "./routes/travelers";
import {isAuthenticated, isSuperAdmin} from "./middlewares/auth-middleware";
import {initSubscriptionPlans} from "./routes/subscription-plan";
import {initSubscriptions} from "./routes/subscription";
import {initStripeWebhook} from "./routes/stripe-webhook";
import {initAdminRoutes} from "./routes/adminRoutes";
import {initProviderOccupations} from "./routes/provider-occupations";
import {initPayments} from "./routes/payments";

export const initRoutes = (app: express.Express) => {
    app.get("/health", (_req, res) => {
        res.status(200).json({ data: "API Healthy." });
    });

    app.get("/amiadmin", isAuthenticated, isSuperAdmin, (_req, res) => {
        res.status(200).json({ data: "Yes." });
    });

    initAuth(app);
    initUsers(app);
    initTravelers(app);
    initLandlords(app);
    initProperties(app);
    initPropertyOccupations(app);
    initPropertyReservations(app);
    initProviderOccupations(app);
    initPropertyReviews(app);
    initInterventions(app);
    initInterventionForms(app);
    initInvoices(app);
    initServiceProviders(app);
    initServiceReviews(app);
    initServices(app);
    initSubscriptionPlans(app);
    initSubscriptions(app);
    initStripeWebhook(app);
    initAdminRoutes(app);
    initPayments(app);


    app.use(invalidPath);
};
