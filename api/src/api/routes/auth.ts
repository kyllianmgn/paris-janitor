import express from "express";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";
import {generateAdminTokens, generateTokens, hashToken} from "../../utils/token";
import {isAuthenticated} from "../middlewares/auth-middleware";
import {
    addRefreshTokenToWhitelist,
    deleteRefreshToken,
    findRefreshTokenById,
    revokeTokens
} from "../services/auth-services";
import {findUserByEmail, getSafeUserById, verifyAdminPassword, verifyUserPassword} from "../services/users-services";
import {
    adminLoginValidation,
    loginValidation,
    refreshTokenValidation,
    revokeRefreshTokenValidation
} from "../validators/auth-validator";
import {userValidation} from "../validators/user-validator";
import bcrypt from "bcrypt";
import {prisma} from "../../utils/prisma";

export const initAuth = (app: express.Express) => {
    app.post(`/auth/login`, async (req: express.Request, res: express.Response) => {
            try {
                const validation = loginValidation.validate(req.body);
                if (validation.error) {
                    return res.status(400).send({error: validation.error});
                }

                const loginRequest = validation.value;
                const user = await verifyUserPassword(
                    loginRequest.email,
                    loginRequest.password
                );

                if (!user) {
                    return res.status(403).send({error: "Invalid login credentials"});
                }

                const jti = uuidv4();
                const {accessToken, refreshToken} = generateTokens(
                    user,
                    jti
                );
                await addRefreshTokenToWhitelist({
                    jti,
                    refreshToken,
                    userId: user.id,
                });

                req.headers.authorization = `Bearer ${accessToken}`;
                res.cookie("authorization", `Bearer ${accessToken}`)
                return res.json({accessToken, refreshToken});
            } catch (error) {
                console.error(error);
                return res.status(500).send({error: error});
            }
        }
    );

    app.post(`/auth/login/admin`, async (req: express.Request, res: express.Response) => {
            try {
                const validation = adminLoginValidation.validate(req.body);
                if (validation.error) {
                    return res.status(400).send({error: validation.error});
                }

                const loginRequest = validation.value;
                const admin = await verifyAdminPassword(
                    loginRequest.username,
                    loginRequest.password
                );

                if (!admin) {
                    return res.status(403).send({error: "Invalid login credentials"});
                }

                const jti = uuidv4();
                const {accessToken, refreshToken} = generateAdminTokens(
                    admin,
                    jti
                );
                await addRefreshTokenToWhitelist({
                    jti,
                    refreshToken,
                    userId: admin.id,
                });

                req.headers.authorization = `Bearer ${accessToken}`;
                res.cookie("authorization", `Bearer ${accessToken}`)
                return res.json({accessToken, refreshToken});
            } catch (error) {
                console.error(error);
                return res.status(500).send({error: error});
            }
        }
    );

    app.post("/auth/signup", async (req, res) => {
        const validation = userValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send({ error: validation.error });
            return;
        }

        const userRequest = validation.value;
        userRequest.password = await bcrypt.hash(userRequest.password, 10);
        try {
            await prisma.user.create({
                data: {
                    firstName: userRequest.firstName,
                    lastName: userRequest.lastName,
                    email: userRequest.email,
                    password: userRequest.password,
                },
            });

            const userSignup = await findUserByEmail(userRequest.email);

            if (!userSignup) {
                return res.status(400).send({ error: "User not found" });
            }

            const jti = uuidv4();
            const { accessToken, refreshToken } = generateTokens(userSignup, jti);
            await addRefreshTokenToWhitelist({
                jti,
                refreshToken,
                userId: userSignup.id,
            });

            req.headers.authorization = `Bearer ${accessToken}`;
            res.cookie("authorization", `Bearer ${accessToken}`);
            return res.json({ accessToken, refreshToken });
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/auth/signup/landlord", async (req, res) => {
        const validation = userValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send({ error: validation.error });
            return;
        }

        const userRequest = validation.value;
        userRequest.password = await bcrypt.hash(userRequest.password, 10);
        try {
            await prisma.user.create({
                data: {
                    firstName: userRequest.firstName,
                    lastName: userRequest.lastName,
                    email: userRequest.email,
                    password: userRequest.password,
                    Landlord: {
                        create: {},
                    },
                },
            });

            const userSignup = await findUserByEmail(userRequest.email);

            if (!userSignup) {
                return res.status(400).send({ error: "User not found" });
            }

            const jti = uuidv4();
            const { accessToken, refreshToken } = generateTokens(userSignup, jti);
            await addRefreshTokenToWhitelist({
                jti,
                refreshToken,
                userId: userSignup.id,
            });

            req.headers.authorization = `Bearer ${accessToken}`;
            res.cookie("authorization", `Bearer ${accessToken}`);
            return res.json({ accessToken, refreshToken });
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/auth/signup/service-provider", async (req, res) => {
        const validation = userValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send({ error: validation.error });
            return;
        }

        const userRequest = validation.value;
        userRequest.password = await bcrypt.hash(userRequest.password, 10);
        try {
            await prisma.user.create({
                data: {
                    firstName: userRequest.firstName,
                    lastName: userRequest.lastName,
                    email: userRequest.email,
                    password: userRequest.password,
                    ServiceProvider: {
                        create: {},
                    },
                },
            });

            const userSignup = await findUserByEmail(userRequest.email);

            if (!userSignup) {
                return res.status(400).send({ error: "User not found" });
            }

            const jti = uuidv4();
            const { accessToken, refreshToken } = generateTokens(userSignup, jti);
            await addRefreshTokenToWhitelist({
                jti,
                refreshToken,
                userId: userSignup.id,
            });

            req.headers.authorization = `Bearer ${accessToken}`;
            res.cookie("authorization", `Bearer ${accessToken}`);
            return res.json({ accessToken, refreshToken });
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/auth/signup/traveler", async (req, res) => {
        const validation = userValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send({ error: validation.error });
            return;
        }

        const userRequest = validation.value;
        userRequest.password = await bcrypt.hash(userRequest.password, 10);
        try {
            const user = await prisma.user.create({
                data: {
                    firstName: userRequest.firstName,
                    lastName: userRequest.lastName,
                    email: userRequest.email,
                    password: userRequest.password,
                    Traveler: {
                        create: {}
                    }
                },

            });

            const userSignup = await findUserByEmail(userRequest.email);

            if(!userSignup){
                return res.status(400).send({error: "User not found"});
            }
            const jti = uuidv4();
            const {accessToken, refreshToken} = generateTokens(
                userSignup,
                jti
            );
            await addRefreshTokenToWhitelist({
                jti,
                refreshToken,
                userId: userSignup.id,
            });

            req.headers.authorization = `Bearer ${accessToken}`;
            res.cookie("authorization", `Bearer ${accessToken}`)
            return res.json({accessToken, refreshToken});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post(`/auth/refreshToken`, async (req: express.Request, res: express.Response) => {
            try {
                const validation = refreshTokenValidation.validate(req.body);
                if (validation.error) {
                    return res.status(400).send({error: validation.error});
                }

                const refreshTokenRequest = validation.value;
                const payload: any = jwt.verify(
                    refreshTokenRequest.token,
                    process.env.JWT_REFRESH_SECRET!
                );
                const savedRefreshToken = await findRefreshTokenById(payload.jti);
                if (!savedRefreshToken || savedRefreshToken.revoked === true) {
                    return res.status(401).send({error: "Refresh token revoked"});
                }

                const hashedToken = hashToken(refreshTokenRequest.token);
                if (hashedToken !== savedRefreshToken.hashedToken) {
                    return res.status(401).send({error: "Refresh token invalid"});
                }

                const user = await getSafeUserById(payload.userId);
                if (!user) {
                    return res.status(401).send({error: "Refresh token invalid"});
                }

                await deleteRefreshToken(savedRefreshToken.id);
                const jti = uuidv4();
                const {accessToken, refreshToken: newRefreshToken} = generateTokens(
                    user,
                    jti
                );
                await addRefreshTokenToWhitelist({
                    jti,
                    refreshToken: newRefreshToken,
                    userId: user.id,
                });

                return res.json({
                    accessToken,
                    refreshToken: newRefreshToken,
                });
            } catch (error) {
                return res.status(400).send({error: "Refresh token invalid"});
            }
        }
    );

    app.post(`/auth/revokeRefreshToken`, async (req: express.Request, res: express.Response) => {
            try {
                const validation = revokeRefreshTokenValidation.validate(req.body);
                if (validation.error) {
                    return res.status(400).send({error: validation.error});
                }

                const revokeRefreshTokenRequest = validation.value;
                await revokeTokens(revokeRefreshTokenRequest.userId);

                return res.json({
                    message: `Refresh token revoked for user with id #${revokeRefreshTokenRequest.userId}`,
                });
            } catch (error) {
                return res.status(500).send({error: error});
            }
        }
    );

    app.get(`/auth/check`, isAuthenticated, async (req: express.Request, res: express.Response) => {
            try {
                const payload = (req as any).payload;
                return res.json(payload);
            } catch (error) {
                return res.status(500).send({error: error});
            }
        }
    );
};
