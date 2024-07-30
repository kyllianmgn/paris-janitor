import express from "express";
import { prisma } from "../../utils/prisma";
import { isAuthenticated, isSuperAdmin } from "../middlewares/auth-middleware";
import {
    propertyReservationValidator,
    propertyReservationPatchValidator
} from "../validators/property-validator";

export const initPropertyReservations = (app: express.Express) => {
    app.get("/property-reservations", async (_req, res) => {
        try {
            const allPropertyReservations = await prisma.propertyReservation.findMany();
            res.status(200).json({data: allPropertyReservations});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/property-reservations/:id(\\d+)", async (req, res) => {
        try {
            const PropertyReservations = await prisma.propertyReservation.findUnique({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json({data: PropertyReservations});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/property-reservations/", async (req, res) => {
        try {
            const validation = propertyReservationValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const reservationRequest = validation.value;
            const propertyReservation = await prisma.propertyReservation.create({
                data: reservationRequest
            })
            res.status(200).json({data: propertyReservation});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.patch("/property-reservations/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = propertyReservationPatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const propertyRequest = validation.value;
        try {
            const property = await prisma.propertyReservation.update({
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

    app.patch("/property-reservations/:id(\\d+)/status", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = propertyReservationPatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const propertyRequest = validation.value;
        try {
            const property = await prisma.propertyReservation.update({
                where: {
                    id: +req.params.id,
                },
                data: { status: propertyRequest.status},
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.delete("/property-reservations/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const deletedProperty = await prisma.propertyReservation.delete({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json({data: deletedProperty});
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });
};
