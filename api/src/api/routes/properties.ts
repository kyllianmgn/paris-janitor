import express from "express";
import { prisma } from "../../utils/prisma";
import {isAuthenticated, isRole, isSuperAdmin, UserRole} from "../middlewares/auth-middleware";
import {
    propertyAdminValidator,
    propertyPatchStatusValidator,
    propertyPatchValidator,
    PropertyStatus,
    propertyValidator
} from "../validators/property-validator";
import {Filter, filterValidator} from "../validators/filter-validator";

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

    app.get("/properties/all", async (req, res) => {
        try {
            const validation = filterValidator.validate(req.query)

            if (validation.error) {
                res.status(400).json({error: validation.error});
            }

            const filter: Filter = validation.value;
            const allProperties = await prisma.property.findMany({
                include: {landlord: {include: {user: true}}},
                where: filter.query ?
                    {
                        OR: [{
                            address: {
                                contains: filter.query,
                                mode: "insensitive"
                            }
                        }, {
                            description: {
                                contains: filter.query,
                                mode: "insensitive"
                            }
                        }]
                    }
                    : {},
                take: (filter.pageSize) ? +filter.pageSize : 10,
                skip: (filter.page) ? (filter.pageSize) ? +filter.page * +filter.pageSize : (+filter.page-1) * 10 : 0,
            });
            const countProperties = await prisma.property.count({
                where: filter.query ?
                    {
                        OR: [{
                            address: {
                                contains: filter.query,
                                mode: "insensitive"
                            }
                        }, {
                            description: {
                                contains: filter.query,
                                mode: "insensitive"
                            }
                        }]
                    }
                    : {}
            })
            res.status(200).json({data: allProperties, count: countProperties});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/properties/landlord/:id(\\d+)",isAuthenticated, async (req, res) => {
        try {
            const allProperties = await prisma.property.findMany({
                include: {landlord: {include: {user: true}}},
                where: {landlordId: +req.params.id},
            });
            const countProperties = await prisma.property.count({
                where: {landlordId: +req.params.id},
            });
            res.status(200).json({data: allProperties, count: countProperties});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });


    app.get("/properties/pending", async (req, res) => {
        try {
            const validation = filterValidator.validate(req.query)

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const filterParams = validation.value;
            const allProperties = await prisma.property.findMany({
                take: (filterParams.pageSize) ? +filterParams.pageSize : undefined,
                skip: (filterParams.page && filterParams.pageSize) ? +filterParams.pageSize * +filterParams.pageSize : undefined
            });
            res.status(200).json({data: allProperties});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/properties/pending/count", async (_req, res) => {
        try {
            const allProperties = await prisma.property.count({
                where: {
                    status: PropertyStatus.PENDING
                }
            });
            res.status(200).json({data: {count: allProperties}});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/properties/:id(\\d+)", async (req, res) => {
        try {
            const property = await prisma.property.findUnique({
                where: { id: Number(req.params.id) },
                include: {landlord: {include: {user: true}}}
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
                    postalCode: propertyRequest.postalCode,
                    city: propertyRequest.city,
                    country: propertyRequest.country,
                    description: propertyRequest.description,
                    status: PropertyStatus.PENDING,
                    landlordId: req.user.landlordId
                },
                include: {landlord: {include: {user: true}}}
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
                    postalCode: propertyRequest.postalCode,
                    city: propertyRequest.city,
                    country: propertyRequest.country,
                    description: propertyRequest.description,
                    status: propertyRequest.status,
                    landlordId: propertyRequest.landlordId,
                },
                include: {landlord: {include: {user: true}}}
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
                include: {landlord: {include: {user: true}}}
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
        console.log(propertyRequest)
        try {
            const property = await prisma.property.update({
                where: {
                    id: +req.params.id,
                },
                data: {status: propertyRequest.status},
                include: {landlord: {include: {user: true}}}
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
