import express from "express";
import {prisma} from "../../utils/prisma";
import {isAuthenticated, isSuperAdmin} from "../middlewares/auth-middleware";
import {
    propertyReservationValidator,
    propertyReservationPatchValidator, propertyReservationWithOccupationValidator, ReservationStatus
} from "../validators/property-validator";

export const initPropertyReservations = (app: express.Express) => {
    app.get("/property-reservations", async (_req, res) => {
        try {
            const allPropertyReservations = await prisma.propertyReservation.findMany({
                include: {
                    traveler: {
                        include: {
                            user: true
                        }
                    },
                    occupation: {
                        include: {
                            property: true
                        }
                    }
                }
            });
            const countReservations = await prisma.propertyReservation.count()
            res.status(200).json({data: allPropertyReservations, count: countReservations});
        } catch (e) {
            res.status(500).send({error: e});
            return;
        }
    });

    app.get("/property-reservations/:id(\\d+)", async (req, res) => {
        try {
            const PropertyReservations = await prisma.propertyReservation.findUnique({
                where: {id: Number(req.params.id)},
            });
            res.status(200).json({data: PropertyReservations});
        } catch (e) {
            res.status(500).send({error: e});
            return;
        }
    });

    app.get("/property-reservations/full/:id(\\d+)", async (req, res) => {
        try {
            const PropertyReservationFull = await prisma.propertyReservation.findUnique({
                where: {id: Number(req.params.id)},
                include: {occupation: true}
            });
            res.status(200).json({data: PropertyReservationFull});
        } catch (e) {
            res.status(500).send({error: e});
            return;
        }
    });

    app.get("/property-reservations/traveler/:id(\\d+)", async (req, res) => {
        try {
            const PropertyReservations = await prisma.propertyReservation.findMany({
                where: {travelerId: +req.params.id},
                include: {occupation: true}
            });
            res.status(200).json({data: PropertyReservations});
        } catch (e) {
            res.status(500).send({error: e});
            return;
        }
    });

    app.get("/property-reservations/property/:id(\\d+)", async (req, res) => {
        try {
            const PropertyReservations = await prisma.propertyReservation.findMany({
                where: {occupation: {propertyId: +req.params.id}}
            });
            res.status(200).json({data: PropertyReservations});
        } catch (e) {
            res.status(500).send({error: e});
            return;
        }
    });

    app.post("/property-reservations/", async (req, res) => {
        try {
            const validation = propertyReservationWithOccupationValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({error: validation.error});
                return;
            }

            const reservationRequest = validation.value;

            const propertyReservation = await prisma.propertyOccupation.create({
                data: {
                    startDate: reservationRequest.startDate,
                    endDate: reservationRequest.endDate,
                    propertyId: reservationRequest.propertyId,
                    reservation: {
                        create: {
                            travelerId: reservationRequest.travelerId,
                            totalPrice: reservationRequest.totalPrice,
                            status: ReservationStatus.PENDING,
                        }
                    },
                }
            })
            res.status(200).json({data: propertyReservation});
        } catch (e) {
            res.status(500).send({error: e});
            return;
        }
    });

    app.patch("/property-reservations/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = propertyReservationPatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({error: validation.error});
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
            res.status(500).json({error: e});
            return;
        }
    });

    app.patch("/property-reservations/:id(\\d+)/status", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = propertyReservationPatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({error: validation.error});
            return;
        }

        const propertyRequest = validation.value;
        try {
            const property = await prisma.propertyReservation.update({
                where: {
                    id: +req.params.id,
                },
                data: {status: propertyRequest.status},
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).json({error: e});
            return;
        }
    });

    app.delete("/property-reservations/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const deletedProperty = await prisma.propertyReservation.delete({
                where: {id: Number(req.params.id)},
            });
            res.status(200).json({data: deletedProperty});
        } catch (e) {
            res.status(500).send({error: e});
        }
    });
};
