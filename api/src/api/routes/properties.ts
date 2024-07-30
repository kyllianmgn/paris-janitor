import express from "express";
import { prisma } from "../../utils/prisma";
import { isAuthenticated, isSuperAdmin } from "../middlewares/auth-middleware";
import {propertyPatchStatusValidator, propertyPatchValidator, PropertyStatus} from "../validators/property-validator";

export const initProperties = (app: express.Express) => {
    app.get("/properties", async (_req, res) => {
        try {
            const allProperties = await prisma.property.findMany();
            res.status(200).json({data: allProperties});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/properties/:id(\\d+)", async (req, res) => {
        try {
            const property = await prisma.property.findUnique({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.patch("/properties/:id(\\d+)", isAuthenticated, async (req, res) => {
        const validation = propertyPatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const propertyRequest = validation.value;
        try {
            const property = await prisma.property.update({
                where: {
                    id: Number(req.params.id),
                },
                data: {
                    address: propertyRequest.address,
                    description: propertyRequest.description,
                    status: PropertyStatus.PENDING
                },
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.patch("/properties/:id(\\d+)/status", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = propertyPatchStatusValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const propertyRequest = validation.value;
        try {
            const property = await prisma.property.update({
                where: {
                    id: +req.params.id,
                },
                data: {status: propertyRequest.status},
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.delete("/properties/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
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
