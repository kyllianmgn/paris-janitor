import express from "express";
import { prisma } from "../../utils/prisma";
import {LandlordValidator} from "../validators/landlord-validator";
import { isAuthenticated, isSuperAdmin } from "../middlewares/auth-middleware";

export const initLandlords = (app: express.Express) => {
    app.get("/landlords", isAuthenticated, async (_req, res) => {
        try {
            const allUsers = await prisma.landlord.findMany({
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

    app.get("/landlords/:id(\\d+)", isAuthenticated, async (req, res) => {
        try {
            const user = await prisma.landlord.findUnique({
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
            res.json(user);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    /*app.patch("/landlords/:id(\\d+)", isAuthenticated, async (req, res) => {
        const validation = LandlordValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const userRequest = validation.value;
        try {
            const user = await prisma.landlord.update({
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
