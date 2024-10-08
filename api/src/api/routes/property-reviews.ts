import express from "express";
import {prisma} from "../../utils/prisma";
import {isAuthenticated, isRole, isSuperAdmin, UserRole} from "../middlewares/auth-middleware";
import {propertyReviewValidator} from "../validators/property-validator";

export const initPropertyReviews = (app: express.Express) => {
    app.get("/property-reviews", async (_req, res) => {
        try {
            const allPropertyReviews = await prisma.propertyReview.findMany();
            res.status(200).json({data: allPropertyReviews});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/property-reviews/me/:propertyId(\\d+)", isAuthenticated, isRole(UserRole.TRAVELER), async (req, res) => {
        try {
            if (!req.user?.travelerId) return;
            const propertyReviews = await prisma.propertyReview.findFirst({
                where: { travelerId: req.user?.travelerId, propertyId: +req.params.propertyId },
            });
            res.status(200).json({data: propertyReviews});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/property-reviews/:id(\\d+)", isAuthenticated, isRole(UserRole.TRAVELER), async (req, res) => {
        try {
            const validation = propertyReviewValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            if (!req.user?.travelerId) return res.sendStatus(401)
            const reservation = await prisma.propertyReservation.findFirst({
                where: { travelerId: req.user?.travelerId, occupation: {propertyId : +req.params.id} },
            })
            if (!reservation) return res.sendStatus(401);
            const previousReview = await prisma.propertyReview.findFirst({
                where: {
                    travelerId: req.user?.travelerId,
                    propertyId: +req.params.id,
                }
            })

            const reservationRequest = validation.value;
            let propertyReview;
            if (previousReview){
                propertyReview = await prisma.propertyReview.update({
                    where: {
                        id: previousReview.id
                    },
                    data: {
                        note: reservationRequest.note,
                        comment: reservationRequest.comment
                    }
                })
            }else{
                propertyReview = await prisma.propertyReview.create({
                    data: {
                        travelerId: req.user?.travelerId,
                        propertyId: +req.params.id,
                        note: reservationRequest.note,
                        comment: reservationRequest.comment
                    }
                })
            }

            res.status(200).json({data: propertyReview});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    /*app.patch("/property-reviews/:id(\\d+)", isAuthenticated, async (req, res) => {
        const validation = propertyReviewPatchValidator.validate(req.body);

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

    app.delete("/property-reviews/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const deletedProperty = await prisma.propertyReview.delete({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json({data: deletedProperty});
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });

    app.get("/property-reviews/property/:propertyId", async (req, res) => {
        try {
            const propertyReviews = await prisma.propertyReview.findMany({
                where: { propertyId: +req.params.propertyId },
                include: {
                    traveler: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    }
                }
            });
            res.status(200).json({data: propertyReviews});
        } catch (e) {
            return res.status(500).send({ error: e });
        }
    });
};
