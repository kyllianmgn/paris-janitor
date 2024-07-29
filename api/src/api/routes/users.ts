import express from "express";
import { prisma } from "../../utils/prisma";
import {
  userPatchValidation,
  userValidation,
} from "../validators/user-validator";
import bcrypt from "bcrypt";
import { authMiddleware, isSuperAdmin } from "../middlewares/auth-middleware";

export const initUsers = (app: express.Express) => {
  app.get(`/users/me`,authMiddleware, async (req: any, res) => {
    try {
      console.log(req.payload)
      const user = await prisma.user.findUnique({
        where: { id: Number(req.payload.userId) },
        select: {
          id: true,
          "firstName": true,
          "lastName": true,
          "email": true
        }
      });
      res.status(200).json(user);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/users", authMiddleware, isSuperAdmin, async (_req, res) => {
    try {
      const allUsers = await prisma.user.findMany();
      res.json(allUsers);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/users/:id", authMiddleware, isSuperAdmin, async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(req.params.id) },
      });
      res.json(user);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.patch("/users/:id", async (req, res) => {
    const validation = userPatchValidation.validate(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
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
      res.json(user);
    } catch (e) {
      res.status(500).json({ error: e });
      return;
    }
  });

  app.delete("/users/:id", async (req, res) => {
    try {
      const deletedUser = await prisma.user.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json(deletedUser);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });
};
