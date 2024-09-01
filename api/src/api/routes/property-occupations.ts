import express from "express";
import { prisma } from "../../utils/prisma";
import {isAuthenticated, isRole, isSuperAdmin, UserRole} from "../middlewares/auth-middleware";
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


    app.get("/property-occupations/landlord", isAuthenticated, isRole(UserRole.LANDLORD), async (req, res) => {
        try {
            const landlordId = req.user?.landlordId;
            if (!landlordId) {
                return res.status(400).json({ error: "Landlord ID not found" });
            }

            const occupations = await prisma.propertyOccupation.findMany({
                where: {
                    property: {
                        landlordId: landlordId
                    }
                },
                include: {
                    property: true,
                    reservation: true,
                    intervention: true

                }
            });
            res.status(200).json({data: occupations});
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });

    //recupere les occupation d'une propriété
    app.get("/property-occupations/property/:id(\\d+)",isAuthenticated, async (req, res) => {
        try {
            const propertyId = parseInt(req.params.id);
            const occupations = await prisma.propertyOccupation.findMany({
                where: {
                    propertyId: propertyId
                },
                include: {
                    property: true,
                    reservation: true
                }
            });
            res.status(200).json({data: occupations});
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });

    app.post("/property-occupations/",isAuthenticated, async (req, res) => {
        try {
            console.log(req.body)
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
            console.log(e);
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

    /*app.patch("/property-occupations/:id(\\d+)/status", isAuthenticated, async (req, res) => {
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
    });*/

    app.patch("/property-occupations/:id(\\d+)", isAuthenticated, async (req, res) => {
        const validation = propertyOccupationPatchValidator.validate(req.body);
        console.log(validation.value);

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
                data: {
                    startDate: propertyRequest.startDate,
                    endDate: propertyRequest.endDate,
                },
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });


    app.delete("/property-occupations/:id(\\d+)", isAuthenticated, async (req, res) => {
        try {
            const deletedProperty = await prisma.propertyOccupation.delete({
                where: { id: Number(req.params.id) },
            });
            res.status(200).send({data: deletedProperty});
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });
};
