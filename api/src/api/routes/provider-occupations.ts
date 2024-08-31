import express from "express";
import {prisma} from "../../utils/prisma";
import {isAuthenticated, isRole, isRoleOrAdmin, isSuperAdmin, UserRole} from "../middlewares/auth-middleware";
import {providerOccupationPatchValidator, providerOccupationValidator} from "../validators/service-validator";

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

    app.post("/provider-occupations/",isAuthenticated, isRole(UserRole.SERVICE_PROVIDER), async (req, res) => {
        try {
            const validation = providerOccupationValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }
            if (!req.user?.serviceProviderId) return res.sendStatus(401)

            const occupationRequest = validation.value;
            const providerOccupation = await prisma.providerOccupation.create({
                data: {
                    providerId: req.user?.serviceProviderId,
                    startDate: occupationRequest.startDate,
                    endDate: occupationRequest.endDate,
                }
            })
            res.status(200).json({data: providerOccupation});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/provider-occupations/me", isAuthenticated, isRole(UserRole.SERVICE_PROVIDER), async (req, res) => {
        try {
            if (!req.user?.serviceProviderId) return res.sendStatus(401);
            const allProviderOccupations = await prisma.providerOccupation.findMany({
                where: {providerId: +req.user.serviceProviderId}
            });
            res.status(200).json({data: allProviderOccupations});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.patch("/provider-occupations/:id(\\d+)", isAuthenticated, isRoleOrAdmin(UserRole.SERVICE_PROVIDER), async (req, res) => {
        const validation = providerOccupationPatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const occupationRequest = validation.value;
        try {
            const occupation = await prisma.providerOccupation.findUnique({
                where: { id: Number(req.params.id) }
            })
            if (!occupation) {return res.sendStatus(404)}
            if (occupation.providerId !== req.user?.serviceProviderId && !req.user?.adminId) {return res.sendStatus(401)}
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

    app.delete("/provider-occupations/:id(\\d+)", isAuthenticated, isRoleOrAdmin(UserRole.SERVICE_PROVIDER), async (req, res) => {
        try {
            const occupation = await prisma.providerOccupation.findUnique({
                where: { id: Number(req.params.id) }
            })
            if (!occupation) {return res.sendStatus(404)}
            if (occupation.providerId !== req.user?.serviceProviderId && !req.user?.adminId) {return res.sendStatus(401)}
            const deletedOccupation = await prisma.providerOccupation.delete({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json({data: deletedOccupation});
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });
};
