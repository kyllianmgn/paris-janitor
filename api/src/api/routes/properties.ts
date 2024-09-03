import express from "express";
import {prisma} from "../../utils/prisma";
import {isAuthenticated, isRole, isSuperAdmin, UserRole} from "../middlewares/auth-middleware";
import {
    propertyAdminValidator,
    propertyPatchStatusValidator,
    propertyPatchValidator,
    PropertyStatus,
    propertyValidator
} from "../validators/property-validator";
import {dateValidator, Filter, filterValidator} from "../validators/filter-validator";
import * as fs from "fs"

export const initProperties = (app: express.Express) => {
    app.get("/properties/public", async (req, res) => {
        try {

            const validation = filterValidator.validate(req.query);
            if (validation.error) {
                return res.status(400).json({error: validation.error});
            }

            const filter: Filter = validation.value;

            const allProperties = await prisma.property.findMany({
                where: {status: PropertyStatus.APPROVED,
                    ...(filter.query ? {
                        OR: [{
                            address: { contains: filter.query, mode: "insensitive" }
                        }, {
                            description: { contains: filter.query, mode: "insensitive" }
                        }, {
                            city: {
                                contains: filter.query,
                                mode: "insensitive"
                            }
                        }, {
                            country: {
                                contains: filter.query,
                                mode: "insensitive"
                            }
                        }]
                    } : {status: PropertyStatus.APPROVED})
                },
                include: {landlord: {include: {user: true}}},
                take: filter.pageSize ? +filter.pageSize : 10,
                skip: filter.page ? (filter.pageSize ? +filter.page * +filter.pageSize : (+filter.page-1) * 10) : 0,
            });

            const countProperties = await prisma.property.count({
                where: filter.query ?
                    {
                        status: PropertyStatus.APPROVED,
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
                        }, {
                            city: {
                                contains: filter.query,
                                mode: "insensitive"
                            }
                        }, {
                            country: {
                                contains: filter.query,
                                mode: "insensitive"
                            }
                        }]
                    }
                    : {status: PropertyStatus.APPROVED}
                })

            res.status(200).json({data: allProperties, count: countProperties});
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });

    app.get("/properties", async (_req, res) => {
        try {
            const allProperties = await prisma.property.findMany({});
            res.status(200).json({data: allProperties});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/properties/availability/:id(\\d+)", async (req, res) => {
        try {
            const validation = dateValidator.validate(req.query)

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const filterParams = validation.value;
            const property = await prisma.property.findFirst({
                    where: {
                        id: +req.params.id,
                        occupations: {
                            none: {
                                AND: [
                                    {startDate:
                                            {lte: validation.value.date}
                                    },
                                    {endDate:
                                            {gte: validation.value.date}
                                    },
                                ]
                            }
                        }
                    }
                }
            );
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/properties/me", isAuthenticated, isRole(UserRole.LANDLORD), async (req, res) => {
        try {
            if (!req.user?.landlordId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const allProperties = await prisma.property.findMany({
                where: {
                    landlordId: +req.user?.landlordId,
                }
            });
            res.status(200).json({data: allProperties});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/properties/all", async (req, res) => {
        try {
            const validation = filterValidator.validate(req.query);

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

    app.get("/properties/available", async (req, res) => {
        try {
            const validation = filterValidator.validate(req.query)

            if (validation.error) {
                res.status(400).json({error: validation.error});
            }

            const filter: Filter = validation.value;
            const allProperties = await prisma.property.findMany({
                where: filter.query ?
                    {
                        status: PropertyStatus.APPROVED,
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
                    : {
                        status: PropertyStatus.APPROVED
                    },
                take: (filter.pageSize) ? +filter.pageSize : 10,
                skip: (filter.page) ? (filter.pageSize) ? +filter.page * +filter.pageSize : (+filter.page-1) * 10 : 0,
            });
            const countProperties = await prisma.property.count({
                where: filter.query ?
                    {
                        status: PropertyStatus.APPROVED,
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
                    : {
                        status: PropertyStatus.APPROVED
                    }
            })
            res.status(200).json({data: allProperties, count: countProperties});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/properties/landlord/:id", isAuthenticated, async (req, res) => {
        try {
            const allProperties = await prisma.property.findMany({
                include: { landlord: { include: { user: true } } },
                where: {
                    landlordId: parseInt(req.params.id),
                    status: { not: PropertyStatus.DISABLED }
                }
            });
            const countProperties = await prisma.property.count({
                where: {
                    landlordId: parseInt(req.params.id),
                    status: { not: PropertyStatus.DISABLED }
                }
            });
            res.status(200).json({ data: allProperties, count: countProperties });
        } catch (error) {
            res.status(500).json({ error: "An error occurred while fetching properties." });
        }
    });

    app.get("/properties/landlord/:id/approved", isAuthenticated, async (req, res) => {
        try {
            const approvedProperties = await prisma.property.findMany({
                where: {
                    landlordId: parseInt(req.params.id),
                    status: PropertyStatus.APPROVED
                },
                include: { occupations: true }
            });
            res.status(200).json({ data: approvedProperties });
        } catch (error) {
            res.status(500).json({ error: "An error occurred while fetching approved properties." });
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
                take: (filterParams.pageSize) ? +filterParams.pageSize : 10,
                skip: (filterParams.page) ? (filterParams.pageSize) ? +filterParams.page * +filterParams.pageSize : (+filterParams.page-1) * 10 : 0,
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
                where: { id: Number(req.params.id),status: PropertyStatus.APPROVED },
                include: {landlord: {include: {user: true}}}
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/properties/me/:id(\\d+)",isAuthenticated, isRole(UserRole.LANDLORD), async (req, res) => {
        try {
            if (!req.user?.landlordId) return res.sendStatus(401);
            const property = await prisma.property.findUnique({
                where: { id: Number(req.params.id),landlordId: +req.user?.landlordId }
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/properties/:id(\\d+)/image", async (req, res) => {
        try {
            const property = await prisma.property.findUnique({
                where: { id: Number(req.params.id),status: PropertyStatus.APPROVED },
                include: {landlord: {include: {user: true}}}
            });
            if (!property) return res.sendStatus(404);
            const files = fs.readdirSync(`./public/image/property/${+req.params.id}`)
            res.status(200).json({data: files});
        } catch (e: any) {
            if (e.errno == -4058){
                return res.status(404).send({ error: e });
            }
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/properties/me/:id(\\d+)/image",isAuthenticated, isRole(UserRole.LANDLORD), async (req, res) => {
        try {
            if (!req.user?.landlordId) return res.sendStatus(401);
            const property = await prisma.property.findUnique({
                where: { id: Number(req.params.id),landlordId: +req.user?.landlordId }
            });
            if (!property) return res.sendStatus(404);
            const files = fs.readdirSync(`./public/image/property/${+req.params.id}`)
            res.status(200).json({data: files});
        } catch (e: any) {
            if (e.errno == -4058){
                return res.status(404).send({ error: e });
            }
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/properties/admin/:id(\\d+)", async (req, res) => {
        try {
            const property = await prisma.property.findUnique({
                where: { id: Number(req.params.id)},
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
            console.error(validation.error);
            res.status(400).json({ error: validation.error });
            return;
        }


        const propertyRequest = validation.value;
        try {
            const property = await prisma.property.create({
                data: {
                    roomCount: propertyRequest.roomCount,
                    propertyType: propertyRequest.propertyType,
                    instruction: propertyRequest.instruction,
                    address: propertyRequest.address,
                    postalCode: propertyRequest.postalCode,
                    city: propertyRequest.city,
                    country: propertyRequest.country,
                    description: propertyRequest.description,
                    pricePerNight: propertyRequest.pricePerNight,
                    status: PropertyStatus.PENDING,
                    landlordId: req.user.landlordId
                },
                include: {landlord: {include: {user: true}}}
            });

            for (const [index,file] of propertyRequest.files.entries()){
                const base64data = file.replace(/^data:image\/(png;base64|jpeg;base64),/, "");
                console.log(base64data)
                fs.mkdir(`./public/image/property/${property.id}`, { recursive: true}, function (err) {
                    if (err) console.error(err)

                    fs.writeFile(`./public/image/property/${property.id}/${index+1}.jpeg`,base64data, {encoding: "base64"}, err => {
                        console.error(err)
                    })
                });
            }

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
                    roomCount: propertyRequest.roomCount,
                    propertyType: propertyRequest.propertyType,
                    instruction: propertyRequest.instruction,
                    address: propertyRequest.address,
                    postalCode: propertyRequest.postalCode,
                    city: propertyRequest.city,
                    country: propertyRequest.country,
                    description: propertyRequest.description,
                    pricePerNight: propertyRequest.pricePerNight,
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

        app.put("/property/:id/disable", isAuthenticated, isRole(UserRole.LANDLORD), async (req, res) => {
            try {
                const property = await prisma.property.update({
                    where: { id: parseInt(req.params.id) },
                    data: { status: PropertyStatus.DISABLED },
                });
                res.status(200).json({ data: property });
            } catch (error) {
                res.status(500).json({ error: "An error occurred while disabling the property." });
            }
        });
};
