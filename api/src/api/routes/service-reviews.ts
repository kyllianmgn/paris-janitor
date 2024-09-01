import express from "express";
import { prisma } from "../../utils/prisma";
import {
    isAuthenticated,
    isRole,
    isSuperAdmin,
    isTravelerOrLandlord,
    UserRole
} from "../middlewares/auth-middleware";
import {
    serviceReviewPatchValidator,
    serviceReviewValidator
} from "../validators/service-validator";
import {propertyReviewValidator} from "../validators/property-validator";

export const initServiceReviews = (app: express.Express) => {
    app.get("/service-reviews", async (_req, res) => {
        try {
            const allServiceReviews = await prisma.serviceReview.findMany();
            res.status(200).json({data: allServiceReviews});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/service-reviews/:id(\\d+)", async (req, res) => {
        try {
            const ServiceReview = await prisma.serviceReview.findUnique({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json({data: ServiceReview});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/service-reviews/", async (req, res) => {
        try {
            const validation = serviceReviewValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const reservationRequest = validation.value;
            const serviceReview = await prisma.serviceReview.create({
                data: reservationRequest
            })
            res.status(200).json({data: serviceReview});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.patch("/service-reviews/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = serviceReviewPatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const propertyRequest = validation.value;
        try {
            const property = await prisma.service.update({
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

    app.delete("/service-reviews/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const deletedProperty = await prisma.service.delete({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json({data: deletedProperty});
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });

    app.get("/service-reviews/me/:propertyId(\\d+)", isAuthenticated, isTravelerOrLandlord, async (req, res) => {
        try {
            if (!req.user?.travelerId || !req.user?.serviceProviderId) return;
            const propertyReviews = await prisma.serviceReview.findFirst({
                where: { travelerId: req.user?.travelerId, landlordId: req.user?.travelerId, serviceId: +req.params.propertyId },
            });
            res.status(200).json({data: propertyReviews});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });


    app.post("/service-reviews/:id(\\d+)", isAuthenticated, isTravelerOrLandlord, async (req, res) => {
        try {
            const validation = serviceReviewValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            if (!req.user?.travelerId || !req.user?.landlordId) return res.sendStatus(401)
            const reservation = await prisma.intervention.findFirst({
                where: {OR: [
                        { propertyOccupation: {reservation: {travelerId: +req.user.travelerId}}, serviceId: +req.params.id },
                        { propertyOccupation: {property: {landlordId: +req.user.landlordId}}, serviceId: +req.params.id }
                    ]},
            })
            if (!reservation) return res.sendStatus(401);
            const previousReview = await prisma.serviceReview.findFirst({
                where: {
                    travelerId: req.user?.travelerId,
                    landlordId: req.user?.landlordId,
                    serviceId: +req.params.id,
                }
            })

            const reservationRequest = validation.value;
            let serviceReview;
            if (previousReview){
                serviceReview = await prisma.serviceReview.update({
                    where: {
                        id: previousReview.id
                    },
                    data: {
                        note: reservationRequest.note,
                        comment: reservationRequest.comment
                    }
                })
            }else{
                serviceReview = await prisma.serviceReview.create({
                    data: {
                        travelerId: req.user?.travelerId,
                        landlordId: req.user?.landlordId,
                        serviceId: +req.params.id,
                        note: reservationRequest.note,
                        comment: reservationRequest.comment
                    }
                })
            }

            res.status(200).json({data: serviceReview});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });
};
