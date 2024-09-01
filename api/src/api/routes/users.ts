import express from "express";
import {prisma} from "../../utils/prisma";
import {userBanValidation, userPatchValidation, userSelfResetPasswordValidation,} from "../validators/user-validator";
import {isAuthenticated, isSuperAdmin} from "../middlewares/auth-middleware";
import {Filter, filterValidator} from "../validators/filter-validator";
import {createResetPasswordToken} from "../services/email-service";
import {User} from "@prisma/client";
import bcrypt from "bcrypt";
import {revokeTokens} from "../services/auth-services";

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
            const validation = filterValidator.validate(req.query);

            if (validation.error) {
                res.status(400).json({error: validation.error});
            }

            const filter: Filter = validation.value;
            const where: any = {};

            if (filter.query) {
                where.OR = [
                    {firstName: {contains: filter.query, mode: "insensitive"}},
                    {lastName: {contains: filter.query, mode: "insensitive"}},
                    {email: {contains: filter.query, mode: "insensitive"}}
                ];
            }

            if (filter.role) {
                where.OR = [
                    ...(where.OR || []),
                    ...(filter.role.landlord ? [{Landlord: {isNot: null}}] : []),
                    ...(filter.role.serviceProvider ? [{ServiceProvider: {isNot: null}}] : []),
                    ...(filter.role.traveler ? [{Traveler: {isNot: null}}] : [])
                ];
            }

            if (filter.subscription) {
                where.subscriptions = filter.subscription.active ? {some: {}} : {none: {}};
            }

            if (filter.banned) {
                where.bannedUntil = {not: null};
            }

            const allUsers = await prisma.user.findMany({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    Landlord: true,
                    Traveler: true,
                    ServiceProvider: true,
                    bannedUntil: true,
                    subscriptions: true
                },
                where,
                take: (filter.pageSize) ? +filter.pageSize : 10,
                skip: (filter.page) ? (filter.pageSize) ? +filter.page * +filter.pageSize : (+filter.page - 1) * 10 : 0,

            });

            const countUsers = await prisma.user.count({where});
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

    app.delete("/users/:id(\\d+)", isSuperAdmin, async (req, res) => {
        try {
            const deletedUser = await prisma.user.delete({
                where: {id: Number(req.params.id)},
            });
            res.status(200).json({data: deletedUser});
        } catch (e) {
            res.status(500).send({error: e});
        }
    });

    app.post("/users/reset-password/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const user: User | null = await prisma.user.findUnique({
                where: {id: Number(req.params.id)},
            });
            if (!user) {
                return res.status(404).json({error: "User not found"});
            }

            await createResetPasswordToken(user.email);

            return res.status(200).json({message: "Password reset email sent"});
        } catch (e) {
            console.error("Error in reset password:", e);
            return res.status(500).json({error: "Internal server error"});
        }
    });

    app.patch("/users/self-update", isAuthenticated, async (req: any, res) => {
        const validation = userPatchValidation.validate(req.body);

        if (validation.error) {
            return res.status(400).json({error: validation.error});
        }

        const userRequest = validation.value;
        try {
            await prisma.user.update({
                where: {
                    id: +req.user.userId,
                },
                data: userRequest,
            });

            return res.status(200).json({message: "Success"});
        } catch (e) {
            return res.status(500).send({error: e});
        }
    });

    app.patch("/users/self-reset-password", isAuthenticated, async (req: any, res) => {
        try {
            const validation = userSelfResetPasswordValidation.validate(req.body);

            if (validation.error) {
                return res.status(400).json({error: validation.error});
            }

            const userRequest = validation.value;
            let user = await prisma.user.findUnique({where: {id: +req.user.userId}});

            const oldPasswordMatch: boolean = await bcrypt.compare(userRequest.oldPassword, user!.password);
            if (!oldPasswordMatch) {
                return res.status(400).json({error: "Error"});
            }

            const newPasswordMatch: boolean = await bcrypt.compare(userRequest.newPassword, user!.password);
            if (newPasswordMatch) {
                return res.status(400).json({error: "New password can't be the same as the old password"});
            }

            const newPasswordHash = await bcrypt.hash(userRequest.newPassword, 10);
            await prisma.user.update({
                where: {id: user!.id},
                data: {
                    password: newPasswordHash,
                }
            });

            await revokeTokens(user!.id);

            return res.status(200).json({message: "Password updated successfully"});
        } catch (e) {
            return res.status(500).send({error: e});
        }
    });
};
