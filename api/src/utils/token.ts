import jwt from "jsonwebtoken";
import crypto from "crypto";
import {AdminWithoutPassword, User, UserWithoutPassword} from "../api/services/users-services";

export const generateAccessToken = (user: UserWithoutPassword) => {
    return jwt.sign(
        {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
        process.env.JWT_ACCESS_SECRET!,
        {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
        }
    );
};

export const generateRefreshToken = (user: UserWithoutPassword, jti: string) => {
    return jwt.sign(
        {
            userId: user.id,
            jti,
        },
        process.env.JWT_REFRESH_SECRET!,
        {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
        }
    );
};

export const generateTokens = (user: UserWithoutPassword, jti: string) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, jti);

    return {
        accessToken,
        refreshToken,
    };
};

export const generateAdminAccessToken = (admin: AdminWithoutPassword) => {
    return jwt.sign(
        {
            adminId: admin.id,
            username: admin.username,
        },
        process.env.JWT_ACCESS_SECRET!,
        {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
        }
    );
};

export const generateAdminRefreshToken = (admin: AdminWithoutPassword, jti: string) => {
    return jwt.sign(
        {
            adminId: admin.id,
            jti,
        },
        process.env.JWT_REFRESH_SECRET!,
        {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
        }
    );
};

export const generateAdminTokens = (admin: AdminWithoutPassword, jti: string) => {
    const accessToken = generateAdminAccessToken(admin);
    const refreshToken = generateAdminRefreshToken(admin, jti);

    return {
        accessToken,
        refreshToken,
    };
};

export const hashToken = (token: string) => {
    return crypto.createHash("sha512").update(token).digest("hex");
};
