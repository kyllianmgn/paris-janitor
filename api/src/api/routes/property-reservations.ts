import express from "express";
import {prisma} from "../../utils/prisma";
import {isAuthenticated, isRole, isSuperAdmin, UserRole} from "../middlewares/auth-middleware";
import {
    propertyReservationPatchValidator,
    propertyReservationWithOccupationValidator,
    ReservationStatus
} from "../validators/property-validator";
import {filterValidator} from "../validators/filter-validator";
import {PropertyReservation} from "@prisma/client";

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

    app.get("/property-reservations/me/future",isAuthenticated, isRole(UserRole.TRAVELER), async (req, res) => {
        try {
            const todayWithoutHours = new Date()
            todayWithoutHours.setHours(0,0,0,0)
            const allPropertyReservations = await prisma.propertyReservation.findMany({
                include: {
                    occupation: {
                        include: {
                            property: true
                        }
                    }
                },
                where: {
                    travelerId: req.user?.travelerId,
                    occupation: {
                        startDate: {
                            gte: todayWithoutHours
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

    app.get("/property-reservations/landlord/future",isAuthenticated, isRole(UserRole.LANDLORD), async (req, res) => {
        try {
            const todayWithoutHours = new Date()
            todayWithoutHours.setHours(0,0,0,0)
            const allPropertyReservations = await prisma.propertyReservation.findMany({
                include: {
                    occupation: {
                        include: {
                            property: true
                        }
                    }
                },
                where: {
                    occupation: {
                        property: {
                            landlordId: req.user?.landlordId,
                        },
                        startDate: {
                            gte: todayWithoutHours
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
                include: {occupation: {include: {property: true}}}
            });
            res.status(200).json({data: PropertyReservationFull});
        } catch (e) {
            res.status(500).send({error: e});
            return;
        }
    });

    app.get("/property-reservations/traveler/:id(\\d+)", async (req, res) => {
        try {
            const validation = filterValidator.validate(req.query)

            if (validation.error) {
                res.status(400).json({error: validation.error});
                return;
            }

            const filterParams = validation.value;
            const PropertyReservations = await prisma.propertyReservation.findMany({
                where: filterParams.query ? {
                    travelerId: +req.params.id,
                    OR: [{occupation:
                                {property:
                                        {address:
                                                {contains: filterParams.query,
                                                    mode: "insensitive"
                                                }
                                        }
                                }
                        }]
                } : {travelerId: +req.params.id},
                include: {occupation: {include: {property: {include: {landlord: {include: {user: true}}}}}}},
                take: (filterParams.pageSize) ? +filterParams.pageSize : 10,
                skip: (filterParams.page) ? (filterParams.pageSize) ? +filterParams.page * +filterParams.pageSize : (+filterParams.page - 1) * 10 : 0,
            });
            const countReservations = await prisma.propertyReservation.count({
                where: {travelerId: +req.params.id}
            });
            res.status(200).json({data: PropertyReservations, count: countReservations});
        } catch (e) {
            res.status(500).send({error: e});
            return;
        }
    });

    app.get("/property-reservations/property/:id(\\d+)", async (req, res) => {
        try {
            const validation = filterValidator.validate(req.query)

            if (validation.error) {
                res.status(400).json({error: validation.error});
                return;
            }

            const filterParams = validation.value;
            const propertyReservations = await prisma.propertyReservation.findMany({
                where: {occupation: {propertyId: +req.params.id}},
                include: {
                    traveler: {include: {user: true}},
                    occupation: true
                },
                take: (filterParams.pageSize) ? +filterParams.pageSize : 10,
                skip: (filterParams.page) ? (filterParams.pageSize) ? +filterParams.page * +filterParams.pageSize : (+filterParams.page - 1) * 10 : 0,
            });
            const countReservations = await prisma.propertyReservation.count({
                where: {occupation: {propertyId: +req.params.id}}
            });
            res.status(200).json({data: propertyReservations, count: countReservations});
        } catch (e) {
            res.status(500).send({error: e});
            return;
        }
    });


    app.post("/property-reservations/", isAuthenticated, isRole(UserRole.TRAVELER), async (req, res) => {
        try {
            const validation = propertyReservationWithOccupationValidator.validate(req.body);

            if (validation.error || !req.user?.travelerId) {
                res.status(400).json({error: validation.error});
                return;
            }

            const reservationRequest = validation.value;

            // Créer d'abord l'occupation
            const occupation = await prisma.propertyOccupation.create({
                data: {
                    startDate: reservationRequest.startDate,
                    endDate: reservationRequest.endDate,
                    propertyId: reservationRequest.propertyId,
                }
            });

            // Ensuite, créer la réservation liée à cette occupation
            const propertyReservation = await prisma.propertyReservation.create({
                data: {
                    travelerId: req.user.travelerId,
                    totalPrice: reservationRequest.totalPrice,
                    status: ReservationStatus.PENDING,
                    occupationId: occupation.id, // Utiliser l'ID de l'occupation créée
                },
                include: {
                    occupation: true
                }
            });

            res.status(200).json({data: propertyReservation});
        } catch (e) {
            console.error('Error creating reservation:', e);
            res.status(500).send({error: 'An error occurred while creating the reservation'});
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
