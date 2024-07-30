import express from "express";
import { prisma } from "../../utils/prisma";
import { isAuthenticated, isSuperAdmin } from "../middlewares/auth-middleware";
import {
    servicePatchValidator,
    serviceValidator
} from "../validators/service-validator";

export const initServices = (app: express.Express) => {
    app.get("/services", async (_req, res) => {
        try {
            const allservices = await prisma.service.findMany();
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
            });
            res.status(200).json({data: services});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/services/", async (req, res) => {
        try {
            const validation = serviceValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const serviceRequest = validation.value;
            const service = await prisma.service.create({
                data: serviceRequest
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
