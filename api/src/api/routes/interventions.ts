import express from "express";
import { prisma } from "../../utils/prisma";
import { isAuthenticated, isSuperAdmin } from "../middlewares/auth-middleware";
import {
    InterventionPatchValidator,
    InterventionValidator,
    servicePatchValidator,
    serviceValidator
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

    app.get("/interventions/:id(\\d+)", async (req, res) => {
        try {
            const Interventions = await prisma.intervention.findUnique({
                where: { id: +req.params.id },
            });
            res.status(200).json({data: Interventions});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/interventions/", async (req, res) => {
        try {
            const validation = InterventionValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const serviceRequest = validation.value;
            const intervention = await prisma.intervention.create({
                data: serviceRequest
            })
            res.status(200).json({data: intervention});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.patch("/interventions/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = InterventionPatchValidator.validate(req.body);

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
        const validation = InterventionPatchValidator.validate(req.body);

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
