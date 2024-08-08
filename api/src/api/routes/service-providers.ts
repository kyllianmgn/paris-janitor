import express from "express";
import { prisma } from "../../utils/prisma";
import {serviceProviderValidator} from "../validators/service-provider-validator";
import { isAuthenticated, isSuperAdmin } from "../middlewares/auth-middleware";
import {ServiceProviderStatus} from "@prisma/client";

export const initServiceProviders = (app: express.Express) => {
    app.get("/service-providers", isAuthenticated, isSuperAdmin, async (_req, res) => {
        try {
            const allProviders = await prisma.serviceProvider.findMany({
                select: {
                    id: true,
                    userId: true,
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            });
            res.status(200).json({data: allProviders});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/service-providers/pending", isAuthenticated, async (_req, res) => {
        try {
            const allProviders = await prisma.serviceProvider.findMany({
                select: {
                    id: true,
                    userId: true,
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                },
                where: {
                    status: ServiceProviderStatus.PENDING
                }
            });
            res.status(200).json({data: allProviders});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/service-providers/pending/count", isAuthenticated, async (_req, res) => {
        try {
            const count = await prisma.serviceProvider.count({
                where: {
                    status: ServiceProviderStatus.PENDING
                }
            });
            res.status(200).json({data: {count: count}});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/service-providers/:id(\\d+)", isAuthenticated, async (req, res) => {
        try {
            const user = await prisma.serviceProvider.findUnique({
                where: { id: +req.params.id },
                select: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    services: true
                }
            });
            res.status(200).json({data: user});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/service-providers/user/:id(\\d+)", isAuthenticated, async (req, res) => {
        try {
            const user = await prisma.serviceProvider.findUnique({
                where: { userId: +req.params.id },
                select: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    services: true
                }
            });
            res.status(200).json({data: user});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    /*app.patch("/service-providers/:id(\\d+)", isAuthenticated, async (req, res) => {
        const validation = ServiceProviderValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const userRequest = validation.value;
        try {
            const user = await prisma.ServiceProvider.update({
                where: {
                    id: +req.params.id,
                },
                data: userRequest,
            });
            res.json(user);
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });*/
};
