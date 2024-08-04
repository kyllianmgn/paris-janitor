import express from "express";
import { prisma } from "../../utils/prisma";
import {isAuthenticated, isRole, isRoleOrAdmin, isSuperAdmin, UserRole} from "../middlewares/auth-middleware";
import {
    propertyAdminValidator,
    propertyPatchStatusValidator,
    propertyPatchValidator,
    PropertyStatus,
    propertyValidator
} from "../validators/property-validator";
import {paginationValidator} from "../validators/pagination-validator";

export const initProperties = (app: express.Express) => {
    app.get("/properties", async (_req, res) => {
        try {
            const allProperties = await prisma.property.findMany();
            res.status(200).json({data: allProperties});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/properties/all", async (_req, res) => {
        try {
            const allProperties = await prisma.property.findMany({include: {landlord: {include: {user: true}}}});
            res.status(200).json({data: allProperties});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });


    app.get("/properties/pending", async (req, res) => {
        try {
            console.log(req.query)
            const validation = paginationValidator.validate(req.query)

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const paginationParams = validation.value;
            const allProperties = await prisma.property.findMany({
                take: (paginationParams.pageSize) ? +paginationParams.pageSize : undefined,
                skip: (paginationParams.page && paginationParams.pageSize) ? +paginationParams.pageSize * +paginationParams.pageSize : undefined
            });
            res.status(200).json({data: allProperties});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/properties/:id(\\d+)", async (req, res) => {
        try {
            const property = await prisma.property.findUnique({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/properties", isAuthenticated, isRole(UserRole.LANDLORD), async (req, res) => {
        if (!req.user?.landlordId){
            return res.status(401).send({ error: "You are not a landlord." });
        }
        const validation = propertyValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const propertyRequest = validation.value;
        try {
            const property = await prisma.property.create({
                data: {
                    address: propertyRequest.address,
                    description: propertyRequest.description,
                    status: PropertyStatus.PENDING,
                    landlordId: req.user.landlordId
                },
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.post("/admin/properties", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = propertyAdminValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const propertyRequest = validation.value;
        try {
            const property = await prisma.property.create({
                data: {
                    address: propertyRequest.address,
                    description: propertyRequest.description,
                    status: propertyRequest.status,
                    landlordId: propertyRequest.landlordId,
                },
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.patch("/properties/:id(\\d+)", isAuthenticated, async (req, res) => {
        const validation = propertyPatchValidator.validate(req.body);

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
    });

    app.patch("/properties/:id(\\d+)/status", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = propertyPatchStatusValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const propertyRequest = validation.value;
        try {
            const property = await prisma.property.update({
                where: {
                    id: +req.params.id,
                },
                data: {status: propertyRequest.status},
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.delete("/properties/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
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
