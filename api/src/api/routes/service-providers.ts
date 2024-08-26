import express from "express";
import {prisma} from "../../utils/prisma";
import {serviceProviderStatusPatchValidator} from "../validators/service-provider-validator";
import {isAuthenticated, isSuperAdmin} from "../middlewares/auth-middleware";
import {ServiceProviderStatus} from "@prisma/client";
import {Filter, filterValidator} from "../validators/filter-validator";

export const initServiceProviders = (app: express.Express) => {
    app.get("/service-providers", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const validation = filterValidator.validate(req.query)

            if (validation.error) {
                res.status(400).json({error: validation.error});
            }

            const filter: Filter = validation.value;

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
                where: filter.query ?
                    {
                        OR: [{
                            user: {
                                firstName: {
                                    contains: filter.query,
                                    mode: "insensitive"
                                }
                            }
                        }, {
                            user: {
                                lastName: {
                                    contains: filter.query,
                                    mode: "insensitive"
                                }
                            }
                        }, {
                            user: {
                                email: {
                                    contains: filter.query,
                                    mode: "insensitive"
                                }
                            }
                        }]
                    }
                    : {},
                take: (filter.pageSize) ? +filter.pageSize : 10,
                skip: (filter.page) ? (filter.pageSize) ? +filter.page * +filter.pageSize : (+filter.page-1) * 10 : 0,
            });
            const countProviders = await prisma.serviceProvider.count({
                where: filter.query ?
                    {
                        OR: [{
                            user: {
                                firstName: {
                                    contains: filter.query,
                                    mode: "insensitive"
                                }
                            }
                        }, {
                            user: {
                                lastName: {
                                    contains: filter.query,
                                    mode: "insensitive"
                                }
                            }
                        }, {
                            user: {
                                email: {
                                    contains: filter.query,
                                    mode: "insensitive"
                                }
                            }
                        }]
                    }
                    : {}
            })
            res.status(200).json({data: allProviders, count: countProviders});
        } catch (e) {
            res.status(500).send({error: e});
            return;
        }
    });

    app.get("/service-providers/pending", isAuthenticated, async (req, res) => {
        try {
            const validation = filterValidator.validate(req.query)

            if (validation.error) {
                res.status(400).json({error: validation.error});
            }

            const filter: Filter = validation.value;
            const allProviders = await prisma.serviceProvider.findMany({
                select: {
                    id: true,
                    userId: true,
                    status: true,
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
                    status: ServiceProviderStatus.PENDING,
                    OR: [{
                        user: {
                            firstName: {
                                contains: filter.query,
                                mode: "insensitive"
                            }
                        }
                    }, {
                        user: {
                            lastName: {
                                contains: filter.query,
                                mode: "insensitive"
                            }
                        }
                    }, {
                        user: {
                            email: {
                                contains: filter.query,
                                mode: "insensitive"
                            }
                        }
                    }]
                },
                take: (filter.pageSize) ? +filter.pageSize : 10,
                skip: (filter.page) ? (filter.pageSize) ? +filter.page * +filter.pageSize : (+filter.page-1) * 10 : 0,
            });
            const countProviders = await prisma.serviceProvider.count({
                where: {
                    status: ServiceProviderStatus.PENDING
                }
            })
            res.status(200).json({data: allProviders, count: countProviders});
        } catch (e) {
            res.status(500).send({error: e});
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
            res.status(500).send({error: e});
            return;
        }
    });

    app.get("/service-providers/:id(\\d+)", isAuthenticated, async (req, res) => {
        try {
            const user = await prisma.serviceProvider.findUnique({
                where: {id: +req.params.id},
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
            if (!user){
                res.status(404).send({error: "Service Provider Not Found"});
            }
            res.status(200).json({data: user});
        } catch (e) {
            res.status(500).send({error: e});
            return;
        }
    });

    app.get("/service-providers/user/:id(\\d+)", isAuthenticated, async (req, res) => {
        try {
            const user = await prisma.serviceProvider.findUnique({
                where: {userId: +req.params.id},
                select: {
                    id: true,
                    status: true,
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
            res.status(500).send({error: e});
            return;
        }
    });

    app.patch("/service-providers/:id(\\d+)/status", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = serviceProviderStatusPatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const userRequest = validation.value;
        try {
            const serviceProvider = await prisma.serviceProvider.update({
                where: {
                    id: +req.params.id,
                },
                data: {
                    status: userRequest.status
                },
                include: {
                    user: true
                }
            });
            res.status(200).json({data: serviceProvider});
        } catch (e) {
            res.status(500).json({ error: e });
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
