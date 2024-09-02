import express from "express";
import {prisma} from "../../utils/prisma";
import {isAuthenticated, isRole, isSuperAdmin, isTravelerOrSP, UserRole} from "../middlewares/auth-middleware";
import {
    InterventionInPropertyValidator,
    interventionPatchValidator,
    InterventionStatus,
    InterventionWithOccupationValidator
} from "../validators/service-validator";

export const initInterventions = (app: express.Express) => {
    app.get("/interventions", async (_req, res) => {
        try {
            const allInterventions = await prisma.intervention.findMany();
            res.status(200).json({data: allInterventions});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/interventions/sp/me",isAuthenticated, isRole(UserRole.SERVICE_PROVIDER), async (req, res) => {
        try {
            if (!req.user?.serviceProviderId) return res.sendStatus(404);
            const allInterventions = await prisma.intervention.findMany({
                where: {
                     service: {
                         provider: {
                             id: +req.user?.serviceProviderId
                         }
                     }
                },
                include: {
                    propertyOccupation: {include: {property: {include: {landlord: {include: {user: true}}}}}},
                    providerOccupation: true,
                    service: {include: {provider: {include: {user: true}}}}
                }
            });
            res.status(200).json({data: allInterventions});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/interventions/:id(\\d+)",isAuthenticated, isTravelerOrSP, async (req, res) => {
        try {
            const intervention = await prisma.intervention.findUnique({
                where: { id: +req.params.id },
                include: {
                    service: true,
                    providerOccupation: true,
                    propertyOccupation: {include: {property: true}}
                }
            });
            if (!intervention) return res.sendStatus(404)
            if (intervention.service.providerId !== req.user?.serviceProviderId && intervention.propertyOccupation?.property.landlordId !== req.user?.serviceProviderId) return res.sendStatus(401);
            res.status(200).json({data: intervention});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/interventions/service/:id(\\d+)", async (req, res) => {
        try {
            const interventions = await prisma.intervention.findMany({
                where: { serviceId: +req.params.id },
                include: {
                    propertyOccupation: {include: {property: {include: {landlord: {include: {user: true}}}}}},
                    service: {include: {provider: {include: {user: true}}}}
                }
            });
            const countInterventions = await prisma.intervention.count({
                where: { serviceId: +req.params.id }
            });
            res.status(200).json({data: interventions, count: countInterventions});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/interventions/", async (req, res) => {
        try {
            const validation = InterventionWithOccupationValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const serviceRequest = validation.value;
            const service = await prisma.service.findUnique({
                where: { id: serviceRequest.serviceId },
                include: {
                    provider: true
                }
            })
            if (!service) return res.sendStatus(404)
            const intervention = await prisma.providerOccupation.create({
                data: {
                    startDate: serviceRequest.startDate,
                    endDate: serviceRequest.endDate,
                    providerId: service.provider.id,
                    intervention: {
                        create: {
                            status: InterventionStatus.PLANNED,
                            additionalPrice: serviceRequest.additionalPrice,
                            serviceId: serviceRequest.serviceId
                        }
                    }
                }
            })
            res.status(200).json({data: intervention});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/interventions/property", async (req, res) => {
        try {
            const validation = InterventionInPropertyValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const serviceRequest = validation.value;
            const service = await prisma.service.findUnique({
                where: { id: serviceRequest.serviceId },
                include: {
                    provider: true
                }
            })
            if (!service) return res.sendStatus(404)
            const occupation = await prisma.propertyOccupation.create({
                data: {
                    startDate: serviceRequest.startDate,
                    endDate: serviceRequest.endDate,
                    propertyId: serviceRequest.propertyId,

                }
            })
            const intervention = await prisma.providerOccupation.create({
                data: {
                    startDate: serviceRequest.startDate,
                    endDate: serviceRequest.endDate,
                    providerId: service.provider.id,
                    intervention: {
                        create: {
                            status: InterventionStatus.PLANNED,
                            additionalPrice: serviceRequest.additionalPrice,
                            serviceId: serviceRequest.serviceId,
                            propertyOccupationId: occupation.id
                        }
                    }
                }
            })

            res.status(200).json({data: intervention});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.patch("/interventions/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = interventionPatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const interventionPatch = validation.value;
        try {
            const property = await prisma.intervention.update({
                where: {
                    id: +req.params.id,
                },
                data: interventionPatch,
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.patch("/interventions/:id(\\d+)/status", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = interventionPatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const interventionPatch = validation.value;
        try {
            const property = await prisma.intervention.update({
                where: {
                    id: +req.params.id,
                },
                data: {status: interventionPatch.status},
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.delete("/interventions/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const deletedProperty = await prisma.property.delete({
                where: { id: +req.params.id },
            });
            res.status(200).json({data: deletedProperty});
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });
};
