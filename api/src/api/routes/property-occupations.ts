import express from "express";
import { prisma } from "../../utils/prisma";
import { isAuthenticated, isSuperAdmin } from "../middlewares/auth-middleware";
import {
    propertyOccupationValidator,
    propertyOccupationPatchValidator
} from "../validators/property-validator";

export const initPropertyOccupations = (app: express.Express) => {
    app.get("/property-occupations", async (_req, res) => {
        try {
            const allPropertyOccupations = await prisma.propertyOccupation.findMany();
            res.status(200).json({data: allPropertyOccupations});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/property-occupations/:id(\\d+)", async (req, res) => {
        try {
            const propertyOccupation = await prisma.propertyOccupation.findUnique({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json({data: propertyOccupation});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/property-occupations/", async (req, res) => {
        try {
            const validation = propertyOccupationValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const occupationRequest = validation.value;
            const propertyOccupation = await prisma.propertyOccupation.create({
                data: occupationRequest
            })
            res.status(200).json({data: propertyOccupation});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    /*app.patch("/property-occupations/:id(\\d+)", isAuthenticated, async (req, res) => {
        const validation = propertyOccupationPatchValidator.validate(req.body);

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
    });*/

    app.patch("/property-occupations/:id(\\d+)/status", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = propertyOccupationPatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const propertyRequest = validation.value;
        try {
            const property = await prisma.propertyOccupation.update({
                where: {
                    id: +req.params.id,
                },
                data: propertyRequest,
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.delete("/property-occupations/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const deletedProperty = await prisma.propertyOccupation.delete({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json({data: deletedProperty});
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });
};
