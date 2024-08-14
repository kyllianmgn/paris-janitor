import express from "express";
import {prisma} from "../../utils/prisma";
import {userBanValidation, userPatchValidation,} from "../validators/user-validator";
import {isAuthenticated, isRole, isRoleOrAdmin, isSuperAdmin, UserRole} from "../middlewares/auth-middleware";
import {Filter, filterValidator} from "../validators/filter-validator";

export const initUsers = (app: express.Express) => {
    app.get(`/users/me`, isAuthenticated, async (req: any, res) => {
        try {
            let user;
            if (req.user.userId) {
                user = await prisma.user.findUnique({
                    where: {id: +req.user.userId},
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        Landlord: true,
                        Traveler: true,
                        ServiceProvider: true
                    }
                });
            } else if (req.user.adminId) {
                user = await prisma.admin.findUnique({
                    where: {id: +req.user.adminId},
                    select: {
                        id: true,
                        username: true
                    }
                })
            }

            res.status(200).json({data: user});
        } catch (e) {
            res.status(500).send({error: e});
            return;
        }
    });

    app.get("/users", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const validation = filterValidator.validate(req.query)

            if (validation.error) {
                res.status(400).json({error: validation.error});
            }

            const filter: Filter = validation.value;
            const allUsers = await prisma.user.findMany({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    Landlord: true,
                    Traveler: true,
                    ServiceProvider: true,
                    bannedUntil: true
                },
                where: filter.query ?
                    {
                        OR: [{
                            firstName: {
                                contains: filter.query,
                                mode: "insensitive"
                            }
                        }, {
                            lastName: {
                                contains: filter.query,
                                mode: "insensitive"
                            }
                        },
                            {
                                email: {
                                    contains: filter.query,
                                    mode: "insensitive"
                                }
                            }]
                    }
                    : {},
                take: (filter.pageSize) ? +filter.pageSize : 10,
                skip: (filter.page) ? (filter.pageSize) ? +filter.page * +filter.pageSize : (+filter.page-1) * 10 : 0,
            });
            const countUsers = await prisma.user.count({
                where: filter.query ?
                    {
                        OR: [{
                            firstName: {
                                contains: filter.query,
                                mode: "insensitive"
                            }
                        }, {
                            lastName: {
                                contains: filter.query,
                                mode: "insensitive"
                            }
                        },
                            {
                                email: {
                                    contains: filter.query,
                                    mode: "insensitive"
                                }
                            }]
                    }
                    : {}
            })
            res.status(200).json({data: allUsers, count: countUsers});
        } catch (e) {
            res.status(500).send({error: e});
            return;
        }
    });

    app.get("/users/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: {id: Number(req.params.id)},
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    Landlord: true,
                    Traveler: true,
                    ServiceProvider: true
                }
            });
            res.status(200).json({data: user});
        } catch (e) {
            res.status(500).send({error: e});
            return;
        }
    });

    app.patch("/users/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = userPatchValidation.validate(req.body);

        if (validation.error) {
            res.status(400).json({error: validation.error});
            return;
        }

        const userRequest = validation.value;
        try {
            const user = await prisma.user.update({
                where: {
                    id: Number(req.params.id),
                },
                data: userRequest,
            });
            res.status(200).json({data: user});
        } catch (e) {
            res.status(500).json({error: e});
            return;
        }
    });

    app.patch("/users/:id(\\d+)/ban", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = userBanValidation.validate(req.body);

        if (validation.error) {
            res.status(400).json({error: validation.error});
            return;
        }

        const bannedUntil = validation.value.date;
        try {
            const user = await prisma.user.update({
                where: {
                    id: +req.params.id,
                },
                data: {
                    bannedUntil: bannedUntil
                },
            });
            res.status(200).json({data: user});
        } catch (e) {
            res.status(500).json({error: e});
            return;
        }
    });

    app.delete("/users/:id(\\d+)", async (req, res) => {
        try {
            const deletedUser = await prisma.user.delete({
                where: {id: Number(req.params.id)},
            });
            res.status(200).json({data: deletedUser});
        } catch (e) {
            res.status(500).send({error: e});
        }
    });
};
