import { Members } from "@prisma/client";
import Joi from "joi";

export interface userRequest {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  isSuperAdmin?: boolean;
  members?: Members[];
}

export const userValidation = Joi.object<userRequest>({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  isSuperAdmin: Joi.boolean().optional(),
}).options({ abortEarly: true });

export const userPatchValidation = Joi.object<Partial<userRequest>>({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
}).options({ abortEarly: true });
