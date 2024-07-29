import Joi from "joi"

export interface loginRequest {
    email: string
    password: string
}

export const loginValidation = Joi.object<loginRequest>({
    email: Joi.string().email().required(),
    password: Joi.string().required()
}).options({abortEarly: true})

export interface refreshTokenRequest {
    token: string
}

export const refreshTokenValidation = Joi.object<refreshTokenRequest>({
    token: Joi.string().required()
}).options({abortEarly: true})

export interface revokeRefreshTokenRequest {
    userId: number
}

export const revokeRefreshTokenValidation = Joi.object<revokeRefreshTokenRequest>({
    userId: Joi.number().required()
}).options({abortEarly: true})
