import express from "express";
import { prisma } from "../../utils/prisma";
import { isAuthenticated, isSuperAdmin } from "../middlewares/auth-middleware";
import {
    providerOccupationValidator,
    providerOccupationPatchValidator
} from "../validators/service-validator";

export const initProviderOccupations = (app: express.Express) => {
    app.get("/provider-occupations", async (_req, res) => {
        try {
            const allProviderOccupations = await prisma.providerOccupation.findMany();
            res.status(200).json({data: allProviderOccupations});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/provider-occupations/:id(\\d+)", async (req, res) => {
        try {
            const providerOccupation = await prisma.providerOccupation.findUnique({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json({data: providerOccupation});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/provider-occupations/", async (req, res) => {
        try {
            const validation = providerOccupationValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const occupationRequest = validation.value;
            const providerOccupation = await prisma.providerOccupation.create({
                data: occupationRequest
            })
            res.status(200).json({data: providerOccupation});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.patch("/provider-occupations/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = providerOccupationPatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const occupationRequest = validation.value;
        try {
            const provider = await prisma.providerOccupation.update({
                where: {
                    id: +req.params.id,
                },
                data: occupationRequest,
            });
            res.status(200).json({data: provider});
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.delete("/provider-occupations/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const deletedOccupation = await prisma.providerOccupation.delete({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json({data: deletedOccupation});
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });
};
