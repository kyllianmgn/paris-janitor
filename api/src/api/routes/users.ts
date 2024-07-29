import express from "express";
import { prisma } from "../../utils/prisma";
import {
  userPatchValidation,
  userValidation,
} from "../validators/user-validator";
import bcrypt from "bcrypt";
import { authMiddleware, authzMiddleware } from "../middlewares/auth-middleware";

export const initUsers = (app: express.Express) => {
  app.get("/users/me",authMiddleware, async (req: any, res) => {
    try {
      console.log(req.payload)
      const user = await prisma.users.findUnique({
        where: { id: Number(req.payload.userId) },
        select: {
          id: true,
          "firstName": true,
          "lastName": true,
          "email": true,
          "isSuperAdmin": true,
        }
      });
      res.status(200).json(user);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/users", authMiddleware, authzMiddleware, async (req, res) => {
    try {
      const allUsers = await prisma.users.findMany();
      res.json(allUsers);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/users/:id", authMiddleware, authzMiddleware, async (req, res) => {
    try {
      const user = await prisma.users.findUnique({
        where: { id: Number(req.params.id) },
      });
      res.json(user);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/users/:id/name", async (req, res) => {
    try {
      const user = await prisma.members.findUnique({
        where: { id: Number(req.params.id) },
        include: {
          user: {
            select: {
              lastName: true,
              firstName: true
            }
          }
        }
      });
      res.json(user);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });


  app.post("/users", async (req, res) => {
    const validation = userValidation.validate(req.body);

    if (validation.error) {
      res.status(400).send({ error: validation.error });
      return;
    }

    const userRequest = validation.value;
    userRequest.password = await bcrypt.hash(userRequest.password, 10);
    try {
      const user = await prisma.users.create({
        data: {
          firstName: userRequest.firstName,
          lastName: userRequest.lastName,
          email: userRequest.email,
          password: userRequest.password,
          isSuperAdmin: userRequest.isSuperAdmin,
        },
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
      const user = await prisma.users.update({
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
      const deletedUser = await prisma.users.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json(deletedUser);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });
};
