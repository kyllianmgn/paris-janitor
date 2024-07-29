import Joi from "joi";

export interface userRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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
