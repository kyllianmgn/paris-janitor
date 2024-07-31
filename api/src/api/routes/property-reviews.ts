import express from "express";
import { prisma } from "../../utils/prisma";
import { isAuthenticated, isSuperAdmin } from "../middlewares/auth-middleware";
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

    app.get("/property-reviews/:id(\\d+)", async (req, res) => {
        try {
            const propertyReviews = await prisma.propertyReview.findUnique({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json({data: propertyReviews});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/property-reviews/", async (req, res) => {
        try {
            const validation = propertyReviewValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const reservationRequest = validation.value;
            const propertyReview = await prisma.propertyReview.create({
                data: reservationRequest
            })
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
};
