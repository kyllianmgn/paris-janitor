import jwt from "jsonwebtoken";
import crypto from "crypto";
import {User, UserWithoutPassword} from "../api/services/users-services";

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

export const hashToken = (token: string) => {
    return crypto.createHash("sha512").update(token).digest("hex");
};
