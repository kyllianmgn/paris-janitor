import Joi from "joi";

export interface userRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface userSelfResetPasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export const userValidation = Joi.object<userRequest>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
}).options({ abortEarly: true });

export const userPatchValidation = Joi.object<Pick<userRequest, "firstName" | "lastName" | "email">>({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email()
}).options({ abortEarly: true });

export const userBanValidation = Joi.object<{ date: Date }>({
  date: Joi.date().required(),
}).options({ abortEarly: true });

export const userSelfResetPasswordValidation = Joi.object<userSelfResetPasswordRequest>({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required().disallow(Joi.ref("oldPassword")),
}).options({ abortEarly: true });
