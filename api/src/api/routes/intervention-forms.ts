import express from "express";
import { prisma } from "../../utils/prisma";
import { isAuthenticated, isSuperAdmin } from "../middlewares/auth-middleware";
import {
    InterventionPatchValidator,
    InterventionValidator,
    servicePatchValidator,
    serviceValidator
} from "../validators/service-validator";

export const initInterventionForms = (app: express.Express) => {
    app.get("/intervention-forms", async (_req, res) => {
        try {
            const allInterventionForms = await prisma.intervention.findMany();
            res.status(200).json({data: allInterventionForms});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/intervention-forms/:id(\\d+)", async (req, res) => {
        try {
            const interventionForm = await prisma.intervention.findUnique({
                where: { id: +req.params.id },
            });
            res.status(200).json({data: interventionForm});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/intervention-forms/", async (req, res) => {
        try {
            const validation = InterventionValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const serviceRequest = validation.value;
            const interventionForm = await prisma.intervention.create({
                data: serviceRequest
            })
            res.status(200).json({data: interventionForm});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.patch("/intervention-forms/:id(\\d+)/status", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = InterventionPatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const interventionFormPatch = validation.value;
        try {
            const property = await prisma.intervention.update({
                where: {
                    id: +req.params.id,
                },
                data: interventionFormPatch,
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.delete("/intervention-forms/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
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
