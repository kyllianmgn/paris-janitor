import express from "express";
import { prisma } from "../../utils/prisma";
import {travelerValidator} from "../validators/traveler-validator";
import { isAuthenticated, isSuperAdmin } from "../middlewares/auth-middleware";

export const initTravelers = (app: express.Express) => {
    app.get("/travelers", isAuthenticated, async (_req, res) => {
        try {
            const allUsers = await prisma.traveler.findMany({
                select: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            });
            res.status(200).json({data: allUsers});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/travelers/:id(\\d+)", isAuthenticated, async (req, res) => {
        try {
            const user = await prisma.traveler.findUnique({
                where: { id: +req.params.id },
                select: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            });
            res.status(200).json({data: user});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    /*app.patch("/travelers/:id(\\d+)", isAuthenticated, async (req, res) => {
        const validation = TravelerValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const userRequest = validation.value;
        try {
            const user = await prisma.Traveler.update({
                where: {
                    id: +req.params.id,
                },
                data: userRequest,
            });
            res.json(user);
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });*/
};
