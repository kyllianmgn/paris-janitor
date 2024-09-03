import express from "express";
import {prisma} from "../../utils/prisma";
import {isAuthenticated, isRole, isSuperAdmin, UserRole} from "../middlewares/auth-middleware";
import {serviceValidator} from "../validators/service-validator";
import {dateValidator, filterValidator} from "../validators/filter-validator";

export const initServices = (app: express.Express) => {
    app.get("/services", async (req, res) => {
        try {
            const validation = filterValidator.validate(req.query)

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const filterParams = validation.value;
            const allservices = await prisma.service.findMany({
                    where: filterParams.query ?
                        {
                            provider: {
                                status: "ACCEPTED"
                            },
                            OR: [{
                                name: {
                                    contains: filterParams.query,
                                    mode: "insensitive"
                                }
                            }, {
                                description: {
                                    contains: filterParams.query,
                                    mode: "insensitive"
                                }
                            }]
                        }
                        : {
                            provider: {
                                status: "ACCEPTED"
                            }
                        },
                    take: (filterParams.pageSize) ? +filterParams.pageSize : 10,
                    skip: (filterParams.page) ? (filterParams.pageSize) ? +filterParams.page * +filterParams.pageSize : (+filterParams.page-1) * 10 : 0,
                }
            );
            res.status(200).json({data: allservices});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/services/available/intervention", async (req, res) => {
        try {
            const validation = filterValidator.validate(req.query)

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const filterParams = validation.value;
            const allservices = await prisma.service.findMany({
                    where: filterParams.query ?
                        {
                            provider: {
                                status: "ACCEPTED",
                                occupation : filterParams.date ? {none: {
                                        AND: [
                                            {
                                                startDate: {lte: filterParams.date}
                                            },
                                            {
                                                endDate: {gte: filterParams.date}
                                            }
                                        ]
                                    }} : undefined
                            },
                            type: "INTERVENTION",
                            OR: [{
                                name: {
                                    contains: filterParams.query,
                                    mode: "insensitive"
                                }
                            }, {
                                description: {
                                    contains: filterParams.query,
                                    mode: "insensitive"
                                }
                            }]
                        }
                        : {
                            provider: {
                                status: "ACCEPTED",
                                occupation : filterParams.date ? {none: {
                                        AND: [
                                            {
                                                startDate: {lte: filterParams.date}
                                            },
                                            {
                                                endDate: {gte: filterParams.date}
                                            }
                                        ]
                                    }} : undefined
                            },
                            type: "INTERVENTION"
                        },
                    take: (filterParams.pageSize) ? +filterParams.pageSize : 10,
                    skip: (filterParams.page) ? (filterParams.pageSize) ? +filterParams.page * +filterParams.pageSize : (+filterParams.page-1) * 10 : 0,
                }
            );
            res.status(200).json({data: allservices});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/services/availability/:id(\\d+)", async (req, res) => {
        try {
            const validation = dateValidator.validate(req.query)

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const filterParams = validation.value;
            const service = await prisma.service.findUnique({
                    where: {
                        id: +req.params.id,
                        provider: {
                            occupation: {
                                none: {
                                    AND: [
                                        {startDate:
                                                {lte: validation.value.date}
                                        },
                                        {endDate:
                                                {gte: validation.value.date}
                                        },
                                    ]
                                }
                            }
                        }
                    }
                }
            );
            res.status(200).json({data: service});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/services/me", isAuthenticated, isRole(UserRole.SERVICE_PROVIDER), async (req, res) => {
        try {
            const validation = filterValidator.validate(req.query)

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const filterParams = validation.value;
            const allservices = await prisma.service.findMany({
                    where: filterParams.query ?
                        {
                            providerId: req.user?.serviceProviderId,
                            OR: [{
                                name: {
                                    contains: filterParams.query,
                                    mode: "insensitive"
                                }
                            }, {
                                description: {
                                    contains: filterParams.query,
                                    mode: "insensitive"
                                }
                            }]
                        }
                        : {providerId: req.user?.serviceProviderId},
                    take: (filterParams.pageSize) ? +filterParams.pageSize : undefined,
                    skip: (filterParams.page) ? (filterParams.pageSize) ? +filterParams.page * +filterParams.pageSize : (+filterParams.page-1) * 10 : 0,
                }
            );
            res.status(200).json({data: allservices});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/services/:id(\\d+)", async (req, res) => {
        try {
            const services = await prisma.service.findUnique({
                where: { id: Number(req.params.id) },
                include: {provider: {include: {user: true}}}
            });
            res.status(200).json({data: services});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/services/provider/:id(\\d+)", async (req, res) => {
        try {
            const validation = filterValidator.validate(req.query)

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const filterParams = validation.value;
            const services = await prisma.service.findMany({
                where: filterParams.query ?
                    {
                        providerId: +req.params.id,
                        OR: [{
                            name: {
                                contains: filterParams.query,
                                mode: "insensitive"
                            }
                        }, {
                            description: {
                                contains: filterParams.query,
                                mode: "insensitive"
                            }
                        }]
                    }
                    : {
                        providerId: +req.params.id,

                    },
                take: (filterParams.pageSize) ? +filterParams.pageSize : 10,
                skip: (filterParams.page) ? (filterParams.pageSize) ? +filterParams.page * +filterParams.pageSize : (+filterParams.page-1) * 10 : 0,
            });
            const countServices = await prisma.service.count({
                where: { providerId: +req.params.id }
            });
            res.status(200).json({data: services, count: countServices});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/services/provider/:id(\\d+)/count", async (req, res) => {
        try {
            const services = await prisma.service.count({
                where: { providerId: +req.params.id }
            });
            res.status(200).json({data: services});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/services", isAuthenticated, isRole(UserRole.SERVICE_PROVIDER), async (req, res) => {
        try {
            const validation = serviceValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            if (!req.user?.serviceProviderId){
                res.status(401).json({error: "Unauthorized"})
                return;
            }

            const serviceRequest = validation.value;
            const service = await prisma.service.create({
                data: {...serviceRequest, providerId: req.user.serviceProviderId}
            })
            await prisma.serviceProvider.update({
                where: {id: req.user.serviceProviderId},
                data: {status: "PENDING"}
            })
            res.status(200).json({data: service});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    /*app.patch("/services/:id(\\d+)", isAuthenticated, async (req, res) => {
        const validation = servicePatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const propertyRequest = validation.value;
        try {
            const property = await prisma.service.update({
                where: {
                    id: Number(req.params.id),
                },
                data: {
                    : propertyRequest.address,
                    description: propertyRequest.description,
                    status: PropertyStatus.PENDING
                },
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });*/

    app.delete("/services/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const deletedProperty = await prisma.property.delete({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json({data: deletedProperty});
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });
};
